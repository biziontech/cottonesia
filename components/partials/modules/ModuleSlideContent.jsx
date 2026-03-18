/* eslint-disable react-hooks/set-state-in-effect */
import { GripVertical, Image } from 'lucide-react';
import { Sortable, SortableContent, SortableItem, SortableItemHandle, SortableOverlay } from "@/components/ui/sortable";
import { useModule } from "@/contexts/ModuleContext";
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const ThumbnailSlide = ({ item, index, isSelected }) => {

    const { selectedSlide, setSelectedSlide } = useModule();

    return (
        <div className='flex relative gap-1 cursor-pointer' onClick={() => setSelectedSlide(item)}>
            <div className='absolute p-0.5 pt-1 pr-1 rounded-tr-md bottom-1 left-7 aspect-square flex items-center justify-center bg-white text-xs font-semibold mt-2 text-gray-600 text-left z-10'>
                {item?.slide_type == 'image' ? (
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
                ) : item?.slide_type == 'video' ? (
                    <svg className='size-4' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <g>
                            <path d="M18.7 8.97989L4.14 17.7099C4.05 17.3799 4 17.0299 4 16.6699V7.32989C4 4.24989 7.33 2.32989 10 3.86989L14.04 6.19989L18.09 8.53989C18.31 8.66989 18.52 8.80989 18.7 8.97989Z" className='fill-rose-500' />
                            <path opacity="0.4" d="M18.0902 15.4598L14.0402 17.7998L10.0002 20.1298C8.09022 21.2298 5.84021 20.5698 4.72021 18.9598L5.14021 18.7098L19.5802 10.0498C20.5802 11.8498 20.0902 14.3098 18.0902 15.4598Z" className='fill-rose-500' />
                        </g>
                        <defs>
                            <clipPath id="clip0_4418_4372">
                                <rect className='size-4 fill-rose-500' />
                            </clipPath>
                        </defs>
                    </svg>
                ) : (
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
                )}
            </div>
            <div className='absolute shadow-sm h-5 px-1 rounded-sm bottom-2 right-2 aspect-square flex items-center justify-center bg-white text-xs font-semibold mt-2 text-gray-600 text-left z-10'>{index + 1}</div>
            <SortableItemHandle className="cursor-grab py-1 text-gray-400">
                <GripVertical className="h-5 w-5" />
            </SortableItemHandle>
            <div
                className={`${isSelected && 'outline-primary outline-2 shadow-primary'} transition-colors hover:outline-2 hover:outline-primary flex-1 bg-white p-1 shadow-sm rounded-xl flex items-center justify-center text-sm gap-2 font-medium group relative overflow-hidden`}
            >
                <div className='absolute m-1 inset-0 bg-linear-to-t from-white/50 from-0% via-transparent via-35% to-transparent to-95%% rounded-lg transition-colors'></div>
                {!item.page_thumbnail ? (
                    <span className='aspect-video w-full'></span>
                ) : (
                    <img
                        src={item.page_thumbnail}
                        alt={item.ulid}
                        className="object-cover rounded-lg aspect-video"
                        loading="eager"
                        quality={50}
                    />
                )}
            </div>
        </div>
    );
}

