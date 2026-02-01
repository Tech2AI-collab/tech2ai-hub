import Link from 'next/link';
import Image from 'next/image';
import { Post } from '@/lib/storage';
import { Calendar, ArrowRight, PlayCircle } from 'lucide-react';

interface BlogCardProps {
    post: Post;
}

export default function BlogCard({ post }: BlogCardProps) {
    return (
        <div className="group bg-card text-card-foreground rounded-2xl overflow-hidden border border-border/50 hover:border-primary/50 shadow-sm hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 flex flex-col h-full hover:-translate-y-1">
            <div className="relative h-56 w-full overflow-hidden">
                {post.coverImage ? (
                    <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center text-muted-foreground group-hover:scale-105 transition-transform duration-500">
                        <span className="text-sm font-medium">Tech2AI</span>
                    </div>
                )}
                {post.youtubeUrl && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-background/80 backdrop-blur-sm p-3 rounded-full text-primary shadow-lg">
                            <PlayCircle className="w-8 h-8" />
                        </div>
                    </div>
                )}
                <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium border border-border/50 shadow-sm">
                    Blog
                </div>
            </div>
            <div className="p-6 flex flex-col flex-grow relative">
                <div className="flex items-center text-xs font-semibold tracking-wider text-primary mb-3 uppercase">
                    <Calendar className="w-3 h-3 mr-1.5" />
                    {new Date(post.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>

                <h3 className="text-xl font-bold mb-3 leading-tight group-hover:text-primary transition-colors line-clamp-2">{post.title}</h3>

                <p className="text-muted-foreground mb-6 line-clamp-3 text-sm flex-grow leading-relaxed">
                    {post.description}
                </p>

                <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center text-sm font-semibold text-foreground group-hover:text-primary transition-colors mt-auto"
                >
                    Read Article
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
        </div>
    );
}
