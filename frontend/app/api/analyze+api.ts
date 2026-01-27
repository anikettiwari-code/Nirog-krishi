import { GoogleGenAI } from '@google/genai';
import connectToDatabase from '../../lib/db';
import ScanResult from '../../models/ScanResult';
import { Buffer } from 'buffer'; // Node environment

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
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const MODEL = 'gemini-2.5-flash';

        console.log('[API] Analyzing image...', image.name, image.size);

        const contents = [
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

        const response = await ai.models.generateContent({ model: MODEL, contents });
        const resultText = response.text || '';

        // Parse JSON safely
        let analysisData: any = null;
        try {
            const cleaned = resultText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            analysisData = JSON.parse(cleaned);
        } catch {
            analysisData = { raw: resultText };
        }

        // Save to DB
        await connectToDatabase();

        const scan = new ScanResult({
            userId: userId || 'anonymous',
            imageName: image.name,
            imageSize: image.size,
            mimeType: mimeType,
            imageBase64: base64Image, // Save to DB
            analysisResult: JSON.stringify(analysisData), // Save CLEAN JSON (no backticks)
            plantType: analysisData.plantType,
            diseaseName: analysisData.disease?.name,
            severity: analysisData.disease?.severity || 'Unknown',
            isHealthy: analysisData.isHealthy
        });

        await scan.save();

        return Response.json({ result: resultText, analysis: analysisData, scanId: scan._id });

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

        await connectToDatabase();

        // Return latest 50 scans, sorted new to old
        const scans = await ScanResult.find({ userId })
            .sort({ createdAt: -1 })
            .limit(50);

        return Response.json(scans);
    } catch (error: any) {
        return Response.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
