const express = require('express');
const cors = require('cors');
const multer = require('multer');
const mongoose = require('mongoose');
const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

const app = express();
const port = 5000;

// ==================== DATABASE CONNECTION ====================
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.log('❌ MongoDB Error:', err.message));

// ==================== SCHEMAS ====================
const UserSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true }, // Ideally hashed
    lastLocation: {
        type: { type: String, default: 'Point' },
        coordinates: [Number] // [longitude, latitude]
    },
    createdAt: { type: Date, default: Date.now }
});
UserSchema.index({ lastLocation: '2dsphere' });

const ScanResultSchema = new mongoose.Schema({
    userId: String, // Link to user
    imageName: String,
    imageBase64: String,
    location: {
        type: { type: String, default: 'Point' },
        coordinates: [Number]
    }, // Store actual image data
    imageSize: Number,
    mimeType: String,
    analysisResult: String,
    plantType: String,
    diseaseName: String,
    severity: { type: String, default: 'Unknown' },
    isHealthy: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});
ScanResultSchema.index({ location: '2dsphere' });

const ChatMessageSchema = new mongoose.Schema({
    userId: String, // Link to user
    sessionId: { type: String, required: true, index: true },
    role: { type: String, enum: ['user', 'assistant'], required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const OutbreakSchema = new mongoose.Schema({
    diseaseName: { type: String, required: true },
    plantType: String,
    severity: { type: String, default: 'Moderate' },
    location: {
        type: { type: String, default: 'Point' },
        coordinates: [Number]
    },
    address: String,
    reportCount: { type: Number, default: 1 },
    status: { type: String, default: 'active' },
    reportedAt: { type: Date, default: Date.now }
});
OutbreakSchema.index({ location: '2dsphere' });

const NotificationSchema = new mongoose.Schema({
    userId: { type: String, required: true, index: true },
    title: String,
    message: String,
    type: { type: String, default: 'alert' }, // alert, info
    read: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);
const ScanResult = mongoose.model('ScanResult', ScanResultSchema);
const ChatMessage = mongoose.model('ChatMessage', ChatMessageSchema);
const Outbreak = mongoose.model('Outbreak', OutbreakSchema);
const Notification = mongoose.model('Notification', NotificationSchema);

// --- HELPER: CHECK CLUSTERS & ALERT ---
async function checkClustersAndAlert(diseaseName, plantType, lat, long) {
    if (!diseaseName || diseaseName === 'Healthy' || !lat || !long) return;

    // 1. Check for recent scans of same disease within 5km
    const radiusInKm = 5;
    const nearbyScans = await ScanResult.find({
        diseaseName,
        createdAt: { $gt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }, // Last 7 days
        location: {
            $near: {
                $geometry: { type: 'Point', coordinates: [long, lat] },
                $maxDistance: radiusInKm * 1000
            }
        }
    });

    const CLUSTER_THRESHOLD = 7; // As requested
    if (nearbyScans.length >= CLUSTER_THRESHOLD) {
        console.log(`⚠️ Potential Outbreak Detected: ${diseaseName} (${nearbyScans.length} cases)`);

        // Check if outbreak already exists locally to avoid dupes
        const existingOutbreak = await Outbreak.findOne({
            diseaseName,
            status: 'active',
            location: {
                $near: {
                    $geometry: { type: 'Point', coordinates: [long, lat] },
                    $maxDistance: 2000 // 2km tolerance
                }
            }
        });

        if (!existingOutbreak) {
            // CREATE OUTBREAK
            const newOutbreak = new Outbreak({
                diseaseName,
                plantType,
                severity: 'Severe', // Red Zone
                location: { type: 'Point', coordinates: [long, lat] },
                address: `Detected Cluster near ${lat.toFixed(4)}, ${long.toFixed(4)}`,
                reportCount: nearbyScans.length
            });
            await newOutbreak.save();
            console.log('🚨 RED ZONE CREATED!');

            // TRIGGER ALERTS FOR NEARBY USERS
            await alertNearbyUsers(newOutbreak);
        } else {
            // Update existing count
            existingOutbreak.reportCount = nearbyScans.length;
            existingOutbreak.severity = 'Severe'; // Ensure it's red
            await existingOutbreak.save();
        }
    }
}

async function alertNearbyUsers(outbreak) {
    const ALERT_RADIUS_KM = 10;
    const usersNearby = await User.find({
        lastLocation: {
            $near: {
                $geometry: outbreak.location,
                $maxDistance: ALERT_RADIUS_KM * 1000
            }
        }
    });

    console.log(`📢 Alerting ${usersNearby.length} users nearby.`);

    const notifications = usersNearby.map(u => ({
        userId: u.userId,
        title: `⚠️ ${outbreak.diseaseName} Outbreak!`,
        message: `High risk of ${outbreak.diseaseName} detected within ${ALERT_RADIUS_KM}km of your location. Take constraints!`,
        type: 'alert'
    }));

    if (notifications.length > 0) {
        await Notification.insertMany(notifications);
    }
}

// ==================== MIDDLEWARE ====================
app.use(cors());
app.use(express.json());
const upload = multer({ storage: multer.memoryStorage() });

// ==================== GEMINI AI ====================
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const MODEL = 'gemini-2.5-flash';

// ==================== ROUTES ====================

// --- HELPER: CHECK CLUSTERS & ALERT --- (If not present, I should add it here too? No, let's verify first)
// Actually, I'll allow ReplaceFileContent to insert unconditionally? No.
// Let's Insert the endpoints before Authentication routes.

app.post('/user/location', async (req, res) => {
    try {
        const { userId, latitude, longitude } = req.body;
        if (!userId || !latitude || !longitude) return res.status(400).send('Missing data');

        await User.findOneAndUpdate(
            { userId },
            {
                lastLocation: {
                    type: 'Point',
                    coordinates: [longitude, latitude]
                }
            },
            { upsert: true } // Create if not exists (safeguard)
        );
        res.json({ success: true });
    } catch (e) {
        console.error('Loc update error:', e);
        res.status(500).json({ error: 'Loc update failed' });
    }
});

app.get('/notifications', async (req, res) => {
    try {
        const { userId } = req.query;
        if (!userId) return res.json([]);
        const notifs = await Notification.find({ userId }).sort({ createdAt: -1 }).limit(20);
        res.json(notifs);
    } catch (e) {
        res.status(500).json({ error: 'Fetch failed' });
    }
});

// --- AUTHENTICATION ---
app.post('/auth/register', async (req, res) => {
    try {
        const { userId, name, password } = req.body;
        if (!userId || !name || !password) {
            return res.status(400).json({ error: 'Missing fields' });
        }

        const existingUser = await User.findOne({ userId });
        if (existingUser) {
            return res.status(400).json({ error: 'User ID already exists' });
        }

        const newUser = new User({ userId, name, password });
        await newUser.save();

        res.json(newUser);
    } catch (error) {
        res.status(500).json({ error: 'Registration failed', details: error.message });
    }
});

app.post('/auth/login', async (req, res) => {
    try {
        const { userId, password } = req.body;
        const user = await User.findOne({ userId });

        if (!user || user.password !== password) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
});

app.get('/', (req, res) => {
    res.json({ status: 'running', model: MODEL });
});

// ==================== IMAGE ANALYSIS ====================
app.post('/analyze', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image file uploaded' });
        }

        console.log('📸 Analyzing image...', req.file.size, 'bytes');
        const base64Image = req.file.buffer.toString('base64');

        const contents = [
            { inlineData: { mimeType: req.file.mimetype, data: base64Image } },
            {
                text: `Analyze this crop/plant image. 
                1. Identify the specific plant type (e.g., "Tomato (Solanum lycopersicum)", "Potato", "Wheat").
                2. Check specific leaf patterns to confirm it is a plant/crop.
                3. Diagnose any diseases or pests.
                4. Assess severity.

                Return ONLY valid JSON:
{
    "plantType": "Specific Plant Name",
    "isHealthy": true/false,
    "disease": { "name": "string", "severity": "Mild/Moderate/Severe", "symptoms": [], "treatment": [], "prevention": [] },
    "summary": "brief summary"
}
If healthy, set disease to null.` }
        ];

        const response = await ai.models.generateContent({ model: MODEL, contents });
        const resultText = response.text;
        console.log('✅ Analysis complete');

        let analysisData = null;
        try {
            const cleaned = resultText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            analysisData = JSON.parse(cleaned);
        } catch (e) {
            analysisData = { raw: resultText };
        }

        const scan = new ScanResult({
            imageName: req.file.originalname || 'captured',
            imageBase64: base64Image,
            imageSize: req.file.size,
            mimeType: req.file.mimetype,
            analysisResult: resultText,
            plantType: analysisData.plantType,
            diseaseName: analysisData.disease?.name,
            severity: analysisData.disease?.severity || 'Unknown',
            isHealthy: analysisData.isHealthy,
            userId: req.body.userId,
            location: {
                type: 'Point',
                coordinates: [
                    parseFloat(req.body.longitude || 0),
                    parseFloat(req.body.latitude || 0)
                ]
            }
        });
        await scan.save();

        // Trigger Cluster Check
        if (req.body.latitude && req.body.longitude) {
            checkClustersAndAlert(
                analysisData.disease?.name,
                analysisData.plantType,
                parseFloat(req.body.latitude),
                parseFloat(req.body.longitude)
            ).catch(err => console.error('Cluster check error:', err));
        }

        res.json({ result: resultText, analysis: analysisData, scanId: scan._id });
    } catch (error) {
        console.error('❌ Error:', error.message);
        res.status(500).json({ error: 'Failed to analyze', details: error.message });
    }
});

// ==================== SCAN HISTORY ====================
app.get('/history', async (req, res) => {
    try {
        const { userId } = req.query;
        // If userId is provided, filter by it. Otherwise, return empty (privacy) or all (admin - optional)
        // For this app, we force userId filter for privacy.
        if (!userId) {
            return res.json([]);
        }

        const scans = await ScanResult.find({ userId }).sort({ createdAt: -1 }).limit(50);
        res.json(scans);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch history' });
    }
});

app.delete('/history/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body; // Ensure user owns the record

        if (!userId) {
            return res.status(400).json({ error: 'User ID required to delete' });
        }

        const result = await ScanResult.findOneAndDelete({ _id: id, userId });

        if (!result) {
            return res.status(404).json({ error: 'Scan not found or unauthorized' });
        }

        res.json({ success: true, message: 'Scan deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete scan' });
    }
});

