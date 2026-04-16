"use client"

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import PageTitle from '@/components/partials/PageTitle';
import LayoutContainer from '@/components/partials/LayoutContainer';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Cropper, CropperArea, CropperImage } from "@/components/ui/cropper";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ImageZoom } from "@/components/partials/ImageZoom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from 'sonner';
import {
    Upload, X, Crop, RotateCcw, Save, Trash, Search,
    ImageIcon, Shapes, FolderOpen, Pencil
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import { Spinner } from '@/components/ui/spinner';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// ─── Helper: Crop Image ───────────────────────────────────────────────────────
async function createCroppedImage(imageSrc, cropData, fileName) {
    const image = new Image();
    image.crossOrigin = "anonymous";
    return new Promise((resolve, reject) => {
        image.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            if (!ctx) { reject(new Error("Could not get canvas context")); return; }
            canvas.width = cropData.width;
            canvas.height = cropData.height;
            ctx.drawImage(image, cropData.x, cropData.y, cropData.width, cropData.height, 0, 0, cropData.width, cropData.height);
            canvas.toBlob((blob) => {
                if (!blob) { reject(new Error("Canvas is empty")); return; }
                resolve(new File([blob], `cropped-${fileName}`, { type: "image/png" }));
            }, "image/png");
        };
        image.onerror = () => reject(new Error("Failed to load image"));
        image.src = imageSrc;
    });
}

// ─── Icon Picker ──────────────────────────────────────────────────────────────
const ALL_ICONS = Object.entries(LucideIcons).filter(([name, Comp]) => {
    return name;
}).map(([name, Component]) => ({ name, Component }));

function IconPickerModal({ open, onOpenChange, selectedIcon, onSelect }) {
    const [search, setSearch] = useState('');

    const filtered = useMemo(() => {
        if (!search.trim()) return ALL_ICONS.slice(0, 200);
        return ALL_ICONS.filter(({ name }) =>
            name.toLowerCase().includes(search.toLowerCase())
        ).slice(0, 200);
    }, [search]);

    return (
        <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) setSearch(''); }}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Pilih Icon</DialogTitle>
                    <DialogDescription>Cari dan pilih icon dari Lucide React</DialogDescription>
                </DialogHeader>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                        placeholder="Cari icon... contoh: Home, User, Star"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9"
                        autoFocus
                    />
                </div>
                <ScrollArea className="h-80">
                    <div className="grid grid-cols-8 gap-1 p-1">
                        {filtered.map(({ name, Component }) => (
                            <Tooltip key={name}>
                                <TooltipTrigger asChild>
                                    <button
                                        onClick={() => { onSelect(name); onOpenChange(false); setSearch(''); }}
                                        className={`
                                            flex flex-col items-center justify-center gap-1 p-2 rounded-lg aspect-square
                                            hover:bg-accent transition-colors cursor-pointer
                                            ${selectedIcon === name ? 'bg-primary/10 ring-1 ring-primary' : ''}
                                        `}
                                    >
                                        <Component className="size-5" />
                                        <span className="text-[9px] text-muted-foreground truncate w-full text-center leading-tight">
                                            {name}
                                        </span>
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent side="bottom"><p>{name}</p></TooltipContent>
                            </Tooltip>
                        ))}
                    </div>
                </ScrollArea>
                <p className="text-xs text-muted-foreground text-center">
                    Menampilkan {filtered.length} icon {search ? `untuk "${search}"` : '(200 pertama)'}
                </p>
            </DialogContent>
        </Dialog>
    );
}

