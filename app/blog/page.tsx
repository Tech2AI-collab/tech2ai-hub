import { getPublishedPosts } from "@/lib/storage";
import BlogCard from "@/components/BlogCard";
import { Sparkles, ArrowLeft } from 'lucide-react';
import Link from "next/link";
import AdSlotTop from "@/components/AdSlotTop";
import AdSlotSidebar from "@/components/AdSlotSidebar";

export const dynamic = 'force-dynamic';

export default function BlogPage() {
    const posts = getPublishedPosts();

    return (
        <main className="min-h-screen pt-20 pb-16">
            <section className="container mx-auto px-4">
                <AdSlotTop />

                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-border/50 pb-6">
                    <div className="mb-6 md:mb-0">
                        <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4 transition-colors">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Home
                        </Link>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
                            <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">Tech</span>
                            <span className="text-foreground"> Insights</span>
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl">
                            Explore our latest articles, tutorials, and tech reviews.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                    <div className="w-full lg:w-3/4">
                        {posts.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {posts.map((post) => (
                                    <BlogCard key={post.slug} post={post} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-24 bg-card rounded-3xl border border-dashed border-border">
                                <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Sparkles className="w-8 h-8 text-muted-foreground" />
                                </div>
                                <h3 className="text-lg font-semibold mb-2">No posts found</h3>
                                <p className="text-muted-foreground mb-6">Check back later for new content.</p>
                            </div>
                        )}
                    </div>
                    <aside className="w-full lg:w-1/4 space-y-8">
                        <div className="bg-card p-6 rounded-2xl border border-border/50 sticky top-24">
                            <h3 className="text-lg font-bold mb-4">Sponsored</h3>
                            <AdSlotSidebar />
                            <div className="mt-8">
                                <h4 className="font-semibold mb-2">Popular Tags</h4>
                                <div className="flex flex-wrap gap-2">
                                    {['AI', 'Tech', 'Tutorial', 'Review', 'Coding'].map(tag => (
                                        <span key={tag} className="px-3 py-1 bg-secondary text-secondary-foreground text-xs rounded-full">{tag}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </section>
        </main>
    );
}
