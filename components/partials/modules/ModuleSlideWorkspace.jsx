/* eslint-disable react-hooks/set-state-in-effect */
'use client'

import { useState, useCallback, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useModule } from "@/contexts/ModuleContext";
import { Button } from "@/components/ui/button";
import { Separator } from '@/components/ui/separator';
import { PanelLeft, Paperclip, BookOpen, Mic, Type, Image as ImageIcon, Video as VideoIcon, TextSelectionIcon, Play } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { AttachmentItem } from '@/components/partials/modules/slides/AttachmentItem';
import { ImageSlideEditor } from '@/components/partials/modules/slides/ImageSlideEditor';
import { TextSlideEditor } from '@/components/partials/modules/slides/TextSlideEditor';
import { VideoSlideEditor } from '@/components/partials/modules/slides/VideoSlideEditor';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import api from '@/lib/api';
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const EmptySlideState = () => {
    return (
        <div className="aspect-video relative bg-white shadow-sm rounded-xl flex flex-col items-center justify-center gap-4 p-8">
            <div className="flex items-center justify-center rounded-xl border p-4 bg-gray-50">
                <ImageIcon className="size-8 text-gray-400" />
            </div>
            <div className="text-center">
                <h3 className="text-sm font-semibold text-gray-900 mb-1">Belum Ada Slide Terpilih</h3>
                <p className="text-xs text-gray-500">Silakan pilih slide terlebih dahulu untuk mulai mengedit</p>
            </div>
        </div>
    );
};

