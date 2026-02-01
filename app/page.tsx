import Link from "next/link";
import { getPublishedPosts } from "@/lib/storage";
import BlogCard from "@/components/BlogCard";
import { ArrowRight, Sparkles } from 'lucide-react';

import AdSlotTop from "@/components/AdSlotTop";
import AdSlotSidebar from "@/components/AdSlotSidebar";

export const dynamic = 'force-dynamic';

export default async function Home() {
    const posts = getPublishedPosts();
    const latestPost = posts.length > 0 ? posts[0] : null;
    const otherPosts = posts.length > 1 ? posts.slice(1) : [];

    return (
        <main className="min-h-screen">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
                <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[bottom_1px_center] dark:bg-grid-slate-400/[0.05] [mask-image:linear-gradient(0deg,transparent,black)]"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>

                <div className="container relative mx-auto px-4 text-center z-10">
                    <div className="inline-flex items-center rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-8 backdrop-blur-sm animate-fade-in">
                        <Sparkles className="w-4 h-4 mr-2" />
                        Exploring the Future of Tech
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight animate-slide-up">
                        <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Tech</span>
                        <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">2AI</span>
                        <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent"> Hub</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up [animation-delay:100ms]">
                        Your daily source for computer tutorials, AI insights, and tech reviews.
                    </p>

                    <div className="flex flex-wrap justify-center gap-4 animate-slide-up [animation-delay:200ms]">
                        <Link
                            href="/tools"
                            className="px-8 py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all hover:scale-105 shadow-lg shadow-primary/25"
                        >
                            Explore Tools
                        </Link>
                        <Link
                            href="#latest"
                            className="px-8 py-3 rounded-full bg-secondary text-secondary-foreground font-semibold hover:bg-secondary/80 transition-all hover:scale-105 border border-border/50"
                        >
                            Read Blog
                        </Link>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-4">
                <AdSlotTop />
            </div>

            {/* Latest Posts Section */}
            <section id="latest" className="container mx-auto px-4 py-16">
                <div className="flex items-end justify-between mb-12 border-b border-border/50 pb-6">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Latest Articles</h2>
                        <p className="text-muted-foreground mt-2">Fresh content from the channel.</p>
                    </div>
                    <Link href="/blog" className="hidden md:flex items-center text-sm font-medium text-primary hover:text-primary/80">
                        View Archive <ArrowRight className="ml-1 w-4 h-4" />
                    </Link>
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
                                <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
                                <p className="text-muted-foreground mb-6">Start by creating your first post in the Admin panel.</p>
                                <Link href="/admin" className="text-primary hover:underline">
                                    Go to Admin
                                </Link>
                            </div>
                        )}
                        <div className="mt-12 text-center md:hidden">
                            <Link href="/blog" className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80">
                                View Archive <ArrowRight className="ml-1 w-4 h-4" />
                            </Link>
                        </div>
                    </div>

                    <aside className="w-full lg:w-1/4 space-y-8">
                        <div className="sticky top-24">
                            <div className="bg-card p-6 rounded-2xl border border-border/50 mb-8">
                                <h3 className="text-lg font-bold mb-4">Sponsored</h3>
                                <AdSlotSidebar />
                            </div>

                            <div className="bg-gradient-to-br from-indigo-500/5 to-purple-500/5 p-6 rounded-2xl border border-indigo-500/10">
                                <h3 className="text-lg font-bold mb-3 flex items-center">
                                    <Sparkles className="w-4 h-4 mr-2 text-indigo-500" />
                                    Trending
                                </h3>
                                <ul className="space-y-3">
                                    {otherPosts.slice(0, 3).map(post => (
                                        <li key={post.slug}>
                                            <Link href={`/blog/${post.slug}`} className="text-sm font-medium hover:text-primary transition-colors line-clamp-2">
                                                {post.title}
                                            </Link>
                                            <span className="text-xs text-muted-foreground">{new Date(post.date).toLocaleDateString()}</span>
                                        </li>
                                    ))}
                                    {otherPosts.length === 0 && <li className="text-sm text-muted-foreground">More posts coming soon!</li>}
                                </ul>
                            </div>
                        </div>
                    </aside>
                </div>
            </section>
        </main>
    );
}
