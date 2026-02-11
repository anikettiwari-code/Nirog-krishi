import { GoogleGenAI } from '@google/genai';
import { db } from '../../lib/firebase';
import { collection, doc, setDoc, getDocs, query, where, orderBy, limit, serverTimestamp } from 'firebase/firestore';
import { Buffer } from 'buffer'; // Node environment
import { API_CONFIG } from '../../constants/config';

const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const image = (formData as any).get('image') as File | null;
        const userId = (formData as any).get('userId') as string | null;

        if (!image) {
            return Response.json({ error: 'No image uploaded' }, { status: 400 });
        }

        if (image.size > MAX_SIZE) {
            return Response.json({ error: 'Image too large' }, { status: 400 });
        }

        const buffer = Buffer.from(await image.arrayBuffer());
        const base64Image = buffer.toString('base64');
        const mimeType = image.type || 'image/jpeg';


        // AI Analysis
        const apiKey = process.env.GEMINI_API_KEY || API_CONFIG.GEMINI_API_KEY;
        const ai = new GoogleGenAI({ apiKey });
        // User requested "2.5 flash" -> Mapping to 2.0 Flash Experimental
        const MODEL = 'gemini-2.0-flash-exp';

        console.log('[API] Analyzing image...', image.name, image.size);

        // Construct parts for the new strict format
        const parts = [
            { inlineData: { mimeType: mimeType, data: base64Image } },
            {
                text: `Analyze this crop/plant image. Return ONLY valid JSON:
{
    "plantType": "plant name",
    "isHealthy": true/false,
    "confidence": 0-100,
    "disease": { 
        "name": "string", 
        "severity": "Mild/Moderate/Severe", 
        "symptoms": [], 
        "reasoning": "Detailed visual explanation of why this disease is identified.",
        "treatment_steps": ["Step 1: Do X", "Step 2: Do Y"], 
        "prevention_steps": ["..."],
        "expert_insights": ["Useful tip 1", "Tip 2"]
    },
    "summary": "Brief executive summary for the farmer"
}
If healthy, set disease to null.` }
        ];

        const response = await ai.models.generateContent({
            model: MODEL,
            contents: [{
                role: 'user',
                parts: parts
            }]
        });
        const resultText = response.text || '';

        // Parse JSON safely
        let analysisData: any = null;
        try {
            const cleaned = resultText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            analysisData = JSON.parse(cleaned);
        } catch {
            analysisData = { raw: resultText };
        }

        // Save to DB (Firestore)
        const scanData = {
            userId: userId || 'anonymous',
            imageName: image.name,
            imageSize: image.size,
            mimeType: mimeType,
            // Firestore has 1MB limit. Only save image if < 900KB.
            // In production, use Firebase Storage and save the URL instead.
            imageBase64: base64Image.length < 900000 ? base64Image : null,
            imageTooLarge: base64Image.length >= 900000,
            analysisResult: JSON.stringify(analysisData),
            plantType: analysisData.plantType || 'Unknown',
            diseaseName: analysisData.disease?.name || 'None',
            severity: analysisData.disease?.severity || 'Unknown',
            isHealthy: !!analysisData.isHealthy,
            createdAt: serverTimestamp()
        };

        const scanRef = doc(collection(db, 'scan_results'));
        await setDoc(scanRef, scanData);

        return Response.json({
            result: resultText,
            analysis: analysisData,
            scanId: scanRef.id
        });

    } catch (error: any) {
        console.error('[API] Analyze Error:', error);
        return Response.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const userId = url.searchParams.get('userId');

        if (!userId) return Response.json({ error: 'userId required' }, { status: 400 });

        const scansQuery = query(
            collection(db, 'scan_results'),
            where('userId', '==', userId),
            orderBy('createdAt', 'desc'),
            limit(50)
        );

        const querySnapshot = await getDocs(scansQuery);
        const scans = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt
        }));

        return Response.json(scans);
    } catch (error: any) {
        console.error('[API] Analyze GET Error:', error);
        return Response.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}
