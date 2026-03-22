import { useState, useCallback, useMemo, useEffect } from "react";
import { FileUpload, FileUploadDropzone, FileUploadItem, FileUploadItemDelete, FileUploadItemMetadata, FileUploadItemPreview, FileUploadList, FileUploadTrigger } from "@/components/ui/file-upload";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Cropper, CropperArea, CropperImage } from "@/components/ui/cropper";
import { Button } from "@/components/ui/button";
import { Upload, X, Crop, RotateCcw, Save, Trash } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ImageZoom } from "@/components/partials/ImageZoom";
import { GradientGenerate } from "@/components/partials/GradientGenerate";
import { SparkleLoader } from "@/components/partials/SparkleLoader";
import { toast } from "sonner";
import NextImage from "next/image";
import { SparkleAi } from "@/components/partials/SparkleAi";
import { api } from '@/lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function createCroppedImage(imageSrc, cropData, fileName) {
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

const ResetSaveRender = ({ isGenerating, resetCoverDefault, handleGenerateCover, handleSaveCover }) => {
    return (
        <div className="flex flex-1 items-center justify-end p-3 border-t w-full border-dashed gap-2">
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant="outline"
                        size="sm"
                        className="group"
                        disabled={isGenerating}
                        onClick={() => handleGenerateCover()}
                    >
                        <SparkleAi />
                        <span className="text-purple-600 font-semibold">Generate</span>
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Generate dengan AI</p>
                </TooltipContent>
            </Tooltip>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon-sm"
                        className="group"
                        onClick={() => resetCoverDefault()}
                    >
                        <RotateCcw className="group-hover:-rotate-90 transition-transform" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Reset ke Default</p>
                </TooltipContent>
            </Tooltip>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        size="sm"
                        onClick={() => handleSaveCover()}
                    >
                        <Save />
                        <span>Simpan</span>
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Simpan Perubahan</p>
                </TooltipContent>
            </Tooltip>
        </div>
    )
}

