/* eslint-disable react-hooks/set-state-in-effect */
'use client'

import { useState, useEffect, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { toPng } from 'html-to-image';
import { Button } from "@/components/ui/button";
import ModuleActionSlides from '@/components/partials/modules/ModuleActionSlides';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from '@/components/ui/separator';
import { SparkleLoader } from "@/components/partials/SparkleLoader";
import { toast } from "sonner";
import { RotateCcw, Save, Eye, EditIcon, Loader, FilePenLine, VideoIcon, Camera } from "lucide-react";

const Editor = dynamic(() => import('@/components/editor/Editor'), {
    ssr: false,
    loading: () => (
        <div className="w-full max-w-[1200px] mx-auto my-0">
            <div className="min-h-[652px] flex items-center justify-center rounded-xl bg-card text-card-foreground shadow-sm border border-border/60">
                <div className="flex flex-col gap-4 items-center">
                    <Loader className="animate-spin text-muted-foreground" size={32} />
                    <p className="text-sm text-muted-foreground">Memuat Editor...</p>
                </div>
            </div>
        </div>
    ),
});

const EditorSwitchRender = ({ handleChange, editMode, setEditMode, content }) => {
    return (
        <div className='flex flex-col'>
            {editMode ? (
                <Editor onBlur={(c) => handleChange(c)} initialContent={content} />
            ) : (
                <>
                    {content ? (
                        <div className='min-h-[571.5px] shadow-sm p-8 bg-card text-card-foreground rounded-3xl border border-border/60'>
                            <article className='max-w-3xl py-10 mx-auto prose dark:prose-invert prose-sm' dangerouslySetInnerHTML={{ __html: content }}>
                            </article>
                        </div>
                    ) : (
                        <div className='aspect-video relative bg-card text-card-foreground p-3 shadow-sm rounded-xl border border-border/60'>
                            <div className="h-full flex flex-col items-center justify-center gap-4 border-2 border-dashed rounded-lg hover:bg-accent/30 transition-colors">
                                <div className="flex flex-col items-center gap-2 text-center">
                                    <div className="flex items-center justify-center rounded-xl border border-border p-2 bg-background">
                                        <svg className='size-5' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#fff">
                                            <g>
                                                <path opacity="0.4" d="M20.5 10.19H17.61C15.24 10.19 13.31 8.26 13.31 5.89V3C13.31 2.45 12.86 2 12.31 2H8.07C4.99 2 2.5 4 2.5 7.57V16.43C2.5 20 4.99 22 8.07 22H15.93C19.01 22 21.5 20 21.5 16.43V11.19C21.5 10.64 21.05 10.19 20.5 10.19Z" className='fill-amber-500' />
                                                <path d="M15.8002 2.21048C15.3902 1.80048 14.6802 2.08048 14.6802 2.65048V6.14048C14.6802 7.60048 15.9202 8.81048 17.4302 8.81048C18.3802 8.82048 19.7002 8.82048 20.8302 8.82048C21.4002 8.82048 21.7002 8.15048 21.3002 7.75048C19.8602 6.30048 17.2802 3.69048 15.8002 2.21048Z" className='fill-amber-500' />
                                                <path d="M13.5 13.75H7.5C7.09 13.75 6.75 13.41 6.75 13C6.75 12.59 7.09 12.25 7.5 12.25H13.5C13.91 12.25 14.25 12.59 14.25 13C14.25 13.41 13.91 13.75 13.5 13.75Z" className='fill-amber-500' />
                                                <path d="M11.5 17.75H7.5C7.09 17.75 6.75 17.41 6.75 17C6.75 16.59 7.09 16.25 7.5 16.25H11.5C11.91 16.25 12.25 16.59 12.25 17C12.25 17.41 11.91 17.75 11.5 17.75Z" className='fill-amber-500' />
                                            </g>
                                            <defs>
                                                <clipPath id="clip0_4418_4825">
                                                    <rect className='fill-amber-500 size-5' />
                                                </clipPath>
                                            </defs>
                                        </svg>
                                    </div>
                                    <p className="font-medium text-sm">
                                        Belum ada teks. Silakan mulai menulis.
                                    </p>
                                    <p className="text-muted-foreground text-xs">
                                        Klik area di bawah untuk mulai mengedit atau menambahkan teks
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setEditMode(true)}
                                    >
                                        <FilePenLine className="size-4" />
                                        <span>Mulai Menulis</span>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export const TextSlideEditor = ({ item, onUpdate }) => {
    const [content, setContent] = useState(item?.slide_content || '');
    const [lastSavedContent, setLastSavedContent] = useState(item?.slide_content || '');
    const [thumbnail, setThumbnail] = useState(null);
    const [isGeneratingThumbnail, setIsGeneratingThumbnail] = useState(false);
    const [editMode, setEditMode] = useState(false);

    const thumbnailRef = useRef(null);

    // Update content when item changes
    useEffect(() => {
        const newContent = item?.slide_content || '';
        setContent(newContent);
        setLastSavedContent(newContent);

        // Wrap dalam setTimeout untuk menghindari flushSync error
        if (window.editor) {
            setTimeout(() => {
                window.editor.commands.setContent(newContent);
            }, 0);
        }
    }, [item?.slide_content]);

    const handleChange = (c) => {
        setContent(c);
    };

    // Generate thumbnail dari rich text content
    const generateThumbnail = useCallback(async () => {
        if (!thumbnailRef.current || !content) {
            toast.error("Tidak ada konten untuk di-generate");
            return null;
        }

        setIsGeneratingThumbnail(true);

        try {
            // Tunggu sebentar agar DOM ter-render
            await new Promise(resolve => setTimeout(resolve, 100));

            // Generate image dengan aspect ratio 16:9
            const dataUrl = await toPng(thumbnailRef.current, {
                quality: 0.95,
                pixelRatio: 2,
                cacheBust: true,
                width: 1280,
                height: 720,
                backgroundColor: '#ffffff',
                skipAutoScale: false,
                filter: (node) => {
                    // Filter elemen yang berbau upload/media
                    const tagName = node.tagName;

                    // Skip elemen media
                    if (tagName === 'IMG') return false;
                    if (tagName === 'VIDEO') return false;
                    if (tagName === 'AUDIO') return false;
                    if (tagName === 'IFRAME') return false;
                    if (tagName === 'EMBED') return false;
                    if (tagName === 'OBJECT') return false;
                    if (tagName === 'SOURCE') return false;

                    // Skip style dan script
                    if (tagName === 'STYLE') return false;
                    if (tagName === 'SCRIPT') return false;

                    // Skip elemen dengan class/id yang mengandung 'video', 'image', 'media'
                    if (node.classList) {
                        const classList = Array.from(node.classList).join(' ').toLowerCase();
                        if (classList.includes('video') ||
                            classList.includes('image') ||
                            classList.includes('media') ||
                            classList.includes('upload')) {
                            return false;
                        }
                    }

                    return true;
                }
            });

            // Convert dataUrl to blob
            const response = await fetch(dataUrl);
            const blob = await response.blob();

            // Create file object
            const file = new File([blob], `thumbnail-${Date.now()}.png`, {
                type: 'image/png'
            });

            setThumbnail(dataUrl);
            toast.success("Thumbnail berhasil di-generate (tanpa media)");

            return file;
        } catch (error) {
            console.error('Error generating thumbnail:', error);
            toast.error("Gagal generate thumbnail: " + (error.message || 'Unknown error'));
            return null;
        } finally {
            setIsGeneratingThumbnail(false);
        }
    }, [content]);

    const handleSave = async () => {
        setLastSavedContent(content);

        // Generate thumbnail sebelum save
        const thumbnailFile = await generateThumbnail();

        if (onUpdate) {
            onUpdate(
                {
                    slide_content: content,
                },
                content,
                "text",
                thumbnailFile
            );
        }
    };

    const handleReset = () => {
        setContent(item?.slide_content || '');
        setLastSavedContent(item?.slide_content || '');
        setThumbnail(null);

        if (window.editor) {
            setTimeout(() => {
                window.editor.commands.setContent(item?.slide_content || '');
            }, 0);
        }
    };

    const hasChanges = content !== lastSavedContent;

    const PreviewEdit = () => (
        <>
            <div className="flex items-center justify-between ms-auto">
                <div className='bg-gray-100 dark:bg-zinc-900 p-1 gap-1 flex rounded-lg inset-shadow-sm'>
                    <Button
                        variant={!editMode ? 'outline' : 'ghost'}
                        onClick={() => setEditMode(false)}
                        className="hover:bg-accent border-0 h-7 text-xs !px-2"
                    >
                        <Eye className='size-4' />
                        <span>Pratinjau</span>
                    </Button>
                    <Button
                        size="sm"
                        variant={editMode ? 'outline' : 'ghost'}
                        onClick={() => setEditMode(true)}
                        className="hover:bg-accent border-0 h-7 text-xs !px-2"
                    >
                        <EditIcon className='size-4' />
                        <span>Edit</span>
                    </Button>
                </div>
            </div>
        </>
    );

    return (
        <div className="flex flex-col gap-4 p-1">
            {/* Toggle Edit/Preview Mode */}

            {/* Editor or Preview */}
            <EditorSwitchRender
                editMode={editMode}
                handleChange={handleChange}
                setEditMode={setEditMode}
                content={content}
            />

            {/* Hidden thumbnail generator dengan prose styling */}
            <div className='hidden'>
                <div
                    ref={thumbnailRef}
                    className="top-0 w-[1280px] h-[720px] bg-white dark:bg-card flex items-start overflow-hidden justify-center p-16"
                    style={{ pointerEvents: 'none' }}
                >
                    <div
                        className="prose prose-lg max-w-full w-full"
                        dangerouslySetInnerHTML={{ __html: content }}
                    />
                </div>
            </div>

            {/* Action Buttons */}

            <ModuleActionSlides Left={PreviewEdit}>
                {hasChanges && (
                    <div className="flex items-center justify-center gap-2">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="outline" size="sm" onClick={handleReset}>
                                    <RotateCcw />
                                    <span>Reset</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Reset ke Default</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    size="sm"
                                    onClick={handleSave}
                                    disabled={isGeneratingThumbnail}
                                >
                                    {isGeneratingThumbnail ? (
                                        <>
                                            <SparkleLoader size="xs" />
                                            <span>Generating...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Save />
                                            <span>Simpan</span>
                                        </>
                                    )}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Simpan Perubahan & Generate Thumbnail</TooltipContent>
                        </Tooltip>
                    </div>
                )}
            </ModuleActionSlides>

        </div>
    );
};
