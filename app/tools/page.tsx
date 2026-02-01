import Link from 'next/link';
import { FileCode, FileType, FileText, Smartphone, ArrowUpRight } from 'lucide-react';
import AdSlotTop from "@/components/AdSlotTop";

const tools = [
    {
        name: "File Converter",
        description: "Convert images, documents, and videos securely in your browser.",
        icon: FileCode,
        color: "text-blue-500",
        bg: "bg-blue-500/10",
        href: ""
    },
    {
        name: "PDF to PPTX",
        description: "Transform your PDF documents into editable PowerPoint slides.",
        icon: FileType,
        color: "text-red-500",
        bg: "bg-red-500/10",
        href: "/tools/pdf-to-pptx"
    },
    {
        name: "Document Converter",
        description: "Convert Word, Excel, and Text files instantly.",
        icon: FileText,
        color: "text-green-500",
        bg: "bg-green-500/10"
    },
    {
        name: "More Coming Soon",
        description: "We are building more amazing tools for you.",
        icon: Smartphone,
        color: "text-purple-500",
        bg: "bg-purple-500/10"
    }
];

export default function ToolsPage() {
    return (
        <main className="container mx-auto px-4 py-16">
            <AdSlotTop />
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-black mb-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent inline-block">
                    Useful Tools
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Power up your productivity with our suite of free online utilities.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {tools.map((tool, index) => (
                    <div key={index} className="group bg-card hover:bg-gradient-to-br hover:from-card hover:to-accent/50 border border-border/50 p-8 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
                        <div className={`absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity`}>
                            <ArrowUpRight className="w-5 h-5 text-muted-foreground" />
                        </div>

                        <div className={`w-14 h-14 ${tool.bg} ${tool.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                            <tool.icon className="w-7 h-7" />
                        </div>

                        <h3 className="text-xl font-bold mb-3">{tool.name}</h3>
                        <p className="text-muted-foreground mb-6 leading-relaxed">
                            {tool.description}
                        </p>

                        {tool.href ? (
                            <Link
                                href={tool.href}
                                className="block w-full py-2.5 px-4 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-medium text-center text-sm transition-colors shadow-lg shadow-primary/20"
                            >
                                Launch Tool
                            </Link>
                        ) : (
                            <button
                                disabled
                                className="w-full py-2.5 px-4 bg-secondary/50 hover:bg-secondary text-secondary-foreground rounded-xl font-medium text-sm transition-colors border border-transparent hover:border-border cursor-not-allowed"
                            >
                                Coming Soon
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </main>
    );
}