// ==================== CHATBOT ====================
app.post('/chat', async (req, res) => {
    try {
        const { message, sessionId } = req.body;
        if (!message) return res.status(400).json({ error: 'Message required' });

        const session = sessionId || `session_${Date.now()}`;
        console.log('💬 Chat:', message.substring(0, 40) + '...');

        const history = await ChatMessage.find({ sessionId: session }).sort({ createdAt: -1 }).limit(6);
        let context = history.reverse().map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n');

        const prompt = `You are CropGuard AI, an expert agricultural assistant. Help farmers with plant diseases, pest control, fertilizers, irrigation tips. Be helpful and concise.
${context ? `\nConversation:\n${context}\n` : ''}
User: ${message}
Assistant:`;

        const response = await ai.models.generateContent({ model: MODEL, contents: prompt });
        const reply = response.text;

        await ChatMessage.create({ sessionId: session, role: 'user', content: message });
        await ChatMessage.create({ sessionId: session, role: 'assistant', content: reply });

        res.json({ reply, sessionId: session });
    } catch (error) {
        console.error('❌ Chat error:', error.message);
        res.status(500).json({ error: 'Chat failed', details: error.message });
    }
});

app.get('/chat/history/:sessionId', async (req, res) => {
    try {
        const messages = await ChatMessage.find({ sessionId: req.params.sessionId }).sort({ createdAt: 1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch chat history' });
    }
});

// ==================== OUTBREAKS/MAP ====================
app.get('/outbreaks', async (req, res) => {
    try {
        const outbreaks = await Outbreak.find({ status: 'active' }).sort({ reportedAt: -1 });

        // Return as GeoJSON
        const geoJson = {
            type: 'FeatureCollection',
            features: outbreaks.map(o => ({
                type: 'Feature',
                geometry: o.location,
                properties: {
                    id: o._id,
                    diseaseName: o.diseaseName,
                    plantType: o.plantType,
                    severity: o.severity,
                    address: o.address,
                    reportCount: o.reportCount,
                    reportedAt: o.reportedAt
                }
            }))
        };
        res.json(geoJson);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch outbreaks' });
    }
});

app.post('/outbreaks', async (req, res) => {
    try {
        const { diseaseName, plantType, severity, latitude, longitude, address } = req.body;
        if (!diseaseName || !latitude || !longitude) {
            return res.status(400).json({ error: 'Disease name and location required' });
        }

        const outbreak = new Outbreak({
            diseaseName,
            plantType,
            severity: severity || 'Moderate',
            location: { type: 'Point', coordinates: [longitude, latitude] },
            address
        });
        await outbreak.save();
        res.json({ success: true, outbreak });
    } catch (error) {
        res.status(500).json({ error: 'Failed to report outbreak' });
    }
});

// --- NEARBY OUTBREAKS (for user's location) ---
app.get('/outbreaks/nearby', async (req, res) => {
    try {
        const { latitude, longitude, radiusKm = 10 } = req.query;

        if (!latitude || !longitude) {
            // Return all active outbreaks if no location provided
            const outbreaks = await Outbreak.find({ status: 'active' }).sort({ reportedAt: -1 }).limit(20);
            return res.json(outbreaks);
        }

        const lat = parseFloat(latitude);
        const lng = parseFloat(longitude);
        const radius = parseFloat(radiusKm) * 1000; // Convert to meters

        const nearbyOutbreaks = await Outbreak.find({
            status: 'active',
            location: {
                $near: {
                    $geometry: { type: 'Point', coordinates: [lng, lat] },
                    $maxDistance: radius
                }
            }
        }).limit(20);

        // Calculate distance for each outbreak
        const withDistance = nearbyOutbreaks.map(o => {
            const [oLng, oLat] = o.location.coordinates;
            const distKm = calculateDistance(lat, lng, oLat, oLng);
            return {
                ...o.toObject(),
                distanceKm: Math.round(distKm * 10) / 10
            };
        });

        res.json(withDistance);
    } catch (error) {
        console.error('Nearby outbreaks error:', error);
        res.status(500).json({ error: 'Failed to fetch nearby outbreaks' });
    }
});

// --- COMMUNITY STATS ---
app.get('/community/stats', async (req, res) => {
    try {
        const activeOutbreaks = await Outbreak.countDocuments({ status: 'active' });
        const totalScans = await ScanResult.countDocuments();
        const totalUsers = await User.countDocuments();
        const diseasedScans = await ScanResult.countDocuments({ isHealthy: false, diseaseName: { $ne: null } });

        res.json({
            activeOutbreaks,
            totalScans,
            totalUsers,
            diseasedScans
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
});

// --- HELPER: Calculate distance between two points (Haversine formula) ---
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// ==================== START SERVER ====================
app.listen(port, () => {
    console.log(`\n🚀 Server running at http://localhost:${port}`);
    console.log(`📊 Model: ${MODEL}`);
    console.log(`📡 Endpoints: /analyze, /chat, /history, /outbreaks\n`);
});
