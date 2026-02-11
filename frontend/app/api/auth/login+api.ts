import { db } from '../../../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export async function POST(request: Request) {
    try {
        const { userId, password } = await request.json();

        if (!userId || !password) {
            return Response.json({ error: 'Missing fields' }, { status: 400 });
        }

        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            return Response.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const user = userSnap.data();

        if (user.password !== password) {
            return Response.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        return Response.json({
            userId: user.userId,
            name: user.name,
            createdAt: user.createdAt?.toDate?.() || user.createdAt
        });

    } catch (error: any) {
        console.error('Login Error:', error);
        return Response.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}
