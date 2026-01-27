import connectToDatabase from '../../../lib/db';
import User from '../../../models/User';

export async function POST(request: Request) {
    try {
        const { userId, password } = await request.json();

        if (!userId || !password) {
            return Response.json({ error: 'Missing fields' }, { status: 400 });
        }

        await connectToDatabase();

        const user = await User.findOne({ userId });

        if (!user || user.password !== password) {
            return Response.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        return Response.json({
            userId: user.userId,
            name: user.name,
            createdAt: user.createdAt
        });

    } catch (error: any) {
        console.error('Login Error:', error);
        return Response.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