const ThumbnailSlideSkeleton = ({ item, index, isSelected }) => {
    return (
        <div className='flex relative gap-1'>
            <div className='absolute p-0.5 pt-1 pr-1 rounded-tr-md bottom-1 left-7 aspect-square flex items-center justify-center bg-white text-xs font-semibold mt-2 text-gray-600 text-left z-10'>
                {item?.slide_type == 'image' ? (
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
                ) : item?.slide_type == 'video' ? (
                    <svg className='size-4' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <g>
                            <path d="M18.7 8.97989L4.14 17.7099C4.05 17.3799 4 17.0299 4 16.6699V7.32989C4 4.24989 7.33 2.32989 10 3.86989L14.04 6.19989L18.09 8.53989C18.31 8.66989 18.52 8.80989 18.7 8.97989Z" className='fill-rose-500' />
                            <path opacity="0.4" d="M18.0902 15.4598L14.0402 17.7998L10.0002 20.1298C8.09022 21.2298 5.84021 20.5698 4.72021 18.9598L5.14021 18.7098L19.5802 10.0498C20.5802 11.8498 20.0902 14.3098 18.0902 15.4598Z" className='fill-rose-500' />
                        </g>
                        <defs>
                            <clipPath id="clip0_4418_4372">
                                <rect className='size-4 fill-rose-500' />
                            </clipPath>
                        </defs>
                    </svg>
                ) : (
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
                )}
            </div>
            <div className='absolute h-5 px-1 rounded-sm bottom-2 right-2 aspect-square flex items-center justify-center bg-white/80 backdrop-blur-sm text-xs font-semibold mt-2 text-gray-600 text-left z-10'>{index + 1}</div>
            <div className="cursor-grab py-1 text-gray-400 flex items-center">
                <GripVertical className="h-5 w-5" />
            </div>
            <div
                className={`${isSelected && 'outline-primary outline-2 shadow-primary'} transition-colors hover:outline-2 hover:outline-primary aspect-video relative flex-1 bg-white p-1 shadow-sm rounded-xl flex items-center justify-center text-sm gap-2 font-medium group relative`}
            >
                <div className='absolute m-1 inset-0 bg-linear-to-t from-gray-600/50 from-0% via-transparent via-35% to-transparent to-95%% rounded-lg transition-colors'></div>
                <img
                    src={item.page_thumbnail}
                    alt={item.ulid}
                    className="object-cover rounded-lg"
                    loading="eager"
                    quality={50}
                />
            </div>
        </div>
    );
}


export const ModuleSlideContent = () => {
    const { module, setModule, selectedSlide } = useModule();

    // Langsung gunakan module.slides, tidak perlu local state
    const items = module?.slides || [];

    // update slide
    const handleUpdateSortSlide = async (uuid, data) => {
        try {
            const response = await api.fetch(`${API_URL}/office/training-slides/${uuid}/update-sort`, {
                method: "PATCH",
                body: JSON.stringify({
                    slides: data
                })
            });

            if (response?.success) {
                toast.success(response?.message || "Error loading data");
                // Update module langsung
                setModule(prev => ({
                    ...prev,
                    slides: response?.data?.slides
                }));
            } else {
                toast.error(response?.message || "Error loading data");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    // Handler untuk drag & drop - optimistic update
    const handleValueChange = (newItems) => {
        // Update UI dulu (optimistic)
        setModule(prev => ({
            ...prev,
            slides: newItems
        }));

        // Lalu sync ke backend
        handleUpdateSortSlide(module?.uuid, newItems.map((c, i) => ({
            ulid: c.ulid,
            newSort: i + 1,
            oldSort: c.sort
        })));
    }

    return (
        <Sortable
            value={items}
            onValueChange={handleValueChange}
            getItemValue={(item) => item.ulid}
        >
            <SortableContent className="flex flex-col gap-3">
                {(items.length > 0) ? items.map((item, index) => (
                    <SortableItem key={item.ulid} value={item.ulid}>
                        <ThumbnailSlide item={item} index={index} isSelected={selectedSlide?.ulid === item.ulid} />
                    </SortableItem>
                )) : (
                    <div className='text-sm text-gray-500 italic text-center'>Slide Kosong</div>
                )}
            </SortableContent>

            <SortableOverlay>
                {({ value }) => {
                    const item = items.find(i => i.ulid === value);
                    const index = items.findIndex(i => i.ulid === value);
                    return (
                        <>
                            {item?.slide_type == "image" && (
                                <ThumbnailSlideSkeleton item={item} index={index} isSelected={selectedSlide?.ulid === item.ulid} />
                            )}
                        </>
                    );
                }}
            </SortableOverlay>
        </Sortable>
    )
}