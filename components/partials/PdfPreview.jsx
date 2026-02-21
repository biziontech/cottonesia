"use client";

import { useState, useMemo } from "react";
import { Document, Page } from "react-pdf";
import { pdfjs } from 'react-pdf';
import api from "@/lib/api";
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function PdfPreview({ fileUrl, data = null }) {
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [containerWidth, setContainerWidth] = useState(null);

    const fileConfig = useMemo(() => ({
        url: fileUrl,
        httpHeaders: {
            'Accept': 'application/pdf',
            'Authorization': `Bearer ${api.token}`
        },
        withCredentials: false,
    }), [fileUrl]); // hanya re-create jika fileUrl berubah

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    function goToPrevPage() {
        setPageNumber(prev => Math.max(prev - 1, 1));
    }

    function goToNextPage() {
        setPageNumber(prev => Math.min(prev + 1, numPages));
    }

    return (
        <div className="flex flex-col items-center gap-4 w-full">
            <div
                ref={(ref) => {
                    if (ref && !containerWidth) {
                        setContainerWidth(ref.offsetWidth);
                    }
                }}
                className="w-full aspect-video bg-white rounded-lg overflow-hidden"
            >
                <Document
                    file={fileConfig}
                    loading={
                        <div className="flex items-center justify-center w-full h-full">
                            <div className="w-full h-full bg-white animate-pulse rounded-lg flex items-center justify-center">
                                <div className="flex items-center gap-2">
                                    <Spinner />
                                    <span className="text-xs">Memuat File Pdf...</span>
                                </div>
                            </div>
                        </div>
                    }
                    error={
                        <div className="flex items-center justify-center w-full h-full text-red-500">
                            Failed to load PDF
                        </div>
                    }
                    onLoadSuccess={onDocumentLoadSuccess}
                    onLoadError={(error) => console.error('PDF load error:', error)}
                    className="flex items-center justify-center w-full h-full"
                >
                    <Page
                        pageNumber={pageNumber}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                        width={containerWidth || 800}
                        className="mx-auto"
                        loading={
                            <div className="flex items-center justify-center w-full h-full">
                                <div className="w-full h-full bg-white animate-pulse rounded-lg flex items-center justify-center">
                                    <div className="flex items-center gap-2">
                                        <Spinner />
                                        <span className="text-xs">Memuat Halaman...</span>
                                    </div>
                                </div>
                            </div>
                        }
                    />
                </Document>
            </div>

            {numPages && (
                <div className="flex items-center justify-between gap-4 w-full">

                    {data?.filename && (
                        <div className="flex flex-col">
                            <span className="text-xs line-clamp-1">
                                {data?.filename}
                            </span>
                            <span className="text-xs text-gray-500 ">{data?.size_label}</span>
                        </div>
                    )}


                    <div className="flex gap-3 items-center">
                        <Button
                            size="icon-sm"
                            variant="outline"
                            onClick={goToPrevPage}
                            disabled={pageNumber <= 1}
                            aria-label="Previous page"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </Button>

                        <span className="text-xs font-medium">
                            Page {pageNumber} of {numPages}
                        </span>

                        <Button
                            size="icon-sm"
                            variant="outline"
                            onClick={goToNextPage}
                            disabled={pageNumber >= numPages}
                            aria-label="Next page"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}