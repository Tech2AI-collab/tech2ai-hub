export default function AdSlotInArticle() {
    return (
        <div className="w-full my-8 min-h-[250px] bg-muted/50 border border-dashed border-border rounded-lg flex items-center justify-center relative overflow-hidden">
            {/* 
                PASTE YOUR AD CODE HERE 
                For In-Article, use Google AdSense "In-article ads" responsive code.
            */}
            <span className="text-muted-foreground text-sm font-medium px-4 text-center">
                Ad space (In-Article)<br />
                <span className="text-xs opacity-75">Place In-Article responsive code here</span>
            </span>
        </div>
    );
}