// Main Workspace Component
export const ModuleSlideWorkspace = () => {
    const { module, setModule, selectedSlide, setSelectedSlide, openSideSlide, setOpenSideSlide, openSideSlideDrawer, setOpenSideSlideDrawer } = useModule();
    
    const handleSlideUpdate = async (updates, content = null, slideType = null, thumbnail = null) => {
        // Update selected slide UI optimistically
        setSelectedSlide(prev => ({ ...prev, ...updates }));

        // Jika ada content untuk disimpan
        if (content && slideType) {
            try {
                const formData = new FormData();

                // Handle berdasarkan slide type
                switch (slideType) {
                    case 'image':
                        // Content berupa object dengan cropped file
                        const croppedImage = content?.cropped || content?.original;
                        if (croppedImage) {
                            formData.append('file', croppedImage);
                        } else {
                            toast.error('File gambar tidak valid');
                            return;
                        }
                        break;

                    case 'video':
                        // Content berupa video file, thumbnail terpisah
                        if (content) {
                            formData.append('file', content);
                        } else {
                            toast.error('File video tidak valid');
                            return;
                        }

                        // Thumbnail wajib untuk video
                        if (thumbnail) {
                            formData.append('thumbnail', thumbnail);
                        } else {
                            toast.error('Thumbnail video tidak valid');
                            return;
                        }
                        break;

                    case 'text':
                        // thumbanil
                        formData.append('thumbnail', thumbnail);
                        // Content berupa string text
                        if (typeof content === 'string') {
                            formData.append('content', content);
                        } else {
                            toast.error('Konten text tidak valid');
                            return;
                        }
                        break;

                    default:
                        toast.error('Tipe slide tidak valid');
                        return;
                }

                // Append slide type
                formData.append('slide_type', slideType);

                // Upload ke server
                const response = await fetch(
                    `${API_URL}/office/training-slides/${module?.uuid}/update/${selectedSlide?.ulid}`,
                    {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${api.token}`,
                        },
                        body: formData,
                    }
                );

                const data = await response.json();

                if (data?.success) {
                    // Update selected slide dengan data dari server
                    setSelectedSlide(data?.data);

                    // Update module slides
                    setModule(prev => ({
                        ...prev,
                        slides: prev.slides.map(slide =>
                            slide.ulid === data.data.ulid
                                ? { ...slide, ...data.data }
                                : slide
                        )
                    }));

                    toast.success(data?.message || "Data berhasil disimpan");
                } else {
                    toast.error(data?.message || "Terjadi kesalahan saat update data");
                }

            } catch (error) {
                console.error('Upload error:', error);
                toast.error(error.message || "Terjadi kesalahan saat upload file");
            }
        }
    };

    // Determine slide type from available data
    const getSlideType = () => {
        if (!selectedSlide) return null;
        return selectedSlide.slide_type || 'image';
    };

    const slideType = getSlideType();
    const hasAttachment = selectedSlide?.attachment_type;

    const handleSetAttachmentType = (type) => {
        setSelectedSlide(prev => ({
            ...prev,
            attachment_type: type,
            attachment_content: type === 'text' ? (prev?.attachment_content || '') : null,
            attachment_audio: type === 'audio' ? (prev?.attachment_audio || null) : null
        }));
    };

    const handleAttachmentUpdate = (updates) => {
        setSelectedSlide(prev => ({
            ...prev,
            ...updates
        }));
    };

    const handleAttachmentDelete = () => {
        setSelectedSlide(prev => ({
            ...prev,
            attachment_type: null,
            attachment_content: null,
            attachment_audio: null
        }));
    };


    return (
        <div className='flex flex-1 flex-col gap-5 items-center justify-start relative px-3 py-5'>
            <div className="flex flex-col gap-6 w-full h-[calc(100dvh-209px)] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

                <div className='p-1 sticky top-0 z-50'>
                    <div className='w-full max-w-5xl items-center mx-auto bg-white shadow-sm py-1.5 ps-2.5 px-1.5 rounded-xl flex gap-2'>
                        <Button
                            size="icon-sm"
                            variant="secondary"
                            className="hidden 2xl:flex"
                            onClick={() => setOpenSideSlide(!openSideSlide)}
                        >
                            <PanelLeft />
                        </Button>
                        <Button
                            size="icon-sm"
                            variant="secondary"
                            className="flex 2xl:hidden"
                            onClick={() => setOpenSideSlideDrawer(!openSideSlideDrawer)}
                        >
                            <PanelLeft />
                        </Button>
                        <Separator orientation='vertical' className="!h-5 my-auto" />
                        <span className='text-xs text-gray-500'>{selectedSlide ? (<>Slide {selectedSlide?.sort} of {module?.slides?.length}</>) : 'No Selected Slide'}</span>

                        <div className='block xl:hidden p-1 bg-gray-100 rounded-lg ms-auto'>
                            <Select
                                value={selectedSlide?.slide_type}
                                onValueChange={(value) => {
                                    if (selectedSlide?.slide_type !== value) {
                                        setSelectedSlide(prev => ({
                                            ...prev,
                                            slide_type: value
                                        }));
                                    }
                                }}
                            >
                                <SelectTrigger className="w-[140px] h-8 border-0 hover:bg-white">
                                    <SelectValue placeholder="Slide Type" />
                                </SelectTrigger>

                                <SelectContent position='popper' align="end">
                                    <SelectItem value="image">
                                        <div className='flex gap-1.5 items-center text-xs'>
                                            <svg className='size-4 fill-white' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" >
                                                <g>
                                                    <path className='fill-sky-500' opacity="0.4" d="M22 7.81V13.9L20.37 12.5C19.59 11.83 18.33 11.83 17.55 12.5L13.39 16.07C12.61 16.74 11.35 16.74 10.57 16.07L10.23 15.79C9.52 15.17 8.39 15.11 7.59 15.65L2.67 18.95L2.56 19.03C2.19 18.23 2 17.28 2 16.19V7.81C2 4.17 4.17 2 7.81 2H16.19C19.83 2 22 4.17 22 7.81Z" />
                                                    <path className='fill-sky-500' d="M9.00012 10.3801C10.3146 10.3801 11.3801 9.31456 11.3801 8.00012C11.3801 6.68568 10.3146 5.62012 9.00012 5.62012C7.68568 5.62012 6.62012 6.68568 6.62012 8.00012C6.62012 9.31456 7.68568 10.3801 9.00012 10.3801Z" />
                                                    <path className='fill-sky-500' d="M22.0001 13.8996V16.1896C22.0001 19.8296 19.8301 21.9996 16.1901 21.9996H7.81006C5.26006 21.9996 3.42006 20.9296 2.56006 19.0296L2.67006 18.9496L7.59006 15.6496C8.39006 15.1096 9.52006 15.1696 10.2301 15.7896L10.5701 16.0696C11.3501 16.7396 12.6101 16.7396 13.3901 16.0696L17.5501 12.4996C18.3301 11.8296 19.5901 11.8296 20.3701 12.4996L22.0001 13.8996Z" />
                                                </g>
                                                <defs>
                                                    <clipPath>
                                                        <rect className='size-4 fill-white' fill="white" />
                                                    </clipPath>
                                                </defs>
                                            </svg>
                                            <span>Image</span>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="video">
                                        <div className='flex gap-1.5 items-center text-xs'>
                                            <svg className='size-5' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                                <g>
                                                    <path d="M18.7 8.97989L4.14 17.7099C4.05 17.3799 4 17.0299 4 16.6699V7.32989C4 4.24989 7.33 2.32989 10 3.86989L14.04 6.19989L18.09 8.53989C18.31 8.66989 18.52 8.80989 18.7 8.97989Z" className='fill-rose-500' />
                                                    <path opacity="0.4" d="M18.0902 15.4598L14.0402 17.7998L10.0002 20.1298C8.09022 21.2298 5.84021 20.5698 4.72021 18.9598L5.14021 18.7098L19.5802 10.0498C20.5802 11.8498 20.0902 14.3098 18.0902 15.4598Z" className='fill-rose-500' />
                                                </g>
                                                <defs>
                                                    <clipPath id="clip0_4418_4372">
                                                        <rect className='size-5 fill-rose-500' />
                                                    </clipPath>
                                                </defs>
                                            </svg>
                                            <span>Video</span>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="text">
                                        <div className='flex gap-1.5 items-center text-xs'>
                                            <svg className='size-4' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#fff">
                                                <g>
                                                    <path opacity="0.4" d="M20.5 10.19H17.61C15.24 10.19 13.31 8.26 13.31 5.89V3C13.31 2.45 12.86 2 12.31 2H8.07C4.99 2 2.5 4 2.5 7.57V16.43C2.5 20 4.99 22 8.07 22H15.93C19.01 22 21.5 20 21.5 16.43V11.19C21.5 10.64 21.05 10.19 20.5 10.19Z" className='fill-amber-500' />
                                                    <path d="M15.8002 2.21048C15.3902 1.80048 14.6802 2.08048 14.6802 2.65048V6.14048C14.6802 7.60048 15.9202 8.81048 17.4302 8.81048C18.3802 8.82048 19.7002 8.82048 20.8302 8.82048C21.4002 8.82048 21.7002 8.15048 21.3002 7.75048C19.8602 6.30048 17.2802 3.69048 15.8002 2.21048Z" className='fill-amber-500' />
                                                    <path d="M13.5 13.75H7.5C7.09 13.75 6.75 13.41 6.75 13C6.75 12.59 7.09 12.25 7.5 12.25H13.5C13.91 12.25 14.25 12.59 14.25 13C14.25 13.41 13.91 13.75 13.5 13.75Z" className='fill-amber-500' />
                                                    <path d="M11.5 17.75H7.5C7.09 17.75 6.75 17.41 6.75 17C6.75 16.59 7.09 16.25 7.5 16.25H11.5C11.91 16.25 12.25 16.59 12.25 17C12.25 17.41 11.91 17.75 11.5 17.75Z" className='fill-amber-500' />
                                                </g>
                                                <defs>
                                                    <clipPath id="clip0_4418_4825">
                                                        <rect className='fill-amber-500 size-4' />
                                                    </clipPath>
                                                </defs>
                                            </svg>
                                            <span>Text</span>
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className='hidden xl:flex bg-gray-100 p-1 inset-shadow-sm gap-1 rounded-lg items-center justify-center ms-auto'>
                            <Button size="sm" variant={slideType == 'image' ? 'outline' : 'ghost'} className="hover:bg-white border-0" onClick={() => {
                                if (selectedSlide?.slide_type != 'image') {
                                    setSelectedSlide(prev => ({
                                        ...prev,
                                        slide_type: 'image'
                                    }));
                                }
                            }}>
                                <svg className='size-4 fill-white' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" >
                                    <g>
                                        <path className='fill-sky-500' opacity="0.4" d="M22 7.81V13.9L20.37 12.5C19.59 11.83 18.33 11.83 17.55 12.5L13.39 16.07C12.61 16.74 11.35 16.74 10.57 16.07L10.23 15.79C9.52 15.17 8.39 15.11 7.59 15.65L2.67 18.95L2.56 19.03C2.19 18.23 2 17.28 2 16.19V7.81C2 4.17 4.17 2 7.81 2H16.19C19.83 2 22 4.17 22 7.81Z" />
                                        <path className='fill-sky-500' d="M9.00012 10.3801C10.3146 10.3801 11.3801 9.31456 11.3801 8.00012C11.3801 6.68568 10.3146 5.62012 9.00012 5.62012C7.68568 5.62012 6.62012 6.68568 6.62012 8.00012C6.62012 9.31456 7.68568 10.3801 9.00012 10.3801Z" />
                                        <path className='fill-sky-500' d="M22.0001 13.8996V16.1896C22.0001 19.8296 19.8301 21.9996 16.1901 21.9996H7.81006C5.26006 21.9996 3.42006 20.9296 2.56006 19.0296L2.67006 18.9496L7.59006 15.6496C8.39006 15.1096 9.52006 15.1696 10.2301 15.7896L10.5701 16.0696C11.3501 16.7396 12.6101 16.7396 13.3901 16.0696L17.5501 12.4996C18.3301 11.8296 19.5901 11.8296 20.3701 12.4996L22.0001 13.8996Z" />
                                    </g>
                                    <defs>
                                        <clipPath>
                                            <rect className='size-4 fill-white' fill="white" />
                                        </clipPath>
                                    </defs>
                                </svg>
                                <span>Image</span>
                            </Button>
                            <Button size="sm" variant={slideType == 'video' ? 'outline' : 'ghost'} className="hover:bg-white border-0" onClick={() => {
                                if (selectedSlide?.slide_type != 'video') {
                                    setSelectedSlide(prev => ({
                                        ...prev,
                                        slide_type: 'video'
                                    }));
                                }
                            }}>
                                <svg className='size-5' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <g>
                                        <path d="M18.7 8.97989L4.14 17.7099C4.05 17.3799 4 17.0299 4 16.6699V7.32989C4 4.24989 7.33 2.32989 10 3.86989L14.04 6.19989L18.09 8.53989C18.31 8.66989 18.52 8.80989 18.7 8.97989Z" className='fill-rose-500' />
                                        <path opacity="0.4" d="M18.0902 15.4598L14.0402 17.7998L10.0002 20.1298C8.09022 21.2298 5.84021 20.5698 4.72021 18.9598L5.14021 18.7098L19.5802 10.0498C20.5802 11.8498 20.0902 14.3098 18.0902 15.4598Z" className='fill-rose-500' />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_4418_4372">
                                            <rect className='size-5 fill-rose-500' />
                                        </clipPath>
                                    </defs>
                                </svg>
                                <span>Video</span>
                            </Button>
                            <Button size="sm" variant={slideType == 'text' ? 'outline' : 'ghost'} className="hover:bg-white border-0" onClick={() => {
                                if (selectedSlide?.slide_type != 'text') {
                                    setSelectedSlide(prev => ({
                                        ...prev,
                                        slide_type: 'text'
                                    }));
                                }
                            }}>
                                <svg className='size-4' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#fff">
                                    <g>
                                        <path opacity="0.4" d="M20.5 10.19H17.61C15.24 10.19 13.31 8.26 13.31 5.89V3C13.31 2.45 12.86 2 12.31 2H8.07C4.99 2 2.5 4 2.5 7.57V16.43C2.5 20 4.99 22 8.07 22H15.93C19.01 22 21.5 20 21.5 16.43V11.19C21.5 10.64 21.05 10.19 20.5 10.19Z" className='fill-amber-500' />
                                        <path d="M15.8002 2.21048C15.3902 1.80048 14.6802 2.08048 14.6802 2.65048V6.14048C14.6802 7.60048 15.9202 8.81048 17.4302 8.81048C18.3802 8.82048 19.7002 8.82048 20.8302 8.82048C21.4002 8.82048 21.7002 8.15048 21.3002 7.75048C19.8602 6.30048 17.2802 3.69048 15.8002 2.21048Z" className='fill-amber-500' />
                                        <path d="M13.5 13.75H7.5C7.09 13.75 6.75 13.41 6.75 13C6.75 12.59 7.09 12.25 7.5 12.25H13.5C13.91 12.25 14.25 12.59 14.25 13C14.25 13.41 13.91 13.75 13.5 13.75Z" className='fill-amber-500' />
                                        <path d="M11.5 17.75H7.5C7.09 17.75 6.75 17.41 6.75 17C6.75 16.59 7.09 16.25 7.5 16.25H11.5C11.91 16.25 12.25 16.59 12.25 17C12.25 17.41 11.91 17.75 11.5 17.75Z" className='fill-amber-500' />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_4418_4825">
                                            <rect className='fill-amber-500 size-4' />
                                        </clipPath>
                                    </defs>
                                </svg>
                                <span>Text</span>
                            </Button>
                        </div>

                    </div>
                </div>

                <div className='max-w-5xl w-full mx-auto relative'>

                    {/* Main Slide Content */}
                    {!selectedSlide ? (
                        <EmptySlideState />
                    ) : (
                        <>
                            {slideType === "image" && (
                                <ImageSlideEditor item={selectedSlide} onUpdate={handleSlideUpdate} />
                            )}
                            {slideType === "video" && (
                                <VideoSlideEditor item={selectedSlide} onUpdate={handleSlideUpdate} />
                            )}
                            {slideType === "text" && (
                                <TextSlideEditor item={selectedSlide} onUpdate={handleSlideUpdate} />
                            )}
                        </>
                    )}

                    {/* Single Attachment Section */}
                    {/* {selectedSlide && (
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-semibold">Attachment</h3>
                                {!hasAttachment && (
                                    <div className="flex gap-2">
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleSetAttachmentType('text')}
                                                >
                                                    <Type className="size-4" />
                                                    <span>Text</span>
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>Tambah Text Attachment</TooltipContent>
                                        </Tooltip>

                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleSetAttachmentType('audio')}
                                                >
                                                    <Mic className="size-4" />
                                                    <span>Audio</span>
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>Tambah Audio Recording</TooltipContent>
                                        </Tooltip>
                                    </div>
                                )}
                            </div>

                            {hasAttachment ? (
                                <AttachmentItem
                                    attachment={selectedSlide}
                                    onUpdate={handleAttachmentUpdate}
                                    onDelete={handleAttachmentDelete}
                                />
                            ) : (
                                <div className="text-center py-8 text-sm text-gray-500 border border-dashed rounded-xl aspect-video items-center justify-center flex">
                                    Belum ada attachment. Pilih tipe attachment di atas.
                                </div>
                            )}
                        </div>
                    )} */}

                    <div className='pt-10 pb-12'></div>
                </div>
            </div>


        </div>
    );
};