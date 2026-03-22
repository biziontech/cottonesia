import { TagsInput, TagsInputClear, TagsInputInput, TagsInputItem, TagsInputLabel, TagsInputList, TagsInputDropdown } from "@/components/ui/tags-input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { X, Trash, Save, TextCursorInputIcon, Dot, Trash2 } from 'lucide-react';
import { Separator } from "@/components/ui/separator";
import Required from "@/components/partials/Required";
import { Button } from "@/components/ui/button";
import { Paperclip, Type, AudioLines } from 'lucide-react';
import { useModule } from "@/contexts/ModuleContext";

export const ModuleSlideAttactments = ({ initialCategories = [] }) => {
    const { module, setModule, selectedSlide, setSelectedSlide, openSideSlide, setOpenSideSlide, openSideSlideDrawer, setOpenSideSlideDrawer } = useModule();

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
        <div className='rounded-xl bg-card text-card-foreground shadow-sm'>
            <div className='flex p-4 items-center justify-between gap-2'>
                <div className="flex  flex-col">
                    <h4 className='font-semibold text-sm'>Attactment</h4>
                </div>
            </div>
            <div className='border-t border-dashed border-border px-3 py-3 flex flex-col gap-2 justify-center'>
                {!hasAttachment ? (
                    <>
                        <div className="flex flex-col items-center gap-3 text-center">
                            <div className="flex gap-2 my-4">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    disabled={!selectedSlide}
                                    onClick={() => handleSetAttachmentType('text')}
                                >
                                    <Type />
                                    <span>Text</span>
                                </Button>
                                <Separator orientation='vertical' className="!h-5 my-auto" />
                                <Button
                                    size="sm"
                                    variant="outline"
                                    disabled={!selectedSlide}
                                    onClick={() => handleSetAttachmentType('audio')}
                                >
                                    <AudioLines />
                                    <span>Audio</span>
                                </Button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div>
                        {hasAttachment == "audio" ? (
                            <div className="bg-linear-to-tr from-card from-30% to-sky-50/60 dark:to-sky-500/10 border border-border rounded-xl">
                                <div className="flex flex-1 items-center justify-between w-full gap-2 ps-3 pe-2 py-2">
                                    <div className="size-6 flex items-center justify-center bg-sky-50 dark:bg-sky-500/10 rounded-md">
                                        <svg className="size-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                            <g>
                                                <path opacity="0.4" d="M16.1898 2H7.81976C4.17976 2 2.00977 4.17 2.00977 7.81V16.18C2.00977 19.82 4.17976 21.99 7.81976 21.99H16.1898C19.8298 21.99 21.9998 19.82 21.9998 16.18V7.81C21.9998 4.17 19.8298 2 16.1898 2Z" className="fill-sky-500" />
                                                <path d="M6 14.8896C5.59 14.8896 5.25 14.5496 5.25 14.1396V9.84961C5.25 9.43961 5.59 9.09961 6 9.09961C6.41 9.09961 6.75 9.43961 6.75 9.84961V14.1396C6.75 14.5596 6.41 14.8896 6 14.8896Z" className="fill-sky-500" />
                                                <path d="M9 16.3197C8.59 16.3197 8.25 15.9797 8.25 15.5697V8.42969C8.25 8.01969 8.59 7.67969 9 7.67969C9.41 7.67969 9.75 8.01969 9.75 8.42969V15.5697C9.75 15.9897 9.41 16.3197 9 16.3197Z" className="fill-sky-500" />
                                                <path d="M12 17.75C11.59 17.75 11.25 17.41 11.25 17V7C11.25 6.59 11.59 6.25 12 6.25C12.41 6.25 12.75 6.59 12.75 7V17C12.75 17.41 12.41 17.75 12 17.75Z" className="fill-sky-500" />
                                                <path d="M15 16.3197C14.59 16.3197 14.25 15.9797 14.25 15.5697V8.42969C14.25 8.01969 14.59 7.67969 15 7.67969C15.41 7.67969 15.75 8.01969 15.75 8.42969V15.5697C15.75 15.9897 15.41 16.3197 15 16.3197Z" className="fill-sky-500" />
                                                <path d="M18 14.8896C17.59 14.8896 17.25 14.5496 17.25 14.1396V9.84961C17.25 9.43961 17.59 9.09961 18 9.09961C18.41 9.09961 18.75 9.43961 18.75 9.84961V14.1396C18.75 14.5596 18.41 14.8896 18 14.8896Z" className="fill-sky-500" />
                                            </g>
                                            <defs>
                                                <clipPath>
                                                    <rect className="size-6" fill="white" />
                                                </clipPath>
                                            </defs>
                                        </svg>
                                    </div>
                                    <div className="flex flex-col flex-1">
                                        <p className="font-semibold text-xs">Audio Attactment</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-linear-to-tr from-card from-30% to-yellow-50/60 dark:to-yellow-500/10 border border-border rounded-xl">
                                <div className="flex flex-1 items-center justify-between w-full gap-2 ps-3 pe-2 py-2">
                                    <div className="size-6 flex items-center justify-center bg-yellow-50 dark:bg-yellow-500/10 rounded-md">
                                        <svg className="size-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                            <g>
                                                <path d="M22 6V8.42C22 10 21 11 19.42 11H16V4.01C16 2.9 16.91 2 18.02 2C19.11 2.01 20.11 2.45 20.83 3.17C21.55 3.9 22 4.9 22 6Z" className="fill-yellow-500" />
                                                <path opacity="0.4" d="M2 7V21C2 21.83 2.94001 22.3 3.60001 21.8L5.31 20.52C5.71 20.22 6.27 20.26 6.63 20.62L8.28999 22.29C8.67999 22.68 9.32001 22.68 9.71001 22.29L11.39 20.61C11.74 20.26 12.3 20.22 12.69 20.52L14.4 21.8C15.06 22.29 16 21.82 16 21V4C16 2.9 16.9 2 18 2H7H6C3 2 2 3.79 2 6V7Z" className="fill-yellow-500" />
                                                <path d="M12 9.75H6C5.59 9.75 5.25 9.41 5.25 9C5.25 8.59 5.59 8.25 6 8.25H12C12.41 8.25 12.75 8.59 12.75 9C12.75 9.41 12.41 9.75 12 9.75Z" className="fill-yellow-500" />
                                                <path d="M11.25 13.75H6.75C6.34 13.75 6 13.41 6 13C6 12.59 6.34 12.25 6.75 12.25H11.25C11.66 12.25 12 12.59 12 13C12 13.41 11.66 13.75 11.25 13.75Z" className="fill-yellow-500" />
                                            </g>
                                            <defs>
                                                <clipPath>
                                                    <rect className="size-6" fill="white" />
                                                </clipPath>
                                            </defs>
                                        </svg>
                                    </div>
                                    <div className="flex flex-col flex-1">
                                        <p className="font-semibold text-xs">Text Attactment</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