export const ModuleCoverPage = ({ initialCoverUrl = null, module = null }) => {
    const [files, setFiles] = useState([]);
    const [filesWithCrops, setFilesWithCrops] = useState(new Map());
    const [coverUrl, setCoverUrl] = useState(initialCoverUrl);
    const [selectedFile, setSelectedFile] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [loading, setLoading] = useState(false);
    const [croppedArea, setCroppedArea] = useState(null);
    const [showCropDialog, setShowCropDialog] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    const selectedImageUrl = useMemo(() => {
        if (!selectedFile) return null;
        return URL.createObjectURL(selectedFile);
    }, [selectedFile]);

    const onFileReject = useCallback((file, message) => {
        toast(message, {
            description: `"${file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name}" has been rejected`,
        });
    }, []);

    const onFilesChange = useCallback((newFiles, dialogCrop = true) => {
        setFiles(newFiles);

        // Auto open crop dialog when file is uploaded
        if (dialogCrop && (newFiles.length > 0)) {
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

    const onFileSelect = useCallback(
        (file) => {
            const fileWithCrop = filesWithCrops.get(file.name);
            const originalFile = fileWithCrop?.original ?? file;

            setSelectedFile(originalFile);
            setCrop({ x: 0, y: 0 });
            setZoom(1);
            setCroppedArea(null);
            setShowCropDialog(true);
        },
        [filesWithCrops],
    );

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
                error instanceof Error ? error.message : "Failed to crop image",
            );
        }
    }, [
        selectedFile,
        croppedArea,
        selectedImageUrl,
        filesWithCrops,
        onCropDialogOpenChange,
    ]);

    const handleDeleteCover = () => {
        setCoverUrl("");
        setFiles([]);
        setFilesWithCrops(new Map());
    }

    const resetCoverDefault = () => {
        setCoverUrl(initialCoverUrl);
        setFiles([]);
        setFilesWithCrops(new Map());
    }

    const handleGenerateCover = async () => {
        try {
            setIsGenerating(true);
            // response
            const res = await fetch("https://agent.wahyuachmad.com/webhook/4f92efd7-4560-4ec5-9f2f-b6b050681bfa", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    type: "generate_thumbnail",
                    text: "Buatkan sebuah illustrasi seorang Mekanik sedang memperbaiki AC Mobil"
                })
            });
            const blob = await res.blob();
            const file = new File([blob], "Cover.png", { type: blob.type });
            const imageUrl = URL.createObjectURL(file);

            // Calculate center crop with aspect ratio 256:211
            const image = new Image();
            image.crossOrigin = "anonymous";
            image.onload = async () => {
                const aspectRatio = 256 / 211;
                let cropWidth = image.width;
                let cropHeight = image.width / aspectRatio;

                if (cropHeight > image.height) {
                    cropHeight = image.height;
                    cropWidth = image.height * aspectRatio;
                }

                const cropData = {
                    x: (image.width - cropWidth) / 2,
                    y: (image.height - cropHeight) / 2,
                    width: cropWidth,
                    height: cropHeight,
                };

                const croppedFile = await createCroppedImage(imageUrl, cropData, file.name);

                setFilesWithCrops(new Map([
                    [file.name, { original: file, cropped: croppedFile }]
                ]));

                onFilesChange([file], false);
            };
            // set image src
            image.src = imageUrl;
        } catch (err) {
            console.log(err);
            toast.error("Error loading module");
        } finally {
            setIsGenerating(false);
        }
    }

    const handleSaveCover = async () => {
        const file = files?.length > 0 ? files[0] : null;

        // check file
        if (!file) {
            toast.error("Tidak ada file yang dipilih");
            return;
        }

        setLoading(true);

        // Ambil file yang sudah di-crop dari filesWithCrops
        const fileWithCrop = filesWithCrops.get(file.name);
        const fileToUpload = fileWithCrop?.cropped || file; // Gunakan cropped jika ada, fallback ke original

        // create form
        const formData = new FormData();
        // insert cropped file
        formData.append('cover_file', fileToUpload);

        try {
            const response = await fetch(`${API_URL}/office/trainings/${module?.uuid}/update-cover`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${api.token}`,
                },
                body: formData,
            });

            const data = await response.json();

            if (data?.success) {
                toast.success(data?.message || "Berhasil mengunggah file");

                // Update coverUrl dengan file yang baru di-upload
                //const uploadedFileUrl = URL.createObjectURL(fileToUpload);
                setCoverUrl(data?.data?.cover_page);

                // Reset files setelah sukses
                setFiles([]);
                setFilesWithCrops(new Map());
            } else {
                toast.error(data?.message || "Upload gagal");
            }

        } catch (error) {
            console.error('Upload error:', error);
            toast.error(error.message || "Terjadi kesalahan saat upload file");
        } finally {
            setLoading(false);
        }
    }

    return (
        <GradientGenerate isGenerating={isGenerating} borderRadius="15px">
            <div className='rounded-xl bg-card text-card-foreground shadow-sm'>
                <div className='flex flex-col p-4'>
                    <h4 className='font-semibold text-sm'>Cover Page</h4>
                    <p className='text-xs text-muted-foreground'>Gunakan untuk thumbnail dan cover page</p>
                </div>
                <div className='border-t border-dashed border-border'>
                    {coverUrl ? (
                        <div className="flex flex-col">
                            <div className="p-4 relative">
                                <div className="aspect-256/211 relative rounded-sm overflow-hidden">
                                    <ImageZoom src={coverUrl}>
                                        <div className="relative aspect-256/211">
                                            <img
                                                src={coverUrl}
                                                alt="Cover Page"
                                                className="object-cover"
                                                loading="eager"
                                                //fill
                                                quality={50}
                                            />
                                        </div>
                                    </ImageZoom>
                                </div>
                            </div>
                            <div className="flex flex-1 items-center justify-end w-full px-4 py-3 border-t border-dashed border-border">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="outline" size="sm" onClick={handleDeleteCover}>
                                            <Trash />
                                            <span>Ubah</span>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Hapus Cover</p>
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                        </div>
                    ) : (
                        <FileUpload
                            maxFiles={1}
                            maxSize={5 * 1024 * 1024}
                            className="w-full gap-0"
                            value={files}
                            onValueChange={onFilesChange}
                            onFileReject={onFileReject}
                            multiple={false}
                            accept="image/png,image/jpeg"
                        >
                            {files.length === 0 && (
                                <>
                                    <div className="p-4">
                                        {isGenerating ? (
                                            <div className="aspect-256/211 flex items-center justify-center bg-linear-to-tr from-cyan-50 to-pink-100 rounded-lg">
                                                <SparkleLoader size="xs" />
                                            </div>
                                        ) : (
                                            <FileUploadDropzone className="aspect-256/211">
                                                <div className="flex flex-col items-center gap-1 text-center">
                                                <div className="flex items-center justify-center rounded-xl border border-border p-2.5 bg-background">
                                                        <Upload className="size-5 text-muted-foreground" />
                                                    </div>
                                                    <p className="font-medium text-sm">Seret & lepas file di sini</p>
                                                    <p className="text-muted-foreground text-xs">
                                                        Atau klik untuk memilih file ( ukuran maks. 5 MB )
                                                    </p>
                                                </div>
                                                <FileUploadTrigger asChild>
                                                    <Button variant="outline" size="sm" className="mt-2 w-fit">
                                                        Browse files
                                                    </Button>
                                                </FileUploadTrigger>
                                            </FileUploadDropzone>
                                        )}
                                    </div>
                                    {(!coverUrl && initialCoverUrl) && (
                                        <ResetSaveRender isGenerating={isGenerating} resetCoverDefault={resetCoverDefault} handleGenerateCover={handleGenerateCover} handleSaveCover={handleSaveCover} />
                                    )}
                                </>
                            )}
                            <FileUploadList>
                                {files.map((file, index) => {
                                    const fileWithCrop = filesWithCrops.get(file.name);
                                    return (
                                        <FileUploadItem key={index} value={file} className="flex-col flex border-0 p-0 gap-0">
                                            <div className="p-4">
                                                <FileUploadItemPreview
                                                    className="aspect-256/211 size-auto border-0"
                                                    render={(originalFile, fallback) => {
                                                        if (
                                                            fileWithCrop?.cropped &&
                                                            originalFile.type.startsWith("image/")
                                                        ) {
                                                            const url = URL.createObjectURL(fileWithCrop.cropped);
                                                            return (
                                                                <ImageZoom src={url} disabled={showCropDialog}>
                                                                    <img
                                                                        src={url}
                                                                        alt={originalFile.name}
                                                                        className="size-full object-cover"
                                                                    />
                                                                </ImageZoom>
                                                            );
                                                        }

                                                        return fallback();
                                                    }}
                                                />
                                            </div>
                                            <div className="flex flex-1 items-center justify-between w-full ps-3 pe-4 py-3 gap-2 border-t border-dashed border-border">
                                                <div className="size-10 flex items-center justify-center bg-amber-50 rounded-xl">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-amber-500">
                                                        <g clipPath="url(#clip0_4418_4381)">
                                                            <path opacity="0.4" d="M22 7.81V13.9L20.37 12.5C19.59 11.83 18.33 11.83 17.55 12.5L13.39 16.07C12.61 16.74 11.35 16.74 10.57 16.07L10.23 15.79C9.52 15.17 8.39 15.11 7.59 15.65L2.67 18.95L2.56 19.03C2.19 18.23 2 17.28 2 16.19V7.81C2 4.17 4.17 2 7.81 2H16.19C19.83 2 22 4.17 22 7.81Z" className="fill-amber-500" />
                                                            <path d="M9.00012 10.3801C10.3146 10.3801 11.3801 9.31456 11.3801 8.00012C11.3801 6.68568 10.3146 5.62012 9.00012 5.62012C7.68568 5.62012 6.62012 6.68568 6.62012 8.00012C6.62012 9.31456 7.68568 10.3801 9.00012 10.3801Z" className="fill-amber-500" />
                                                            <path d="M22.0001 13.8996V16.1896C22.0001 19.8296 19.8301 21.9996 16.1901 21.9996H7.81006C5.26006 21.9996 3.42006 20.9296 2.56006 19.0296L2.67006 18.9496L7.59006 15.6496C8.39006 15.1096 9.52006 15.1696 10.2301 15.7896L10.5701 16.0696C11.3501 16.7396 12.6101 16.7396 13.3901 16.0696L17.5501 12.4996C18.3301 11.8296 19.5901 11.8296 20.3701 12.4996L22.0001 13.8996Z" className="fill-amber-500" />
                                                        </g>
                                                        <defs>
                                                            <clipPath id="clip0_4418_4381">
                                                                <rect width="24" height="24" fill="white" />
                                                            </clipPath>
                                                        </defs>
                                                    </svg>
                                                </div>
                                                <FileUploadItemMetadata />
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="size-8"
                                                            onClick={() => onFileSelect(file)}
                                                        >
                                                            <Crop />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Crop Image</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <FileUploadItemDelete asChild>
                                                            <Button variant="ghost" size="icon" className="size-7">
                                                                <X />
                                                            </Button>
                                                        </FileUploadItemDelete>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Hapus Cover</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </div>
                                            <ResetSaveRender isGenerating={isGenerating} resetCoverDefault={resetCoverDefault} handleGenerateCover={handleGenerateCover} handleSaveCover={handleSaveCover} />
                                        </FileUploadItem>
                                    );
                                })}
                            </FileUploadList>
                        </FileUpload>
                    )}
                    {/* Crop Dialog */}
                    <Dialog open={showCropDialog} onOpenChange={onCropDialogOpenChange}>
                        <DialogContent className="max-w-4xl">
                            <DialogHeader>
                                <DialogTitle>Crop Image</DialogTitle>
                                <DialogDescription>
                                    Sesuaikan area crop dengan aspect ratio 256:211 untuk {selectedFile?.name}
                                </DialogDescription>
                            </DialogHeader>
                            {selectedFile && selectedImageUrl && (
                                <div className="flex flex-col gap-4">
                                    <Cropper
                                        aspectRatio={256 / 211}
                                        crop={crop}
                                        onCropChange={setCrop}
                                        zoom={zoom}
                                        onZoomChange={setZoom}
                                        onCropAreaChange={onCropAreaChange}
                                        onCropComplete={onCropComplete}
                                        className="h-96"
                                    >
                                        <CropperImage
                                            src={selectedImageUrl}
                                            alt={selectedFile.name}
                                            crossOrigin="anonymous"
                                        />
                                        <CropperArea />
                                    </Cropper>
                                    <div className="flex flex-col gap-2">
                                        <Label className="text-sm">
                                            Zoom: {zoom.toFixed(2)}
                                        </Label>
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
                </div>
            </div>
        </GradientGenerate>
    );
};
