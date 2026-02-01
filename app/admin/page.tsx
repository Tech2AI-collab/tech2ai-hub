"use client";
import { useState, useEffect } from "react";
import Link from 'next/link';
import { Post } from "@/lib/storage";
import { Plus, Edit, Trash2, LogOut } from 'lucide-react';
// We need to fetch posts client side for the admin dashboard to be dynamic after edits
// Or use server actions, but standard client fetch is fine for now.

export default function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        // Check session storage
        const auth = sessionStorage.getItem("admin_auth");
        if (auth === "true") {
            setIsAuthenticated(true);
            fetchPosts();
        } else {
            setLoading(false);
        }
    }, []);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/posts');
            const data = await res.json();
            setPosts(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });
            const data = await res.json();

            if (data.success) {
                setIsAuthenticated(true);
                sessionStorage.setItem("admin_auth", "true");
                fetchPosts();
            } else {
                setError(data.error || "Login failed");
            }
        } catch (err) {
            setError("Something went wrong");
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        sessionStorage.removeItem("admin_auth");
        setPassword("");
    };

    const handleDelete = async (slug: string) => {
        if (!confirm("Are you sure you want to delete this post?")) return;

        try {
            await fetch(`/api/posts/${slug}`, { method: 'DELETE' });
            fetchPosts();
        } catch (err) {
            alert("Failed to delete");
        }
    };

    if (loading && !isAuthenticated) return <div className="p-8 text-center">Loading...</div>;

    if (!isAuthenticated) {
        return (
            <div className="flex items-center justify-center min-h-[80vh]">
                <div className="w-full max-w-md p-8 bg-card border border-border rounded-lg shadow-lg">
                    <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter Admin Password"
                                className="w-full p-2 border border-input bg-background rounded-md"
                            />
                        </div>
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <button type="submit" className="w-full bg-primary text-primary-foreground p-2 rounded-md font-medium hover:bg-primary/90">
                            Access Dashboard
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const stats = {
        total: posts.length,
        published: posts.filter(p => p.status === 'published').length,
        drafts: posts.filter(p => p.status === 'draft').length,
        views: posts.reduce((acc, curr) => acc + (curr.viewCount || 0), 0)
    };

    return (
        <main className="container mx-auto px-4 pt-24 pb-12">
            <div className="flex flex-col gap-6 mb-10">
                <h1 className="text-3xl md:text-4xl font-bold">Admin Dashboard</h1>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-card border border-border p-4 rounded-xl">
                        <p className="text-muted-foreground text-sm font-medium">Total Posts</p>
                        <p className="text-2xl font-bold mt-1">{stats.total}</p>
                    </div>
                    <div className="bg-card border border-border p-4 rounded-xl">
                        <p className="text-muted-foreground text-sm font-medium">Published</p>
                        <p className="text-2xl font-bold mt-1 text-green-500">{stats.published}</p>
                    </div>
                    <div className="bg-card border border-border p-4 rounded-xl">
                        <p className="text-muted-foreground text-sm font-medium">Drafts</p>
                        <p className="text-2xl font-bold mt-1 text-orange-500">{stats.drafts}</p>
                    </div>
                    <div className="bg-card border border-border p-4 rounded-xl">
                        <p className="text-muted-foreground text-sm font-medium">Total Views</p>
                        <p className="text-2xl font-bold mt-1 text-blue-500">{stats.views}</p>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4 justify-between items-end md:items-center">
                    <div className="flex flex-wrap gap-4 w-full md:w-auto">
                        <Link href="/admin/editor" className="inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg active:scale-95 transition-all font-medium shadow-sm hover:shadow-md">
                            <Plus className="w-5 h-5 mr-2" />
                            New Post
                        </Link>
                        <button onClick={handleLogout} className="inline-flex items-center justify-center bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg active:scale-95 transition-all font-medium shadow-sm hover:shadow-md">
                            <LogOut className="w-5 h-5 mr-2" />
                            Logout
                        </button>
                    </div>

                    {/* Search Bar */}
                    <div className="w-full md:w-64">
                        <input
                            type="text"
                            placeholder="Search posts..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-card border border-border rounded-lg overflow-hidden">
                <table className="w-full">
                    <thead className="bg-muted hidden md:table-header-group">
                        <tr>
                            <th className="p-4 text-left">Title</th>
                            <th className="p-4 text-left">Status</th>
                            <th className="p-4 text-left">Views</th>
                            <th className="p-4 text-left">Date</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {filteredPosts.map((post) => (
                            <tr key={post.slug} className="flex flex-col md:table-row border-t border-border/50 md:border-t-0 bg-card hover:bg-muted/50 transition-colors">
                                <td className="p-4 font-medium flex-1">
                                    <span className="md:hidden text-xs font-semibold text-muted-foreground block mb-1">Title</span>
                                    {post.title}
                                </td>
                                <td className="p-4">
                                    <span className="md:hidden text-xs font-semibold text-muted-foreground block mb-1">Status</span>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${post.status === 'published'
                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                        : 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
                                        }`}>
                                        {post.status === 'published' ? 'Published' : 'Draft'}
                                    </span>
                                </td>
                                <td className="p-4 text-muted-foreground">
                                    <span className="md:hidden text-xs font-semibold text-muted-foreground block mb-1">Views</span>
                                    {post.viewCount || 0}
                                </td>
                                <td className="p-4 text-muted-foreground">
                                    <span className="md:hidden text-xs font-semibold text-muted-foreground block mb-1">Date</span>
                                    {new Date(post.date).toLocaleDateString()}
                                </td>
                                <td className="p-4 flex md:table-cell justify-end gap-2 border-t md:border-t-0 border-border/10">
                                    <Link href={`/admin/editor/${post.slug}`} className="inline-flex items-center px-3 py-1.5 bg-blue-500/10 text-blue-600 rounded-lg hover:bg-blue-500/20 transition-colors text-sm font-medium">
                                        <Edit className="w-4 h-4 mr-1.5" />
                                        Edit
                                    </Link>
                                    <button onClick={() => handleDelete(post.slug)} className="inline-flex items-center px-3 py-1.5 bg-red-500/10 text-red-600 rounded-lg hover:bg-red-500/20 transition-colors text-sm font-medium">
                                        <Trash2 className="w-4 h-4 mr-1.5" />
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {filteredPosts.length === 0 && (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-muted-foreground">
                                    {posts.length === 0 ? "No posts found. Create one!" : "No posts match your search."}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </main>
    );
}
