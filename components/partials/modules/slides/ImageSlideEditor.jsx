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
import { toast } from "sonner";
import { Upload, X, Crop, RotateCcw, Save, Trash, Mic, StopCircle, Image as ImageIcon, Type, Video as VideoIcon, Camera } from "lucide-react";
import NextImage from "next/image";
import ModuleActionSlides from '@/components/partials/modules/ModuleActionSlides';

export async function createCroppedImage(imageSrc, cropData, fileName) {
    const image = new Image();
    image.crossOrigin = "anonymous";

    return new Promise((resolve, reject) => {
        image.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            if (!ctx) {
                reject(new Error("Could not get canvas context"));
                return;
            }

            canvas.width = cropData.width;
            canvas.height = cropData.height;

            ctx.drawImage(
                image,
                cropData.x,
                cropData.y,
                cropData.width,
                cropData.height,
                0,
                0,
                cropData.width,
                cropData.height,
            );

            canvas.toBlob((blob) => {
                if (!blob) {
                    reject(new Error("Canvas is empty"));
                    return;
                }

                const croppedFile = new File([blob], `cropped-${fileName}`, {
                    type: "image/png",
                });
                resolve(croppedFile);
            }, "image/png");
        };
        image.onerror = () => reject(new Error("Failed to load image"));
        image.src = imageSrc;
    });
}


