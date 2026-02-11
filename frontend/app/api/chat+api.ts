import { GoogleGenAI } from '@google/genai';
import { db } from '../../lib/firebase';
import { collection, addDoc, getDocs, query, where, orderBy, limit, serverTimestamp } from 'firebase/firestore';
import { API_CONFIG } from '../../constants/config';

export async function POST(request: Request) {
    try {
        const { message, sessionId, userId } = await request.json();

        if (!message) {
            return Response.json({ error: 'Message required' }, { status: 400 });
        }

        const session = sessionId || `session_${Date.now()}`;

        // Fetch history
        const chatQuery = query(
            collection(db, 'chat_messages'),
            where('sessionId', '==', session),
            orderBy('createdAt', 'desc'),
            limit(6)
        );
        const querySnapshot = await getDocs(chatQuery);
        const historyDocs = querySnapshot.docs.map(doc => doc.data());
        const context = historyDocs.reverse().map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n');

        // AI - Gemini
        // Use Config Fallback if Env is missing (Fixes "API Key not found" error)
        const apiKey = process.env.GEMINI_API_KEY || API_CONFIG.GEMINI_API_KEY;
        if (!apiKey) throw new Error('Gemini API Key is missing. Check .env or config.ts');

        const ai = new GoogleGenAI({ apiKey });
        // User requested "2.5 flash" -> Mapping to 2.0 Flash Experimental
        const MODEL = 'gemini-2.0-flash-exp';

        const prompt = `You are CropGuard AI, an expert agricultural assistant. Help farmers with plant diseases, pest control, fertilizers, irrigation tips. Be helpful and concise.
${context ? `\nConversation:\n${context}\n` : ''}
User: ${message}
Assistant:`;

        // Fix: Ensure strict format for 'contents'
        const response = await ai.models.generateContent({
            model: MODEL,
            contents: [{
                role: 'user',
                parts: [{ text: prompt }]
            }]
        });
        const reply = response.text || 'Sorry, I am unable to respond right now.';

        // Save
        const chatCollection = collection(db, 'chat_messages');
        await addDoc(chatCollection, { userId: userId || 'anonymous', sessionId: session, role: 'user', content: message, createdAt: serverTimestamp() });
        await addDoc(chatCollection, { userId: userId || 'anonymous', sessionId: session, role: 'assistant', content: reply, createdAt: serverTimestamp() });

        return Response.json({ reply, sessionId: session });

    } catch (error: any) {
        console.error('[API] Chat Error:', error);
        // Expose actual error to client for debugging
        return Response.json({ error: error.message || 'Internal Server Error', details: error.toString() }, { status: 500 });
    }
}

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const userId = url.searchParams.get('userId');

        if (!userId) return Response.json({ error: 'userId required' }, { status: 400 });

        // Return all chats for user, sorted old to new
        const chatsQuery = query(
            collection(db, 'chat_messages'),
            where('userId', '==', userId),
            orderBy('createdAt', 'asc')
        );
        const querySnapshot = await getDocs(chatsQuery);
        const chats = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt
        }));

        return Response.json(chats);
    } catch (error: any) {
        console.error('[API] Chat GET Error:', error);
        return Response.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
