import connectToDatabase from '../../../lib/db';
import User from '../../../models/User';

export async function POST(request: Request) {
    try {
        const { userId, name, password } = await request.json();

        if (!userId || !name || !password) {
            return Response.json({ error: 'Missing fields' }, { status: 400 });
        }

        await connectToDatabase();

        const existingUser = await User.findOne({ userId });
        if (existingUser) {
            console.log('❌ Register: User ID exists:', userId);
            return Response.json({ error: 'User ID already exists' }, { status: 400 });
        }

        console.log('✨ Register: Creating new user...');
        const newUser = new User({ userId, name, password });
        await newUser.save();
        console.log('✅ Register: User saved');

        return Response.json({
            userId: newUser.userId,
            name: newUser.name,
            createdAt: newUser.createdAt
        });

    } catch (error: any) {
        console.error('Registration Error:', error);
        return Response.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
