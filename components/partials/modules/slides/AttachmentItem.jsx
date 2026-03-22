/* eslint-disable react-hooks/set-state-in-effect */
'use client'

import { useState, useCallback, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useModule } from "@/contexts/ModuleContext";
import { Button } from "@/components/ui/button";
import toWav from 'audiobuffer-to-wav';
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Loader, X, Eye, EditIcon, Save, Trash, Mic, StopCircle, Image as ImageIcon, Shredder, Video as VideoIcon, Camera, ChevronDown, ChevronUp } from "lucide-react";
import { LiveWaveform } from "@/components/partials/LiveWaveform";
import { AudioPlayerButton, AudioPlayerDuration, AudioPlayerProgress, AudioPlayerProvider, AudioPlayerSpeed, AudioPlayerTime } from "@/components/ui/audio-player";
import StripePattern from '@/components/partials/StripePattern';
import { Separator } from '@/components/ui/separator';

const Editor = dynamic(() => import('@/components/editor/Editor'), {
    ssr: false,
    loading: () => (
        <div className="w-full max-w-[1200px] mx-auto my-0">
            <div className="min-h-[696px] flex items-center justify-center rounded-xl bg-card text-card-foreground shadow-sm border border-border/60">
                <div className="flex flex-col gap-4 items-center">
                    <Loader className="animate-spin text-muted-foreground" size={32} />
                    <p className="text-sm text-muted-foreground">Memuat Editor...</p>
                </div>
            </div>
        </div>
    ),
});


