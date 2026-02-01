export default function Footer() {
    return (
        <footer className="bg-muted/30 border-t border-border/50 py-12 mt-auto">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div className="col-span-1 md:col-span-2">
                        <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent inline-block">Tech2AI Hub</h3>
                        <p className="text-muted-foreground max-w-sm">
                            Empowering tech enthusiasts with daily articles, tutorials, and powerful tools to boost productivity.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Links</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><a href="/" className="hover:text-primary transition-colors">Home</a></li>
                            <li><a href="/tools" className="hover:text-primary transition-colors">Tools</a></li>
                            <li><a href="/admin" className="hover:text-primary transition-colors">Admin</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Socials</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><a href="https://www.youtube.com/@Tech2AI" className="hover:text-red-500 transition-colors">YouTube</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Twitter</a></li>
                            <li><a href="#" className="hover:text-pink-500 transition-colors">Instagram</a></li>
                        </ul>
                    </div>
                </div>
                <div className="text-center pt-8 border-t border-border/50 text-xs text-muted-foreground">
                    &copy; {new Date().getFullYear()} Tech2AI Hub. Built with Next.js & Tailwind.
                </div>
            </div>
        </footer>
    );
}