// ─── Browse Image Field (tanpa drag/drop) ─────────────────────────────────────
// Dipakai untuk favicon (square) dan og:image (landscape)
// previewShape: 'square' | 'landscape'
function BrowseImageField({ label, description, currentUrl, previewShape = 'square', hint, onSave, onDelete }) {
    const inputRef = useRef(null);
    const [preview, setPreview] = useState(null);   // object URL file baru
    const [file, setFile] = useState(null);
    const [saving, setSaving] = useState(false);

    // Cleanup object URL saat komponen unmount / ganti file
    useEffect(() => {
        return () => { if (preview) URL.revokeObjectURL(preview); };
    }, [preview]);

    function handleFileChange(e) {
        const f = e.target.files?.[0];
        if (!f) return;

        // Validasi ukuran max 2MB
        if (f.size > 2 * 1024 * 1024) {
            toast.error("Ukuran file maksimal 2MB");
            return;
        }

        if (preview) URL.revokeObjectURL(preview);
        setPreview(URL.createObjectURL(f));
        setFile(f);
    }

    function handleCancel() {
        if (preview) URL.revokeObjectURL(preview);
        setPreview(null);
        setFile(null);
        if (inputRef.current) inputRef.current.value = '';
    }

    async function handleSave() {
        if (!file) return;
        setSaving(true);
        try {
            await onSave(file);
            handleCancel();
        } catch {
            toast.error("Gagal menyimpan gambar");
        } finally {
            setSaving(false);
        }
    }

    // Tentukan dimensi preview
    const previewClass = previewShape === 'square'
        ? 'w-16 h-16'                           // favicon: kotak kecil
        : 'w-full aspect-[640/480] max-h-40';   // og: landscape 640×480

    // URL yang ditampilkan: file baru (preview) atau existing
    const displayUrl = preview || currentUrl;

    return (
        <div className="space-y-2">
            <Label className="text-sm font-medium mb-0.5">{label}</Label>
            {description && <p className="text-xs text-muted-foreground">{description}</p>}

            <div className="flex items-center gap-4">
                {/* Preview box */}
                <div className={`
                    ${previewClass} shrink-0 rounded-lg border bg-muted/50
                    flex items-center justify-center overflow-hidden
                    ${previewShape === 'landscape' ? 'w-full' : ''}
                `}>
                    {displayUrl ? (
                        <ImageZoom src={displayUrl}>
                            <img
                                src={displayUrl}
                                alt={label}
                                className="w-full h-full object-contain p-1"
                            />
                        </ImageZoom>
                    ) : (
                        <ImageIcon className="size-6 text-muted-foreground" />
                    )}
                </div>

                {/* Actions — hanya tampil di sebelah kanan kalau square */}
                {previewShape === 'square' && (
                    <div className="flex flex-row gap-2 justify-center">
                        {/* Browse / ganti */}
                        <input
                            ref={inputRef}
                            type="file"
                            accept="image/png,image/jpeg,image/webp,image/x-icon,image/svg+xml"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => inputRef.current?.click()}
                        >
                            <FolderOpen className="size-3.5" />
                            {displayUrl ? 'Ganti' : 'Browse'}
                        </Button>

                        {/* Tombol simpan — muncul kalau ada file baru */}
                        {file && (
                            <Button size="sm" disabled={saving} onClick={handleSave}>
                                <Save className="size-3.5" />
                                {saving ? 'Menyimpan...' : 'Simpan'}
                            </Button>
                        )}

                        {/* Cancel preview */}
                        {file && (
                            <Button variant="ghost" size="sm" onClick={handleCancel}>
                                <X className="size-3.5" />
                                Batal
                            </Button>
                        )}

                        {/* Hapus existing */}
                        {currentUrl && !file && (
                            <Button variant="ghost" size="sm" onClick={onDelete}>
                                <Trash className="size-3.5" />
                                Hapus
                            </Button>
                        )}
                    </div>
                )}
            </div>

            {/* Untuk landscape (og image): actions di bawah preview */}
            {previewShape === 'landscape' && (
                <div className="flex items-center gap-2">
                    <input
                        ref={inputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => inputRef.current?.click()}
                    >
                        <FolderOpen className="size-3.5" />
                        {displayUrl ? 'Ganti Gambar' : 'Browse Gambar'}
                    </Button>

                    {file && (
                        <>
                            <Button size="sm" disabled={saving} onClick={handleSave}>
                                <Save className="size-3.5" />
                                {saving ? 'Menyimpan...' : 'Simpan'}
                            </Button>
                            <Button variant="ghost" size="sm" onClick={handleCancel}>
                                <X className="size-3.5" />
                                Batal
                            </Button>
                        </>
                    )}

                    {currentUrl && !file && (
                        <Button variant="ghost" size="sm" onClick={onDelete}>
                            <Trash className="size-3.5" />
                            Hapus
                        </Button>
                    )}
                </div>
            )}

            {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
        </div>
    );
}


