import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { password } = await request.json();
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!adminPassword) {
            // If env var is not set, block access or allow default? 
            // Safer to block.
            console.error("ADMIN_PASSWORD env var is not set");
            return NextResponse.json({ success: false, error: 'Server misconfiguration' }, { status: 500 });
        }

        if (password === adminPassword) {
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json({ success: false, error: 'Invalid password' }, { status: 401 });
        }
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Error' }, { status: 500 });
    }
}
