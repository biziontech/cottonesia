import { useEffect, useState } from 'react';
import { Link2, Route, CheckCircle, Loader2, AlertCircle, RotateCcw, Save } from 'lucide-react';
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { generateSlug } from '@/lib/utils/generateSlug';
import { Switch } from "@/components/ui/switch";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from "@/components/ui/label";
import { useModule } from '@/contexts/ModuleContext';
import api from '@/lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const ModuleTitle = ({ initialTitle = "", initialSlug = "" }) => {
    const { module, setModuleTemp } = useModule();
    const [permalinkEdit, setPermalinkEdit] = useState(false);
    const [permalinkType, setPermalinkType] = useState(initialSlug ? 'manual' : 'automatic');
    const [slug, setSlug] = useState(initialSlug);
    const [tempSlug, setTempSlug] = useState(initialSlug); // Temporary slug saat edit
    const [originalSlug, setOriginalSlug] = useState(initialSlug); // Slug asli dari database
    const [title, setTitle] = useState(initialTitle);
    const [isCheckingSlug, setIsCheckingSlug] = useState(false);
    const [slugStatus, setSlugStatus] = useState(null);
    const [suggestedSlug, setSuggestedSlug] = useState("");

    const handleTitleChange = (e) => {
        const newTitle = e.target.value;
        setTitle(newTitle);
        // set new Title
        if (newTitle != module?.title) {
            setModuleTemp(prev => ({
                ...prev,
                title: newTitle
            }));
        } else {
            setModuleTemp(prev => {
                const { title: _, ...rest } = prev;
                return rest;
            });
        }
        // Hanya auto-generate slug jika mode create (tidak ada originalSlug)
        if (permalinkType === 'automatic' && !originalSlug) {
            const generatedSlug = generateSlug(newTitle);
            setSlug(generatedSlug);
            setTempSlug(generatedSlug);
            setSlugStatus(null);
        }
    };

    const handleSlugChange = (e) => {
        const value = e.target.value;
        const newSlug = value
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w-]/g, '')
            .replace(/-+/g, '-');
        setTempSlug(newSlug);
        setSlugStatus(null);
    };

    const checkSlugAvailability = async (slugToCheck) => {
        if (!slugToCheck) {
            setSlugStatus(null);
            return;
        }

        // Skip check jika slug sama dengan original (tidak berubah)
        if (slugToCheck === originalSlug) {
            setSlugStatus('available');
            return;
        }

        setIsCheckingSlug(true);
        setSlugStatus(null);

        try {
            const response = await api.fetch(`${API_URL}/office/trainings/check-slug?slug=${encodeURIComponent(slugToCheck)}`, {
                method: 'GET'
            });

            if (response?.data?.available) {
                setSlugStatus('available');
                setSuggestedSlug("");
            } else {
                setSlugStatus('unavailable');
                const suggestion = await findAvailableSlug(slugToCheck);
                setSuggestedSlug(suggestion);
            }
        } catch (error) {
            console.error('Error checking slug:', error);
            setSlugStatus(null);
        } finally {
            setIsCheckingSlug(false);
        }
    };

    const findAvailableSlug = async (baseSlug) => {
        let counter = 1;
        let newSlug = `${baseSlug}-${counter}`;

        while (counter < 100) {
            try {
                const response = await api.fetch(`${API_URL}/office/trainings/check-slug?slug=${encodeURIComponent(newSlug)}`, {
                    method: 'GET'
                });

                if (response?.data?.available) {
                    return newSlug;
                }

                counter++;
                newSlug = `${baseSlug}-${counter}`;
            } catch (error) {
                console.error('Error finding available slug:', error);
                return `${baseSlug}-${counter}`;
            }
        }

        return `${baseSlug}-${counter}`;
    };

    const handlePermalinkTypeChange = () => {
        const newType = permalinkType === 'automatic' ? 'manual' : 'automatic';
        setPermalinkType(newType);

        // Jika switch ke automatic, generate slug dari title
        if (newType === 'automatic') {
            const generatedSlug = generateSlug(title);
            setTempSlug(generatedSlug);
            checkSlugAvailability(generatedSlug);
        }
    };

    const handleTitleBlur = () => {
        if (slug && !originalSlug) {
            checkSlugAvailability(slug);
        }
    };

    const handleSlugBlur = () => {
        if (tempSlug && permalinkType === 'manual') {
            checkSlugAvailability(tempSlug);
        }
    };

    const applySuggestedSlug = () => {
        if (suggestedSlug) {
            setTempSlug(suggestedSlug);
            setSlugStatus('available');
            setSuggestedSlug("");
        }
    };

    const handleResetSlug = () => {
        setTempSlug(originalSlug);
        setSlug(originalSlug);
        setSlugStatus(null);
        setSuggestedSlug("");
        setPermalinkType('manual');
    };

    const handleSaveSlug = () => {
        // Simpan tempSlug ke slug yang sebenarnya
        setSlug(tempSlug);
        setPermalinkEdit(false);
        // Simpan
        if (module?.slug != tempSlug) {
            setModuleTemp(prev => ({
                ...prev,
                slug: tempSlug
            }));
        } else {
            setModuleTemp(prev => {
                const { slug: _, ...rest } = prev;
                return rest;
            });
        }
    };

    const handleCancelEdit = () => {
        // Reset ke slug asli saat cancel
        setTempSlug(slug);
        setPermalinkEdit(false);
        setSlugStatus(null);
        setSuggestedSlug("");
    };

    useEffect(() => {
        if (permalinkType === 'automatic' && title && !originalSlug) {
            const generatedSlug = generateSlug(title);
            setSlug(generatedSlug);
            setTempSlug(generatedSlug);
            checkSlugAvailability(generatedSlug);
        }
    }, [permalinkType]);

    const renderStatusIcon = () => {
        if (isCheckingSlug) {
            return <Loader2 className='w-4 h-4 text-blue-500 animate-spin' />;
        }

        if (slugStatus === 'available') {
            return <CheckCircle className='w-4 h-4 text-green-600' />;
        }

        if (slugStatus === 'unavailable') {
            return <AlertCircle className='w-4 h-4 text-red-500' />;
        }

        return null;
    };

    return (
        <div className='rounded-xl bg-white shadow-sm'>
            <div className='flex items-start justify-center w-full flex-col gap-0'>
                <span className='px-5 pt-5 text-xs font-medium text-gray-600 whitespace-nowrap'>Training Title</span>
                <Input
                    className="shadow-none border-none focus-visible:ring-0 md:text-lg font-medium px-5 placeholder:text-gray-200 placeholder:font-normal"
                    placeholder="Masukan judul materi training"
                    value={title}
                    onChange={handleTitleChange}
                    onBlur={handleTitleBlur}
                />
            </div>
            <div className='border-t border-dashed px-5 py-2 flex items-start justify-between gap-2'>
                <div className='flex gap-2 my-auto flex-1'>
                    <div className='font-medium text-xs items-center flex gap-2'>
                        <Link2 className='w-4 h-4' />
                        <span className='hidden sm:block'>Permalink :</span>
                    </div>
                    {(slug && renderStatusIcon()) && (
                        <div className='flex items-center justify-center'>
                            {renderStatusIcon()}
                        </div>
                    )}
                    <div className='line-lamp-1 items-center flex-1 line-clamp-1'>
                        <span className='text-xs'>
                            https://app.alexacmobil.com/
                            <span className={`${slugStatus === 'unavailable' ? 'text-red-500' : ''}`}>
                                {permalinkEdit ? tempSlug : slug}
                            </span>
                        </span>
                    </div>
                </div>
                <div className='flex gap-1'>
                    {/* Tombol Reset - muncul saat edit mode dan slug berubah */}
                    {permalinkEdit && originalSlug && tempSlug !== originalSlug && (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    size="xs"
                                    variant="ghost"
                                    className="text-xs"
                                    onClick={handleResetSlug}
                                >
                                    Reset
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Reset ke slug asli</p>
                            </TooltipContent>
                        </Tooltip>
                    )}

                    <Button
                        size="xs"
                        variant="ghost"
                        className="text-xs"
                        onClick={() => permalinkEdit ? handleCancelEdit() : setPermalinkEdit(true)}
                    >
                        {permalinkEdit ? 'Tutup' : 'Ubah'}
                    </Button>
                </div>
            </div>

            {/* Suggested slug jika unavailable */}
            {slugStatus === 'unavailable' && suggestedSlug && (
                <div className={`px-5 py-2 border-t border-dashed bg-amber-50 ${!permalinkEdit && 'rounded-b-xl'}`}>
                    <div className='flex items-center justify-between gap-2'>
                        <span className='text-xs text-amber-700'>
                            Slug sudah digunakan. Saran: <span className='font-medium'>{suggestedSlug}</span>
                        </span>
                        <Button
                            size="xs"
                            variant="outline"
                            className="text-xs"
                            onClick={applySuggestedSlug}
                        >
                            Gunakan
                        </Button>
                    </div>
                </div>
            )}

            {/* Permalink Edit */}
            {permalinkEdit && (
                <div className='px-5 py-3 flex items-center justify-start border-t rounded-b-xl'>
                    <div className='flex divide-x flex-1'>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className='flex gap-2 pe-3 items-center'>
                                    <Switch
                                        id="permalink-automatic"
                                        checked={permalinkType === 'automatic'}
                                        onClick={handlePermalinkTypeChange}
                                    />
                                    <Label htmlFor="permalink-automatic" className="text-xs hidden md:block">
                                        {permalinkType === 'automatic' ? 'Automatic' : 'Manual'}
                                    </Label>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Permalink otomatis dari judul atau manual.</p>
                            </TooltipContent>
                        </Tooltip>

                        <div className='flex-1'>
                            <InputGroup className="h-7 border-0 shadow-none !ring-0 !ring-transparent !focus-within:ring-0 items-center">
                                <InputGroupAddon className="text-xs font-normal"><Route /></InputGroupAddon>
                                <InputGroupInput
                                    placeholder="Masukkan path URL"
                                    className="text-xs placeholder:text-gray-200 placeholder:font-normal"
                                    readOnly={permalinkType === 'automatic'}
                                    value={tempSlug}
                                    onChange={handleSlugChange}
                                    onBlur={handleSlugBlur}
                                />
                            </InputGroup>
                        </div>
                    </div>
                    <div>
                        <Button
                            size="sm"
                            className="text-xs"
                            onClick={handleSaveSlug}
                            disabled={slugStatus === 'unavailable'}
                        >
                            <Save />
                            <span>Simpan</span>
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};