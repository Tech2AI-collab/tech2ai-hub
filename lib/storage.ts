import fs from 'fs';
import path from 'path';

const postsDirectory = path.join(process.cwd(), 'data');
const postsFile = path.join(postsDirectory, 'posts.json');

export interface Attachment {
    name: string;
    url: string;
    size?: string;
}

export interface Post {
    slug: string;
    title: string;
    description: string;
    content: string; // HTML or Markdown
    youtubeUrl?: string; // Optional
    date: string;
    coverImage?: string;
    attachments: Attachment[];
    status?: 'published' | 'draft';
    viewCount?: number;
    inlineImages?: string[];
}

function ensureDirectory() {
    if (!fs.existsSync(postsDirectory)) {
        fs.mkdirSync(postsDirectory, { recursive: true });
    }
}

export function getPosts(): Post[] {
    ensureDirectory();
    if (!fs.existsSync(postsFile)) {
        return [];
    }
    const fileContent = fs.readFileSync(postsFile, 'utf8');
    try {
        const posts: Post[] = JSON.parse(fileContent);
        // Migration: Ensure all posts have default status, viewCount, and missing attachment sizes
        return posts.map(post => {
            // Populate missing attachment sizes
            let attachments = post.attachments;
            if (attachments && attachments.length > 0) {
                attachments = attachments.map(att => {
                    if (!att.size && att.url.startsWith('/uploads/')) {
                        try {
                            const filePath = path.join(process.cwd(), 'public', att.url);
                            if (fs.existsSync(filePath)) {
                                const stats = fs.statSync(filePath);
                                const bytes = stats.size;
                                if (bytes === 0) return { ...att, size: '0 Bytes' };
                                const k = 1024;
                                const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
                                const i = Math.floor(Math.log(bytes) / Math.log(k));
                                const size = parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
                                return { ...att, size };
                            }
                        } catch (e) {
                            // Ignore error
                        }
                    }
                    return att;
                });
            }

            return {
                ...post,
                status: post.status || 'published',
                viewCount: post.viewCount || 0,
                attachments
            };
        });
    } catch (error) {
        console.error("Error reading posts.json", error);
        return [];
    }
}

export function getPublishedPosts(): Post[] {
    const posts = getPosts();
    return posts.filter(post => post.status === 'published');
}

export function incrementViewCount(slug: string): void {
    const posts = getPosts();
    const index = posts.findIndex(p => p.slug === slug);
    if (index > -1) {
        posts[index].viewCount = (posts[index].viewCount || 0) + 1;
        fs.writeFileSync(postsFile, JSON.stringify(posts, null, 2));
    }
}

export function getPostBySlug(slug: string): Post | null {
    const posts = getPosts();
    return posts.find((post) => post.slug === slug) || null;
}

export function savePost(post: Post): void {
    const posts = getPosts();
    const existingIndex = posts.findIndex((p) => p.slug === post.slug);

    if (existingIndex > -1) {
        posts[existingIndex] = post;
    } else {
        posts.unshift(post); // Add to top
    }

    fs.writeFileSync(postsFile, JSON.stringify(posts, null, 2));
}

export function deletePost(slug: string): void {
    const posts = getPosts();
    const newPosts = posts.filter((p) => p.slug !== slug);
    fs.writeFileSync(postsFile, JSON.stringify(newPosts, null, 2));
}
