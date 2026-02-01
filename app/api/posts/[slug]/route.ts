import { NextResponse } from 'next/server';
import { getPostBySlug, savePost, deletePost, Post } from '@/lib/storage';

// Since we are using file system, dynamic routes can be tricky if we don't have request params properly typed in Next.js 13+ app dir for API
// But standard signature is (request, { params })

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = getPostBySlug(slug);
    if (!post) {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    return NextResponse.json(post);
}

export async function PUT(request: Request, { params }: { params: Promise<{ slug: string }> }) {
    try {
        const { slug } = await params;
        const body = await request.json();
        const updatedPost: Post = {
            ...body,
            slug: slug, // Force keep slug from URL
            // Status and other fields come from body
        };
        savePost(updatedPost);
        return NextResponse.json(updatedPost);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    deletePost(slug);
    return NextResponse.json({ success: true });
}
