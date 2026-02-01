export default function AdSlotSidebar() {
    return (
        <div className="w-full min-h-[250px] bg-muted/50 border border-dashed border-border rounded-lg flex items-center justify-center relative overflow-hidden my-6 hidden md:flex">
            {/* 
                PASTE YOUR AD CODE HERE 
                For Sidebar, usually a 300x250 or 300x600 unit.
            */}
            <span className="text-muted-foreground text-sm font-medium px-4 text-center">
                Ad space (Sidebar)<br />
                <span className="text-xs opacity-75">Place 300x250 code here</span>
            </span>
        </div>
    );
}