export const ImageSlideEditor = ({ item, onUpdate }) => {
    const [files, setFiles] = useState([]);
    const [filesWithCrops, setFilesWithCrops] = useState(new Map());
    const [selectedFile, setSelectedFile] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedArea, setCroppedArea] = useState(null);
    const [showCropDialog, setShowCropDialog] = useState(false);
    const [imageUrl, setImageUrl] = useState(item?.page_image || null);
    const [defaultImage] = useState(item?.page_image || null); // Store original default image

    // Update imageUrl when item changes
    useEffect(() => {
        setImageUrl(item?.page_image || null);
        setFiles([]);
        setFilesWithCrops(new Map());
    }, [item?.page_image]);

    const selectedImageUrl = selectedFile ? URL.createObjectURL(selectedFile) : null;

    const onFileReject = useCallback((file, message) => {
        toast.error(message, {
            description: `"${file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name}" ditolak`,
        });
    }, []);

    const onFilesChange = useCallback((newFiles, dialogCrop = true) => {
        setFiles(newFiles);

        if (dialogCrop && newFiles.length > 0) {
            const firstFile = newFiles[0];
            setSelectedFile(firstFile);
            setCrop({ x: 0, y: 0 });
            setZoom(1);
            setCroppedArea(null);
            setShowCropDialog(true);
        }

        setFilesWithCrops((prevFilesWithCrops) => {
            const updatedFilesWithCrops = new Map(prevFilesWithCrops);

            for (const file of newFiles) {
                if (!updatedFilesWithCrops.has(file.name)) {
                    updatedFilesWithCrops.set(file.name, { original: file });
                }
            }

            const fileNames = new Set(newFiles.map((f) => f.name));
            for (const [fileName] of updatedFilesWithCrops) {
                if (!fileNames.has(fileName)) {
                    updatedFilesWithCrops.delete(fileName);
                }
            }

            return updatedFilesWithCrops;
        });
    }, []);

    const onFileSelect = useCallback((file) => {
        const fileWithCrop = filesWithCrops.get(file.name);
        const originalFile = fileWithCrop?.original ?? file;

        setSelectedFile(originalFile);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setCroppedArea(null);
        setShowCropDialog(true);
    }, [filesWithCrops]);

    const onCropAreaChange = useCallback((_, croppedAreaPixels) => {
        setCroppedArea(croppedAreaPixels);
    }, []);

    const onCropComplete = useCallback((_, croppedAreaPixels) => {
        setCroppedArea(croppedAreaPixels);
    }, []);

    const onCropReset = useCallback(() => {
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setCroppedArea(null);
    }, []);

    const onCropDialogOpenChange = useCallback((open) => {
        if (!open) {
            setShowCropDialog(false);
            setCrop({ x: 0, y: 0 });
            setZoom(1);
            setCroppedArea(null);
        }
    }, []);

    const onCropApply = useCallback(async () => {
        if (!selectedFile || !croppedArea || !selectedImageUrl) return;

        try {
            const croppedFile = await createCroppedImage(
                selectedImageUrl,
                croppedArea,
                selectedFile.name,
            );

            const newFilesWithCrops = new Map(filesWithCrops);
            const existing = newFilesWithCrops.get(selectedFile.name);
            if (existing) {
                newFilesWithCrops.set(selectedFile.name, {
                    ...existing,
                    cropped: croppedFile,
                });
                setFilesWithCrops(newFilesWithCrops);
            }

            onCropDialogOpenChange(false);
        } catch (error) {
            toast.error(
                error instanceof Error ? error.message : "Gagal crop gambar",
            );
        }
    }, [selectedFile, croppedArea, selectedImageUrl, filesWithCrops, onCropDialogOpenChange]);

    const handleDelete = () => {
        setImageUrl(null);
        setFiles([]);
        setFilesWithCrops(new Map());
        toast.success("Gambar berhasil dihapus");
    };

    const handleResetToDefault = () => {
        setImageUrl(defaultImage);
        setFiles([]);
        setFilesWithCrops(new Map());
        if (onUpdate) onUpdate({ page_image: defaultImage });
        toast.success("Gambar berhasil direset ke default");
    };

    const handleSave = () => {
        const fileWithCrop = Array.from(filesWithCrops.values())[0];
        if (fileWithCrop?.cropped) {
            const url = URL.createObjectURL(fileWithCrop.cropped);
            setImageUrl(url);
            if (onUpdate) onUpdate({ page_image: url }, fileWithCrop, "image");
        }
    };

    return (
        <div className="flex flex-col gap-4 p-1">


            <div className="aspect-video relative bg-white p-3 shadow-sm rounded-xl">
                {imageUrl ? (
                    <div className="relative h-full w-full">
                        <ImageZoom src={imageUrl}>
                            <div className="relative h-full w-full overflow-hidden rounded-lg">
                                <img
                                    src={imageUrl}
                                    alt="Slide Image"
                                    className="object-cover size-full"
                                    quality={50}
                                />
                            </div>
                        </ImageZoom>
                    </div>
                ) : (
                    <FileUpload
                        maxFiles={1}
                        maxSize={5 * 1024 * 1024}
                        className="w-full h-full gap-0"
                        value={files}
                        onValueChange={onFilesChange}
                        onFileReject={onFileReject}
                        multiple={false}
                        accept="image/png,image/jpeg"
                    >
                        {files.length === 0 ? (
                            <FileUploadDropzone className="h-full">
                                <div className="flex flex-col items-center gap-2 text-center">
                                    <div className="flex items-center justify-center rounded-xl border p-2">
                                        <svg className='size-5 fill-white' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" >
                                            <g>
                                                <path className='fill-sky-500' opacity="0.4" d="M22 7.81V13.9L20.37 12.5C19.59 11.83 18.33 11.83 17.55 12.5L13.39 16.07C12.61 16.74 11.35 16.74 10.57 16.07L10.23 15.79C9.52 15.17 8.39 15.11 7.59 15.65L2.67 18.95L2.56 19.03C2.19 18.23 2 17.28 2 16.19V7.81C2 4.17 4.17 2 7.81 2H16.19C19.83 2 22 4.17 22 7.81Z" />
                                                <path className='fill-sky-500' d="M9.00012 10.3801C10.3146 10.3801 11.3801 9.31456 11.3801 8.00012C11.3801 6.68568 10.3146 5.62012 9.00012 5.62012C7.68568 5.62012 6.62012 6.68568 6.62012 8.00012C6.62012 9.31456 7.68568 10.3801 9.00012 10.3801Z" />
                                                <path className='fill-sky-500' d="M22.0001 13.8996V16.1896C22.0001 19.8296 19.8301 21.9996 16.1901 21.9996H7.81006C5.26006 21.9996 3.42006 20.9296 2.56006 19.0296L2.67006 18.9496L7.59006 15.6496C8.39006 15.1096 9.52006 15.1696 10.2301 15.7896L10.5701 16.0696C11.3501 16.7396 12.6101 16.7396 13.3901 16.0696L17.5501 12.4996C18.3301 11.8296 19.5901 11.8296 20.3701 12.4996L22.0001 13.8996Z" />
                                            </g>
                                            <defs>
                                                <clipPath>
                                                    <rect className='size-5 fill-white' fill="white" />
                                                </clipPath>
                                            </defs>
                                        </svg>
                                    </div>
                                    <p className="font-medium text-sm">Seret & lepas gambar di sini</p>
                                    <p className="text-muted-foreground text-xs">
                                        Atau klik untuk memilih file (maks. 5 MB)
                                    </p>
                                </div>
                                <FileUploadTrigger asChild>
                                    <Button variant="outline" size="sm" className="mt-2">
                                        Browse files
                                    </Button>
                                </FileUploadTrigger>
                            </FileUploadDropzone>
                        ) : (
                            <FileUploadList className="h-full">
                                {files.map((file, index) => {
                                    const fileWithCrop = filesWithCrops.get(file.name);
                                    return (
                                        <FileUploadItem key={index} value={file} className="flex-col h-full border-0 p-0 gap-0">
                                            <FileUploadItemPreview
                                                className="h-full w-full border-0"
                                                render={(originalFile, fallback) => {
                                                    if (fileWithCrop?.cropped && originalFile.type.startsWith("image/")) {
                                                        const url = URL.createObjectURL(fileWithCrop.cropped);
                                                        return (
                                                            <ImageZoom src={url} disabled={showCropDialog} className="w-full">
                                                                <img
                                                                    src={url}
                                                                    alt={originalFile.name}
                                                                    className="size-full object-contain rounded-lg"
                                                                />
                                                            </ImageZoom>
                                                        );
                                                    }
                                                    return fallback();
                                                }}
                                            />
                                        </FileUploadItem>
                                    );
                                })}
                            </FileUploadList>
                        )}
                    </FileUpload>
                )}
            </div>


            <ModuleActionSlides>

                {/* Action Buttons */}
                <div className="flex items-center justify-center gap-2">
                    {(imageUrl || files.length > 0) && (
                        <>
                            {files.length > 0 && (
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="outline" size="sm" onClick={() => onFileSelect(files[0])}>
                                            <Crop />
                                            <span>Crop</span>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Crop Gambar</TooltipContent>
                                </Tooltip>
                            )}
                        </>
                    )}
                    {console.log(item)}
                    {(!imageUrl && item?.slide_type == "image" && item?.page_image) && (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="outline" size="sm" onClick={handleResetToDefault}>
                                    <RotateCcw />
                                    <span>Reset</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Reset ke Default</TooltipContent>
                        </Tooltip>
                    )}

                    {(imageUrl || files.length > 0) && (
                        <>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="outline" size="sm" onClick={handleDelete}>
                                        <Trash />
                                        <span>Hapus</span>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Hapus Gambar</TooltipContent>
                            </Tooltip>

                            {files.length > 0 && (
                                <>

                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button size="sm" onClick={handleSave}>
                                                <Save />
                                                <span>Simpan</span>
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>Simpan Gambar</TooltipContent>
                                    </Tooltip>
                                </>
                            )}
                        </>
                    )}

                </div>

                {/* Crop Dialog */}
                <Dialog open={showCropDialog} onOpenChange={onCropDialogOpenChange}>
                    <DialogContent className="max-w-4xl">
                        <DialogHeader>
                            <DialogTitle>Crop Gambar</DialogTitle>
                            <DialogDescription>
                                Sesuaikan area crop dengan aspect ratio 16:9
                            </DialogDescription>
                        </DialogHeader>
                        {selectedFile && selectedImageUrl && (
                            <div className="flex flex-col gap-4">
                                <Cropper
                                    aspectRatio={16 / 9}
                                    crop={crop}
                                    onCropChange={setCrop}
                                    zoom={zoom}
                                    onZoomChange={setZoom}
                                    onCropAreaChange={onCropAreaChange}
                                    onCropComplete={onCropComplete}
                                    className="h-96 w-full"
                                >
                                    <CropperImage
                                        src={selectedImageUrl}
                                        alt={selectedFile.name}
                                        crossOrigin="anonymous"
                                    />
                                    <CropperArea />
                                </Cropper>
                                <div className="flex flex-col gap-2">
                                    <Label className="text-sm">Zoom: {zoom.toFixed(2)}</Label>
                                    <Slider
                                        value={[zoom]}
                                        onValueChange={(value) => setZoom(value[0] ?? 1)}
                                        min={1}
                                        max={3}
                                        step={0.1}
                                        className="w-full"
                                    />
                                </div>
                            </div>
                        )}
                        <DialogFooter>
                            <Button onClick={onCropReset} variant="outline">
                                Reset
                            </Button>
                            <Button onClick={onCropApply} disabled={!croppedArea}>
                                Apply Crop
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </ModuleActionSlides>


        </div>
    );
};