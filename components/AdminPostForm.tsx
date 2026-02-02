"use client";
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Post, Attachment } from '@/lib/storage';
import { ArrowLeft, Save, Upload, X, Eye, Image as ImageIcon, FileText, Link as LinkIcon, Bold, Italic, Code, List, Heading } from 'lucide-react';
import Link from 'next/link';
import { remark } from 'remark';
import html from 'remark-html';

interface AdminPostFormProps {
    initialData?: Post;
}

export default function AdminPostForm({ initialData }: AdminPostFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [previewHtml, setPreviewHtml] = useState("");
    const [showLinkModal, setShowLinkModal] = useState(false);
    const [linkData, setLinkData] = useState({ text: '', url: '', newTab: false });
    const contentRef = useRef<HTMLTextAreaElement>(null);

    // File input refs
    const imageInputRef = useRef<HTMLInputElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState<Partial<Post>>({
        title: "",
        slug: "",
        description: "",
        content: "",
        youtubeUrl: "",
        coverImage: "",
        attachments: [],
        status: 'draft',
        ...initialData
    });

    // Auto-generate slug from title if new post
    useEffect(() => {
        if (!initialData && formData.title && !formData.slug) {
            const slug = formData.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)+/g, '');
            setFormData(prev => ({ ...prev, slug }));
        }
    }, [formData.title, formData.slug, initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'file') => {
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];
        const uploadData = new FormData();
        uploadData.append('file', file);
        uploadData.append('type', type === 'image' ? 'image' : 'file');

        setLoading(true);
        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: uploadData
            });
            const data = await res.json();

            if (data.success) {
                if (type === 'image') {
                    setFormData(prev => ({ ...prev, coverImage: data.url }));
                } else {
                    const newAttachment: Attachment = { name: data.name, url: data.url, size: data.size };
                    setFormData(prev => ({
                        ...prev,
                        attachments: [...(prev.attachments || []), newAttachment]
                    }));
                }
            } else {
                alert("Upload failed");
            }
        } catch (err) {
            console.error(err);
            alert("Upload error");
        } finally {
            setLoading(false);
        }
    };

    const handleInlineImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];
        const uploadData = new FormData();
        uploadData.append('file', file);
        uploadData.append('type', 'image');

        setLoading(true);
        try {
            const res = await fetch('/api/upload', { method: 'POST', body: uploadData });
            const data = await res.json();

            if (data.success) {
                // Insert markdown at cursor position
                const url = data.url;
                const markdownImage = `![${file.name}](${url})`;

                if (contentRef.current) {
                    const start = contentRef.current.selectionStart;
                    const end = contentRef.current.selectionEnd;
                    const text = formData.content || "";
                    const newText = text.substring(0, start) + markdownImage + text.substring(end);

                    setFormData(prev => ({
                        ...prev,
                        content: newText,
                        inlineImages: [...(prev.inlineImages || []), url]
                    }));
                } else {
                    // Fallback append
                    setFormData(prev => ({
                        ...prev,
                        content: (prev.content || "") + "\n" + markdownImage,
                        inlineImages: [...(prev.inlineImages || []), url]
                    }));
                }
            }
        } catch (err) {
            console.error(err);
            alert("Image upload failed");
        } finally {
            setLoading(false);
            // Reset input
            if (imageInputRef.current) imageInputRef.current.value = '';
        }
    };

    const generatePreview = async () => {
        if (!formData.content) {
            setPreviewHtml("");
            return;
        }
        try {
            const processed = await remark().use(html).process(formData.content);
            setPreviewHtml(processed.toString());
            setShowPreview(true);
        } catch (err) {
            console.error("Preview generation failed", err);
        }
    };

    const handleInsertLink = () => {
        const { text, url, newTab } = linkData;
        if (!url) {
            alert("Please enter a URL");
            return;
        }

        // Validate URL
        if (!url.startsWith('http') && !url.startsWith('/')) {
            alert("URL must start with http://, https://, or /");
            return;
        }

        let linkMarkdown = `[${text || url}](${url})`;
        // If new tab is requested, we might need HTML, but standard markdown defaults to current tab. 
        // To support new tab in markdown rendering generally requires HTML <a> tags or a markdown renderer plugin.
        // For simplicity and standard markdown support, we'll try to use standard markdown, 
        // OR if the user specifically requested new tab, use HTML.

        if (newTab) {
            linkMarkdown = `<a href="${url}" target="_blank" rel="noopener noreferrer">${text || url}</a>`;
        }

        if (contentRef.current) {
            const start = contentRef.current.selectionStart;
            const end = contentRef.current.selectionEnd;
            const currentText = formData.content || "";
            const newText = currentText.substring(0, start) + linkMarkdown + currentText.substring(end);

            setFormData(prev => ({ ...prev, content: newText }));
        } else {
            setFormData(prev => ({ ...prev, content: (prev.content || "") + linkMarkdown }));
        }

        setShowLinkModal(false);
        setLinkData({ text: '', url: '', newTab: false });
    };

    const insertMarkdown = (prefix: string, suffix: string = "") => {
        if (contentRef.current) {
            const start = contentRef.current.selectionStart;
            const end = contentRef.current.selectionEnd;
            const text = formData.content || "";
            const selectedText = text.substring(start, end);
            const before = text.substring(0, start);
            const after = text.substring(end);

            const newText = before + prefix + selectedText + suffix + after;

            setFormData(prev => ({ ...prev, content: newText }));

            // Optional: Restore cursor / selection
            // We need a timeout or useEffect to set selection after render, 
            // but simple text update is often enough for MVP.
        }
    };

    const openLinkModal = () => {
        // Optionally capture selected text as link text
        let selectedText = '';
        if (contentRef.current) {
            const start = contentRef.current.selectionStart;
            const end = contentRef.current.selectionEnd;
            selectedText = (formData.content || "").substring(start, end);
        }
        setLinkData({ text: selectedText, url: '', newTab: false });
        setShowLinkModal(true);
    };

    const removeAttachment = (index: number) => {
        setFormData(prev => ({
            ...prev,
            attachments: prev.attachments?.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const endpoint = initialData ? `/api/posts/${initialData.slug}` : '/api/posts';
            const method = initialData ? 'PUT' : 'POST';

            const res = await fetch(endpoint, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                router.push('/admin');
                router.refresh();
            } else {
                alert("Failed to save post");
            }
        } catch (err) {
            console.error(err);
            alert("Error saving post");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto pb-12">
            <div className="flex justify-between items-center">
                <Link href="/admin" className="text-muted-foreground hover:text-foreground flex items-center">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                </Link>
                <h1 className="text-2xl font-bold">{initialData ? 'Edit Post' : 'Create New Post'}</h1>
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={generatePreview}
                        className="bg-secondary text-secondary-foreground px-4 py-2 rounded-md font-medium flex items-center hover:bg-secondary/80 border border-border"
                    >
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-primary text-primary-foreground px-6 py-2 rounded-md font-medium flex items-center hover:bg-primary/90 disabled:opacity-50"
                    >
                        <Save className="w-4 h-4 mr-2" />
                        {loading ? 'Saving...' : 'Save Post'}
                    </button>
                </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-1">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border border-input bg-background rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Status</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'draft' | 'published' }))}
                            className="w-full p-2 border border-input bg-background rounded-md"
                        >
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Slug (URL)</label>
                        <input
                            type="text"
                            name="slug"
                            value={formData.slug}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border border-input bg-background rounded-md"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Description (Short Summary)</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full p-2 border border-input bg-background rounded-md h-24"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">YouTube URL</label>
                    <input
                        type="text"
                        name="youtubeUrl"
                        value={formData.youtubeUrl}
                        onChange={handleChange}
                        placeholder="e.g. https://www.youtube.com/watch?v=..."
                        className="w-full p-2 border border-input bg-background rounded-md"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Cover Image</label>
                    <div className="flex items-center gap-4">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, 'image')}
                            className="text-sm"
                        />
                        {loading && <span className="text-sm text-muted-foreground">Uploading...</span>}
                    </div>
                    {formData.coverImage && (
                        <div className="mt-2 text-sm text-green-500">
                            Image uploaded: {formData.coverImage}
                        </div>
                    )}
                </div>

                <div>
                    <div className="flex justify-between items-center mb-1">
                        <label className="block text-sm font-medium">Content (Markdown Allowed)</label>
                        <button
                            type="button"
                            onClick={() => imageInputRef.current?.click()}
                            className="text-xs bg-muted hover:bg-muted/80 px-2 py-1 rounded border border-border flex items-center"
                        >
                            <ImageIcon className="w-3 h-3 mr-1" />
                            Insert Image
                        </button>
                        <button
                            type="button"
                            onClick={openLinkModal}
                            className="text-xs bg-muted hover:bg-muted/80 px-2 py-1 rounded border border-border flex items-center ml-2"
                        >
                            <LinkIcon className="w-3 h-3 mr-1" />
                            Insert Link
                        </button>
                    </div>

                    {/* Markdown Toolbar */}
                    <div className="flex flex-wrap gap-1 mb-2 p-1 bg-muted/50 rounded-md border border-border">
                        <button type="button" onClick={() => insertMarkdown('**', '**')} title="Bold" className="p-1.5 hover:bg-background rounded transition-colors text-xs font-bold min-w-[28px]">
                            <Bold className="w-4 h-4" />
                        </button>
                        <button type="button" onClick={() => insertMarkdown('*', '*')} title="Italic" className="p-1.5 hover:bg-background rounded transition-colors text-xs italic min-w-[28px]">
                            <Italic className="w-4 h-4" />
                        </button>
                        <button type="button" onClick={() => insertMarkdown('`', '`')} title="Code" className="p-1.5 hover:bg-background rounded transition-colors text-xs font-mono min-w-[28px]">
                            <Code className="w-4 h-4" />
                        </button>
                        <div className="w-px bg-border mx-1 my-1"></div>
                        <button type="button" onClick={() => insertMarkdown('# ')} title="Heading 1" className="p-1.5 hover:bg-background rounded transition-colors text-xs font-bold min-w-[28px]">
                            H1
                        </button>
                        <button type="button" onClick={() => insertMarkdown('## ')} title="Heading 2" className="p-1.5 hover:bg-background rounded transition-colors text-xs font-bold min-w-[28px]">
                            H2
                        </button>
                        <button type="button" onClick={() => insertMarkdown('### ')} title="Heading 3" className="p-1.5 hover:bg-background rounded transition-colors text-xs font-bold min-w-[28px]">
                            H3
                        </button>
                        <div className="w-px bg-border mx-1 my-1"></div>
                        <button type="button" onClick={() => insertMarkdown('- ')} title="Bullet List" className="p-1.5 hover:bg-background rounded transition-colors text-xs min-w-[28px]">
                            <List className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Hidden input for inline images */}
                    <input
                        type="file"
                        accept="image/*"
                        ref={imageInputRef}
                        className="hidden"
                        onChange={handleInlineImageUpload}
                    />

                    <textarea
                        name="content"
                        ref={contentRef}
                        value={formData.content}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border border-input bg-background rounded-md h-[400px] font-mono text-sm"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                        Use Markdown for formatting. # Heading, **Bold**, - List, etc.
                    </p>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Attachments</label>
                    <div className="flex items-center gap-4 mb-4">
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="text-sm bg-muted hover:bg-muted/80 px-3 py-1.5 rounded border border-border flex items-center"
                        >
                            <FileText className="w-4 h-4 mr-2" />
                            Add Attachment
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={(e) => handleFileUpload(e, 'file')}
                            className="hidden"
                        />
                        {loading && <span className="text-sm text-muted-foreground">Uploading...</span>}
                    </div>

                    <div className="space-y-2">
                        {formData.attachments?.map((file, idx) => (
                            <div key={idx} className="flex items-center justify-between bg-muted p-2 rounded-md">
                                <span className="text-sm truncate">{file.name}</span>
                                <button type="button" onClick={() => removeAttachment(idx)} className="text-red-500 hover:bg-white/10 p-1 rounded">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Link Modal */}
            {showLinkModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-background w-full max-w-md rounded-xl shadow-2xl p-6 animate-in zoom-in-95 duration-200">
                        <h2 className="font-bold text-lg mb-4 flex items-center">
                            <LinkIcon className="w-4 h-4 mr-2" />
                            Insert Link
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Link Text</label>
                                <input
                                    type="text"
                                    value={linkData.text}
                                    onChange={(e) => setLinkData(prev => ({ ...prev, text: e.target.value }))}
                                    className="w-full p-2 border border-input bg-background rounded-md"
                                    placeholder="Click here"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">URL</label>
                                <input
                                    type="text"
                                    value={linkData.url}
                                    onChange={(e) => setLinkData(prev => ({ ...prev, url: e.target.value }))}
                                    className="w-full p-2 border border-input bg-background rounded-md"
                                    placeholder="https://example.com"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="newTab"
                                    checked={linkData.newTab}
                                    onChange={(e) => setLinkData(prev => ({ ...prev, newTab: e.target.checked }))}
                                    className="rounded border-input"
                                />
                                <label htmlFor="newTab" className="text-sm">Open in new tab</label>
                            </div>
                            <div className="flex justify-end gap-2 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowLinkModal(false)}
                                    className="px-4 py-2 text-sm font-medium rounded-md hover:bg-muted"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleInsertLink}
                                    className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                                >
                                    Insert
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Preview Modal */}
            {showPreview && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-background w-full max-w-4xl max-h-[90vh] rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-4 border-b border-border flex justify-between items-center bg-muted/50">
                            <h2 className="font-bold flex items-center">
                                <Eye className="w-4 h-4 mr-2 text-primary" />
                                Post Preview
                            </h2>
                            <button onClick={() => setShowPreview(false)} className="hover:bg-muted p-1 rounded-full transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="overflow-y-auto p-6 md:p-10">
                            {formData.coverImage && (
                                <img src={formData.coverImage} alt="Cover" className="w-full h-64 md:h-80 object-cover rounded-xl mb-8" />
                            )}
                            <h1 className="text-3xl md:text-5xl font-black mb-6">{formData.title}</h1>
                            {formData.youtubeUrl && (() => {
          const getYoutubeId = (url: string) => {
            const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
            const match = url.match(regExp);
            return (match && match[2].length === 11) ? match[2] : null;
          };
          const videoId = getYoutubeId(formData.youtubeUrl);
          
          return videoId ? (
            <div className="aspect-video w-full mb-8">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${videoId}`}
                title="YouTube video preview"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="border-0 rounded-xl"
              />
            </div>
          ) : (
            <div className="aspect-video w-full mb-8 bg-black/5 rounded-xl flex items-center justify-center text-muted-foreground">
              Invalid YouTube URL
            </div>
          );
        })()}
                            <div
                                className="prose prose-base md:prose-lg dark:prose-invert max-w-none"
                                dangerouslySetInnerHTML={{ __html: previewHtml }}
                            />
                            {formData.attachments && formData.attachments.length > 0 && (
                                <div className="mt-10 pt-8 border-t border-border">
                                    <h3 className="text-lg font-bold mb-4">Attachments</h3>
                                    <div className="flex gap-2">
                                        {formData.attachments.map((file, i) => (
                                            <span key={i} className="px-3 py-1 bg-secondary text-xs rounded-full">{file.name}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </form>
    );
}
