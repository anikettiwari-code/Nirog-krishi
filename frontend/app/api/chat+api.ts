import { GoogleGenAI } from '@google/genai';
import connectToDatabase from '../../lib/db';
import ChatMessage from '../../models/ChatMessage';

export async function POST(request: Request) {
    try {
        const { message, sessionId, userId } = await request.json();

        if (!message) {
            return Response.json({ error: 'Message required' }, { status: 400 });
        }

        const session = sessionId || `session_${Date.now()}`;
        await connectToDatabase();

        // Fetch history
        const history = await ChatMessage.find({ sessionId: session }).sort({ createdAt: -1 }).limit(6);
        const context = history.reverse().map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n');

        // AI
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const MODEL = 'gemini-2.5-flash';

        const prompt = `You are CropGuard AI, an expert agricultural assistant. Help farmers with plant diseases, pest control, fertilizers, irrigation tips. Be helpful and concise.
${context ? `\nConversation:\n${context}\n` : ''}
User: ${message}
Assistant:`;

        const response = await ai.models.generateContent({ model: MODEL, contents: prompt });
        const reply = response.text || 'Sorry, I am unable to respond right now.';

        // Save
        await ChatMessage.create({ sessionId: session, userId, role: 'user', content: message });
        await ChatMessage.create({ sessionId: session, userId, role: 'assistant', content: reply });

        return Response.json({ reply, sessionId: session });

    } catch (error: any) {
        console.error('[API] Chat Error:', error);
        return Response.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const userId = url.searchParams.get('userId');

        if (!userId) return Response.json({ error: 'userId required' }, { status: 400 });

        await connectToDatabase();

        // Return all chats for user, sorted old to new
        const chats = await ChatMessage.find({ userId }).sort({ createdAt: 1 });

        return Response.json(chats);
    } catch (error: any) {
        return Response.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
