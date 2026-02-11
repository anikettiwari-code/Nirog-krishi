import { db } from '../../../lib/firebase';
import { collection, doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export async function POST(request: Request) {
    try {
        const { userId, name, password } = await request.json();

        if (!userId || !name || !password) {
            return Response.json({ error: 'Missing fields' }, { status: 400 });
        }

        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            console.log('❌ Register: User ID exists:', userId);
            return Response.json({ error: 'User ID already exists' }, { status: 400 });
        }

        console.log('✨ Register: Creating new user in Firestore...');
        const userData = {
            userId,
            name,
            password, // In production, hash this
            createdAt: serverTimestamp()
        };

        await setDoc(userRef, userData);
        console.log('✅ Register: User saved');

        return Response.json({
            userId: userData.userId,
            name: userData.name,
            createdAt: new Date().toISOString()
        });

    } catch (error: any) {
        console.error('Registration Error:', error);
        return Response.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}
