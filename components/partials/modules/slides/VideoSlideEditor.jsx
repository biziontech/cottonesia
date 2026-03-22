/* eslint-disable react-hooks/set-state-in-effect */
'use client'

import { useState, useCallback, useEffect, useRef } from 'react';
import { useModule } from "@/contexts/ModuleContext";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { Upload, Save, Trash, StopCircle, Video as VideoIcon, Camera, RotateCcw } from "lucide-react";
import ModuleActionSlides from '@/components/partials/modules/ModuleActionSlides';
import {
    MediaPlayer,
    MediaPlayerVideo,
    MediaPlayerLoading,
    MediaPlayerError,
    MediaPlayerVolumeIndicator,
    MediaPlayerControls,
    MediaPlayerControlsOverlay,
    MediaPlayerPlay,
    MediaPlayerSeekBackward,
    MediaPlayerSeekForward,
    MediaPlayerVolume,
    MediaPlayerSeek,
    MediaPlayerTime,
    MediaPlayerPlaybackSpeed,
    MediaPlayerFullscreen,
} from "@/components/ui/media-player";

export const VideoSlideEditor = ({ item, onUpdate }) => {
    const [videoUrl, setVideoUrl] = useState(item?.page_video || null);
    const [defaultVideo] = useState(item?.page_video || null);
    const [isRecording, setIsRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [recordedChunks, setRecordedChunks] = useState([]);
    const [stream, setStream] = useState(null);
    const [uploadedFile, setUploadedFile] = useState(null);
    const videoPreviewRef = useRef(null);
    const fileInputRef = useRef(null);

    // Update videoUrl when item changes
    useEffect(() => {
        setVideoUrl(item?.page_video || null);
        setUploadedFile(null);
    }, [item?.page_video]);

    useEffect(() => {
        // Cleanup stream on unmount
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [stream]);

    useEffect(() => {
        if (isRecording && stream && videoPreviewRef.current) {
            videoPreviewRef.current.srcObject = stream;
            videoPreviewRef.current.play()
                .then(() => console.log('Preview playing'))
                .catch(err => console.error('Play error:', err));
        }
    }, [isRecording, stream]);

    const generateVideoThumbnail = async (videoFile) => {
        return new Promise((resolve, reject) => {
            const video = document.createElement('video');
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            video.preload = 'metadata';
            video.muted = true;
            video.playsInline = true;

            video.onloadedmetadata = () => {
                // Seek ke random timestamp (10-50% dari durasi)
                const randomTime = video.duration * (0.1 + Math.random() * 0.4);
                video.currentTime = randomTime;
            };

            video.onseeked = () => {
                canvas.width = 700;
                canvas.height = (video.videoHeight / video.videoWidth) * 700;

                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

                canvas.toBlob((blob) => {
                    if (blob) {
                        const thumbnailFile = new File(
                            [blob],
                            `thumbnail-${Date.now()}.jpg`,
                            { type: 'image/jpeg' }
                        );
                        resolve(thumbnailFile);
                    } else {
                        reject(new Error('Failed to generate thumbnail'));
                    }
                }, 'image/jpeg', 0.85);
            };

            video.onerror = () => reject(new Error('Failed to load video'));
            video.src = URL.createObjectURL(videoFile);
        });
    };

    const handleFileUpload = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 50 * 1024 * 1024) {
                toast.error("Ukuran file terlalu besar (maks. 50MB)");
                return;
            }
            const url = URL.createObjectURL(file);
            setVideoUrl(url);
            setUploadedFile(file);
            toast.success("Video berhasil dipilih, klik Simpan untuk menyimpan");
        }
    };

    const startRecording = async () => {
        try {
            // Request camera + audio dengan resolusi 1920x1080
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 1920 },
                    height: { ideal: 1080 },
                    frameRate: { ideal: 30 },
                    facingMode: 'user'
                },
                audio: true
            });

            setStream(mediaStream);

            // ✅ Show preview - ensure video element is ready
            if (videoPreviewRef.current) {
                videoPreviewRef.current.srcObject = mediaStream;

                // Force play after setting srcObject
                try {
                    await videoPreviewRef.current.play();
                    console.log('Video preview started successfully');
                } catch (playError) {
                    console.error('Error playing video preview:', playError);
                    // Try play again after a short delay
                    setTimeout(() => {
                        videoPreviewRef.current?.play().catch(e => console.error('Retry play failed:', e));
                    }, 100);
                }
            }

            const recorder = new MediaRecorder(mediaStream, {
                mimeType: 'video/webm;codecs=vp9,opus',
                videoBitsPerSecond: 2500000
            });
            const chunks = [];

            recorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunks.push(e.data);
                }
            };

            recorder.onstop = () => {
                const blob = new Blob(chunks, { type: 'video/webm' });
                const file = new File([blob], `recorded-video-${Date.now()}.webm`, { type: 'video/webm' });
                const url = URL.createObjectURL(blob);
                setVideoUrl(url);
                setUploadedFile(file);

                // Stop all tracks
                mediaStream.getTracks().forEach(track => track.stop());
                setStream(null);

                toast.success("Video berhasil direkam, klik Simpan untuk menyimpan");
            };

            recorder.start();
            setMediaRecorder(recorder);
            setRecordedChunks(chunks);
            setIsRecording(true);
            toast.success("Perekaman kamera dimulai");
        } catch (error) {
            toast.error("Gagal mengakses kamera/mikrofon");
            console.error('Camera access error:', error);
        }
    };
    const stopRecording = () => {
        if (mediaRecorder && isRecording) {
            mediaRecorder.stop();
            setIsRecording(false);
            setMediaRecorder(null);
            toast.success("Perekaman kamera selesai");
        }
    };

    const handleSave = async () => {
        if (uploadedFile) {
            try {
                // Generate thumbnail
                const thumbnailFile = await generateVideoThumbnail(uploadedFile);

                // Send both video and thumbnail
                if (onUpdate) {
                    onUpdate(
                        { page_video: videoUrl },
                        uploadedFile,
                        "video",
                        thumbnailFile
                    );
                }
                toast.success("Video berhasil disimpan");
            } catch (error) {
                toast.error("Gagal generate thumbnail: " + error.message);
            }
        }
    };

    const handleDelete = () => {
        setVideoUrl(null);
        setUploadedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        toast.success("Video berhasil dihapus");
    };

    const handleResetToDefault = () => {
        setVideoUrl(defaultVideo);
        setUploadedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        if (onUpdate) onUpdate({ page_video: defaultVideo });
        toast.success("Video berhasil direset ke default");
    };

    return (
        <div className="flex flex-col gap-4 p-1">
            <div className="aspect-video relative bg-card text-card-foreground p-3 shadow-sm rounded-xl border border-border/60">
                {isRecording ? (
                    <div className="relative h-full w-full rounded-lg overflow-hidden bg-black">
                        <video
                            ref={videoPreviewRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-600 text-white px-3 py-1.5 rounded-full z-10">
                            <div className="size-2 bg-background rounded-full animate-pulse" />
                            <span className="text-xs font-medium">Recording</span>
                        </div>
                    </div>
                ) : videoUrl ? (
                    <div className="h-full w-full rounded-lg overflow-hidden">
                        <MediaPlayer>
                            <MediaPlayerVideo>
                                <source src={videoUrl} type="video/webm" />
                                <source src={videoUrl} type="video/mp4" />
                            </MediaPlayerVideo>
                            <MediaPlayerLoading />
                            <MediaPlayerError />
                            <MediaPlayerVolumeIndicator />
                            <MediaPlayerControls>
                                <MediaPlayerControlsOverlay />
                                <MediaPlayerPlay />
                                <MediaPlayerSeekBackward />
                                <MediaPlayerSeekForward />
                                <MediaPlayerVolume />
                                <MediaPlayerSeek />
                                <MediaPlayerTime />
                                <MediaPlayerPlaybackSpeed />
                                <MediaPlayerFullscreen />
                            </MediaPlayerControls>
                        </MediaPlayer>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center gap-4 border-2 border-dashed rounded-lg hover:bg-accent/30 transition-colors">
                        <div className="flex flex-col items-center gap-2 text-center">
                            <div className="flex items-center justify-center rounded-xl border border-border p-2 bg-background">
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
                            </div>
                            <p className="font-medium text-sm">
                                Belum ada video. Silakan unggah video.
                            </p>
                            <p className="text-muted-foreground text-xs">
                                Klik tombol di bawah untuk memilih file atau rekam langsung dari kamera
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" asChild>
                                <label>
                                    <Upload className="size-4" />
                                    <span>Upload Video</span>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="video/*"
                                        className="hidden"
                                        onChange={handleFileUpload}
                                    />
                                </label>
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={startRecording}
                            >
                                <Camera className="size-4" />
                                <span>Rekam Kamera</span>
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            <ModuleActionSlides>
                {/* Action Buttons */}
                <div className="flex items-center justify-center gap-2">
                    {isRecording && (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={stopRecording}
                                >
                                    <StopCircle className="size-4" />
                                    <span>Stop Recording</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Stop Perekaman</TooltipContent>
                        </Tooltip>
                    )}

                    {!videoUrl && defaultVideo && (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="outline" size="sm" onClick={handleResetToDefault}>
                                    <RotateCcw className="size-4" />
                                    <span>Reset</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Reset ke Default</TooltipContent>
                        </Tooltip>
                    )}

                    {videoUrl && !isRecording && (
                        <>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="outline" size="sm" onClick={handleDelete}>
                                        <Trash />
                                        <span>Hapus</span>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Hapus Video</TooltipContent>
                            </Tooltip>

                            {uploadedFile && (
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button size="sm" onClick={handleSave}>
                                            <Save />
                                            <span>Simpan</span>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Simpan Video</TooltipContent>
                                </Tooltip>
                            )}
                        </>
                    )}
                </div>
            </ModuleActionSlides>
        </div>
    );
};
