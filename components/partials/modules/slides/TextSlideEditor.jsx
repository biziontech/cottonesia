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
import { RotateCcw, Save, Eye, EditIcon, Loader } from "lucide-react";

const Editor = dynamic(() => import('@/components/editor/Editor'), {
    ssr: false,
    loading: () => (
        <div className="w-full max-w-[1200px] mx-auto my-0">
            <div className="min-h-[652px] flex items-center justify-center rounded-xl bg-white shadow-sm">
                <div className="flex flex-col gap-4 items-center">
                    <Loader className="animate-spin text-gray-500" size={32} />
                    <p className="text-sm text-gray-600">Memuat Editor...</p>
                </div>
            </div>
        </div>
    ),
});

const EditorSwitchRender = ({ handleChange, editMode, content }) => {
    return (
        <div className='flex flex-col'>
            {editMode ? (
                <Editor onBlur={(c) => handleChange(c)} initialContent={content} />
            ) : (
                <div className='p-1'>
                    <div className='min-h-[652px] shadow-md bg-white p-8 rounded-3xl'>
                        <article className='max-w-3xl py-10 mx-auto prose prose-sm' dangerouslySetInnerHTML={{ __html: content }}>
                        </article>
                    </div>
                </div>
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

    return (
        <div className="flex flex-col gap-4">
            {/* Toggle Edit/Preview Mode */}
            <div className="flex items-center justify-between">
                <div className='bg-gray-100 p-1 gap-1 flex rounded-lg inset-shadow-sm'>
                    <Button
                        size="sm"
                        variant={!editMode ? 'outline' : 'ghost'}
                        onClick={() => setEditMode(false)}
                        className="hover:bg-white border-0"
                    >
                        <Eye />
                        <span>Pratinjau</span>
                    </Button>
                    <Button
                        size="sm"
                        variant={editMode ? 'outline' : 'ghost'}
                        onClick={() => setEditMode(true)}
                        className="hover:bg-white border-0"
                    >
                        <EditIcon />
                        <span>Edit</span>
                    </Button>
                </div>
            </div>

            {/* Editor or Preview */}
            <EditorSwitchRender
                editMode={editMode}
                handleChange={handleChange}
                content={content}
            />

            {/* Hidden thumbnail generator dengan prose styling */}
            <div className='hidden'>
                <div
                    ref={thumbnailRef}
                    className="top-0 w-[1280px] h-[720px] bg-white flex items-start overflow-hidden justify-center p-16"
                    style={{ pointerEvents: 'none' }}
                >
                    <div
                        className="prose prose-lg max-w-full w-full"
                        dangerouslySetInnerHTML={{ __html: content }}
                    />
                </div>
            </div>

            {/* Action Buttons */}
            {hasChanges && (
                <ModuleActionSlides>
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
                </ModuleActionSlides>
            )}
        </div>
    );
};