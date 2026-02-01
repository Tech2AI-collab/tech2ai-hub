import { getPostBySlug } from '@/lib/storage';
import Link from 'next/link';import { notFound } from 'next/navigation';
import { ArrowLeft, Calendar, Download } from 'lucide-react';
import { remark } from 'remark';
import html from 'remark-html';
import AdSlotInArticle from "@/components/AdSlotInArticle";
import AdSlotSidebar from "@/components/AdSlotSidebar";

export const dynamic = 'force-dynamic';

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

async function getPostContent(content: string) {
    const processedContent = await remark()
        .use(html)
        .process(content);
    return processedContent.toString();
}

export default async function BlogPostPage({ params }: PageProps) {
    const { slug } = await params;
    const post = getPostBySlug(slug);

    if (!post) {
        notFound();
    }

    // Increment view count
    // incrementViewCount(slug);

    const contentHtml = await getPostContent(post.content);

    // Simple helper to extract video ID from standard YT URLs
    const getYoutubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const videoId = post.youtubeUrl ? getYoutubeId(post.youtubeUrl) : null;

    return (
        <main className="container mx-auto px-4 py-8">
            <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
            </Link>

            <div className="flex flex-col lg:flex-row gap-12">
                <div className="w-full lg:w-3/4">
                    <article className="bg-card text-card-foreground shadow-lg rounded-xl overflow-hidden border border-border">
                        {videoId && (
                            <div className="aspect-video w-full">
                                <iframe
                                    width="100%"
                                    height="100%"
                                    src={`https://www.youtube.com/embed/${videoId}`}
                                    title={post.title}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="border-0"
                                />
                            </div>
                        )}

                        <div className="p-4 md:p-8">
                            <header className="mb-6 md:mb-8 border-b border-border pb-6">
                                <div className="flex items-center text-sm text-muted-foreground mb-4">
                                    <Calendar className="w-4 h-4 mr-1.5" />
                                    {new Date(post.date).toLocaleDateString(undefined, {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </div>
                                <h1 className="text-2xl md:text-4xl sm:text-3xl font-black mb-4 leading-tight tracking-tight">{post.title}</h1>
                                <p className="text-base md:text-lg text-muted-foreground leading-relaxed">{post.description}</p>
                            </header>

                            <AdSlotInArticle />

                            <div
                                className="prose prose-base md:prose-lg dark:prose-invert prose-indigo max-w-none leading-relaxed prose-headings:font-bold prose-headings:tracking-tight prose-a:text-[#0066cc] prose-a:underline hover:prose-a:text-blue-800 prose-img:rounded-xl prose-img:shadow-md prose-strong:text-foreground prose-blockquote:border-l-primary prose-blockquote:bg-muted/30 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg"
                                dangerouslySetInnerHTML={{ __html: contentHtml }}
                            />

                            {post.attachments && post.attachments.length > 0 && (
                                <div className="mt-10 pt-8 border-t border-border">
                                    <h3 className="text-lg md:text-xl font-bold mb-4 flex items-center">
                                        <Download className="w-5 h-5 mr-2 text-primary" />
                                        Resources
                                    </h3>
                                    <div className="flex flex-col sm:flex-row flex-wrap gap-3">
                                        {post.attachments.map((file, idx) => (
                                            <a
                                                key={idx}
                                                href={file.url}
                                                target="_blank"
                                                download
                                                className="group flex items-center justify-center px-5 py-3 bg-secondary/50 text-secondary-foreground rounded-xl hover:bg-secondary border border-transparent hover:border-border transition-all duration-200"
                                            >
                                                <Download className="w-4 h-4 mr-2 text-primary group-hover:scale-110 transition-transform" />
                                                <span className="group-hover:text-primary group-hover:underline decoration-primary/50 underline-offset-4 transition-colors">
                                                    {file.name}
                                                </span>
                                                {file.size && (
                                                    <span className="ml-2 text-xs text-[#999] font-normal">
                                                        ({file.size})
                                                    </span>
                                                )}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </article>
                </div>

                <aside className="w-full lg:w-1/4 space-y-8">
                    <div className="bg-card p-6 rounded-2xl border border-border/50 sticky top-24">
                        <h3 className="text-lg font-bold mb-4">Sponsored</h3>
                        <AdSlotSidebar />
                        <div className="mt-6 pt-6 border-t border-border/50">
                            <h4 className="font-semibold mb-3">Newsletter</h4>
                            <p className="text-sm text-muted-foreground mb-4">Subscribe to get the latest tech insights directly to your inbox.</p>
                            <div className="flex gap-2">
                                <input type="email" placeholder="Email" className="w-full px-3 py-2 rounded-md border border-input bg-background/50 text-sm" />
                                <button className="bg-primary text-primary-foreground px-3 py-2 rounded-md text-sm font-medium hover:bg-primary/90">Go</button>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </main>
    );
}
