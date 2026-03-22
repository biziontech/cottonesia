'use client'

import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Button } from "@/components/ui/button";
import { useModule } from "@/contexts/ModuleContext";
import { Loader, RotateCcw, Save, Eye, EditIcon, FileCog, MessagesSquare, InfoIcon, FileSearchCorner, MessageCircleQuestionMark, Trash, PlusCircle, Layers, Gauge, Scale, FilePenLine, Lock, Search, Dot, EllipsisVertical, Shredder, Eraser, X, MoonIcon, SunMediumIcon, Loader2, MessagesSquareIcon, LockOpen, Info } from "lucide-react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { ModuleWorkspaceTitle } from '@/components/partials/modules/ModuleWorkspaceTitle';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { GradientGenerate } from '@/components/partials/GradientGenerate';
import { SparkleLoader } from "@/components/partials/SparkleLoader";
import { SparkleAi } from '@/components/partials/SparkleAi';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import StripePattern from '@/components/partials/StripePattern';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from '@/components/ui/badge';
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { ButtonGroup } from '@/components/ui/button-group';
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupSelect, InputGroupText } from '@/components/ui/input-group';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Label } from '@/components/ui/label';
import { CircularProgress, CircularProgressIndicator, CircularProgressTrack, CircularProgressRange, CircularProgressValueText } from "@/components/ui/circular-progress";
import { SlidingNumber } from '../../SlidingNumber';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';


const initialQuestions = [
    {
        id: 1,
        sort: 1,
        weight: 10,
        type: "multiple_choice",
        difficulty: "easy",
        question: "Saat briefing pagi, apa prioritas utama yang harus dilakukan oleh seorang supervisor?",
        options: [
            "Mengecek kehadiran semua teknisi",
            "Memberikan instruksi teknis yang jelas dan terstruktur",
            "Membahas gosip terbaru di bengkel",
            "Memeriksa kebersihan area parkir mobil pelanggan"
        ],
        correctAnswer: 1,
        correctAnswers: [],
        explanation: "Instruksi teknis yang jelas memastikan semua teknisi memahami tugas mereka.",
        isLocked: false
    },
    {
        id: 2,
        sort: 2,
        weight: 10,
        type: "complex_multiple_choice",
        difficulty: "medium",
        question: "Tindakan mana saja yang mencerminkan tanggung jawab supervisor terhadap kesalahan teknis?",
        options: [
            "Menganalisis penyebab kesalahan",
            "Menyalahkan teknisi di depan umum",
            "Membuat laporan insiden secara tertulis",
            "Menutupi kesalahan dari kepala cabang"
        ],
        correctAnswer: null,
        correctAnswers: [0, 2],
        explanation: "Supervisor bertanggung jawab untuk menganalisis dan mendokumentasikan kesalahan.",
        isLocked: false
    },
    {
        id: 3,
        sort: 3,
        weight: 20,
        type: "essay",
        difficulty: "hard",
        question: "Jelaskan langkah-langkah yang harus dilakukan supervisor ketika menemukan kesalahan teknis di bengkel.",
        options: [],
        correctAnswer: null,
        correctAnswers: [],
        explanation: "",
        isLocked: false
    }
];