// ─── Logo Upload Field — style browse, dengan crop dialog ─────────────────────
// shape: 'square' → aspect-square w-fit
// shape: 'rectangle' → aspect-[3/1] w-full (auto)
function LogoUploadField({ label, description, hint, shape = 'square', currentUrl, onSave, onDelete }) {
    const inputRef = useRef(null);
    const [preview, setPreview] = useState(null);   // object URL sebelum crop
    const [croppedPreview, setCroppedPreview] = useState(null); // object URL setelah crop
    const [file, setFile] = useState(null);          // file original
    const [croppedFile, setCroppedFile] = useState(null); // file hasil crop
    const [saving, setSaving] = useState(false);

    // Crop state
    const [showCrop, setShowCrop] = useState(false);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedArea, setCroppedArea] = useState(null);

    const aspectRatio = shape === 'square' ? 1 : 3;
    const aspectLabel = shape === 'square' ? '1:1' : '3:1';

    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview);
            if (croppedPreview) URL.revokeObjectURL(croppedPreview);
        };
    }, [preview, croppedPreview]);

    function handleFileChange(e) {
        const f = e.target.files?.[0];
        if (!f) return;
        if (f.size > 5 * 1024 * 1024) { toast.error("Ukuran file maksimal 5MB"); return; }
        if (preview) URL.revokeObjectURL(preview);
        if (croppedPreview) URL.revokeObjectURL(croppedPreview);

        setPreview(URL.createObjectURL(f));
        setFile(f);
        setCroppedFile(null);
        setCroppedPreview(null);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setCroppedArea(null);
        setShowCrop(true); // langsung buka crop dialog
        if (inputRef.current) inputRef.current.value = '';
    }

    async function handleCropApply() {
        if (!file || !croppedArea || !preview) return;
        try {
            const result = await createCroppedImage(preview, croppedArea, file.name);
            if (croppedPreview) URL.revokeObjectURL(croppedPreview);
            setCroppedFile(result);
            setCroppedPreview(URL.createObjectURL(result));
            setShowCrop(false);
        } catch {
            toast.error("Gagal crop gambar");
        }
    }

    function handleCancel() {
        if (preview) URL.revokeObjectURL(preview);
        if (croppedPreview) URL.revokeObjectURL(croppedPreview);
        setPreview(null);
        setCroppedPreview(null);
        setFile(null);
        setCroppedFile(null);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setCroppedArea(null);
    }

    async function handleSave() {
        const fileToUpload = croppedFile || file;
        if (!fileToUpload) return;
        setSaving(true);
        try {
            await onSave(fileToUpload);
            handleCancel();
        } catch {
            toast.error("Gagal menyimpan logo");
        } finally {
            setSaving(false);
        }
    }

    // Yang ditampilkan di preview box:
    // croppedPreview → file baru sudah di-crop
    // preview → file baru belum di-crop (fallback)
    // currentUrl → gambar existing dari server
    const displayUrl = croppedPreview || preview || currentUrl;
    const hasNewFile = !!file;

    return (
        <div className="space-y-2">
            <Label className="text-sm font-medium mb-0.5">{label}</Label>
            {description && <p className="text-xs text-muted-foreground">{description}</p>}

            {/* Preview box
                square    → aspect-square w-fit h-24
                rectangle → w-full aspect-[3/1] max-h-28 (proporsional 3:1)
            */}
            <div className={`
                rounded-lg border bg-muted/50 flex items-center justify-center overflow-hidden
                ${shape === 'square'
                    ? 'aspect-square w-fit h-24'
                    : 'w-full h-28'
                }
            `}
                style={shape === 'rectangle' ? { aspectRatio: '3 / 1' } : {}}
            >
                {displayUrl
                    ? <ImageZoom src={displayUrl}>
                        <img src={displayUrl} alt={label} className="w-full h-full object-contain p-1.5" />
                    </ImageZoom>
                    : <ImageIcon className="size-6 text-muted-foreground/30" />
                }
            </div>

            {/* Actions — selalu horizontal flex */}
            <div className="flex items-center gap-2 flex-wrap">
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={handleFileChange}
                />

                {/* Browse / Ganti */}
                <Button variant="outline" size="sm" onClick={() => inputRef.current?.click()}>
                    <FolderOpen className="size-3.5" />
                    {displayUrl ? 'Ganti' : 'Browse'}
                </Button>

                {/* Crop ulang — tampil kalau ada file baru */}
                {hasNewFile && (
                    <Button variant="outline" size="sm" onClick={() => setShowCrop(true)}>
                        <Crop className="size-3.5" />
                        Crop
                    </Button>
                )}

                {/* Simpan */}
                {hasNewFile && (
                    <Button size="sm" disabled={saving} onClick={handleSave}>
                        <Save className="size-3.5" />
                        {saving ? 'Menyimpan...' : 'Simpan'}
                    </Button>
                )}

                {/* Batal — cancel file baru, kembali ke existing */}
                {hasNewFile && (
                    <Button variant="ghost" size="sm" onClick={handleCancel}>
                        <X className="size-3.5" />
                        Batal
                    </Button>
                )}

                {/* Hapus — hanya tampil kalau ada existing & tidak ada file baru */}
                {currentUrl && !hasNewFile && (
                    <Button variant="ghost" size="sm" onClick={onDelete}>
                        <Trash className="size-3.5" />
                        Hapus
                    </Button>
                )}
            </div>

            {hint && <p className="text-xs text-muted-foreground">{hint}</p>}

            {/* Crop Dialog */}
            <Dialog open={showCrop} onOpenChange={(open) => { if (!open) setShowCrop(false); }}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Crop — {label}</DialogTitle>
                        <DialogDescription>Sesuaikan area crop (rasio {aspectLabel})</DialogDescription>
                    </DialogHeader>
                    {preview && (
                        <div className="flex flex-col gap-4">
                            <Cropper
                                aspectRatio={aspectRatio}
                                crop={crop}
                                onCropChange={setCrop}
                                zoom={zoom}
                                onZoomChange={setZoom}
                                onCropComplete={(_, pixels) => setCroppedArea(pixels)}
                                className="h-72"
                            >
                                <CropperImage src={preview} alt={label} crossOrigin="anonymous" />
                                <CropperArea />
                            </Cropper>
                            <div className="flex flex-col gap-2">
                                <Label className="text-sm">Zoom: {zoom.toFixed(2)}x</Label>
                                <Slider
                                    value={[zoom]}
                                    onValueChange={(v) => setZoom(v[0] ?? 1)}
                                    min={1} max={3} step={0.1}
                                />
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => { setCrop({ x: 0, y: 0 }); setZoom(1); setCroppedArea(null); }}>
                            <RotateCcw className="size-3.5" /> Reset
                        </Button>
                        <Button onClick={handleCropApply} disabled={!croppedArea}>
                            Apply Crop
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}



// ─── Wrappers ─────────────────────────────────────────────────────────────────
function SettingSection({ title, description, children, className }) {
    return (
        <div className={cn('py-8', className)}>
            <div className="mb-6">
                <h2 className="text-base font-semibold">{title}</h2>
                {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
            </div>
            {children}
        </div>
    );
}

function SettingField({ label, description, children }) {
    return (
        <div className="space-y-1.5">
            <Label className="text-sm font-medium mb-0.5">{label}</Label>
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
            {children}
        </div>
    );
}

function SettingSwitchRow({ id, label, description, checked, onCheckedChange }) {
    return (
        <div className="flex items-center justify-between py-1">
            <div className="space-y-0.5">
                <Label htmlFor={id} className="text-sm font-medium cursor-pointer">{label}</Label>
                {description && <p className="text-xs text-muted-foreground">{description}</p>}
            </div>
            <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} />
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function GeneralSettings() {
    const { settings, loading, updateSettings } = useSettings();

    const [form, setForm] = useState({
        site_name: '',
        site_tagline: '',
        site_description: '',
        site_email: '',
        maintenance_mode: false,
        logo_type: 'icon',
        logo_icon: null,
        logo_url: null,
        favicon_url: null,
        og_image_url: null,
        logo_rectangle_url: null,
    });

    const [saving, setSaving] = useState({ details: false, contact: false });
    const [iconPickerOpen, setIconPickerOpen] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (settings) setForm(prev => ({ ...prev, ...settings }));
    }, [settings]);

    function handleChange(e) {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    }

    async function handleSave(section, payload) {
        setSaving(prev => ({ ...prev, [section]: true }));
        await updateSettings(payload);
        setSaving(prev => ({ ...prev, [section]: false }));
    }

    async function uploadImage(file, field) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('field', field);
        const response = await fetch(`${API_URL}/office/settings/upload-image`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${api.token}` },
            body: formData,
        });
        const data = await response.json();
        if (!data.success) throw new Error(data.message);
        await updateSettings({ [field]: data.data.url });
        toast.success('Gambar berhasil disimpan!');
    }

    async function deleteImage(field) {
        const response = await fetch(`${API_URL}/office/settings/delete-image`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${api.token}`,
            },
            body: JSON.stringify({ field }),
        });
        const data = await response.json();
        if (!data.success) throw new Error(data.message);

        // Update form lokal + context
        setForm(prev => ({ ...prev, [field]: null }));
        await updateSettings({ [field]: null });
        toast.success('Gambar dihapus.');
    }

    const SelectedIcon = form.logo_icon ? (LucideIcons[form.logo_icon] ?? null) : null;

    if (loading) {
        return (
            <LayoutContainer>
                <div className="max-w-4xl mx-auto w-full">
                    <PageTitle title="General Settings" subtitle="Kelola pengaturan website" />
                    <p className="text-sm text-muted-foreground mt-8">Memuat settings...</p>
                </div>
            </LayoutContainer>
        );
    }

    return (
        <LayoutContainer>
            <div className="max-w-4xl mx-auto w-full">
                <PageTitle title="General Settings" subtitle="Kelola pengaturan website" />

                {/* ══════════════════════════════════════════════════
                    SECTION 1 — Details
                    Kiri  : Site Name, Tagline, Description
                    Kanan : Favicon + OG Image (browse style)
                ══════════════════════════════════════════════════ */}
                <SettingSection
                    title="Details"
                    className="!pt-0"
                    description="Informasi umum dan aset visual dasar website."
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

                        {/* ── Kiri ── */}
                        <div className="space-y-5">
                            <SettingField
                                label="Site Name"
                                description="Nama website yang tampil di browser dan halaman."
                            >
                                <Input
                                    name="site_name"
                                    value={form.site_name}
                                    onChange={handleChange}
                                    placeholder="Nama Website"
                                />
                            </SettingField>

                            <SettingField
                                label="Site Tagline"
                                description="Slogan singkat di bawah nama website."
                            >
                                <Input
                                    name="site_tagline"
                                    value={form.site_tagline}
                                    onChange={handleChange}
                                    placeholder="Tagline singkat..."
                                />
                            </SettingField>

                            <SettingField
                                label="Site Description"
                                description="Deskripsi untuk keperluan SEO dan meta tag."
                            >
                                <Textarea
                                    name="site_description"
                                    value={form.site_description}
                                    onChange={handleChange}
                                    placeholder="Deskripsi singkat website..."
                                    rows={5}
                                    className="resize-none"
                                />
                            </SettingField>

                            <Button
                                size="sm"
                                disabled={saving.details}
                                onClick={() => handleSave('details', {
                                    site_name: form.site_name,
                                    site_tagline: form.site_tagline,
                                    site_description: form.site_description,
                                })}
                            >
                                {saving.details ? (
                                    <>
                                        <Spinner />
                                        <span>Menyimpan...</span>
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        <span>Simpan</span>
                                    </>
                                )}
                            </Button>
                        </div>

                        {/* ── Kanan: Favicon + OG Image ── */}
                        <div className="space-y-6">
                            {/* Favicon — browse, preview w-16 h-16 square */}
                            <BrowseImageField
                                label="Favicon"
                                description="Icon tab browser."
                                hint="Disarankan ukuran 32×32 atau 64×64 px · PNG, ICO, SVG · Maks 2MB"
                                currentUrl={form.favicon_url}
                                previewShape="square"
                                onSave={(file) => uploadImage(file, 'favicon_url')}
                                onDelete={() => deleteImage('favicon_url')}
                            />

                            <Separator className="border-dashed" />

                            {/* OG Image — browse, preview landscape 640×480 */}
                            <BrowseImageField
                                label="OG Image"
                                description="Gambar pratinjau saat website dibagikan di media sosial."
                                hint="Disarankan ukuran 640×480 px · PNG, JPG, WebP · Maks 2MB"
                                currentUrl={form.og_image_url}
                                previewShape="landscape"
                                onSave={(file) => uploadImage(file, 'og_image_url')}
                                onDelete={() => deleteImage('og_image_url')}
                            />
                        </div>
                    </div>
                </SettingSection>

                <Separator />

                {/* ══════════════════════════════════════════════════
                    SECTION 2 — Logo
                    - Logo Type: icon | image
                    - Icon → icon picker
                    - Image → square (kiri) + rectangle (kanan)
                             responsive: stack di mobile, side-by-side di md+
                ══════════════════════════════════════════════════ */}
                {/* ── Logo ─────────────────────────────────────────────────── */}
                <SettingSection
                    title="Identitas Visual"
                    description="Atur tampilan visual seperti logo dan ikon website."
                >
                    {/* Logo Type */}
                    <div className="mb-6">
                        <Label className="text-sm font-medium">Logo Type</Label>
                        <p className="text-xs text-muted-foreground mt-0.5 mb-3">Pilih tipe logo yang digunakan.</p>
                        <RadioGroup
                            value={form.logo_type}
                            onValueChange={(val) => {
                                setForm(prev => ({ ...prev, logo_type: val }));
                                updateSettings({ logo_type: val });
                            }}
                            className="flex flex-wrap gap-3"
                        >
                            <Label htmlFor="type-icon" className={`flex items-center gap-3 border rounded-lg px-4 py-3 cursor-pointer w-full sm:w-48 transition-colors hover:bg-accent ${form.logo_type === 'icon' ? 'border-primary bg-primary/5' : 'border-border'}`}>
                                <RadioGroupItem value="icon" id="type-icon" className="sr-only" />
                                <Shapes className="size-4 text-muted-foreground shrink-0" />
                                <div>
                                    <p className="text-sm font-medium">Icon</p>
                                    <p className="text-xs text-muted-foreground">Lucide icon</p>
                                </div>
                            </Label>
                            <Label htmlFor="type-image" className={`flex items-center gap-3 border rounded-lg px-4 py-3 cursor-pointer w-full sm:w-48 transition-colors hover:bg-accent ${form.logo_type === 'image' ? 'border-primary bg-primary/5' : 'border-border'}`}>
                                <RadioGroupItem value="image" id="type-image" className="sr-only" />
                                <ImageIcon className="size-4 text-muted-foreground shrink-0" />
                                <div>
                                    <p className="text-sm font-medium">Image</p>
                                    <p className="text-xs text-muted-foreground">Upload file gambar</p>
                                </div>
                            </Label>
                        </RadioGroup>
                    </div>

                    {/* Icon Mode */}
                    {form.logo_type === 'icon' && (
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Pilih Icon</Label>
                            <p className="text-xs text-muted-foreground">Icon yang dipilih akan digunakan sebagai logo website.</p>
                            <div className="flex items-center gap-3 mt-2">
                                <div className="flex items-center justify-center w-16 h-16 rounded-xl border bg-muted shrink-0">
                                    {SelectedIcon ? <SelectedIcon className="size-8" /> : <Shapes className="size-8 text-muted-foreground/30" />}
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <Button variant="outline" size="sm" onClick={() => setIconPickerOpen(true)}>
                                        <Search className="size-3.5" />
                                        {form.logo_icon ? 'Ganti Icon' : 'Pilih Icon'}
                                    </Button>
                                    {form.logo_icon && <span className="text-xs text-muted-foreground">{form.logo_icon}</span>}
                                </div>
                            </div>
                            <IconPickerModal
                                open={iconPickerOpen}
                                onOpenChange={setIconPickerOpen}
                                selectedIcon={form.logo_icon}
                                onSelect={(iconName) => {
                                    setForm(prev => ({ ...prev, logo_icon: iconName }));
                                    updateSettings({ logo_icon: iconName });
                                    toast.success(`Icon "${iconName}" dipilih`);
                                }}
                            />
                        </div>
                    )}

                    {/* Image Mode: Square + Rectangle */}
                    {form.logo_type === 'image' && (
                        <div className="flex gap-x-10 gap-y-5 flex-col md:flex-row items-stretch">
                            <LogoUploadField
                                label="Logo Square"
                                className="w-fit"
                                description="Favicon, avatar, icon app."
                                hint="Rasio 1:1 · PNG, JPG, WebP · Maks 5MB"
                                shape="square"
                                currentUrl={form.logo_url}
                                onSave={(file) => uploadImage(file, 'logo_url')}
                                onDelete={() => deleteImage('logo_url')}
                            />
                            <LogoUploadField
                                className="w-full"
                                label="Logo Rectangle"
                                description="Header & navbar website."
                                hint="Rasio 3:1 · PNG, JPG, WebP · Maks 5MB"
                                shape="rectangle"
                                currentUrl={form.logo_rectangle_url}
                                onSave={(file) => uploadImage(file, 'logo_rectangle_url')}
                                onDelete={() => deleteImage('logo_rectangle_url')}
                            />
                        </div>
                    )}
                </SettingSection>

                <Separator />

                {/* ══════════════════════════════════════════════════
                    SECTION 3 — Contact
                ══════════════════════════════════════════════════ */}
                <SettingSection
                    title="Contact"
                    description="Informasi kontak yang bisa dihubungi pengunjung."
                >
                    <div className="max-w-sm space-y-5">
                        <SettingField label="Email" description="Email utama website.">
                            <Input
                                name="site_email"
                                type="email"
                                value={form.site_email}
                                onChange={handleChange}
                                placeholder="admin@example.com"
                            />
                        </SettingField>
                        <Button
                            size="sm"
                            disabled={saving.contact}
                            onClick={() => handleSave('contact', { site_email: form.site_email })}
                        >
                            {saving.contact ? (
                                <>
                                    <Spinner />
                                    <span>Menyimpan...</span>
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    <span>Simpan</span>
                                </>
                            )}
                        </Button>
                    </div>
                </SettingSection>

                <Separator />

                {/* ══════════════════════════════════════════════════
                    SECTION 4 — Features
                ══════════════════════════════════════════════════ */}
                <SettingSection
                    title="Features & Capabilities"
                    description="Aktifkan atau nonaktifkan fitur tertentu."
                >
                    <div className="max-w-sm">
                        <SettingSwitchRow
                            id="maintenance_mode"
                            label="Maintenance Mode"
                            description="Tampilkan halaman maintenance kepada pengunjung."
                            checked={form.maintenance_mode}
                            onCheckedChange={(val) => {
                                setForm(prev => ({ ...prev, maintenance_mode: val }));
                                updateSettings({ maintenance_mode: val });
                            }}
                        />
                    </div>
                </SettingSection>

            </div>
        </LayoutContainer>
    );
}