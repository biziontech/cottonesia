'use client'

import { X, Upload, LayersPlus, FileSymlink, Save, File, Trash2, ScreenShare, RefreshCw, RefreshCcw, Check, FileCheck, Edit2, FilePen } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { FileUpload, FileUploadDropzone, FileUploadItem, FileUploadItemDelete, FileUploadItemMetadata, FileUploadItemProgress, FileUploadItemPreview, FileUploadList, FileUploadTrigger } from "@/components/ui/file-upload";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ModuleWorkspaceTitle } from "@/components/partials/modules/ModuleWorkspaceTitle";
import { useModule } from "@/contexts/ModuleContext";
import { Button } from "@/components/ui/button";
import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import api from '@/lib/api';
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useConversion } from '@/hooks/use-conversion';
import dynamic from "next/dynamic";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const PdfPreview = dynamic(() => import("@/components/partials/PdfPreview"), {
    ssr: false,
    loading: () => (
        <div className="flex items-center justify-center aspect-video">
            <div className="w-full h-full bg-white animate-pulse rounded-lg flex items-center justify-center">
                <div className="flex items-center gap-2">
                    <Spinner />
                    <span className="text-xs">Memuat File Pdf...</span>
                </div>
            </div>
        </div>
    )
});

export const HomeRibbonMateri = () => {
    const { module, setModule, staff, moduleTemp, setModuleTemp, active, setActive } = useModule();
    const { progress } = useConversion(module?.uuid);
    const [files, setFiles] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingSave, setLoadingSave] = useState(false);
    const [loadingTempDelete, setLoadingTempDelete] = useState(false);
    const [openPreview, setOpenPreview] = useState(false);
    const [selectedFilePdf, setSelectedFilePdf] = useState(null);
    const [modalDelete, setModalDelete] = useState(false);
    const [isConverting, setIsConverting] = useState(false);
    const [conversionJob, setConversionJob] = useState(null);
    const [conversionStarted, setConversionStarted] = useState(false);
    const [conversionLog, setConversionLog] = useState(null);

    useEffect(() => {
        if (!progress || !conversionStarted) return;

        const { status, processed_pages, total_pages, progress: persen, metadata, error_message } = progress;

        if (status === "processing") {
            const estimasi = metadata?.estimated_remaining != null
                ? ` • Estimasi sisa: ${metadata.estimated_remaining}s`
                : "";

            setConversionLog(
                `Memproses halaman ${processed_pages} dari ${total_pages}${estimasi} — ${persen}%`
            );
        } else if (status === "completed") {
            setConversionLog(`Konversi selesai. Semua ${total_pages} halaman berhasil diproses — 100%`);
            setConversionStarted(false);
        } else if (status === "error" || error_message) {
            setConversionLog(`Gagal mengkonversi: ${error_message || "Kesalahan tidak diketahui"}`);
            setConversionStarted(false);
        }

        // set module conversion job 
        setModule(prev => ({
            ...prev,
            conversion_job: {
                ...prev.conversion_job,
                status,
                processed_pages,
                total_pages,
                progress: persen,
                metadata,
                error_message
            }
        }));
        // set conversionJob
        setConversionJob(prev => ({
            ...prev,
            status,
            processed_pages,
            total_pages,
            progress: persen,
            metadata,
            error_message
        }));
    }, [progress, conversionStarted]);

    useEffect(() => {
        // set convertion jobs
        setConversionJob(module?.conversion_job || null);
        // check convertsion module status log
        if (module?.conversion_job) {
            if (module?.conversion_job?.status === "processing") {
                setConversionStarted(true);

                // Hitung estimasi (sama seperti useEffect pertama)
                const startedAt = new Date(module?.conversion_job?.started_at).getTime();
                const processingTime = Math.round((Date.now() - startedAt) * 100) / 100;
                const estimasi_count = Math.round(
                    (module?.conversion_job?.total_pages - module?.conversion_job?.processed_pages) *
                    (processingTime / 1000) * 10
                ) / 10;

                const estimasi_main = estimasi_count != null && !isNaN(estimasi_count)
                    ? ` • Estimasi sisa: ${estimasi_count}s`
                    : "";

                const estimasi = module?.conversion_job?.metadata?.estimated_remaining != null
                    ? ` • Estimasi sisa: ${module?.conversion_job?.metadata.estimated_remaining}s`
                    : estimasi_main;

                setConversionLog(
                    `Memproses halaman ${module?.conversion_job?.processed_pages} dari ${module?.conversion_job?.total_pages}${estimasi} — ${module?.conversion_job?.progress}%`
                );
            } else if (module?.conversion_job?.status === "completed") {
                setConversionLog(`Konversi selesai. Semua ${module?.conversion_job?.total_pages} halaman berhasil diproses — 100%`);
            } else if (module?.conversion_job?.status === "error" || module?.conversion_job?.error_message) {
                setConversionLog(`Gagal mengkonversi: ${module?.conversion_job?.error_message || "Kesalahan tidak diketahui"}`);
            }
        }
    }, [module]);

    const onUpload = useCallback(
        async (files, { onProgress, onSuccess, onError }) => {
            setIsUploading(true);
            setIsSuccess(false);
            setIsError(false);

            try {
                const uploadPromises = files.map(async (file) => {
                    try {
                        const totalChunks = 10;
                        let uploadedChunks = 0;

                        for (let i = 0; i < totalChunks; i++) {
                            await new Promise((resolve) =>
                                setTimeout(resolve, Math.random() * 200 + 100)
                            );

                            uploadedChunks++;
                            const currentProgress =
                                (uploadedChunks / totalChunks) * 100;

                            onProgress(file, currentProgress);
                        }

                        await new Promise((resolve) => setTimeout(resolve, 500));
                        onSuccess(file);
                    } catch (err) {
                        setIsError(true);
                        onError(
                            file,
                            err instanceof Error ? err : new Error("Upload failed")
                        );
                        throw err;
                    }
                });

                await Promise.all(uploadPromises);
                setIsSuccess(true);
            } catch (error) {
                console.error("Unexpected error during upload:", error);
            } finally {
                setIsUploading(false);
            }
        },
        []
    );

    const onFilesChange = useCallback((newFiles, dialogCrop = true) => {
        setFiles(newFiles);
    }, []);

    const onFileReject = useCallback((file, message) => {
        toast(message, {
            description: `"${file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name}" has been rejected`,
        });
    }, []);

    const middleEllipsis = (str, start = 18, end = 8, ellipsis = '.....') => {
        if (!str || str.length <= start + end) return str;

        return (
            str.slice(0, start) +
            ellipsis +
            str.slice(-end)
        );
    };

    const handleSaveModule = () => {
        // Validasi file sudah dikonversi
        if (conversionJob?.status !== "completed") {
            toast.error("File belum dikonversi sepenuhnya");
            return;
        }
        setLoadingSave(true);
        // save loading
        setTimeout(() => {
            setLoadingSave(false);
            setModuleTemp(prev => ({
                ...prev,
                module_save: true
            }));
        }, 1000);
    }

    const handleUploadFile = async () => {
        const file = files?.length > 0 ? files[0] : null;
        if (!file) {
            toast.error("Tidak ada file yang dipilih");
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(`${API_URL}/office/trainings/${module?.uuid}/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${api.token}`,
                },
                body: formData,
            });

            const data = await response.json();

            if (data?.success) {
                toast.success(data?.message || "Berhasil mengunggah file");
                setFiles([]); // Reset files setelah sukses
                setModule(prev => ({
                    ...prev,
                    temp_file: data?.data?.temp_file
                }));
            } else {
                toast.error(data?.message || "Upload gagal");
            }

        } catch (error) {
            toast.error(error.message || "Terjadi kesalahan saat upload file");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteTemp = async () => {
        setLoadingTempDelete(true);
        setModalDelete(false);
        try {
            const response = await api.fetch(`${API_URL}/office/trainings/${module?.uuid}/delete-temp-file`, {
                method: "DELETE"
            });
            // response success
            if (response?.success) {
                // set jika berhasil
                setModule(response?.data);
                setConversionJob(response?.data?.conversion_job || null);
                setConversionLog(null);
                // success alert
                toast.success(response?.message || "Berhasil menghapus file temp");
            } else {
                toast.error(response?.message || "Error loading data");
            }
        } catch (error) {
            console.error("Error menghapus file :", error);
        } finally {
            setLoadingTempDelete(false);
        }
    }

    const handleDeleteOriginal = async () => {
        setLoadingTempDelete(true);
        setModalDelete(false);
        try {
            const response = await api.fetch(`${API_URL}/office/trainings/${module?.uuid}/delete-original-file`, {
                method: "DELETE"
            });
            // response success
            if (response?.success) {
                // set jika berhasil
                setModule(response?.data);
                setConversionJob(response?.data?.conversion_job || null);
                setConversionLog(null);
                // success alert
                toast.success(response?.message || "Berhasil menghapus file temp");
            } else {
                toast.error(response?.message || "Error loading data");
            }
        } catch (error) {
            console.error("Error menghapus file :", error);
        } finally {
            setLoadingTempDelete(false);
        }
    }

    const handleConvertFile = async () => {
        // Validasi file temp ada
        if (!module?.temp_file?.exists) {
            toast.error("File belum diupload");
            return;
        }

        setIsConverting(true);

        try {
            const response = await api.fetch(`${API_URL}/office/trainings/${module?.uuid}/convert`, {
                method: 'POST',
                body: JSON.stringify({
                    fileName: module?.temp_file?.filename || 'source.pdf',
                }),
            });

            // Cek response sukses
            if (!response?.success) {
                throw new Error(response?.message || 'Gagal memulai konversi');
            }
            // success alert
            toast.success(response?.message || "Konversi dimulai");

            // Set state untuk tracking konversi
            setConversionStarted(true);
        } catch (error) {
            console.error('Convert error:', error);
            toast.error(error.message || "Terjadi kesalahan saat memulai konversi");
        } finally {
            setIsConverting(false);
        }
    }

    const handleConvertToSlides = async () => {
        // Set state untuk tracking konversi
        setConversionStarted(true);
        try {
            const response = await api.fetch(`${API_URL}/office/trainings/${module?.uuid}/convert-to-slides`, {
                method: 'POST',
                body: JSON.stringify({
                    fileName: module?.temp_file?.filename || 'source.pdf',
                }),
            });

            // Cek response sukses
            if (!response?.success) {
                throw new Error(response?.message || 'Gagal memulai konversi');
            }
            // success alert
            toast.success(response?.message || "Berhasil membuat slide");

        } catch (error) {
            console.error('Convert error:', error);
            toast.error(error.message || "Terjadi kesalahan saat memulai konversi");
        } finally {
            setIsConverting(false);
        }
    }

    return (
        <>
            <ModuleWorkspaceTitle />

            <div className="flex flex-col">
                {module?.temp_file?.exists ? (
                    <div className="flex p-4 rounded-xl bg-white shadow-sm flex-col border-0 gap-0 aspect-video items-center justify-center">
                        <div className={`transition-colors bg-linear-to-tr duration-500 ${loadingTempDelete ? 'from-red-50 via-white to-red-50' : (isConverting || conversionStarted) ? ' from-gray-50 via-white to-gray-50' : 'from-gray-50 via-white to-gray-50'} w-full h-full flex items-center justify-center rounded-xl`}>
                            <div className="flex flex-col items-center gap-4 py-5">
                                <div className="flex gap-5 items-end">
                                    {conversionJob?.status == "completed" ? (
                                        <div className="relative w-fit h-fit">
                                            <svg className="size-12" viewBox="0 0 65 96" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <g clipPath="url(#clip0_203_38)">
                                                    <path opacity="0.06" d="M64.8827 80.187H11.6072C8.40675 80.187 5.8125 77.5926 5.8125 74.3923V5.79469C5.8125 2.59444 8.40675 0 11.6072 0H64.8827C68.0831 0 70.6774 2.59444 70.6774 5.79469V74.3921C70.6774 77.5926 68.0829 80.187 64.8827 80.187Z" fill="#000201" />
                                                    <path d="M64.8827 0H59.088C62.2885 0 64.8827 2.59444 64.8827 5.79469V74.3921C64.8827 77.5926 62.2883 80.1868 59.088 80.1868H64.8827C68.0831 80.1868 70.6774 77.5924 70.6774 74.3921V5.79469C70.6774 2.59444 68.083 0 64.8827 0V0Z" fill="#BCC6C5" />
                                                    <path d="M70.6961 95.9999H5.79469C2.59444 95.9999 0 93.4055 0 90.2052V43.4607C0 40.2603 2.59444 37.666 5.79469 37.666H34.062C36.3666 37.666 38.3752 39.2345 38.9342 41.47L39.9294 45.4514C40.4884 47.6871 42.4971 49.2554 44.8016 49.2554H70.6959C73.8964 49.2554 76.4906 51.8498 76.4906 55.0501V90.205C76.491 93.4055 73.8966 95.9999 70.6961 95.9999Z" className="fill-orange-500/90" />
                                                    <path d="M33.1404 41.47L34.1356 45.4514C34.6946 47.6871 36.7033 49.2554 39.0078 49.2554H44.8025C42.4981 49.2554 40.4893 47.687 39.9303 45.4514L38.9351 41.47C38.3761 39.2343 36.3674 37.666 34.0629 37.666H28.2682C30.5728 37.6658 32.5814 39.2343 33.1404 41.47Z" className="fill-orange-500" />
                                                    <path d="M70.6975 49.2559H64.9028C68.1033 49.2559 70.6975 51.8503 70.6975 55.0505V90.2055C70.6975 93.4059 68.1031 96.0002 64.9028 96.0002H70.6975C73.898 96.0002 76.4922 93.4057 76.4922 90.2055V55.0507C76.4924 51.8503 73.898 49.2559 70.6975 49.2559Z" className="fill-orange-500" />
                                                    <path d="M53.6819 71.1047H50.3349V67.6971H54.0957C54.8958 67.6971 55.5444 67.0485 55.5444 66.2484C55.5444 65.4484 54.8958 64.7998 54.0957 64.7998H48.8862C48.0862 64.7998 47.4376 65.4484 47.4376 66.2484V79.1017C47.4376 79.9018 48.0862 80.5504 48.8862 80.5504C49.6863 80.5504 50.3349 79.9018 50.3349 79.1017V74.0021H53.6819C54.482 74.0021 55.1306 73.3536 55.1306 72.5535C55.1307 71.7534 54.482 71.1047 53.6819 71.1047Z" fill="white" />
                                                    <path d="M38.6536 65.0879H35.0948C34.306 65.0838 33.6411 65.7513 33.6462 66.5394V66.5495V66.5499V78.8979C33.6389 79.7468 34.2087 80.5507 35.1203 80.5507H35.1258C35.2332 80.5503 37.7699 80.5405 38.7829 80.5229C42.4876 80.458 45.1763 77.2184 45.1763 72.8195C45.1763 68.1948 42.5551 65.0879 38.6536 65.0879ZM38.7323 77.6257C38.2364 77.6343 37.3401 77.6412 36.5641 77.6459C36.5523 73.9808 36.5523 71.7569 36.5461 67.9853H38.6534C41.3264 67.9853 42.2789 70.4823 42.2789 72.8193C42.2789 76.0966 40.4976 77.5947 38.7323 77.6257Z" fill="white" />
                                                    <path d="M26.0004 64.7043H22.3949C21.6787 64.6901 20.9161 65.3386 20.9463 66.153V79.101C20.9463 79.901 21.5949 80.5496 22.3949 80.5496C23.195 80.5496 23.8436 79.901 23.8436 79.101V74.9175C24.6108 74.9133 25.5018 74.9094 26.0004 74.9094C28.8534 74.9094 31.1746 72.6204 31.1746 69.8068C31.1746 66.9933 28.8534 64.7043 26.0004 64.7043ZM26.0004 72.0121C25.5056 72.0121 24.6254 72.0161 23.8608 72.02C23.8569 71.231 23.8505 68.4266 23.8481 67.6016H26.0004C27.2345 67.6016 28.2772 68.6115 28.2772 69.8068C28.2772 71.0021 27.2345 72.0121 26.0004 72.0121Z" fill="white" />
                                                    <path d="M59.8691 17.3845H16.6204C16.0869 17.3845 15.6545 16.9521 15.6545 16.4187V9.65819C15.6545 9.12476 16.0869 8.69238 16.6204 8.69238H59.8689C60.4024 8.69238 60.8347 9.12476 60.8347 9.65819V16.4187C60.8347 16.9521 60.4024 17.3845 59.8691 17.3845Z" fill="#BCC6C5" />
                                                    <path d="M60.8362 27.5252H15.656C14.856 27.5252 14.2074 26.8766 14.2074 26.0766C14.2074 25.2765 14.856 24.6279 15.656 24.6279H60.8362C61.6363 24.6279 62.2848 25.2765 62.2848 26.0766C62.2848 26.8766 61.6363 27.5252 60.8362 27.5252Z" fill="#BCC6C5" />
                                                    <path d="M60.8362 33.3201H15.656C14.856 33.3201 14.2074 32.6715 14.2074 31.8715C14.2074 31.0714 14.856 30.4229 15.656 30.4229H60.8362C61.6363 30.4229 62.2848 31.0714 62.2848 31.8715C62.285 32.6715 61.6363 33.3201 60.8362 33.3201Z" fill="#BCC6C5" />
                                                    <path d="M60.8363 39.115H44.6299C43.8298 39.115 43.1813 38.4665 43.1813 37.6664C43.1813 36.8663 43.8298 36.2178 44.6299 36.2178H60.8363C61.6363 36.2178 62.2849 36.8663 62.2849 37.6664C62.2849 38.4665 61.6363 39.115 60.8363 39.115Z" fill="#BCC6C5" />
                                                    <path d="M60.8363 44.909H44.6299C43.8298 44.909 43.1813 44.2604 43.1813 43.4603C43.1813 42.6603 43.8298 42.0117 44.6299 42.0117H60.8363C61.6363 42.0117 62.2849 42.6603 62.2849 43.4603C62.2849 44.2604 61.6363 44.909 60.8363 44.909Z" fill="#BCC6C5" />
                                                </g>
                                                <defs>
                                                    <clipPath id="clip0_203_38">
                                                        <rect width="76.5" height="96" fill="white" />
                                                    </clipPath>
                                                </defs>
                                            </svg>
                                            <div className="absolute border-3 border-white top-3 -right-3 flex size-6 items-center justify-center rounded-full bg-green-500 text-white">
                                                <Check className="size-3" />
                                            </div>
                                        </div>
                                    ) : (
                                        <svg className="size-12" viewBox="0 0 65 96" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <g clipPath="url(#clip0_203_38)">
                                                <path opacity="0.06" d="M64.8827 80.187H11.6072C8.40675 80.187 5.8125 77.5926 5.8125 74.3923V5.79469C5.8125 2.59444 8.40675 0 11.6072 0H64.8827C68.0831 0 70.6774 2.59444 70.6774 5.79469V74.3921C70.6774 77.5926 68.0829 80.187 64.8827 80.187Z" fill="#000201" />
                                                <path d="M64.8827 0H59.088C62.2885 0 64.8827 2.59444 64.8827 5.79469V74.3921C64.8827 77.5926 62.2883 80.1868 59.088 80.1868H64.8827C68.0831 80.1868 70.6774 77.5924 70.6774 74.3921V5.79469C70.6774 2.59444 68.083 0 64.8827 0V0Z" fill="#BCC6C5" />
                                                <path d="M70.6961 95.9999H5.79469C2.59444 95.9999 0 93.4055 0 90.2052V43.4607C0 40.2603 2.59444 37.666 5.79469 37.666H34.062C36.3666 37.666 38.3752 39.2345 38.9342 41.47L39.9294 45.4514C40.4884 47.6871 42.4971 49.2554 44.8016 49.2554H70.6959C73.8964 49.2554 76.4906 51.8498 76.4906 55.0501V90.205C76.491 93.4055 73.8966 95.9999 70.6961 95.9999Z" className="fill-orange-500/90" />
                                                <path d="M33.1404 41.47L34.1356 45.4514C34.6946 47.6871 36.7033 49.2554 39.0078 49.2554H44.8025C42.4981 49.2554 40.4893 47.687 39.9303 45.4514L38.9351 41.47C38.3761 39.2343 36.3674 37.666 34.0629 37.666H28.2682C30.5728 37.6658 32.5814 39.2343 33.1404 41.47Z" className="fill-orange-500" />
                                                <path d="M70.6975 49.2559H64.9028C68.1033 49.2559 70.6975 51.8503 70.6975 55.0505V90.2055C70.6975 93.4059 68.1031 96.0002 64.9028 96.0002H70.6975C73.898 96.0002 76.4922 93.4057 76.4922 90.2055V55.0507C76.4924 51.8503 73.898 49.2559 70.6975 49.2559Z" className="fill-orange-500" />
                                                <path d="M53.6819 71.1047H50.3349V67.6971H54.0957C54.8958 67.6971 55.5444 67.0485 55.5444 66.2484C55.5444 65.4484 54.8958 64.7998 54.0957 64.7998H48.8862C48.0862 64.7998 47.4376 65.4484 47.4376 66.2484V79.1017C47.4376 79.9018 48.0862 80.5504 48.8862 80.5504C49.6863 80.5504 50.3349 79.9018 50.3349 79.1017V74.0021H53.6819C54.482 74.0021 55.1306 73.3536 55.1306 72.5535C55.1307 71.7534 54.482 71.1047 53.6819 71.1047Z" fill="white" />
                                                <path d="M38.6536 65.0879H35.0948C34.306 65.0838 33.6411 65.7513 33.6462 66.5394V66.5495V66.5499V78.8979C33.6389 79.7468 34.2087 80.5507 35.1203 80.5507H35.1258C35.2332 80.5503 37.7699 80.5405 38.7829 80.5229C42.4876 80.458 45.1763 77.2184 45.1763 72.8195C45.1763 68.1948 42.5551 65.0879 38.6536 65.0879ZM38.7323 77.6257C38.2364 77.6343 37.3401 77.6412 36.5641 77.6459C36.5523 73.9808 36.5523 71.7569 36.5461 67.9853H38.6534C41.3264 67.9853 42.2789 70.4823 42.2789 72.8193C42.2789 76.0966 40.4976 77.5947 38.7323 77.6257Z" fill="white" />
                                                <path d="M26.0004 64.7043H22.3949C21.6787 64.6901 20.9161 65.3386 20.9463 66.153V79.101C20.9463 79.901 21.5949 80.5496 22.3949 80.5496C23.195 80.5496 23.8436 79.901 23.8436 79.101V74.9175C24.6108 74.9133 25.5018 74.9094 26.0004 74.9094C28.8534 74.9094 31.1746 72.6204 31.1746 69.8068C31.1746 66.9933 28.8534 64.7043 26.0004 64.7043ZM26.0004 72.0121C25.5056 72.0121 24.6254 72.0161 23.8608 72.02C23.8569 71.231 23.8505 68.4266 23.8481 67.6016H26.0004C27.2345 67.6016 28.2772 68.6115 28.2772 69.8068C28.2772 71.0021 27.2345 72.0121 26.0004 72.0121Z" fill="white" />
                                                <path d="M59.8691 17.3845H16.6204C16.0869 17.3845 15.6545 16.9521 15.6545 16.4187V9.65819C15.6545 9.12476 16.0869 8.69238 16.6204 8.69238H59.8689C60.4024 8.69238 60.8347 9.12476 60.8347 9.65819V16.4187C60.8347 16.9521 60.4024 17.3845 59.8691 17.3845Z" fill="#BCC6C5" />
                                                <path d="M60.8362 27.5252H15.656C14.856 27.5252 14.2074 26.8766 14.2074 26.0766C14.2074 25.2765 14.856 24.6279 15.656 24.6279H60.8362C61.6363 24.6279 62.2848 25.2765 62.2848 26.0766C62.2848 26.8766 61.6363 27.5252 60.8362 27.5252Z" fill="#BCC6C5" />
                                                <path d="M60.8362 33.3201H15.656C14.856 33.3201 14.2074 32.6715 14.2074 31.8715C14.2074 31.0714 14.856 30.4229 15.656 30.4229H60.8362C61.6363 30.4229 62.2848 31.0714 62.2848 31.8715C62.285 32.6715 61.6363 33.3201 60.8362 33.3201Z" fill="#BCC6C5" />
                                                <path d="M60.8363 39.115H44.6299C43.8298 39.115 43.1813 38.4665 43.1813 37.6664C43.1813 36.8663 43.8298 36.2178 44.6299 36.2178H60.8363C61.6363 36.2178 62.2849 36.8663 62.2849 37.6664C62.2849 38.4665 61.6363 39.115 60.8363 39.115Z" fill="#BCC6C5" />
                                                <path d="M60.8363 44.909H44.6299C43.8298 44.909 43.1813 44.2604 43.1813 43.4603C43.1813 42.6603 43.8298 42.0117 44.6299 42.0117H60.8363C61.6363 42.0117 62.2849 42.6603 62.2849 43.4603C62.2849 44.2604 61.6363 44.909 60.8363 44.909Z" fill="#BCC6C5" />
                                            </g>
                                            <defs>
                                                <clipPath id="clip0_203_38">
                                                    <rect width="76.5" height="96" fill="white" />
                                                </clipPath>
                                            </defs>
                                        </svg>
                                    )}

                                    {(isConverting || conversionStarted || conversionJob?.status == "processing") && (
                                        <>
                                            <svg viewBox="0 0 360 168" className="w-16 h-auto">
                                                <circle cx="23" cy="46" r="20" className="dot dot-1" />
                                                <circle cx="93" cy="46" r="20" className="dot dot-2" />
                                                <circle cx="177" cy="46" r="20" className="dot dot-3" />
                                                <circle cx="262" cy="46" r="20" className="dot dot-4" />
                                                <circle cx="333" cy="46" r="20" className="dot dot-5" />
                                            </svg>

                                            <svg className="size-10" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 512 512">
                                                <path d="M0 0 C1.18296661 -0.0071553 2.36593323 -0.01431061 3.58474731 -0.02168274 C4.87931854 -0.02437164 6.17388977 -0.02706055 7.50769043 -0.02983093 C8.88780894 -0.03609913 10.26792577 -0.04274624 11.64804077 -0.04974365 C16.1787194 -0.07075359 20.70939823 -0.08114687 25.2401123 -0.09111023 C26.80372637 -0.09515969 28.36734027 -0.09927666 29.93095398 -0.10346031 C37.28219226 -0.12250951 44.63342054 -0.13673807 51.98467875 -0.14507228 C60.44839285 -0.15482775 68.91184424 -0.18110396 77.37546587 -0.22157317 C83.93024675 -0.25183039 90.48495277 -0.26655043 97.03980207 -0.26985329 C100.9481673 -0.2721939 104.85625182 -0.28102339 108.76454163 -0.30631447 C112.44840946 -0.32976754 116.13181525 -0.33376023 119.81573868 -0.32355309 C121.79344928 -0.32282948 123.77113733 -0.34180127 125.74874878 -0.36161804 C135.93728463 -0.30293214 145.59333431 1.54209226 153.9588623 7.70967102 C154.77870605 8.28846008 155.5985498 8.86724915 156.4432373 9.46357727 C165.81251284 18.55495056 171.07683139 30.26848607 176.7088623 41.83467102 C177.53864733 43.51938117 178.36937015 45.20362975 179.2010498 46.8874054 C181.2144884 50.9687615 183.21519127 55.05612488 185.2088623 59.14717102 C186.4904658 59.14771579 187.7720693 59.14826056 189.09250927 59.14882183 C219.55267321 59.1628826 250.01268328 59.20270807 280.47276286 59.27402664 C284.22634832 59.28279282 287.97993425 59.29134273 291.73352051 59.29975891 C292.48075478 59.30143797 293.22798905 59.30311704 293.99786679 59.30484698 C306.07826268 59.331477 318.15861112 59.34060919 330.23903336 59.34321245 C342.64556839 59.34627783 355.0519668 59.36829192 367.45844012 59.40769559 C375.10667525 59.43139565 382.75463718 59.44052316 390.40290389 59.43068413 C396.27928301 59.42471249 402.15538916 59.44517446 408.03170013 59.47523117 C410.43377367 59.48344478 412.83589381 59.48323776 415.23796272 59.47376823 C433.28926829 59.4096764 446.25565222 60.83630634 459.8807373 73.72920227 C466.83451173 81.09518497 471.32287791 90.80542639 471.34587669 100.91295528 C471.35095124 102.09725689 471.35602578 103.28155849 471.3612541 104.50174803 C471.36200073 106.45535327 471.36200073 106.45535327 471.36276245 108.44842529 C471.3667782 109.84504587 471.37121662 111.24166529 471.37604201 112.63828331 C471.38800116 116.48068221 471.39365445 120.32306855 471.39822316 124.1654824 C471.40418188 128.30817543 471.41579118 132.45085347 471.42651367 136.59353638 C471.45103347 146.60165432 471.46566523 156.60977722 471.47857374 166.61791596 C471.48228631 169.44548479 471.4862595 172.27305312 471.4903264 175.10062146 C471.51556613 192.66495064 471.53761611 210.22928061 471.55005455 227.79362392 C471.55298418 231.86191244 471.55594585 235.93020093 471.55895996 239.99848938 C471.55970601 241.00962636 471.56045206 242.02076334 471.56122072 243.06254084 C471.5738676 259.4332689 471.60708174 275.80388819 471.64876179 292.17456543 C471.69121806 308.98821006 471.71475394 325.80179908 471.71997511 342.61549717 C471.72338529 352.05318155 471.73509387 361.49069602 471.76807785 370.92832756 C471.79613043 378.96808322 471.80705494 387.00763413 471.79588239 395.04743492 C471.79070881 399.14635125 471.79349712 403.24483917 471.81834793 407.34369278 C471.8409542 411.10389584 471.8400137 414.86336559 471.82114406 418.62358249 C471.81705132 420.61205846 471.83740552 422.60053969 471.85893095 424.58890337 C471.73804355 438.39945408 467.02790401 448.88408497 457.62683105 458.81904602 C449.62426708 466.37377795 439.69663515 470.3028813 428.85010624 470.28418541 C428.10312445 470.28683724 427.35614266 470.28948906 426.58652505 470.29222125 C424.06943529 470.2999149 421.55239432 470.30047345 419.03529358 470.30107117 C417.21794365 470.30508576 415.40059461 470.30952397 413.58324665 470.31435072 C408.57788705 470.32632267 403.57253709 470.33196613 398.56716597 470.33653188 C393.17292944 470.34248569 387.77870446 470.35409616 382.38447571 470.36482239 C369.35074534 470.38935254 356.31701114 470.403975 343.28326479 470.41688246 C339.60205309 470.42059412 335.92084178 470.42456738 332.23963046 470.42863512 C309.38141203 470.45387275 286.52319301 470.47592662 263.66496372 470.48836327 C258.36945659 470.49129298 253.07394947 470.49425464 247.77844238 470.49726868 C245.80417285 470.49838775 245.80417285 470.49838775 243.79001909 470.49952944 C222.47240618 470.51218093 201.15489365 470.54540076 179.83731628 470.58707051 C157.95217615 470.62949902 136.06707873 470.65305942 114.18189758 470.65828383 C101.8937714 470.66169703 89.60577559 470.67344155 77.3176899 470.70638657 C66.85151233 470.73440084 56.38549185 470.74538031 45.9192797 470.7341911 C40.58093839 470.72900794 35.242926 470.73186933 29.90463257 470.75665665 C25.01202573 470.77918441 20.11998341 470.77838169 15.22736644 470.75945278 C13.46279024 470.75665772 11.69817547 470.76222364 9.93366117 470.77726571 C-5.8447523 470.90348645 -17.72040188 467.67672243 -29.4630127 456.56513977 C-36.78427183 448.80988847 -40.90776308 438.99942963 -40.92815208 428.44434452 C-40.93080391 427.76827442 -40.93345574 427.09220433 -40.93618792 426.39564726 C-40.94387547 424.11977912 -40.94443989 421.84396498 -40.94503784 419.56808472 C-40.94905284 417.9239763 -40.95349112 416.27986887 -40.9583174 414.63576263 C-40.97028487 410.10926919 -40.97593177 405.58278641 -40.98049855 401.05628026 C-40.98645408 396.17738529 -40.99806414 391.29850307 -41.00878906 386.4196167 C-41.03331559 374.63172662 -41.04794131 362.84383231 -41.06084913 351.05592456 C-41.06456111 347.72621288 -41.06853434 344.39650161 -41.0726018 341.06679034 C-41.09784016 320.38840859 -41.11989267 299.71002618 -41.13232994 279.03163242 C-41.13525963 274.2414506 -41.13822129 269.4512688 -41.14123535 264.66108704 C-41.1419814 263.47051317 -41.14272745 262.2799393 -41.14349611 261.05328744 C-41.15614599 241.77263053 -41.18936384 222.49206591 -41.23103718 203.21145213 C-41.2734754 183.41457486 -41.29702723 163.61774482 -41.3022505 143.82082218 C-41.30566265 132.70640841 -41.31739461 121.59213883 -41.35035324 110.47776985 C-41.3783809 101.01070796 -41.38934115 91.54381981 -41.37815778 82.07671965 C-41.37297797 77.24873218 -41.37581385 72.42110841 -41.40062332 67.59317398 C-41.42317847 63.16685442 -41.42232757 58.7411585 -41.40341945 54.31482755 C-41.40062818 52.71983217 -41.4061691 51.12479393 -41.42123239 49.52986724 C-41.55622003 34.29663656 -37.80693136 22.67497272 -27.20910645 11.47529602 C-19.83070773 4.5098004 -10.12000985 0.04207448 0 0 Z " fill="#C8FEED" transform="translate(40.7911376953125,20.852828979492188)" />
                                                <path d="M0 0 C1.18296661 -0.0071553 2.36593323 -0.01431061 3.58474731 -0.02168274 C4.87931854 -0.02437164 6.17388977 -0.02706055 7.50769043 -0.02983093 C8.88780894 -0.03609913 10.26792577 -0.04274624 11.64804077 -0.04974365 C16.1787194 -0.07075359 20.70939823 -0.08114687 25.2401123 -0.09111023 C26.80372637 -0.09515969 28.36734027 -0.09927666 29.93095398 -0.10346031 C37.28219226 -0.12250951 44.63342054 -0.13673807 51.98467875 -0.14507228 C60.44839285 -0.15482775 68.91184424 -0.18110396 77.37546587 -0.22157317 C83.93024675 -0.25183039 90.48495277 -0.26655043 97.03980207 -0.26985329 C100.9481673 -0.2721939 104.85625182 -0.28102339 108.76454163 -0.30631447 C112.44840946 -0.32976754 116.13181525 -0.33376023 119.81573868 -0.32355309 C121.79344928 -0.32282948 123.77113733 -0.34180127 125.74874878 -0.36161804 C135.93728463 -0.30293214 145.59333431 1.54209226 153.9588623 7.70967102 C154.77870605 8.28846008 155.5985498 8.86724915 156.4432373 9.46357727 C165.81251284 18.55495056 171.07683139 30.26848607 176.7088623 41.83467102 C177.53864733 43.51938117 178.36937015 45.20362975 179.2010498 46.8874054 C181.2144884 50.9687615 183.21519127 55.05612488 185.2088623 59.14717102 C186.4904658 59.14771579 187.7720693 59.14826056 189.09250927 59.14882183 C219.55267321 59.1628826 250.01268328 59.20270807 280.47276286 59.27402664 C284.22634832 59.28279282 287.97993425 59.29134273 291.73352051 59.29975891 C292.48075478 59.30143797 293.22798905 59.30311704 293.99786679 59.30484698 C306.07826268 59.331477 318.15861112 59.34060919 330.23903336 59.34321245 C342.64556839 59.34627783 355.0519668 59.36829192 367.45844012 59.40769559 C375.10667525 59.43139565 382.75463718 59.44052316 390.40290389 59.43068413 C396.27928301 59.42471249 402.15538916 59.44517446 408.03170013 59.47523117 C410.43377367 59.48344478 412.83589381 59.48323776 415.23796272 59.47376823 C433.28926829 59.4096764 446.25565222 60.83630634 459.8807373 73.72920227 C467.67348324 81.98388933 471.37561407 91.98999077 471.3223877 103.12861633 C471.32253372 103.92899323 471.32267975 104.72937012 471.3228302 105.55400085 C471.3221346 108.19446033 471.31435871 110.8348489 471.30651855 113.47529602 C471.30465312 115.30803896 471.30322981 117.14078239 471.30223083 118.973526 C471.29841552 123.79366944 471.28859364 128.61378267 471.27752686 133.43391418 C471.26729155 138.35395397 471.26272867 143.27399865 471.25769043 148.19404602 C471.2469705 157.84510095 471.22990589 167.49613347 471.2088623 177.14717102 C469.66993257 174.10637478 468.30140343 171.02976698 466.9588623 167.89717102 C461.9241502 156.84141431 454.86073017 149.76775684 444.12683105 144.22529602 C434.20590027 140.55973123 424.005532 140.85666834 413.58624268 140.87301636 C411.7932994 140.86855945 410.00035809 140.86324392 408.20741963 140.85714763 C403.29734183 140.84301192 398.38732746 140.8413035 393.47723222 140.84174454 C388.17510061 140.84009246 382.87299485 140.82701879 377.57087708 140.81555176 C365.98618829 140.79273473 354.40151786 140.78478499 342.81680965 140.77972531 C335.57988907 140.77646505 328.34297379 140.76994066 321.10605621 140.76272392 C301.05805508 140.74316383 281.01005887 140.72675565 260.96204758 140.72384739 C259.68000976 140.72365982 258.39797194 140.72347225 257.0770845 140.723279 C254.47825098 140.72291275 251.87941746 140.72254905 249.28058395 140.72218788 C247.99057303 140.72200507 246.70056212 140.72182226 245.37145996 140.72163391 C244.0798699 140.72145336 242.78827983 140.72127281 241.45755067 140.72108679 C220.52575224 140.71754457 199.59405665 140.69051644 178.66229388 140.65313602 C157.1577682 140.6150408 135.65329355 140.59568983 114.14873338 140.59538788 C102.0803231 140.59480365 90.01203557 140.58633383 77.94365692 140.55739021 C67.66868603 140.53286038 57.3938827 140.52560451 47.11889043 140.54063774 C41.87962451 140.54779945 36.64068935 140.54698062 31.40146065 140.52422714 C26.59846629 140.50356849 21.79605557 140.50630169 16.99306706 140.52710199 C15.26230292 140.53058367 13.53149608 140.52574335 11.8007879 140.51139755 C-2.31961617 140.40196462 -14.53876752 142.2774819 -25.60754395 151.98310852 C-33.23150371 159.53887544 -37.87127817 167.53147717 -39.7911377 178.14717102 C-40.1211377 178.14717102 -40.4511377 178.14717102 -40.7911377 178.14717102 C-40.90823903 159.72687073 -40.99625652 141.30666782 -41.05019855 122.88607502 C-41.07591697 114.3319481 -41.11094479 105.77805323 -41.16833496 97.22407532 C-41.21836591 89.76339321 -41.25047489 82.30287926 -41.26158017 74.84203404 C-41.26806587 70.89603699 -41.28317374 66.95052078 -41.31978798 63.00467873 C-41.35406012 59.28060156 -41.3641289 55.55719721 -41.3566761 51.83297729 C-41.35867928 49.83509677 -41.38540939 47.83728731 -41.41323853 45.83959961 C-41.33509868 31.95749787 -36.66027635 21.46319903 -27.20910645 11.47529602 C-19.83070773 4.5098004 -10.12000985 0.04207448 0 0 Z " fill="#3DEFA5" transform="translate(40.7911376953125,20.852828979492188)" />
                                                <path d="M0 0 C4.24440518 2.4928513 6.44776076 5.74502874 9.04272461 9.84448242 C9.53048874 10.58667023 10.01825287 11.32885803 10.52079773 12.09353638 C12.13304429 14.55258866 13.7241052 17.02466482 15.31616211 19.49682617 C16.4617571 21.25035337 17.60917552 23.00269049 18.75830078 24.75390625 C20.56268563 27.50379752 22.36606543 30.254282 24.16416931 33.00828552 C30.07689471 42.05936505 36.12993774 51.01254568 42.19866943 59.95944214 C53.2601647 76.27526923 64.16599529 92.68841863 74.98471069 109.16601562 C85.49009256 125.16187486 96.14587621 141.05192472 106.88842773 156.8894043 C109.64168981 160.94878097 112.37812313 165.0191555 115.10925293 169.09344482 C116.71055136 171.46301805 118.33764513 173.81335384 119.9675293 176.16333008 C120.98809472 177.66594146 122.00798316 179.16901293 123.02709961 180.67260742 C123.73704575 181.67411079 123.73704575 181.67411079 124.46133423 182.69584656 C127.67576296 187.50338697 128.21569326 190.6625607 127.69116211 196.43432617 C127.02709961 198.82495117 127.02709961 198.82495117 126.06616211 200.68432617 C125.61370117 201.62018555 125.61370117 201.62018555 125.15209961 202.57495117 C122.18627776 206.34963353 119.60957908 208.18307852 114.84848416 208.80662072 C111.1391722 208.95519065 107.44047815 208.97279017 103.72938538 208.94898987 C102.28550855 208.9543165 100.84163726 208.96138286 99.39777654 208.97003692 C95.43417688 208.98867599 91.47095054 208.98235506 87.50733531 208.97188389 C83.23116012 208.96489543 78.95506189 208.98088713 74.6789093 208.99388123 C66.30325687 209.01553248 57.92774024 209.01539144 49.55206902 209.00725568 C42.74495463 209.00095784 35.93787988 209.00209073 29.13076591 209.00852776 C28.16222348 209.00942941 27.19368105 209.01033107 26.19578884 209.01126004 C24.22824815 209.01311123 22.26070748 209.01497379 20.29316681 209.0168476 C1.83904951 209.03343003 -16.61499137 209.02470314 -35.06910408 209.00786202 C-51.95462773 208.99316509 -68.83997344 209.00779259 -85.72547417 209.03663219 C-103.0612376 209.06602044 -120.39691888 209.07700011 -137.73270613 209.06744999 C-139.69334605 209.06642743 -141.65398598 209.06543282 -143.61462593 209.06446648 C-144.57930961 209.06399009 -145.5439933 209.0635137 -146.53790982 209.06302287 C-153.33648688 209.06085796 -160.13498624 209.07066692 -166.93354607 209.0852375 C-175.21938745 209.10274777 -183.50500195 209.10266229 -191.79083436 209.07988585 C-196.01861354 209.06873166 -200.24599282 209.06560755 -204.47375488 209.08418655 C-208.3446156 209.1009783 -212.21472722 209.09465881 -216.08553929 209.06996977 C-217.48520275 209.06508168 -218.88492649 209.06861541 -220.28453957 209.08145721 C-228.25735307 209.14932617 -233.38752402 209.04647663 -239.30883789 203.43432617 C-242.48861179 199.84425887 -243.18849341 196.05727949 -243.03540039 191.36010742 C-241.41007311 184.81510672 -236.45404024 179.60353818 -232.30883789 174.43432617 C-231.43310259 173.31091141 -230.55935771 172.18594183 -229.68774414 171.05932617 C-227.90025689 168.75816626 -226.09863568 166.46915606 -224.28540039 164.18823242 C-220.97411388 160.02073228 -217.70144894 155.8236181 -214.43383789 151.62182617 C-213.55115234 150.48692749 -213.55115234 150.48692749 -212.65063477 149.32910156 C-206.98985483 142.04046073 -201.38713798 134.7079808 -195.78881836 127.37133789 C-191.9763025 122.38148292 -188.14031609 117.40962249 -184.30883789 112.43432617 C-183.06117393 110.81280633 -181.81375037 109.19110183 -180.56640625 107.56933594 C-179.72747073 106.47860575 -178.88844065 105.38794829 -178.04931641 104.29736328 C-176.0145414 101.65274901 -173.98102486 99.00719231 -171.94946289 96.36010742 C-168.32031301 91.6339106 -164.68484213 86.91313706 -161.02368164 82.21166992 C-160.44779297 81.47207031 -159.8719043 80.7324707 -159.27856445 79.97045898 C-158.09055205 78.44654827 -156.90109819 76.92376019 -155.71020508 75.40209961 C-152.66822609 71.50658002 -149.66773809 67.58840706 -146.73461914 63.61010742 C-146.15881104 62.83570313 -145.58300293 62.06129883 -144.98974609 61.26342773 C-143.89878144 59.79232885 -142.81727271 58.31415225 -141.74707031 56.82788086 C-138.701042 52.73876005 -136.23561581 50.25334091 -131.30883789 48.43432617 C-125.66128773 47.70561002 -122.06509488 48.31497435 -117.36743164 51.57495117 C-113.43026465 55.13110201 -110.51714036 59.48059696 -107.4753418 63.80053711 C-105.59153268 66.43897383 -103.60452302 68.99514245 -101.62133789 71.55932617 C-101.22269531 72.07648193 -100.82405273 72.5936377 -100.41333008 73.12646484 C-94.40564899 80.91673393 -88.35448685 88.67351585 -82.30883789 96.43432617 C-78.24455135 92.8012925 -75.5330874 88.46787086 -72.59399414 83.93041992 C-72.03417343 83.07525787 -71.47435272 82.22009583 -70.89756775 81.33901978 C-69.68549348 79.4871223 -68.47540737 77.63392238 -67.26708984 75.77957153 C-64.0340085 70.82060142 -60.78233487 65.87385275 -57.53149414 60.92651367 C-56.85986237 59.90386917 -56.18823059 58.88122467 -55.49624634 57.82759094 C-48.79010768 47.62620792 -42.02468673 37.46519791 -35.21408081 27.33328247 C-33.94932217 25.45035586 -32.68670832 23.56598673 -31.42630005 21.68014526 C-29.66356714 19.04362002 -27.89353037 16.41215543 -26.12133789 13.78198242 C-25.34656349 12.61924301 -25.34656349 12.61924301 -24.55613708 11.43301392 C-18.455886 2.42552679 -11.56558858 -5.47259792 0 0 Z " fill="#0EC29D" transform="translate(323.308837890625,222.565673828125)" />
                                                <path d="M0 0 C9.75955902 -0.61489952 18.68053294 3.22842498 26.04296875 9.47265625 C32.76819882 16.03385632 37.96248517 24.04223424 38.94140625 33.546875 C39.08897749 46.48887299 35.76048781 55.93118089 26.85546875 65.41015625 C23.10224258 69.05893271 19.46803163 71.39581689 14.60546875 73.28515625 C13.57421875 73.69765625 12.54296875 74.11015625 11.48046875 74.53515625 C0.65979956 76.62947932 -8.77373102 75.84259964 -18.39453125 70.28515625 C-21.34002716 68.17772989 -23.88648279 65.89259125 -26.39453125 63.28515625 C-27.75578125 61.89296875 -27.75578125 61.89296875 -29.14453125 60.47265625 C-35.61652209 51.30400256 -37.36583336 41.31229192 -36.39453125 30.28515625 C-33.68777396 19.33929383 -26.82823768 10.88528119 -17.45703125 4.78515625 C-11.75190116 1.66364767 -6.37163098 0.75877498 0 0 Z " fill="#21D4A0" transform="translate(97.39453125,220.71484375)" />
                                            </svg>
                                        </>
                                    )}

                                </div>

                                <div className="flex min-w-0 flex-1 flex-col text-center">
                                    <span className="truncate font-semibold text-base">{middleEllipsis(module?.temp_file?.filename)}</span>
                                    <span className="truncate text-muted-foreground text-xs">{module?.temp_file?.size_label}</span>
                                </div>

                                <Badge className="rounded-md flex items-center">
                                    <File />
                                    <span>Temp File</span>
                                </Badge>

                                <p className="text-muted-foreground text-xs text-center max-w-md">
                                    {conversionJob?.status == "completed" ? (
                                        <>
                                            Konversi telah selesai dan file berhasil diproses. Silakan <span className="font-bold text-primary">Simpan</span> perubahan untuk menyimpan file materi yang telah dikonversi.
                                        </>
                                    ) : conversionJob?.status == "failed" ? (
                                        <>
                                            Konversi gagal dan file tidak berhasil diproses. Anda dapat mencoba kembali proses konversi atau memeriksa file yang diunggah sebelumnya.
                                        </>
                                    ) : (conversionStarted || conversionJob?.status == "processing") ? (
                                        <>
                                            Konversi sedang berlangsung. Harap tunggu hingga proses ini selesai. Proses ini membutuhkan beberapa menit. Anda juga dapat meninggalkan halaman ini dan kembali lagi nanti setelah konversi selesai.
                                        </>
                                    ) : (
                                        <>
                                            File materi sementara sudah diunggah. Kamu masih bisa menggantinya dengan menghapus file ini.
                                            Jika sudah sesuai, lanjutkan ke tahap berikutnya dengan mengonversi file.
                                        </>
                                    )}
                                </p>

                                {((conversionStarted && conversionLog) || conversionJob?.status == "processing") && (
                                    <div className="text-xs flex items-center gap-2 text-orange-500">
                                        <Spinner className="w-3 h-3" />
                                        <span>{conversionLog}</span>
                                    </div>
                                )}

                                <div className="flex gap-3 items-center">
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button variant="destructive" size="sm" disabled={isUploading || loading || loadingTempDelete || isConverting || conversionStarted || conversionJob?.status == "processing"} onClick={() => setModalDelete(true)}>
                                                <Trash2 />
                                                <span>Hapus</span>
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Hapus File Materi</p>
                                        </TooltipContent>
                                    </Tooltip>

                                    <Separator orientation="vertical" className="min-h-5" />

                                    <div className="flex gap-2">
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button variant="outline" size="sm" disabled={isUploading || loading || loadingTempDelete || isConverting || conversionStarted || conversionJob?.status == "processing"} onClick={() => {
                                                    setOpenPreview(true);
                                                    setSelectedFilePdf(module?.temp_file)
                                                }}>
                                                    <ScreenShare />
                                                    <span>Preview</span>
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Pratinjau File Materi</p>
                                            </TooltipContent>
                                        </Tooltip>
                                        {conversionJob?.status != "completed" && (
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button variant="default" size="sm" disabled={isUploading || loading || loadingTempDelete || isConverting || conversionStarted || conversionJob?.status == "processing"} onClick={() => handleConvertFile()}>
                                                        {loading ? (
                                                            <>
                                                                <Spinner />
                                                                <span>Uploading...</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                {isConverting || conversionStarted || conversionJob?.status == "processing" ? <RefreshCw className="animate-spin duration-1000" /> : <FileSymlink />}
                                                                <span>Convert</span>
                                                            </>
                                                        )}
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Konversi File ke Gambar</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        )}
                                        {(conversionJob?.status == "completed" && !module?.original_file?.exists) && (
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        size="sm"
                                                        disabled={loadingSave || isUploading || loading || loadingTempDelete || isConverting || conversionStarted || conversionJob?.status == "processing" || loadingSave}
                                                        onClick={() => handleSaveModule()}
                                                    >
                                                        {loadingSave ? (
                                                            <>
                                                                <Spinner />
                                                                <span>Saving...</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Save />
                                                                <span>Simpan</span>
                                                            </>
                                                        )}
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Simpan Perubahan</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        )}
                                    </div>

                                </div>

                            </div>
                        </div>
                    </div>
                ) : module?.original_file?.exists ? (
                    <div className="flex p-4 rounded-xl bg-white shadow-sm flex-col border-0 gap-0 aspect-video items-center justify-center">
                        <div className={`transition-colors bg-linear-to-tr duration-500 from-gray-50 via-white to-gray-50 w-full h-full flex items-center justify-center rounded-xl`}>
                            <div className="flex flex-col items-center gap-4 py-5">
                                <svg className="size-13 group" viewBox="0 0 77 96" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g clipPath="url(#clip0_203_38)">
                                        <g className="group-hover:translate-y-4 transition-[translate] duration-300">
                                            <path opacity="0.06" d="M64.8827 80.187H11.6072C8.40675 80.187 5.8125 77.5926 5.8125 74.3923V5.79469C5.8125 2.59444 8.40675 0 11.6072 0H64.8827C68.0831 0 70.6774 2.59444 70.6774 5.79469V74.3921C70.6774 77.5926 68.0829 80.187 64.8827 80.187Z" fill="#000201" />
                                            <path d="M64.8827 0H59.088C62.2885 0 64.8827 2.59444 64.8827 5.79469V74.3921C64.8827 77.5926 62.2883 80.1868 59.088 80.1868H64.8827C68.0831 80.1868 70.6774 77.5924 70.6774 74.3921V5.79469C70.6774 2.59444 68.083 0 64.8827 0V0Z" fill="#BCC6C5" />
                                            <path d="M60.8362 27.5252H15.656C14.856 27.5252 14.2074 26.8766 14.2074 26.0766C14.2074 25.2765 14.856 24.6279 15.656 24.6279H60.8362C61.6363 24.6279 62.2848 25.2765 62.2848 26.0766C62.2848 26.8766 61.6363 27.5252 60.8362 27.5252Z" fill="#BCC6C5" />
                                            <path d="M60.8362 33.3201H15.656C14.856 33.3201 14.2074 32.6715 14.2074 31.8715C14.2074 31.0714 14.856 30.4229 15.656 30.4229H60.8362C61.6363 30.4229 62.2848 31.0714 62.2848 31.8715C62.285 32.6715 61.6363 33.3201 60.8362 33.3201Z" fill="#BCC6C5" />
                                            <path d="M60.8363 39.115H44.6299C43.8298 39.115 43.1813 38.4665 43.1813 37.6664C43.1813 36.8663 43.8298 36.2178 44.6299 36.2178H60.8363C61.6363 36.2178 62.2849 36.8663 62.2849 37.6664C62.2849 38.4665 61.6363 39.115 60.8363 39.115Z" fill="#BCC6C5" />
                                            <path d="M60.8363 44.909H44.6299C43.8298 44.909 43.1813 44.2604 43.1813 43.4603C43.1813 42.6603 43.8298 42.0117 44.6299 42.0117H60.8363C61.6363 42.0117 62.2849 42.6603 62.2849 43.4603C62.2849 44.2604 61.6363 44.909 60.8363 44.909Z" fill="#BCC6C5" />
                                        </g>
                                        <g>
                                            <path d="M70.6961 95.9999H5.79469C2.59444 95.9999 0 93.4055 0 90.2052V43.4607C0 40.2603 2.59444 37.666 5.79469 37.666H34.062C36.3666 37.666 38.3752 39.2345 38.9342 41.47L39.9294 45.4514C40.4884 47.6871 42.4971 49.2554 44.8016 49.2554H70.6959C73.8964 49.2554 76.4906 51.8498 76.4906 55.0501V90.205C76.491 93.4055 73.8966 95.9999 70.6961 95.9999Z" className="fill-primary/90" />
                                            <path d="M33.1404 41.47L34.1356 45.4514C34.6946 47.6871 36.7033 49.2554 39.0078 49.2554H44.8025C42.4981 49.2554 40.4893 47.687 39.9303 45.4514L38.9351 41.47C38.3761 39.2343 36.3674 37.666 34.0629 37.666H28.2682C30.5728 37.6658 32.5814 39.2343 33.1404 41.47Z" className="fill-primary" />
                                            <path d="M70.6975 49.2559H64.9028C68.1033 49.2559 70.6975 51.8503 70.6975 55.0505V90.2055C70.6975 93.4059 68.1031 96.0002 64.9028 96.0002H70.6975C73.898 96.0002 76.4922 93.4057 76.4922 90.2055V55.0507C76.4924 51.8503 73.898 49.2559 70.6975 49.2559Z" className="fill-primary" />
                                            <path d="M53.6819 71.1047H50.3349V67.6971H54.0957C54.8958 67.6971 55.5444 67.0485 55.5444 66.2484C55.5444 65.4484 54.8958 64.7998 54.0957 64.7998H48.8862C48.0862 64.7998 47.4376 65.4484 47.4376 66.2484V79.1017C47.4376 79.9018 48.0862 80.5504 48.8862 80.5504C49.6863 80.5504 50.3349 79.9018 50.3349 79.1017V74.0021H53.6819C54.482 74.0021 55.1306 73.3536 55.1306 72.5535C55.1307 71.7534 54.482 71.1047 53.6819 71.1047Z" fill="white" />
                                            <path d="M38.6536 65.0879H35.0948C34.306 65.0838 33.6411 65.7513 33.6462 66.5394V66.5495V66.5499V78.8979C33.6389 79.7468 34.2087 80.5507 35.1203 80.5507H35.1258C35.2332 80.5503 37.7699 80.5405 38.7829 80.5229C42.4876 80.458 45.1763 77.2184 45.1763 72.8195C45.1763 68.1948 42.5551 65.0879 38.6536 65.0879ZM38.7323 77.6257C38.2364 77.6343 37.3401 77.6412 36.5641 77.6459C36.5523 73.9808 36.5523 71.7569 36.5461 67.9853H38.6534C41.3264 67.9853 42.2789 70.4823 42.2789 72.8193C42.2789 76.0966 40.4976 77.5947 38.7323 77.6257Z" fill="white" />
                                            <path d="M26.0004 64.7043H22.3949C21.6787 64.6901 20.9161 65.3386 20.9463 66.153V79.101C20.9463 79.901 21.5949 80.5496 22.3949 80.5496C23.195 80.5496 23.8436 79.901 23.8436 79.101V74.9175C24.6108 74.9133 25.5018 74.9094 26.0004 74.9094C28.8534 74.9094 31.1746 72.6204 31.1746 69.8068C31.1746 66.9933 28.8534 64.7043 26.0004 64.7043ZM26.0004 72.0121C25.5056 72.0121 24.6254 72.0161 23.8608 72.02C23.8569 71.231 23.8505 68.4266 23.8481 67.6016H26.0004C27.2345 67.6016 28.2772 68.6115 28.2772 69.8068C28.2772 71.0021 27.2345 72.0121 26.0004 72.0121Z" fill="white" />
                                        </g>
                                        <g className="group-hover:translate-y-4 transition-[translate] duration-300">
                                            <path d="M59.8691 17.3845H16.6204C16.0869 17.3845 15.6545 16.9521 15.6545 16.4187V9.65819C15.6545 9.12476 16.0869 8.69238 16.6204 8.69238H59.8689C60.4024 8.69238 60.8347 9.12476 60.8347 9.65819V16.4187C60.8347 16.9521 60.4024 17.3845 59.8691 17.3845Z" fill="#BCC6C5" />
                                        </g>
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_203_38">
                                            <rect width="76.5" height="96" fill="white" />
                                        </clipPath>
                                    </defs>
                                </svg>

                                <div className="flex min-w-0 flex-1 flex-col text-center">
                                    <span className="truncate font-semibold text-base">{middleEllipsis(module?.original_file?.filename)}</span>
                                    <span className="truncate text-muted-foreground text-xs">{module?.original_file?.size_label}</span>
                                </div>

                                <Badge className="rounded-md flex items-center">
                                    <FileCheck />
                                    <span>Original File</span>
                                </Badge>

                                <p className="text-muted-foreground text-xs text-center max-w-md">
                                    Module materi ini telah berhasil disimpan dan dikonversi ke gambar sebelumnya. Jika anda ingin menggantinya silakan hapus file materi ini terlebih dahulu.
                                </p>

                                <div className="flex gap-3 items-center">
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button variant="destructive" size="sm" disabled={isUploading || loading || loadingTempDelete || isConverting || conversionStarted || conversionJob?.status == "processing"} onClick={() => setModalDelete(true)}>
                                                <Trash2 />
                                                <span>Hapus</span>
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Hapus File Materi</p>
                                        </TooltipContent>
                                    </Tooltip>

                                    <Separator orientation="vertical" className="min-h-5" />

                                    <div className="flex gap-2">
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button variant="outline" size="sm" disabled={isUploading || loading || loadingTempDelete || isConverting || conversionStarted || conversionJob?.status == "processing"} onClick={() => {
                                                    setOpenPreview(true);
                                                    setSelectedFilePdf(module?.original_file)
                                                }}>
                                                    <ScreenShare />
                                                    <span>Preview</span>
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Pratinjau File Materi</p>
                                            </TooltipContent>
                                        </Tooltip>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button size="sm" disabled={isUploading || loading || loadingTempDelete || isConverting || conversionStarted || conversionJob?.status == "processing"} onClick={() => handleConvertToSlides()}>
                                                    <LayersPlus />
                                                    <span>Jadikan Slide</span>
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Ubah jadikan ke Slide Materi</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </div>

                                </div>

                            </div>
                        </div>
                    </div>
                ) : (
                    <FileUpload
                        maxFiles={1}
                        maxSize={20 * 1024 * 1024}
                        className="w-full gap-0"
                        value={files}
                        multiple={false}
                        onValueChange={onFilesChange}
                        onUpload={onUpload}
                        onFileReject={onFileReject}
                        accept="application/pdf"
                    >
                        {files.length === 0 && (
                            <div className="rounded-xl shadow-sm bg-white">
                                <div className="p-4">
                                    <FileUploadDropzone className="aspect-video">
                                        <div className="flex flex-col items-center gap-1 text-center">
                                            <div className="flex items-center justify-center rounded-xl p-2.5">
                                                <svg className="size-13 group" viewBox="0 0 77 96" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <g clipPath="url(#clip0_203_38)">
                                                        <g className="group-hover:translate-y-4 transition-[translate] duration-300">
                                                            <path opacity="0.06" d="M64.8827 80.187H11.6072C8.40675 80.187 5.8125 77.5926 5.8125 74.3923V5.79469C5.8125 2.59444 8.40675 0 11.6072 0H64.8827C68.0831 0 70.6774 2.59444 70.6774 5.79469V74.3921C70.6774 77.5926 68.0829 80.187 64.8827 80.187Z" fill="#000201" />
                                                            <path d="M64.8827 0H59.088C62.2885 0 64.8827 2.59444 64.8827 5.79469V74.3921C64.8827 77.5926 62.2883 80.1868 59.088 80.1868H64.8827C68.0831 80.1868 70.6774 77.5924 70.6774 74.3921V5.79469C70.6774 2.59444 68.083 0 64.8827 0V0Z" fill="#BCC6C5" />
                                                            <path d="M60.8362 27.5252H15.656C14.856 27.5252 14.2074 26.8766 14.2074 26.0766C14.2074 25.2765 14.856 24.6279 15.656 24.6279H60.8362C61.6363 24.6279 62.2848 25.2765 62.2848 26.0766C62.2848 26.8766 61.6363 27.5252 60.8362 27.5252Z" fill="#BCC6C5" />
                                                            <path d="M60.8362 33.3201H15.656C14.856 33.3201 14.2074 32.6715 14.2074 31.8715C14.2074 31.0714 14.856 30.4229 15.656 30.4229H60.8362C61.6363 30.4229 62.2848 31.0714 62.2848 31.8715C62.285 32.6715 61.6363 33.3201 60.8362 33.3201Z" fill="#BCC6C5" />
                                                            <path d="M60.8363 39.115H44.6299C43.8298 39.115 43.1813 38.4665 43.1813 37.6664C43.1813 36.8663 43.8298 36.2178 44.6299 36.2178H60.8363C61.6363 36.2178 62.2849 36.8663 62.2849 37.6664C62.2849 38.4665 61.6363 39.115 60.8363 39.115Z" fill="#BCC6C5" />
                                                            <path d="M60.8363 44.909H44.6299C43.8298 44.909 43.1813 44.2604 43.1813 43.4603C43.1813 42.6603 43.8298 42.0117 44.6299 42.0117H60.8363C61.6363 42.0117 62.2849 42.6603 62.2849 43.4603C62.2849 44.2604 61.6363 44.909 60.8363 44.909Z" fill="#BCC6C5" />
                                                        </g>
                                                        <g>
                                                            <path d="M70.6961 95.9999H5.79469C2.59444 95.9999 0 93.4055 0 90.2052V43.4607C0 40.2603 2.59444 37.666 5.79469 37.666H34.062C36.3666 37.666 38.3752 39.2345 38.9342 41.47L39.9294 45.4514C40.4884 47.6871 42.4971 49.2554 44.8016 49.2554H70.6959C73.8964 49.2554 76.4906 51.8498 76.4906 55.0501V90.205C76.491 93.4055 73.8966 95.9999 70.6961 95.9999Z" className="fill-primary/90" />
                                                            <path d="M33.1404 41.47L34.1356 45.4514C34.6946 47.6871 36.7033 49.2554 39.0078 49.2554H44.8025C42.4981 49.2554 40.4893 47.687 39.9303 45.4514L38.9351 41.47C38.3761 39.2343 36.3674 37.666 34.0629 37.666H28.2682C30.5728 37.6658 32.5814 39.2343 33.1404 41.47Z" className="fill-primary" />
                                                            <path d="M70.6975 49.2559H64.9028C68.1033 49.2559 70.6975 51.8503 70.6975 55.0505V90.2055C70.6975 93.4059 68.1031 96.0002 64.9028 96.0002H70.6975C73.898 96.0002 76.4922 93.4057 76.4922 90.2055V55.0507C76.4924 51.8503 73.898 49.2559 70.6975 49.2559Z" className="fill-primary" />
                                                            <path d="M53.6819 71.1047H50.3349V67.6971H54.0957C54.8958 67.6971 55.5444 67.0485 55.5444 66.2484C55.5444 65.4484 54.8958 64.7998 54.0957 64.7998H48.8862C48.0862 64.7998 47.4376 65.4484 47.4376 66.2484V79.1017C47.4376 79.9018 48.0862 80.5504 48.8862 80.5504C49.6863 80.5504 50.3349 79.9018 50.3349 79.1017V74.0021H53.6819C54.482 74.0021 55.1306 73.3536 55.1306 72.5535C55.1307 71.7534 54.482 71.1047 53.6819 71.1047Z" fill="white" />
                                                            <path d="M38.6536 65.0879H35.0948C34.306 65.0838 33.6411 65.7513 33.6462 66.5394V66.5495V66.5499V78.8979C33.6389 79.7468 34.2087 80.5507 35.1203 80.5507H35.1258C35.2332 80.5503 37.7699 80.5405 38.7829 80.5229C42.4876 80.458 45.1763 77.2184 45.1763 72.8195C45.1763 68.1948 42.5551 65.0879 38.6536 65.0879ZM38.7323 77.6257C38.2364 77.6343 37.3401 77.6412 36.5641 77.6459C36.5523 73.9808 36.5523 71.7569 36.5461 67.9853H38.6534C41.3264 67.9853 42.2789 70.4823 42.2789 72.8193C42.2789 76.0966 40.4976 77.5947 38.7323 77.6257Z" fill="white" />
                                                            <path d="M26.0004 64.7043H22.3949C21.6787 64.6901 20.9161 65.3386 20.9463 66.153V79.101C20.9463 79.901 21.5949 80.5496 22.3949 80.5496C23.195 80.5496 23.8436 79.901 23.8436 79.101V74.9175C24.6108 74.9133 25.5018 74.9094 26.0004 74.9094C28.8534 74.9094 31.1746 72.6204 31.1746 69.8068C31.1746 66.9933 28.8534 64.7043 26.0004 64.7043ZM26.0004 72.0121C25.5056 72.0121 24.6254 72.0161 23.8608 72.02C23.8569 71.231 23.8505 68.4266 23.8481 67.6016H26.0004C27.2345 67.6016 28.2772 68.6115 28.2772 69.8068C28.2772 71.0021 27.2345 72.0121 26.0004 72.0121Z" fill="white" />
                                                        </g>
                                                        <g className="group-hover:translate-y-4 transition-[translate] duration-300">
                                                            <path d="M59.8691 17.3845H16.6204C16.0869 17.3845 15.6545 16.9521 15.6545 16.4187V9.65819C15.6545 9.12476 16.0869 8.69238 16.6204 8.69238H59.8689C60.4024 8.69238 60.8347 9.12476 60.8347 9.65819V16.4187C60.8347 16.9521 60.4024 17.3845 59.8691 17.3845Z" fill="#BCC6C5" />
                                                        </g>
                                                    </g>
                                                    <defs>
                                                        <clipPath id="clip0_203_38">
                                                            <rect width="76.5" height="96" fill="white" />
                                                        </clipPath>
                                                    </defs>
                                                </svg>
                                            </div>
                                            <p className="font-medium text-sm">Seret & lepas file di sini</p>
                                            <p className="text-muted-foreground text-xs">
                                                Atau klik untuk memilih file ( ukuran maks. 20 MB )
                                            </p>
                                            <p className="text-muted-foreground text-xs">
                                                Format file yang didukung: .pdf
                                            </p>
                                        </div>
                                        <div className="flex gap-2 mt-2">
                                            <FileUploadTrigger asChild>
                                                <Button variant="outline" size="sm" className="w-fit">
                                                    Browse files
                                                </Button>
                                            </FileUploadTrigger>
                                        </div>
                                    </FileUploadDropzone>
                                </div>
                            </div>
                        )}
                        <FileUploadList>
                            {files.map((file, index) => {
                                return (
                                    <FileUploadItem key={index} value={file} className="flex p-4 rounded-xl bg-white shadow-sm flex-col border-0 gap-0 aspect-video items-center justify-center">
                                        <div className={`transition-colors bg-linear-to-tr duration-500 ${isUploading ? 'from-sky-50 via-white to-sky-50' : 'from-gray-50 via-white to-gray-50'} w-full h-full flex items-center justify-center rounded-xl`}>
                                            <div className="flex flex-col items-center gap-4 py-5">
                                                <svg className="w-14" viewBox="0 0 500 615" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M25 0.5H359.889C366.329 0.5 372.511 3.03623 377.096 7.55957L492.207 121.132C496.873 125.736 499.5 132.017 499.5 138.572V590C499.5 603.531 488.531 614.5 475 614.5H25C11.469 614.5 0.5 603.531 0.5 590V25C0.500007 11.6806 11.1287 0.843452 24.3672 0.507812L25 0.5Z" fill="#FF4B42" stroke="#E4E4E4" />
                                                    <path d="M0 420H500V590C500 603.807 488.807 615 475 615H25C11.1929 615 0 603.807 0 590V420Z" fill="#E01C12" />

                                                    {loading ? (
                                                        <g transform="translate(140, 120) scale(10)">
                                                            <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                            <path d="M12 13v8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                            <path d="m8 17 4-4 4 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                        </g>
                                                    ) : (
                                                        <>
                                                            <path d="M216.622 107.89C218.074 81.6565 250.487 78.4629 258.952 107.89C265.725 131.431 254.834 169.252 247.9 196.258C254.834 212.137 277.485 241.564 290.985 254.566C336.06 247.723 361.458 248.486 378.162 256.391C400.814 267.113 396.009 293.49 374.043 295.626C355.281 297.451 327.594 295.626 288.239 263.006C278.019 264.375 247.557 270.26 211.131 282.852C197.174 305.207 177.724 335.782 161.25 349.005C134.251 370.675 113.887 363.604 108.167 351.742C100.387 330.756 131.963 311.138 189.394 282.852C198.47 264.907 219.414 220.03 230.579 184.079C225.698 172.445 214.792 140.966 216.622 107.89ZM181.615 295.17C103.362 328.835 107.023 351.514 121.667 353.795C136.311 356.076 154.386 337.599 181.615 295.17ZM373.128 275.096C372.213 253.654 339.264 253.653 296.248 260.953C346.357 296.539 373.128 290.152 373.128 275.096ZM244.08 204.837C231.998 240.423 220.283 265.44 215.936 273.5C248.518 263.463 274.359 258.064 283.206 256.619C265.084 236.18 249.571 213.581 244.08 204.837ZM234.698 172.673C253.689 112.223 247.283 93.062 232.868 95.1148C217.767 97.6241 219.826 140.509 234.698 172.673Z" fill="white" />
                                                        </>
                                                    )}

                                                    <path d="M172.59 526.294H148.786V512.583H172.59C176.483 512.583 179.636 511.948 182.048 510.679C184.502 509.367 186.301 507.59 187.443 505.347C188.586 503.062 189.157 500.459 189.157 497.539C189.157 494.704 188.586 492.059 187.443 489.604C186.301 487.15 184.502 485.161 182.048 483.638C179.636 482.114 176.483 481.353 172.59 481.353H154.499V560H137.043V467.578H172.59C179.784 467.578 185.92 468.869 190.998 471.45C196.118 473.989 200.012 477.523 202.678 482.051C205.386 486.536 206.74 491.657 206.74 497.412C206.74 503.379 205.386 508.521 202.678 512.837C200.012 517.153 196.118 520.475 190.998 522.803C185.92 525.13 179.784 526.294 172.59 526.294ZM248.063 560H228.132L228.259 546.289H248.063C253.438 546.289 257.945 545.104 261.584 542.734C265.223 540.322 267.974 536.873 269.836 532.388C271.698 527.86 272.629 522.443 272.629 516.138V511.377C272.629 506.51 272.1 502.215 271.042 498.491C269.984 494.767 268.418 491.636 266.345 489.097C264.313 486.558 261.796 484.632 258.791 483.32C255.786 482.008 252.338 481.353 248.444 481.353H227.751V467.578H248.444C254.623 467.578 260.251 468.615 265.329 470.688C270.45 472.762 274.872 475.745 278.596 479.639C282.362 483.49 285.24 488.102 287.229 493.477C289.26 498.851 290.275 504.86 290.275 511.504V516.138C290.275 522.739 289.26 528.748 287.229 534.165C285.24 539.539 282.362 544.152 278.596 548.003C274.872 551.854 270.428 554.816 265.266 556.89C260.103 558.963 254.369 560 248.063 560ZM237.907 467.578V560H220.451V467.578H237.907ZM322.585 467.578V560H305.129V467.578H322.585ZM359.846 507.505V521.279H318.015V507.505H359.846ZM364.733 467.578V481.353H318.015V467.578H364.733Z" fill="white" />
                                                </svg>
                                                <FileUploadItemMetadata className="text-center [&>span:first-of-type]:text-base [&>span:first-of-type]:font-semibold" />
                                                <FileUploadItemProgress />
                                                <p className="text-muted-foreground text-xs text-center max-w-sm">
                                                    Pastikan file sudah benar sebelum mengunggah. File akan digunakan sebagai materi modul training.
                                                </p>
                                                <div className="flex gap-2 items-center">
                                                    <FileUploadItemDelete asChild>
                                                        <Button variant="outline" size="sm" disabled={isUploading || loading}>
                                                            <X />
                                                            <span>Hapus</span>
                                                        </Button>
                                                    </FileUploadItemDelete>
                                                    <Button variant="default" size="sm" disabled={isUploading || loading} onClick={() => handleUploadFile()}>
                                                        {loading ? (
                                                            <>
                                                                <Spinner />
                                                                <span>Uploading...</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Upload />
                                                                <span>Unggah</span>
                                                            </>
                                                        )}
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </FileUploadItem>
                                );
                            })}
                        </FileUploadList>
                    </FileUpload>
                )}

                {/* Modal Previw */}
                <Dialog open={openPreview} onOpenChange={setOpenPreview}>
                    <DialogContent className="sm:max-w-4xl">
                        <DialogHeader>
                            <DialogTitle>Preview Module Training</DialogTitle>
                            <DialogDescription>
                                Menampilkan pratinjau modul training yang telah diunggah.
                            </DialogDescription>
                        </DialogHeader>
                        {selectedFilePdf && (
                            <PdfPreview fileUrl={selectedFilePdf?.url} data={selectedFilePdf} />
                        )}
                    </DialogContent>
                </Dialog>

                {/* Alert Delete File */}
                <AlertDialog open={modalDelete} onOpenChange={setModalDelete}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>{module?.original_file?.exists ? 'Yakin ingin menghapus file modul original ini?' : 'Yakin ingin menghapus file modul Temp ini?'}</AlertDialogTitle>
                            <AlertDialogDescription>
                                {module?.original_file?.exists ? (
                                    <>
                                        Tindakan ini akan menghapus file modul Original secara permanen dan tidak dapat dipulihkan. Pastikan Anda benar-benar yakin sebelum melanjutkan.
                                    </>
                                ) : (
                                    <>
                                        Tindakan ini akan menghapus file modul Temp secara permanen dan tidak dapat dipulihkan. Pastikan Anda benar-benar yakin sebelum melanjutkan.
                                    </>
                                )}

                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <Button variant="destructive" onClick={module?.original_file?.exists ? handleDeleteOriginal : handleDeleteTemp} disabled={loadingTempDelete}>
                                {loadingTempDelete ? (
                                    <>
                                        <Spinner />
                                        <span>Menghapus...</span>
                                    </>
                                ) : (
                                    <>
                                        <Trash2 />
                                        <span>Hapus File</span>
                                    </>
                                )}
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </>
    );
}