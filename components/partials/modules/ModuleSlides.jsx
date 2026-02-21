/* eslint-disable react-hooks/set-state-in-effect */
import { ModuleSlideContent } from '@/components/partials/modules/ModuleSlideContent';

export const ModuleSlides = () => {
    return (
        <div className='w-50 border-e border-dashed relative'>
            <div className={`transition-all duration-300 ease-in-out w-full h-[calc(100dvh-170px)] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden`}>
                <div className='p-3 flex justify-between items-center bg-white m-3 shadow-sm rounded-xl'>
                    <div className='text-sm font-medium flex items-center gap-2'>
                        <span className='whitespace-nowrap'>Page Slide</span>
                    </div>
                </div>
                <div className='flex flex-col gap-3 p-3 '>
                    <ModuleSlideContent />
                </div>
            </div>
            <span className="border-primary/20 bg-white absolute top-0 right-0 z-30 size-2.5 translate-x-1/2 -translate-y-1/2 rotate-45 rounded-xs border"></span>
        </div>
    )
}