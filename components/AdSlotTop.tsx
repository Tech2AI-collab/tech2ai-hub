export default function AdSlotTop() {
    return (
        <div className="w-full max-w-[728px] mx-auto my-8 min-h-[90px] bg-muted/50 border border-dashed border-border rounded-lg flex items-center justify-center relative overflow-hidden">
            {/* 
                PASTE YOUR AD CODE HERE 
                For Google AdSense, likely a <script> tag and an <ins> tag.
                Example:
                <ins className="adsbygoogle"
                     style={{ display: "block" }}
                     data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
                     data-ad-slot="XXXXXXXXXX"
                     data-ad-format="auto"
                     data-full-width-responsive="true"></ins>
            */}
            <span className="text-muted-foreground text-sm font-medium px-4 text-center">
                Ad space (Top Banner)<br />
                <span className="text-xs opacity-75">Place 728x90 or Responsive code here</span>
            </span>
        </div>
    );
}
