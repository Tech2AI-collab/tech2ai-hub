"use client";
import AdminPostForm from '@/components/AdminPostForm';
import { useEffect, useState, use } from 'react';
import { Post } from '@/lib/storage';

export default function EditPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                // Client side fetch since we are in "use client" wrapper for convenience 
                // (or could make this page server component and pass data to client form)
                // But AdminPostForm is client component.
                const res = await fetch(`/api/posts/${slug}`);
                if (res.ok) {
                    const data = await res.json();
                    setPost(data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [slug]);

    if (loading) return <div className="p-8 text-center">Loading post...</div>;
    if (!post) return <div className="p-8 text-center text-red-500">Post not found</div>;

    return (
        <main className="container mx-auto px-4 pt-24 pb-12">
            <AdminPostForm initialData={post} />
        </main>
    );
}