export const AttachmentItem = ({ attachment, onUpdate, onDelete, onSave }) => {
    const { selectedSlide, setSelectedSlide } = useModule();
    const [content, setContent] = useState(attachment?.attachment_content || '');
    const [audioUrl, setAudioUrl] = useState(attachment?.attachment_audio || null);
    const [attachmentEditMode, setAttachmentEditMode] = useState(false);
    const [hasContentChanged, setHasContentChanged] = useState(false);
    const [contentCollapse, setContentCollapse] = useState(true);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleted, setIsDeleted] = useState(false);
    const [stream, setStream] = useState(null);
    const contentRef = useRef(null);
    const [contentHeight, setContentHeight] = useState(0);

    useEffect(() => {
        if (contentRef.current) {
            setContentHeight(contentRef.current.scrollHeight);
        }
    }, [attachmentEditMode]);

    useEffect(() => {
        // Cleanup stream on unmount
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [stream]);

    useEffect(() => {
        if (!selectedSlide) return;

        // Reset draft audio (blob preview)
        setAudioBlob(null);

        // Pakai URL terbaru dari server
        setAudioUrl(selectedSlide?.attachment_audio || null);

    }, [selectedSlide?.attachment_audio]);

    const handleContentChange = (c) => {
        setContent(c);
        setHasContentChanged(true); // <-- tambah ini
        if (onUpdate) onUpdate({ ...attachment, attachment_content: c });
    };

    const startRecording = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            setStream(mediaStream);

            const recorder = new MediaRecorder(mediaStream);
            const chunks = [];

            recorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunks.push(e.data);
                }
            };

            recorder.onstop = async () => {
                const webmBlob = new Blob(chunks, { type: 'audio/webm' });
                const arrayBuffer = await webmBlob.arrayBuffer();
                const audioContext = new AudioContext();
                const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
                const wavBuffer = toWav(audioBuffer);
                const wavBlob = new Blob([wavBuffer], { type: 'audio/wav' });
                const url = URL.createObjectURL(wavBlob);

                setAudioBlob(wavBlob);
                setAudioUrl(url);

                if (onUpdate) onUpdate({
                    ...attachment,
                    attachment_audio_file: wavBlob
                });

                mediaStream.getTracks().forEach(track => track.stop());
                setStream(null);
            };


            recorder.start();
            setMediaRecorder(recorder);
            setIsRecording(true);
            toast.success("Perekaman audio dimulai");
        } catch (error) {
            toast.error("Gagal mengakses mikrofon");
            console.error(error);
        }
    };

    const stopRecording = () => {
        if (mediaRecorder && isRecording) {
            mediaRecorder.stop();
            setIsRecording(false);
            setMediaRecorder(null);
            toast.success("Perekaman audio selesai");
        }
    };

    const handleSaveAttactment = async () => {
        if (!onSave) return;

        try {
            setIsSaving(true);

            const payload = {
                ...attachment,
                attachment_content: content,
                attachment_audio: audioUrl,
            };

            // Jika ada blob audio baru (hasil rekaman), lampirkan sebagai File
            if (audioBlob) {
                const audioFile = new File(
                    [audioBlob],
                    `audio_${attachment.id ?? Date.now()}.webm`,
                    { type: 'audio/webm' }
                );
                payload.attachment_audio_file = audioFile;
            }

            await onSave(payload);
            setHasContentChanged(false);
        } catch (error) {
            toast.error("Gagal menyimpan attachment");
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleAttachmentDelete = async () => {
        if (!onDelete) return;
        setIsDeleted(true);

        try {
            const payload = {
                attachment_type: null,
                attachment_content: null,
                attachment_audio: null
            };

            await onDelete(payload);
        } catch (error) {
            toast.error("Gagal menghapus attachment");
            console.error(error);
        } finally {
            setIsDeleted(false);
        }
    };

    return (
        <div className="border border-border border-dashed p-3 flex flex-col gap-3 relative mx-2">
            <span className="border-primary/20 bg-background absolute top-0 left-0 z-30 size-2.5 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-xs border"></span>
            <span className="border-primary/20 bg-background absolute bottom-0 right-0 z-30 size-2.5 translate-x-1/2 translate-y-1/2 rotate-45 rounded-xs border"></span>
            <div className='flex z-10 mx-4 my-0 gap-4 items-center flex-col xl:flex-row justify-between'>
                <div className='flex flex-col sm:flex-row gap-2 items-center'>
                    <h3 className="text-sm font-semibold">{attachment.attachment_type === 'text' ? 'Text' : 'Audio'} Attachment</h3>
                    <Separator className="!h-4 hidden sm:block" orientation='vertical' />
                    <Separator className="!w-10 block sm:hidden" orientation='horizontal' />
                    {attachment.attachment_type === 'text' ? (
                        <small>Tambahkan informasi pendukung jika diperlukan</small>
                    ) : (
                        <small>Tambahkan rekaman audio sebagai informasi pendukung</small>
                    )}
                </div>

                <div className='flex gap-2 items-center justify-center'>

                    {attachment.attachment_type === 'text' && (
                        <>
                            <div className='bg-gray-100 dark:bg-zinc-900 p-1 gap-1 flex rounded-lg inset-shadow-sm'>
                                <Button
                                    size="sm"
                                    variant={!attachmentEditMode ? 'outline' : 'ghost'}
                                    onClick={() => setAttachmentEditMode(false)}
                                    className="hover:bg-accent border-0 h-7 text-xs !px-2"
                                >
                                    <Eye className='size-4' />
                                    <span>Pratinjau</span>
                                </Button>
                                <Button
                                    size="sm"
                                    variant={attachmentEditMode ? 'outline' : 'ghost'}
                                    onClick={() => setAttachmentEditMode(true)}
                                    className="hover:bg-accent border-0 h-7 text-xs !px-2"
                                >
                                    <EditIcon className='size-4' />
                                    <span>Edit</span>
                                </Button>
                            </div>

                            <Separator orientation='vertical' className="!h-5" />
                        </>
                    )}

                    <AlertDialog>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <AlertDialogTrigger asChild>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        disabled={isDeleted || isRecording}
                                    >
                                        {isDeleted ? (
                                            <Loader className="animate-spin size-4" />
                                        ) : (
                                            <Trash />
                                        )}
                                        <span>{isDeleted ? "Menghapus..." : "Hapus"}</span>
                                    </Button>
                                </AlertDialogTrigger>
                            </TooltipTrigger>

                            <TooltipContent>
                                {isDeleted ? "Sedang menghapus..." : "Hapus Attactment"}
                            </TooltipContent>
                        </Tooltip>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Ingin menghapus Attachment ?</AlertDialogTitle>
                                <AlertDialogDescription>Tindakan ini akan menghapus attachment secara permanen dan tidak dapat dipulihkan</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <Button
                                    variant="destructive"
                                    onClick={() => handleAttachmentDelete()}
                                >
                                    Ya, Hapus
                                </Button>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                    {(audioBlob || hasContentChanged) && (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    size="sm"
                                    onClick={() => handleSaveAttactment()}
                                    disabled={isSaving || isRecording}
                                >
                                    {isSaving ? (
                                        <Loader className="animate-spin size-4" />
                                    ) : (
                                        <Save />
                                    )}
                                    <span>{isSaving ? "Menyimpan..." : "Simpan"}</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Simpan Perubahan</p>
                            </TooltipContent>
                        </Tooltip>
                    )}
                </div>
            </div>

            <StripePattern />

            {attachment.attachment_type === 'text' && (
                <div className='flex flex-col z-10'>
                    {attachmentEditMode ? (
                        <Editor onBlur={handleContentChange} initialContent={content} />
                    ) : (
                        <div
                            style={{
                                maxHeight: contentHeight > 120 ? '120px' : '652px',
                                minHeight: contentCollapse ? '120px' : '652px',
                                transition: 'min-height 0.5s ease-in-out'
                            }}
                            className="overflow-hidden shadow-sm bg-card text-card-foreground p-8 rounded-3xl relative border border-border/60"
                        >
                            <div ref={contentRef}>
                                <article className='max-w-3xl mx-auto prose dark:prose-invert prose-sm' dangerouslySetInnerHTML={{ __html: !content ? '<center><span><i>Silakan tambahkan attactment content</i></span></center>' : content }} />
                            </div>

                            {contentHeight > 120 && (
                                <div className='group'>
                                    <div className='absolute bottom-0 left-0 right-0 h-20 bg-linear-to-t from-card from-40% to-transparent transition-colors group-hover:from-muted duration-500'></div>
                                    <div className='absolute bottom-3 left-0 right-0 w-fit mx-auto text-sm font-medium cursor-pointer text-muted-foreground transition-colors duration-500 group-hover:text-primary animate-bounce' onClick={() => setContentCollapse(!contentCollapse)}>
                                        {contentCollapse ? (
                                            <ChevronDown />
                                        ) : (
                                            <ChevronUp />
                                        )}

                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {attachment.attachment_type === 'audio' && (
                <div className="flex flex-col gap-3 z-10">
                    {isRecording ? (
                        /* ── LIVE RECORDING STATE ── */
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <div className="flex border border-border items-center gap-2 bg-card py-2 px-3 rounded-lg shadow-xs">
                                    <span className="relative flex size-2">
                                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75"></span>
                                        <span className="relative inline-flex size-2 rounded-full bg-rose-500"></span>
                                    </span>
                                    <span className="text-xs font-medium text-muted-foreground">Merekam...</span>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={stopRecording}
                                >
                                    <StopCircle className="size-4 text-red-500" />
                                    <span>Stop</span>
                                </Button>
                            </div>
                            <div className="w-full bg-card shadow-xs border border-border rounded-lg px-4">
                                <LiveWaveform
                                    height={80}
                                    active={true}
                                    mode="static"
                                    barColor="oklch(27.9% 0.041 260.031)"
                                    barWidth={3}
                                    barGap={2}
                                    fadeEdges={false}
                                    className="w-full"
                                    historySize={120}
                                    onError={(err) => console.error('Waveform error:', err)}
                                />
                            </div>
                        </div>
                    ) : audioUrl ? (
                        /* ── PLAYBACK STATE ── */
                        <div className="flex flex-col gap-3 p-4 shadow rounded-lg bg-card text-card-foreground border border-border/60">
                            <AudioPlayerProvider>
                                <div className="flex items-center gap-3">
                                    <AudioPlayerButton
                                        className="rounded-xl"
                                        size="icon-sm"
                                        item={{
                                            id: attachment.id ?? 'recorded-audio',
                                            src: audioUrl,
                                        }}
                                    />
                                    <div className="flex flex-col flex-1 gap-1 min-w-0">
                                        <AudioPlayerProgress className="w-full" />
                                        <div className="flex items-center gap-1 text-xs font-mono text-muted-foreground">
                                            <AudioPlayerTime />
                                            <span>/</span>
                                            <AudioPlayerDuration />
                                        </div>
                                    </div>
                                    <AudioPlayerSpeed variant="outline" size="icon-sm" />
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            setAudioUrl(null);
                                            setAudioBlob(null);
                                            if (onUpdate) onUpdate({ ...attachment, attachment_audio: null });
                                        }}
                                    >
                                        <Shredder className="size-4" />
                                        <span>Hapus</span>
                                    </Button>
                                </div>
                            </AudioPlayerProvider>

                        </div>
                    ) : (
                        /* ── IDLE STATE ── */
                        <div className="flex items-center justify-center py-8 border border-border rounded-lg bg-muted/60">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={startRecording}
                            >
                                <Mic className="size-4" />
                                <span>Mulai Rekam</span>
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
