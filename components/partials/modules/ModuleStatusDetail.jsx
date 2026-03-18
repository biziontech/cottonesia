import { toast } from 'sonner';
import { useState } from 'react';
import { CircleDashed, Star, Calendar, GraduationCap } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import Required from '@/components/partials/Required';
import { useModule } from '@/contexts/ModuleContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { SparkleAi } from '@/components/partials/SparkleAi';
import { GradientGenerate } from '@/components/partials/GradientGenerate';
import { SparkleLoader } from "@/components/partials/SparkleLoader";
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

export const ModuleStatusDetail = () => {
    const { module, moduleTemp, setModuleTemp } = useModule();


    return (
        <div className='rounded-xl bg-white shadow-sm'>
            <div className='flex flex-col p-4'>
                <h4 className='font-semibold text-sm'>Information</h4>
            </div>
            <div className='p-4 border-t border-dashed flex flex-col gap-2.5'>

                <div className='flex gap-2'>
                    <div className='flex items-center gap-2 text-sm min-w-30 text-gray-600'>
                        <CircleDashed className='size-4' />
                        <span className='font-semibold text-xs'>Status</span>
                    </div>
                    <div>
                        {module?.status == 1 ?
                            (
                                <Badge variant="secondary" className='font-semibold text-xs rounded-md'>Draft</Badge>
                            ) : (
                                <Badge className='font-semibold text-xs rounded-md'>Published</Badge>
                            )}

                    </div>
                </div>

                <div className='flex gap-2'>
                    <div className='flex items-center gap-2 text-sm min-w-30 text-gray-600'>
                        <Star className='size-4' />
                        <span className='font-semibold text-xs'>Rating</span>
                    </div>
                    <div>
                        <span className='font-semibold text-sm'>4,5</span>
                    </div>
                </div>

                <div className='flex gap-2'>
                    <div className='flex items-center gap-2 text-sm min-w-30 text-gray-600'>
                        <GraduationCap className='size-4' />
                        <span className='font-semibold text-xs'>Total Slides</span>
                    </div>
                    <div className='flex gap-1 items-center'>
                        <span className='font-semibold text-sm'>{module?.slides?.length || 0}</span>
                        <span className='font-medium text-sm text-gray-500'>slide</span>
                    </div>
                </div>

            </div>
            <div className='pb-1.5'></div>
        </div>
    );
}