"use client";

import { useState, useRef, useEffect } from 'react';
import { FileUp, Download, Loader2, FileType, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

// We'll import these dynamically or use global script tags if needed, 
// but let's try standard imports first and handle worker later.
import pptxgen from "pptxgenjs";
// pdfjs will be imported dynamically to avoid SSR issues

export default function PdfToPptxPage() {
    const [file, setFile] = useState<File | null>(null);
    const [isConverting, setIsConverting] = useState(false);
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState<string>("");
    const [downloadHelpers, setDownloadHelpers] = useState<{ name: string, data: any } | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            if (selectedFile.type === 'application/pdf') {
                setFile(selectedFile);
                setStatus("Ready to convert");
                setDownloadHelpers(null);
                setProgress(0);
            } else {
                alert("Please select a valid PDF file.");
            }
        }
    };

    const convertPdfToPptx = async () => {
        if (!file) return;

        try {
            setIsConverting(true);
            setStatus("Initializing PDF Engine...");
            setProgress(5);

            // Dynamic import to avoid SSR issues
            const pdfJS = await import('pdfjs-dist');

            // Set worker using local file in public folder
            pdfJS.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

            setStatus("Loading PDF...");
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfJS.getDocument({ data: arrayBuffer }).promise;

            const totalPages = pdf.numPages;
            setStatus(`Found ${totalPages} pages. Starting conversion...`);

            const pptx = new pptxgen();

                // Define mode for PDF to image conversion
                const mode = 'image';
            for (let i = 1; i <= totalPages; i++) {
                setStatus(`Processing page ${i} of ${totalPages}...`);
                const page = await pdf.getPage(i);

                // Add slide
                const slide = pptx.addSlide();

                if (mode === 'image') {
                    // Image Mode: Render canvas -> High fidelity image
                    const viewport = page.getViewport({ scale: 2.0 });
                    const canvas = document.createElement('canvas');
                    const context = canvas.getContext('2d');
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;

                    if (context) {
                        // @ts-ignore - mismatch in pdfjs types for render params
                        await page.render({ canvasContext: context, viewport: viewport }).promise;
                        const imgData = canvas.toDataURL('image/jpeg', 0.8);
                        slide.background = { data: imgData };
                    }
                } else {
                    // Editable Mode: Extract Text
                    const viewport = page.getViewport({ scale: 1.0 });
                    const textContent = await page.getTextContent();
                    const PtsToInch = 1 / 72;

                    for (const item of textContent.items) {
                        // @ts-ignore
                        if (!item.str || item.str.trim().length === 0) continue;

                        // PDF.js transform: [scaleX, skewY, skewX, scaleY, x, y]
                        // @ts-ignore
                        const tx = item.transform[4];
                        // @ts-ignore
                        const ty = item.transform[5];

                        // @ts-ignore
                        const fontHeight = Math.sqrt((item.transform[0] * item.transform[0]) + (item.transform[1] * item.transform[1]));

                        // Convert to Inches
                        // x is straightforward
                        const x_in = tx * PtsToInch;

                        // y in PDF is from bottom, PPTX is from top
                        // We need page height. viewport.height is in points.
                        const y_in = (viewport.height - ty - fontHeight) * PtsToInch;

                        const fontSize = fontHeight; // Roughly 1pt = 1pt 

                        slide.addText(item.str as string, {
                            x: x_in,
                            y: y_in,
                            w: "100%", // Allow flow? Or calculate width? 'item.width' exists but vague.
                            h: fontHeight * PtsToInch * 1.5,
                            fontSize: fontSize,
                            color: "000000",
                            fontFace: "Arial"
                        });
                    }
                }

                setProgress(Math.round((i / totalPages) * 90));
            }

            setStatus("Finalizing PPTX file...");
            setProgress(95);

            const fileName = file.name.replace('.pdf', '') + '_converted.pptx';
            await pptx.writeFile({ fileName: fileName });

            setStatus("Conversion Complete!");
            setProgress(100);
            setIsConverting(false);
            // setFile(null); // Keep file for re-converting

        } catch (error) {
            console.error(error);
            setStatus("Error converting file: " + (error instanceof Error ? error.message : String(error)));
            setIsConverting(false);
        }
    };

    return (
        <main className="container mx-auto px-4 py-16 max-w-3xl">
            <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center p-3 bg-red-500/10 rounded-2xl mb-4">
                    <FileType className="w-8 h-8 text-red-500" />
                </div>
                <h1 className="text-4xl font-black mb-4 bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                    PDF to PowerPoint
                </h1>
                <p className="text-muted-foreground text-lg">
                    Convert your PDF documents into editable PowerPoint presentations instantly.
                </p>
            </div>

            <div className="bg-card border border-border rounded-3xl p-8 shadow-2xl shadow-primary/5">
                {/* Upload Area */}
                {!isConverting && progress === 0 && (
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-3 border-dashed border-border hover:border-primary/50 hover:bg-accent/50 rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 group"
                    >
                        <input
                            type="file"
                            accept=".pdf"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                        />
                        <div className="w-20 h-20 bg-muted group-hover:bg-background rounded-full flex items-center justify-center mx-auto mb-6 transition-colors shadow-sm">
                            <FileUp className="w-10 h-10 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">
                            {file ? file.name : "Click to Upload PDF"}
                        </h3>
                        <p className="text-muted-foreground text-sm">
                            {file ? "Click to change file" : "or drag and drop here"}
                        </p>
                    </div>
                )}

                {/* Progress Area */}
                {(isConverting || progress > 0) && (
                    <div className="text-center py-12">
                        <div className="relative w-32 h-32 mx-auto mb-6">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle
                                    cx="64" cy="64" r="60"
                                    className="stroke-muted fill-none text-muted" strokeWidth="8"
                                />
                                <circle
                                    cx="64" cy="64" r="60"
                                    className="stroke-primary fill-none transition-all duration-500"
                                    strokeWidth="8"
                                    strokeDasharray={377}
                                    strokeDashoffset={377 - (377 * progress) / 100}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                {progress === 100 ? (
                                    <CheckCircle className="w-12 h-12 text-green-500 animate-bounce" />
                                ) : (
                                    <span className="text-2xl font-bold">{progress}%</span>
                                )}
                            </div>
                        </div>
                        <h3 className="text-xl font-bold mb-2 animate-pulse">{status}</h3>
                        {progress === 100 && (
                            <p className="text-muted-foreground">Your download should start automatically.</p>
                        )}
                    </div>
                )}

                {/* Actions */}
                {file && !isConverting && progress === 0 && (
                    <div className="mt-8 flex justify-center">
                        <button
                            onClick={convertPdfToPptx}
                            className="px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-bold text-lg shadow-lg hover:shadow-primary/25 transition-all hover:scale-105 flex items-center"
                        >
                            Convert to PPTX <Download className="ml-2 w-5 h-5" />
                        </button>
                    </div>
                )}

                {progress === 100 && (
                    <div className="mt-8 flex justify-center">
                        <button
                            onClick={() => {
                                setFile(null);
                                setProgress(0);
                                setStatus("");
                            }}
                            className="px-6 py-3 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-xl font-medium transition-colors"
                        >
                            Convert Another File
                        </button>
                    </div>
                )}
            </div>
        </main>
    );
}
