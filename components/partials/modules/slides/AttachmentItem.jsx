/* eslint-disable react-hooks/set-state-in-effect */
'use client'

import { useState, useCallback, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useModule } from "@/contexts/ModuleContext";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { FileUpload, FileUploadDropzone, FileUploadItem, FileUploadItemDelete, FileUploadItemMetadata, FileUploadItemPreview, FileUploadList, FileUploadTrigger } from "@/components/ui/file-upload";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Cropper, CropperArea, CropperImage } from "@/components/ui/cropper";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ImageZoom } from "@/components/partials/ImageZoom";
import { SparkleLoader } from "@/components/partials/SparkleLoader";
import { toast } from "sonner";
import { Upload, X, Crop, RotateCcw, Save, Trash, Mic, StopCircle, Image as ImageIcon, Type, Video as VideoIcon, Camera } from "lucide-react";
import NextImage from "next/image";
import { AudioWaveform } from '@/components/partials/modules/slides/AudioWaveform';

const Editor = dynamic(() => import('@/components/editor/Editor'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full flex items-center justify-center">
            <SparkleLoader size="xs" />
        </div>
    ),
});


export const AttachmentItem = ({ attachment, onUpdate, onDelete }) => {
    const [content, setContent] = useState(attachment?.attachment_content || '');
    const [isRecording, setIsRecording] = useState(false);
    const [audioUrl, setAudioUrl] = useState(attachment?.attachment_audio || null);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [stream, setStream] = useState(null);

    useEffect(() => {
        // Cleanup stream on unmount
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [stream]);

    const handleContentChange = (c) => {
        setContent(c);
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

            recorder.onstop = () => {
                const blob = new Blob(chunks, { type: 'audio/webm' });
                const url = URL.createObjectURL(blob);
                setAudioUrl(url);
                if (onUpdate) onUpdate({ ...attachment, attachment_audio: url });
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

    return (
        <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="size-8 flex items-center justify-center bg-blue-50 rounded-lg">
                        <Type className="size-4 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium">Attachment {attachment.attachment_type === 'text' ? 'Text' : 'Audio'}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={onDelete}>
                    <X className="size-4" />
                </Button>
            </div>

            {attachment.attachment_type === 'text' && (
                <div className="min-h-[200px] border rounded-lg p-3">
                    <Editor onBlur={handleContentChange} initialContent={content} />
                </div>
            )}

            {attachment.attachment_type === 'audio' && (
                <div className="flex flex-col gap-3">
                    {isRecording ? (
                        <div className="flex flex-col gap-3 p-4 border rounded-lg bg-gradient-to-r from-purple-50 to-pink-50">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="size-2 bg-red-600 rounded-full animate-pulse" />
                                    <span className="text-sm font-medium text-gray-700">Merekam...</span>
                                </div>
                                <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={stopRecording}
                                >
                                    <StopCircle className="size-4 text-red-600" />
                                    <span>Stop</span>
                                </Button>
                            </div>
                            <AudioWaveform isRecording={isRecording} stream={stream} />
                        </div>
                    ) : audioUrl ? (
                        <>
                            <audio src={audioUrl} controls className="w-full" />
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => {
                                    setAudioUrl(null);
                                    if (onUpdate) onUpdate({ ...attachment, attachment_audio: null });
                                }}
                            >
                                <Trash className="size-4" />
                                <span>Hapus Audio</span>
                            </Button>
                        </>
                    ) : (
                        <div className="flex items-center justify-center py-8 border rounded-lg border-dashed">
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
