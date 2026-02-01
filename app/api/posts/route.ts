import { NextResponse } from 'next/server';
import { getPosts, savePost, Post } from '@/lib/storage';

export async function GET() {
    const posts = getPosts();
    return NextResponse.json(posts);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        // Basic validation
        if (!body.title || !body.slug) {
            return NextResponse.json({ error: 'Title and Slug are required' }, { status: 400 });
        }

        const newPost: Post = {
            ...body,
            date: body.date || new Date().toISOString(),
            attachments: body.attachments || [],
            status: body.status || 'draft', // Default to draft for new posts
            viewCount: 0
        };

        savePost(newPost);
        return NextResponse.json(newPost, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
    }
}