const PromptTab = () => {
    const { module, moduleTemp, setModuleTemp } = useModule();
    const [prompt, setPrompt] = useState(module?.prompt);
    const [lastSavedPrompt, setLastSavedPrompt] = useState(module?.prompt);

    const hasChangedFromLastSaved = prompt !== lastSavedPrompt;

    const handleSavePrompt = () => {
        setModuleTemp(prev => ({
            ...prev,
            prompt: prompt
        }));
        setLastSavedPrompt(prompt);
    };

    const handleResetPrompt = () => {
        setPrompt(module?.prompt);
        setLastSavedPrompt(module?.prompt);
        setModuleTemp(prev => {
            const { prompt: _, ...rest } = prev;
            return rest;
        });
    };

    return (
        <div className='flex flex-col gap-5'>
            <div className='flex flex-col bg-card text-card-foreground shadow-sm rounded-xl'>
                <div className='flex items-start justify-center w-full flex-col gap-0'>
                    <div className="px-5 pt-3 text-xs font-semibold text-muted-foreground whitespace-nowrap flex items-center gap-2 justify-between w-full">
                        <div className='flex items-center gap-2 h-8'>
                            <FileCog className='size-4' />
                            <span>Modul Prompt</span>
                        </div>
                        <div className='flex items-center gap-2'>
                            {prompt !== module?.prompt && (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="group"
                                    onClick={handleResetPrompt}
                                >
                                    <RotateCcw className="group-hover:-rotate-90 transition-transform" />
                                    <span>Reset</span>
                                </Button>
                            )}
                            {hasChangedFromLastSaved && (
                                <Button
                                    size="sm"
                                    onClick={handleSavePrompt}
                                >
                                    <Save />
                                    <span>Simpan</span>
                                </Button>
                            )}
                        </div>
                    </div>
                    <div className='p-4 pt-3 w-full'>
                        <div className='border flex flex-col rounded-xl overflow-hidden'>
                            <Textarea
                                placeholder="Masukkan konten modul sebagai prompt"
                                className="min-h-80 placeholder:italic shadow-none border-none focus-within:outline-none rounded-none p-5"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                            />
                            <div className='flex bg-muted gap-2 text-muted-foreground px-3 py-3 items-center text-sm'>
                                <InfoIcon className='size-4' />
                                <span className='text-xs'>Modul Prompt ini akan digunakan sebagai prompt untuk generate soal otomatis.</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Single question card component
const QuestionCard = ({ item, index, questions, setQuestions, onUpdate, onDelete }) => {
    const textareaRef = useRef(null);
    const debounceRef = useRef(null);

    const [isEditing, setIsEditing] = useState(false);
    const [isLocked, setIsLocked] = useState(item.isLocked);
    const [isSaving, setIsSaving] = useState(false);

    const [question, setQuestion] = useState(item.question);
    const [options, setOptions] = useState(item.options);
    const [type, setType] = useState(item.type);
    const [difficulty, setDifficulty] = useState(item.difficulty);
    const [weight, setWeight] = useState(item.weight);
    const [correctAnswer, setCorrectAnswer] = useState(item.correctAnswer);
    const [correctAnswers, setCorrectAnswers] = useState(item.correctAnswers ?? []);

    // ✅ Cek apakah ada perubahan dibanding item asli
    const hasChanges = useMemo(() => {
        return (
            question !== item.question ||
            type !== item.type ||
            difficulty !== item.difficulty ||
            String(weight) !== String(item.weight) ||
            correctAnswer !== item.correctAnswer ||
            JSON.stringify(correctAnswers) !== JSON.stringify(item.correctAnswers ?? []) ||
            JSON.stringify(options) !== JSON.stringify(item.options)
        );
    }, [question, type, difficulty, weight, correctAnswer, correctAnswers, options, item]);

    const lastItem = questions[questions?.length - 1];
    const isLastItem = item?.id == lastItem?.id;

    const handleInput = useCallback((e) => {
        const el = e.target;
        el.style.height = 'auto';
        el.style.height = el.scrollHeight + 'px';
    }, []);

    // ✅ setQuestion dengan debounce 400ms
    const handleQuestionChange = (e) => {
        const val = e.target.value;
        // Update display langsung (controlled input tetap smooth)
        setQuestion(val);

        // Debounce untuk "efek" jika kamu mau trigger sesuatu setelah berhenti ketik
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            // Bisa trigger validasi atau side effect lain di sini
            // setQuestion sudah terset di atas
        }, 400);
    };

    const handleToggleLock = () => {
        const next = !isLocked;
        setIsLocked(next);
        if (next) setIsEditing(false);
    };

    const handleToggleEdit = (val) => {
        if (isLocked) return;
        setIsEditing(val);
    };

    const handleOptionChange = (idx, value) => {
        const next = [...options];
        next[idx] = value;
        setOptions(next);
    };

    const handleDeleteOption = (idx) => {
        const next = options.filter((_, i) => i !== idx);
        if (correctAnswer === idx) setCorrectAnswer(null);
        else if (correctAnswer > idx) setCorrectAnswer(correctAnswer - 1);
        setCorrectAnswers(correctAnswers.filter(i => i !== idx).map(i => i > idx ? i - 1 : i));
        setOptions(next);
    };

    const handleAddOption = () => {
        setOptions([...options, ""]);
    };

    const handleComplexCheck = (idx, checked) => {
        if (checked) {
            setCorrectAnswers([...correctAnswers, idx]);
        } else {
            setCorrectAnswers(correctAnswers.filter(i => i !== idx));
        }
    };

    // ✅ Handle save dengan loading state
    const handleSave = async () => {
        if (!hasChanges || isSaving || isLocked) return;

        setIsSaving(true);
        try {
            const updated = {
                ...item,
                question,
                options,
                type,
                difficulty,
                weight,
                correctAnswer,
                correctAnswers,
            };
            await onUpdate(updated); // onUpdate bisa async (misal API call)
            setIsEditing(false);
        } catch (err) {
            console.error("Gagal menyimpan:", err);
        } finally {
            setIsSaving(false);
        }
    };

    // Apakah semua interaksi harus diblokir
    const isDisabled = isLocked || isSaving;

    return (
        <div className='flex gap-3 w-full'>
            {/* Nomor */}
            <div className='flex flex-col gap-3 items-center'>
                <div className='flex top-3 sticky bg-card aspect-square min-w-9 items-center justify-center shadow-sm p-2 rounded-lg font-semibold text-sm text-foreground h-fit border border-border/60'>
                    {item.sort}
                </div>
                <Separator orientation='vertical' className={`${isLastItem ? '!h-[calc(100%-50px)]' : '!h-[calc(100%-20px)]'}`} />
            </div>

            <div className='flex flex-1 flex-col gap-5 relative'>

                {/* Question Box */}
                <div className='flex flex-col shadow-sm rounded-xl overflow-hidden'>
                    <div className='bg-card pb-4 py-3 px-5 flex-1 flex flex-col'>
                        <div className='text-xs font-medium text-muted-foreground mb-2 mt-1 flex items-center gap-1 ms-2'>
                            <MessageCircleQuestionMark className='size-4' />
                            <span>Pertanyaan</span>
                        </div>
                        <textarea
                            ref={textareaRef}
                            value={question || ""}
                            onChange={handleQuestionChange} // ✅ pakai handler baru
                            onInput={handleInput}
                            rows={1}
                            readOnly={!isEditing || isSaving} // ✅ disabled saat saving
                            className={`text-sm resize-none overflow-hidden focus-visible:border-border focus-visible:ring-0 shadow-none text-wrap text-foreground underline underline-offset-4 decoration-dotted decoration-1 decoration-border leading-[22px] focus-within:outline-0 w-full bg-transparent ${!isEditing ? 'cursor-default select-text' : ''} ${isSaving ? 'opacity-60' : ''}`}
                            placeholder='Tambahkan pertanyaan disini'
                        />
                    </div>

                    {/* Bottom toolbar */}
                    <div className='border-t bg-muted/60 border-dashed border-border px-5 py-2 flex gap-2 items-center flex-wrap'>

                        {/* Type */}
                        <InputGroup className="bg-background border-border w-fit h-8 overflow-hidden">
                            <InputGroupAddon><Layers /></InputGroupAddon>
                            <InputGroupSelect
                                value={type}
                                onValueChange={val => isEditing && !isSaving && setType(val)}
                                size="sm"
                                variant="outline"
                                className={`w-fit text-xs hover:bg-accent ps-2 ${!isEditing || isSaving ? 'pointer-events-none opacity-60' : ''}`}
                            >
                                <SelectContent position='popper'>
                                    <SelectGroup>
                                        <SelectItem className="text-xs" value="multiple_choice">Pilihan Ganda</SelectItem>
                                        <SelectItem className="text-xs" value="complex_multiple_choice">Pilihan Ganda Kompleks</SelectItem>
                                        <SelectItem className="text-xs" value="essay">Essay</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </InputGroupSelect>
                        </InputGroup>

                        {/* Difficulty */}
                        <InputGroup className="bg-background border-border w-fit h-8 overflow-hidden">
                            <InputGroupAddon><Gauge className='text-muted-foreground' /></InputGroupAddon>
                            <InputGroupSelect
                                value={difficulty}
                                onValueChange={val => isEditing && !isSaving && setDifficulty(val)}
                                size="sm"
                                variant="outline"
                                className={`w-fit text-xs hover:bg-accent ps-2 ${!isEditing || isSaving ? 'pointer-events-none opacity-60' : ''}`}
                            >
                                <SelectContent position="popper">
                                    <SelectGroup>
                                        <SelectItem className="text-xs" value="easy">Mudah</SelectItem>
                                        <SelectItem className="text-xs" value="medium">Sedang</SelectItem>
                                        <SelectItem className="text-xs" value="hard">Sulit</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </InputGroupSelect>
                        </InputGroup>

                        {/* Weight */}
                        <InputGroup className="bg-background border-border w-fit h-8">
                            <InputGroupAddon className="text-xs text-foreground">
                                <Scale className='text-muted-foreground' />
                                <span className={`${!isEditing ? 'opacity-70' : ''}`}>Bobot</span>
                            </InputGroupAddon>
                            <InputGroupInput
                                value={weight}
                                onChange={e => isEditing && !isSaving && setWeight(e.target.value)}
                                readOnly={!isEditing || isSaving}
                                className={`w-10 !text-xs font-semibold ${!isEditing || isSaving ? 'pointer-events-none opacity-60' : ''}`}
                                placeholder=" ... "
                            />
                        </InputGroup>

                        {/* Actions */}
                        <div className='flex gap-2 items-center ms-auto'>

                            {/* Lock toggle */}
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        size="icon-sm"
                                        variant="outline"
                                        onClick={handleToggleLock}
                                        disabled={isSaving}
                                        className={isLocked ? 'bg-muted border-border text-foreground' : ''}
                                    >
                                        {isLocked ? (
                                            <Lock className={isLocked ? 'text-foreground' : 'text-muted-foreground'} />
                                        ) : (
                                            <LockOpen className={isLocked ? 'text-foreground' : 'text-muted-foreground'} />
                                        )}
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{isLocked ? 'Soal Dikunci — Klik untuk Buka' : 'Kunci Soal'}</p>
                                </TooltipContent>
                            </Tooltip>

                            {/* Edit switch */}
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Label className={`cursor-pointer flex items-center gap-2 bg-background border border-border rounded-lg ps-2.5 pe-2 h-8 ${isDisabled ? 'opacity-80 pointer-events-none' : ''}`}>
                                        <FilePenLine className='size-3.5 text-muted-foreground' />
                                        <span className='text-xs text-muted-foreground'>Ubah</span>
                                        <Switch
                                            checked={isEditing}
                                            onCheckedChange={handleToggleEdit}
                                            disabled={isDisabled}
                                            className="scale-75"
                                        />
                                    </Label>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{isLocked ? 'Soal dikunci' : isEditing ? 'Mode Edit Aktif' : 'Aktifkan Mode Edit'}</p>
                                </TooltipContent>
                            </Tooltip>

                            {/* Delete */}
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        size="icon-sm"
                                        variant="outline"
                                        onClick={onDelete}
                                        disabled={isDisabled}
                                        className={isDisabled ? 'opacity-80' : ''}
                                    >
                                        <Eraser className={isDisabled ? 'text-foreground' : 'text-muted-foreground'} />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{isLocked ? 'Soal Dikunci — Tidak dapat menghapus' : 'Hapus Soal'}</p>
                                </TooltipContent>
                            </Tooltip>

                            {/* ✅ Tombol Simpan — hanya tampil jika ada perubahan */}
                            {hasChanges && (
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            size="sm"
                                            onClick={handleSave}
                                            disabled={isDisabled}
                                            className={isDisabled ? 'opacity-80' : ''}
                                        >
                                            {isSaving ? (
                                                // ✅ Spinner saat loading
                                                <Loader2 className="animate-spin size-4" />
                                            ) : (
                                                <Save className="size-4" />
                                            )}
                                            <span>{isSaving ? 'Menyimpan...' : 'Simpan'}</span>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{isLocked ? 'Soal Dikunci' : 'Simpan Perubahan'}</p>
                                    </TooltipContent>
                                </Tooltip>
                            )}

                        </div>
                    </div>
                </div>

                {/* Options: multiple_choice */}
                {type === "multiple_choice" && (
                    <div className='flex flex-col gap-3'>
                        <div className='flex gap-3 items-center'>
                            <span className='text-xs font-medium text-muted-foreground'>Pilihan Jawaban</span>
                            <Separator orientation='vertical' className="!h-2.5" />
                            <span className='text-xs text-muted-foreground'>Pilih opsi yang benar</span>
                        </div>
                        <RadioGroup value={String(correctAnswer)} onValueChange={val => isEditing && setCorrectAnswer(Number(val))}>
                            <div className="grid grid-cols-1 gap-3 text-sm">
                                {options.map((option, idx) => {
                                    const huruf = String.fromCharCode(65 + idx);
                                    const isCorrect = correctAnswer === idx;
                                    return (
                                        <div key={`option-${item.id}-${idx}`} className="flex items-center gap-2 group">
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <RadioGroupItem
                                                        value={String(idx)}
                                                        className={`bg-background border border-border size-5 [&_svg]:size-2.5 ${isEditing ? 'cursor-pointer' : 'pointer-events-none'}`}
                                                    />
                                                </TooltipTrigger>
                                                <TooltipContent><p>Pilih Jawaban Benar</p></TooltipContent>
                                            </Tooltip>
                                            <InputGroup className={`${isCorrect ? 'border-primary/50' : 'border-border'} bg-muted/70 flex-1 shadow-none flex gap-0 items-center ps-1.5 pe-3 rounded-xl border h-fit`}>
                                                <div className={`${isCorrect ? 'bg-primary text-white' : 'bg-background'} size-7 flex items-center justify-center font-medium rounded-lg shrink-0`}>
                                                    <span className="text-sm font-medium">{huruf}</span>
                                                </div>
                                                <InputGroupInput
                                                    className="!h-10"
                                                    value={option || ""}
                                                    onChange={e => handleOptionChange(idx, e.target.value)}
                                                    readOnly={!isEditing}
                                                    placeholder="Tulis opsi disini"
                                                />
                                            </InputGroup>
                                            {isEditing && (
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            size="icon-sm"
                                                            variant="ghost"
                                                            onClick={() => handleDeleteOption(idx)}
                                                            className="bg-muted/70 text-muted-foreground hover:bg-rose-50 hover:text-rose-500 hover:border-rose-100 rounded-lg"
                                                        >
                                                            <Trash />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent><p>Hapus Opsi</p></TooltipContent>
                                                </Tooltip>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </RadioGroup>
                        {isEditing && (
                            <Button size="sm" variant="outline" onClick={handleAddOption} className="w-fit text-xs">
                                <PlusCircle className='text-muted-foreground' />
                                <span>Tambah Opsi</span>
                            </Button>
                        )}
                    </div>
                )}

                {/* Options: complex_multiple_choice */}
                {type === "complex_multiple_choice" && (
                    <div className='flex flex-col gap-3'>
                        <div className='flex gap-3 items-center'>
                            <span className='text-xs font-medium text-muted-foreground'>Pilihan Jawaban</span>
                            <Separator orientation='vertical' className="!h-2.5" />
                            <span className='text-xs text-muted-foreground'>Pilih semua opsi yang benar</span>
                        </div>
                        <div className="grid grid-cols-1 gap-3 text-sm">
                            {options.map((option, idx) => {
                                const huruf = String.fromCharCode(65 + idx);
                                const isChecked = correctAnswers.includes(idx);
                                return (
                                    <div key={`option-complex-${item.id}-${idx}`} className="flex items-center gap-2 group">
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Checkbox
                                                    checked={isChecked}
                                                    onCheckedChange={checked => isEditing && handleComplexCheck(idx, checked)}
                                                    className={`size-5 rounded-md border border-border ${!isEditing ? 'pointer-events-none' : 'cursor-pointer'} ${isChecked ? 'bg-primary text-white [&_span_svg]:stroke-3' : 'bg-background'}`}
                                                />
                                            </TooltipTrigger>
                                            <TooltipContent><p>Tandai Jawaban Benar</p></TooltipContent>
                                        </Tooltip>
                                        <InputGroup className={`${isChecked ? 'border-primary/50' : 'border-border'} bg-muted/70 flex-1 shadow-none flex gap-0 items-center ps-1.5 pe-3 rounded-xl border h-fit`}>
                                            <div className={`${isChecked ? 'bg-primary text-white' : 'bg-background'} size-7 flex items-center justify-center font-medium rounded-lg shrink-0`}>
                                                <span className="text-sm font-medium">{huruf}</span>
                                            </div>
                                            <InputGroupInput
                                                className="!h-10"
                                                value={option || ""}
                                                onChange={e => handleOptionChange(idx, e.target.value)}
                                                readOnly={!isEditing}
                                                placeholder="Tulis opsi disini"
                                            />
                                        </InputGroup>
                                        {isEditing && (
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        size="icon-sm"
                                                        variant="ghost"
                                                        onClick={() => handleDeleteOption(idx)}
                                                        className="bg-muted/70 text-muted-foreground hover:bg-rose-50 hover:text-rose-500 hover:border-rose-100 rounded-lg"
                                                    >
                                                        <Trash />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent><p>Hapus Opsi</p></TooltipContent>
                                            </Tooltip>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                        {isEditing && (
                            <Button size="sm" variant="outline" onClick={handleAddOption} className="w-fit text-xs">
                                <PlusCircle className='text-muted-foreground' />
                                <span>Tambah Opsi</span>
                            </Button>
                        )}
                    </div>
                )}

                {/* Essay: no options shown */}
                {type === "essay" && (
                    <div className='flex flex-col gap-3'>
                        <div className='flex gap-3 items-center'>
                            <span className='text-xs font-medium text-muted-foreground'>Jawaban Essay</span>
                            <Separator orientation='vertical' className="!h-2.5" />
                            <span className='text-xs text-muted-foreground'>Peserta akan menjawab secara tertulis</span>
                        </div>
                        <div className='border border-border border-dashed rounded-xl bg-muted/60 px-5 py-4 flex items-center justify-center'>
                            <span className='text-xs text-muted-foreground italic'>Tidak ada opsi pilihan untuk tipe Essay</span>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export const QuestionTab = () => {
    const { module, setModuleTemp } = useModule();
    const [search, setSearch] = useState("");
    const [filterType, setFilterType] = useState("");
    const [filterDifficult, setFilterDifficult] = useState("");
    const [questions, setQuestions] = useState(module?.questions);
    const [lastSavedQuestions, setLastSavedQuestions] = useState(module?.questions);
    const hasChangedFromLastSaved = JSON.stringify(questions) !== JSON.stringify(lastSavedQuestions);
    const [isGenerating, setIsGenerating] = useState(false);
    const [dialogGenerate, setDialogGenerate] = useState(false);
    const [jumlahSoal, setJumlahSoal] = useState(0);
    const bottomRef = useRef(null);

    const statsQuestion = useMemo(() => {
        const multiple_choice = questions?.filter(c => c.type === "multiple_choice");
        const complex_multiple_choice = questions?.filter(c => c.type === "complex_multiple_choice");
        const essay = questions?.filter(c => c.type === "essay");
        const easy = questions?.filter(c => c.difficulty === "easy");
        const medium = questions?.filter(c => c.difficulty === "medium");
        const hard = questions?.filter(c => c.difficulty === "hard");

        return {
            multiple_choice: {
                count: multiple_choice.length,
                percent: Math.ceil((multiple_choice.length / questions.length) * 100) || 0
            },
            complex_multiple_choice: {
                count: complex_multiple_choice.length,
                percent: Math.ceil((complex_multiple_choice.length / questions.length) * 100) || 0
            },
            essay: {
                count: essay.length,
                percent: Math.ceil((essay.length / questions.length) * 100) || 0
            },
            easy: {
                count: easy?.length,
                percent: Math.ceil((easy?.length / questions.length) * 100) || 0
            },
            medium: {
                count: medium?.length,
                percent: Math.ceil((medium?.length / questions.length) * 100) || 0
            },
            hard: {
                count: hard?.length,
                percent: Math.ceil((hard?.length / questions.length) * 100) || 0
            },
            total_bobot: questions?.reduce((total, q) => total + Number(q.weight || 0), 0)
        };
    }, [questions]);

    const [tipeSoal, setTipeSoal] = useState({
        pg: 0,
        pgKompleks: 0,
        essay: 0,
    });

    const [kesulitan, setKesulitan] = useState({
        easy: 0,
        medium: 0,
        hard: 0,
    });

    const totalTipe =
        Number(tipeSoal.pg) +
        Number(tipeSoal.pgKompleks) +
        Number(tipeSoal.essay);

    const totalKesulitan =
        Number(kesulitan.easy) +
        Number(kesulitan.medium) +
        Number(kesulitan.hard);

    const handleTipeChange = (field, value) => {
        const newValue = Number(value);
        const updated = { ...tipeSoal, [field]: newValue };

        const total =
            Number(updated.pg) +
            Number(updated.pgKompleks) +
            Number(updated.essay);

        if (total <= jumlahSoal) {
            setTipeSoal(updated);
        }
    };

    const handleResetGenerate = () => {
        setJumlahSoal(0);
        setTipeSoal({
            pg: 0,
            pgKompleks: 0,
            essay: 0,
        });
        setKesulitan({
            easy: 0,
            medium: 0,
            hard: 0,
        })
    }

    const handleKesulitanChange = (field, value) => {
        const newValue = Number(value);
        const updated = { ...kesulitan, [field]: newValue };

        const total =
            Number(updated.easy) +
            Number(updated.medium) +
            Number(updated.hard);

        if (total <= jumlahSoal) {
            setKesulitan(updated);
        }
    };

    const handleSaveQuestions = () => {
        setModuleTemp(prev => ({
            ...prev,
            questions: questions
        }));
        setLastSavedQuestions(questions);
    };

    const handleResetQuestions = () => {
        setQuestions(module?.questions);
        setLastSavedQuestions(module?.questions);
        setModuleTemp(prev => {
            const { questions: _, ...rest } = prev;
            return rest;
        });
    };

    const handleAddQuestion = () => {
        const newQuestion = {
            id: Date.now(),
            sort: questions.length + 1,
            weight: 10,
            type: "multiple_choice",
            difficulty: "easy",
            question: "",
            options: ["", ""],
            correctAnswer: null,
            correctAnswers: [],
            isLocked: false
        };
        setQuestions([...questions, newQuestion]);
    };

    const filteredQuestions = questions.filter(q => {
        const matchSearch = search ? (q?.question ?? "").toLowerCase().includes(search.toLowerCase()) : true;
        const matchType = filterType ? q?.type === filterType : true;
        const matchDifficulty = filterDifficult ? q?.difficulty === filterDifficult : true;

        return matchSearch && matchType && matchDifficulty;
    });

    const handleDeleteQuestion = (id) => {
        const next = questions
            .filter(q => q.id !== id)
            .map((q, i) => ({ ...q, sort: i + 1 }));
        setQuestions(next);
    };


    // Handle Introduction
    const handleGenerateQuestions = async () => {
        // check title jika belum ada
        if (!module?.prompt) {
            toast.error("Silakan buat Instruksi dahulu untuk generate topik soal");
            return null;
        }
        // Generate
        try {
            handleResetGenerate();
            setDialogGenerate(true);
            setIsGenerating(true);
            // prompt text
            const promptText = `
                Buatkan ${jumlahSoal} soal untuk Module Training berjudul: "${module?.title}"

                Distribusi Tipe Soal:
                - Pilihan Ganda: ${tipeSoal.pg} soal
                - PG Kompleks: ${tipeSoal.pgKompleks} soal
                - Essay: ${tipeSoal.essay} soal

                Distribusi Tingkat Kesulitan:
                - Easy: ${kesulitan.easy} soal
                - Medium: ${kesulitan.medium} soal
                - Hard: ${kesulitan.hard} soal

                Ketentuan:
                1. Total soal HARUS tepat ${jumlahSoal}.
                2. Distribusi tipe soal HARUS sesuai jumlah yang ditentukan.
                3. Distribusi tingkat kesulitan HARUS sesuai jumlah yang ditentukan.
                4. Soal harus relevan dengan materi module.
                5. Untuk pilihan ganda berikan 4 opsi jawaban dan tandai jawaban yang benar.
                6. Untuk PG Kompleks, bisa lebih dari satu jawaban benar.
                7. Untuk Essay, buat pertanyaan analitis dan berbobot.

                Berikut ringkasan isi module sebagai referensi:

                ${module?.prompt}
            `;
            // response
            const res = await fetch("https://agent.wahyuachmad.com/webhook/4f92efd7-4560-4ec5-9f2f-b6b050681bfa", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    type: "generate_questions",
                    text: promptText
                })
            });
            // ambil json
            const data = await res.json();
            // check
            if (data?.success) {
                // set data summary
                try {
                    // parse question
                    const parse_questions = JSON.parse(data?.data?.text);
                    // set moduletemp
                    setQuestions(prev => {
                        const lastSort = prev.length > 0 ? Math.max(...prev.map(q => q.sort || 0)) : 0;
                        const lastId = prev.length > 0 ? Math.max(...prev.map(q => q.id || 0)) : 0;
                        const newQuestions = parse_questions.map((q, i) => ({
                            ...q,
                            id: lastId + i + 1,
                            sort: lastSort + i + 1
                        }));

                        return [...prev, ...newQuestions];
                    });

                } catch {
                    toast.error("Terjadi kesalahan saat generate soal")
                }
            }
        } catch (err) {
            console.log(err);
            toast.error("Error loading module");
        } finally {
            setIsGenerating(false);
        }
    }

    return (
        <div className='flex flex-col gap-5'>
            <GradientGenerate isGenerating={isGenerating} borderWidth="4px" borderRadius="15px" className='relative'>
                <div className='flex flex-col bg-card text-card-foreground shadow-sm rounded-xl'>
                    <div className='flex items-start justify-center w-full flex-col gap-0'>
                        <div className="px-5 pt-5 text-xs font-semibold text-muted-foreground whitespace-nowrap flex items-center gap-2">
                            <MessagesSquare className='size-4' />
                            <span>Tools Soal</span>
                        </div>
                        <div className='p-4 pb-3.5 flex items-center gap-2.5 w-full justify-between flex-wrap'>
                            <div className='flex items-center gap-2 justify-center sm:justify-between w-full flex-wrap'>
                                <div className='flex flex-wrap gap-2 items-center justify-center'>
                                    <InputGroup className="shadow-none w-fit rounded-lg group">
                                        <InputGroupAddon className="bg-muted ms-1 rounded-md !px-1.5">
                                            <Search className='group-focus-within:rotate-90 transition-transform' />
                                        </InputGroupAddon>
                                        <InputGroupInput disabled={isGenerating} onChange={e => setSearch(e.target.value)} placeholder="Cari pertanyaan ..." className="ps-0" />
                                    </InputGroup>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <div className='flex items-center gap-1.5 border h-9 px-3 rounded-lg'>
                                                <Scale className='text-muted-foreground size-4' />
                                                <span className='text-xs font-medium text-muted-foreground'>Total Bobot</span>
                                                <span className='font-medium text-sm'>{statsQuestion?.total_bobot}</span>
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Total Bobot seluruh Soal</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </div>
                                <div className='flex flex-wrap gap-2 items-center'>


                                    <AlertDialog open={dialogGenerate} onOpenChange={setDialogGenerate}>
                                        <AlertDialogTrigger asChild>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="group"
                                                disabled={isGenerating}
                                            >
                                                <SparkleAi />
                                                <span className="text-purple-600 font-semibold">Generate</span>
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <div className='flex gap-2.5 items-center'>
                                                <SparkleAi className='size-6 mt-1' />
                                                <AlertDialogHeader className="gap-0">
                                                    <AlertDialogTitle className="flex items-center gap-2"><span>Generate Soal</span></AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Silakan atur ketentuan soal yang harus dibuat oleh AI
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                            </div>


                                            <div className='flex flex-col mt-3 gap-5'>
                                                <div className='flex flex-col gap-2'>
                                                    <Label>Jumlah Soal</Label>
                                                    <Input
                                                        type="text"
                                                        value={jumlahSoal}
                                                        onChange={(e) => setJumlahSoal(Number(e.target.value))}
                                                        placeholder="Masukan jumlah soal yang dibuat ..."
                                                    />
                                                </div>

                                                <div className='flex flex-col gap-2'>
                                                    <Label>Jumlah per Tipe Soal</Label>
                                                    <div className='grid grid-cols-2 gap-2'>
                                                        <InputGroup>
                                                            <InputGroupAddon>
                                                                <div className='size-2 bg-blue-500 rounded-sm'></div>
                                                            </InputGroupAddon>
                                                            <InputGroupAddon>Pilihan Ganda</InputGroupAddon>
                                                            <InputGroupInput
                                                                placeholder="..."
                                                                type="text"
                                                                value={tipeSoal.pg}
                                                                onChange={(e) =>
                                                                    handleTipeChange("pg", e.target.value)
                                                                }
                                                            />
                                                        </InputGroup>
                                                        <InputGroup>
                                                            <InputGroupAddon>
                                                                <div className='size-2 bg-blue-500 rounded-sm'></div>
                                                            </InputGroupAddon>
                                                            <InputGroupAddon>PG Kompleks</InputGroupAddon>
                                                            <InputGroupInput
                                                                placeholder="..."
                                                                type="text"
                                                                value={tipeSoal.pgKompleks}
                                                                onChange={(e) =>
                                                                    handleTipeChange("pgKompleks", e.target.value)
                                                                }
                                                            />
                                                        </InputGroup>
                                                        <InputGroup>
                                                            <InputGroupAddon>
                                                                <div className='size-2 bg-blue-500 rounded-sm'></div>
                                                            </InputGroupAddon>
                                                            <InputGroupAddon>Essay</InputGroupAddon>
                                                            <InputGroupInput
                                                                placeholder="..."
                                                                type="text"
                                                                value={tipeSoal.essay}
                                                                onChange={(e) =>
                                                                    handleTipeChange("essay", e.target.value)
                                                                }
                                                            />
                                                        </InputGroup>

                                                    </div>

                                                    {totalTipe > jumlahSoal && (
                                                        <p className="text-red-500 text-xs">
                                                            Total tipe soal tidak boleh lebih dari jumlah soal
                                                        </p>
                                                    )}
                                                </div>

                                                <div className='flex flex-col gap-2'>
                                                    <Label>Jumlah per Tingkat Kesulitan</Label>
                                                    <div className='grid grid-cols-3 gap-2'>
                                                        <InputGroup>
                                                            <InputGroupAddon>
                                                                <div className='size-2 bg-green-500 rounded-sm'></div>
                                                            </InputGroupAddon>
                                                            <InputGroupAddon>Easy</InputGroupAddon>
                                                            <InputGroupInput
                                                                placeholder="..."
                                                                type="text"
                                                                value={kesulitan.easy}
                                                                onChange={(e) =>
                                                                    handleKesulitanChange("easy", e.target.value)
                                                                }
                                                            />
                                                        </InputGroup>
                                                        <InputGroup>
                                                            <InputGroupAddon>
                                                                <div className='size-2 bg-yellow-500 rounded-sm'></div>
                                                            </InputGroupAddon>
                                                            <InputGroupAddon>Medium</InputGroupAddon>
                                                            <InputGroupInput
                                                                placeholder="..."
                                                                type="text"
                                                                value={kesulitan.medium}
                                                                onChange={(e) =>
                                                                    handleKesulitanChange("medium", e.target.value)
                                                                }
                                                            />
                                                        </InputGroup>
                                                        <InputGroup>
                                                            <InputGroupAddon>
                                                                <div className='size-2 bg-red-500 rounded-sm'></div>
                                                            </InputGroupAddon>
                                                            <InputGroupAddon>Hard</InputGroupAddon>
                                                            <InputGroupInput
                                                                placeholder="..."
                                                                type="text"
                                                                value={kesulitan.hard}
                                                                onChange={(e) =>
                                                                    handleKesulitanChange("hard", e.target.value)
                                                                }
                                                            />
                                                        </InputGroup>
                                                    </div>
                                                    {totalKesulitan > jumlahSoal && (
                                                        <p className="text-red-500 text-xs">
                                                            Total tingkat kesulitan tidak boleh lebih dari jumlah soal
                                                        </p>
                                                    )}
                                                </div>



                                            </div>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <Button variant="outline" onClick={handleResetGenerate}>
                                                    <RotateCcw />
                                                    <span>Reset</span>
                                                </Button>
                                                <AlertDialogCancel asChild>
                                                <Button variant="outline" onClick={handleGenerateQuestions} className="bg-card shadow-sm border border-border">
                                                    <SparkleAi />
                                                    <span className="text-purple-600 font-semibold">Generate</span>
                                                </Button>
                                                </AlertDialogCancel>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>

                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                disabled={isGenerating}
                                                onClick={() => {
                                                    // add
                                                    handleAddQuestion();
                                                    // kasih delay biar DOM ke-render dulu
                                                    setTimeout(() => {
                                                        bottomRef.current?.scrollIntoView({
                                                            behavior: "smooth",
                                                            block: "start"
                                                        })
                                                    }, 200)
                                                }}
                                            >
                                                <PlusCircle className='size-4' />
                                                <span>Tambah Soal</span>
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Tambah soal manual</p>
                                        </TooltipContent>
                                    </Tooltip>

                                    {hasChangedFromLastSaved && (
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    size="sm"
                                                    disabled={isGenerating}
                                                    onClick={() => handleSaveQuestions()}
                                                >
                                                    <Save />
                                                    <span>Simpan</span>
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Simpan Perubahan</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    )}

                                </div>
                            </div>
                            {search && (
                                <span className="text-xs text-muted-foreground pl-1">Menampilkan pencarian untuk <span className="font-semibold text-foreground">{search}</span></span>
                            )}
                        </div>
                        <div className='border-t w-full border-dashed p-3'>
                            <div className='grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 divide-x space-x-3 space-y-3 xl:space-y-0'>
                                <div className='flex flex-col gap-1'>
                                    <div className='flex gap-2 items-start justify-between'>
                                        <div className='flex flex-col gap-1'>
                                            <small className='text-xs text-muted-foreground'>Tipe</small>
                                            <h4 className='text-xl font-mono font-medium'>
                                                <SlidingNumber
                                                    number={statsQuestion?.multiple_choice?.count}
                                                />
                                            </h4>
                                        </div>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <CircularProgress
                                                    value={statsQuestion?.complex_multiple_choice?.percent}
                                                    min={0}
                                                    max={100}
                                                    size={30}
                                                    thickness={4}
                                                    className="me-3 mt-2"
                                                >
                                                    <CircularProgressIndicator>
                                                        <CircularProgressTrack className="text-blue-200 dark:text-blue-900" />
                                                        <CircularProgressRange className="text-blue-500" />
                                                    </CircularProgressIndicator>
                                                </CircularProgress>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{statsQuestion?.multiple_choice?.percent}%</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </div>
                                    <span className='text-xs font-medium text-muted-foreground'>Pilihan Ganda</span>
                                </div>
                                <div className='flex flex-col gap-1'>
                                    <div className='flex gap-2 items-start justify-between'>
                                        <div className='flex flex-col gap-1'>
                                            <small className='text-xs text-muted-foreground'>Tipe</small>
                                            <h4 className='text-xl font-mono font-medium'>
                                                <SlidingNumber
                                                    number={statsQuestion?.complex_multiple_choice?.count}
                                                />
                                            </h4>
                                        </div>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <CircularProgress
                                                    value={statsQuestion?.complex_multiple_choice?.percent}
                                                    min={0}
                                                    max={100}
                                                    size={30}
                                                    thickness={4}
                                                    className="me-3 mt-2"
                                                >
                                                    <CircularProgressIndicator>
                                                        <CircularProgressTrack className="text-blue-200 dark:text-blue-900" />
                                                        <CircularProgressRange className="text-blue-500" />
                                                    </CircularProgressIndicator>
                                                </CircularProgress>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{statsQuestion?.complex_multiple_choice?.percent}%</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </div>
                                    <span className='text-xs font-medium text-muted-foreground'>PG Kompleks</span>
                                </div>
                                <div className='flex flex-col gap-1'>
                                    <div className='flex gap-2 items-start justify-between'>
                                        <div className='flex flex-col gap-1'>
                                            <small className='text-xs text-muted-foreground'>Tipe</small>
                                            <h4 className='text-xl font-mono font-medium'>
                                                <SlidingNumber
                                                    number={statsQuestion?.essay?.count}
                                                />
                                            </h4>
                                        </div>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <CircularProgress
                                                    value={statsQuestion?.essay?.percent}
                                                    min={0}
                                                    max={100}
                                                    size={30}
                                                    thickness={4}
                                                    className="me-3 mt-2"
                                                >
                                                    <CircularProgressIndicator>
                                                        <CircularProgressTrack className="text-blue-200 dark:text-blue-900" />
                                                        <CircularProgressRange className="text-blue-500" />
                                                    </CircularProgressIndicator>
                                                </CircularProgress>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{statsQuestion?.essay?.percent}%</p>
                                            </TooltipContent>
                                        </Tooltip>
                                        {console.log(statsQuestion)}
                                    </div>
                                    <span className='text-xs font-medium text-muted-foreground'>Essay</span>
                                </div>
                                <div className='flex flex-col gap-1'>
                                    <div className='flex gap-2 items-start justify-between'>
                                        <div className='flex flex-col gap-1'>
                                            <small className='text-xs text-muted-foreground'>Tipe</small>
                                            <h4 className='text-xl font-mono font-medium'>
                                                <SlidingNumber
                                                    number={statsQuestion?.easy?.count}
                                                />
                                            </h4>
                                        </div>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <CircularProgress
                                                    value={statsQuestion?.easy?.percent}
                                                    min={0}
                                                    max={100}
                                                    size={30}
                                                    thickness={4}
                                                    className="me-3 mt-2"
                                                >
                                                    <CircularProgressIndicator>
                                                        <CircularProgressTrack className="text-green-200 dark:text-green-900" />
                                                        <CircularProgressRange className="text-green-500" />
                                                    </CircularProgressIndicator>
                                                </CircularProgress>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{statsQuestion?.easy?.percent}%</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </div>
                                    <span className='text-xs font-medium text-muted-foreground'>Mudah</span>
                                </div>
                                <div className='flex flex-col gap-1'>
                                    <div className='flex gap-2 items-start justify-between'>
                                        <div className='flex flex-col gap-1'>
                                            <small className='text-xs text-muted-foreground'>Tipe</small>
                                            <h4 className='text-xl font-mono font-medium'>
                                                <SlidingNumber
                                                    number={statsQuestion?.medium?.count}
                                                />
                                            </h4>
                                        </div>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <CircularProgress
                                                    value={statsQuestion?.medium?.percent}
                                                    min={0}
                                                    max={100}
                                                    size={30}
                                                    thickness={4}
                                                    className="me-3 mt-2"
                                                >
                                                    <CircularProgressIndicator>
                                                        <CircularProgressTrack className="text-yellow-200 dark:text-yellow-900" />
                                                        <CircularProgressRange className="text-yellow-500" />
                                                    </CircularProgressIndicator>
                                                </CircularProgress>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{statsQuestion?.medium?.percent}%</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </div>
                                    <span className='text-xs font-medium text-muted-foreground'>Sedang</span>
                                </div>
                                <div className='flex flex-col gap-1'>
                                    <div className='flex gap-2 items-start justify-between'>
                                        <div className='flex flex-col gap-1'>
                                            <small className='text-xs text-muted-foreground'>Tipe</small>
                                            <h4 className='text-xl font-mono font-medium'>
                                                <SlidingNumber
                                                    number={statsQuestion?.hard?.count}
                                                />
                                            </h4>
                                        </div>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <CircularProgress
                                                    value={statsQuestion?.hard?.percent}
                                                    min={0}
                                                    max={100}
                                                    size={30}
                                                    thickness={4}
                                                    className="me-3 mt-2"
                                                >
                                                    <CircularProgressIndicator>
                                                        <CircularProgressTrack className="text-red-200 dark:text-red-900" />
                                                        <CircularProgressRange className="text-red-500" />
                                                    </CircularProgressIndicator>
                                                </CircularProgress>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{statsQuestion?.hard?.percent}%</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </div>
                                    <span className='text-xs font-medium text-muted-foreground'>Sulit</span>
                                </div>
                            </div>
                        </div>
                        <div className="border-t py-3 px-4 w-full border-dashed flex flex-wrap items-center gap-1.5">
                            <span
                                className='text-xs font-medium text-foreground'
                            >Total Soal <span className='font-semibold'>{questions?.length}</span></span>

                            <Separator orientation='vertical' className="!h-4 mx-2" />

                            <Badge
                                variant={!filterType && !filterDifficult ? "secondary" : "outline"}
                                className="rounded-lg cursor-pointer"
                                onClick={() => { setFilterType(""); setFilterDifficult(""); }}
                            >Semua</Badge>

                            {[
                                { label: "Pilihan Ganda", value: "multiple_choice" },
                                { label: "Pilihan Ganda Kompleks", value: "complex_multiple_choice" },
                                { label: "Essay", value: "essay" },
                            ].map(({ label, value }) => (
                                <Badge
                                    key={value}
                                    variant={filterType === value ? "secondary" : "outline"}
                                    className="rounded-lg cursor-pointer items-center flex pe-1.5"
                                    onClick={() => setFilterType(prev => prev === value ? "" : value)}
                                >
                                    <span>{label}</span>
                                    {filterType === value && (
                                        <X />
                                    )}
                                </Badge>
                            ))}

                            <Separator orientation='vertical' className="!h-4" />

                            {[
                                { label: "Mudah", value: "easy" },
                                { label: "Sedang", value: "medium" },
                                { label: "Sulit", value: "hard" },
                            ].map(({ label, value }) => (
                                <Badge
                                    key={value}
                                    variant={filterDifficult === value ? "secondary" : "outline"}
                                    className="rounded-lg cursor-pointer items-center flex pe-1.5"
                                    onClick={() => setFilterDifficult(prev => prev === value ? "" : value)}
                                >
                                    <span>{label}</span>
                                    {filterDifficult === value && (
                                        <X />
                                    )}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </div>
            </GradientGenerate>

            <div className='flex flex-col relative p-5 border border-dashed'>
                <span className="border-primary/20 bg-white dark:bg-zinc-800 absolute top-0 left-0 z-30 size-2.5 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-xs border"></span>
                <span className="border-primary/20 bg-background absolute bottom-0 right-0 z-30 size-2.5 translate-x-1/2 translate-y-1/2 rotate-45 rounded-xs border"></span>

                <div className='z-10 flex flex-col gap-10'>
                    {(filteredQuestions?.length > 0) ? filteredQuestions.map((item, index) => (
                        <QuestionCard
                            key={`question-${item.id}`}
                            item={item}
                            index={index}
                            questions={questions}
                            setQuestions={setQuestions}
                            onUpdate={(updated) => {
                                const next = [...questions];
                                next[index] = updated;
                                setQuestions(next);
                            }}
                            onDelete={() => handleDeleteQuestion(item.id)}
                        />
                    )) : (
                        <div className='my-5 flex items-center justify-center'>
                            <span className='text-sm italic'>Tidak ada soal tersedia</span>
                        </div>
                    )}
                </div>

                <StripePattern />
            </div>

            {/* Bottom */}
            <div ref={bottomRef}></div>
        </div>
    );
};

const EditorSwitchRender = ({ tabMode }) => {

    return (
        <div className='flex flex-col'>
            {tabMode ? (
                <QuestionTab />
            ) : (
                <PromptTab />
            )}
        </div>
    )
}

export const HomeRibbonQuiz = () => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [tabMode, setTabMode] = useState(false);

    // Actions
    const ActionButton = () => {
        return (
            <>
                <div className="items-center flex justify-center h-full gap-2">

                    <div className='bg-gray-100 dark:bg-zinc-900 p-1 gap-1 flex rounded-lg inset-shadow-sm'>
                        <Button
                            size="sm"
                            variant={!tabMode ? 'outline' : 'ghost'}
                            onClick={() => setTabMode(false)}
                            className="hover:bg-accent border-0"
                        >
                            <FileCog />
                            <span>Instruksi</span>
                        </Button>
                        <Button
                            size="sm"
                            variant={tabMode ? 'outline' : 'ghost'}
                            onClick={() => setTabMode(true)}
                            className="hover:bg-accent border-0"
                        >
                            <MessagesSquareIcon />
                            <span>Soal</span>
                        </Button>
                    </div>
                </div>
            </>
        )
    }


    return (
        <>
            <ModuleWorkspaceTitle Action={ActionButton} />
            <GradientGenerate isGenerating={isGenerating} borderWidth="4px" borderRadius="15px" className='relative'>
                <div className='min-h-[696px]'>
                    {isGenerating && (
                        <>
                            <div className='absolute z-10 h-full w-full flex items-center justify-center'>
                                <SparkleLoader size='sm' />
                            </div>
                            <div className='flex items-center justify-center animate-pulse absolute w-full h-full bg-linear-to-tr z-1 from-cyan-50/80 to-pink-100/80 rounded-[12px]'></div>
                        </>
                    )}
                    <EditorSwitchRender tabMode={tabMode} />
                </div>
            </GradientGenerate>
        </>
    );
}
