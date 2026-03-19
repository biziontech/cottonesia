"use client"


import PageTitle from '@/components/partials/PageTitle';
import LayoutContainer from '@/components/partials/LayoutContainer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, KeyRound } from "lucide-react";
import { useState, useEffect } from 'react';
import { SquarePen, Save, X, EyeOff, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ButtonGroup } from "@/components/ui/button-group";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from "@/components/ui/badge";
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Switch } from "@/components/ui/switch";
import { id } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import api from '@/lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const renderEditableField = (label, description, content) => {
    return (
        <div className="grid md:grid-cols-6 lg:grid-cols-3 py-5 md:grid-rows-1 gap-5 md:gap-10">
            <div className='flex flex-col gap-0.5 md:col-span-2 lg:col-span-1'>
                <h4 className='text-lg font-semibold text-gray-700 dark:text-slate-300'>{label}</h4>
                <p className='text-sm text-gray-600 dark:text-slate-500'>{description}</p>
            </div>
            <div className="md:col-span-4 lg:col-span-2 flex flex-row justify-between items-center rounded-xl px-4 py-0 pe-2">
                {content}
            </div>
        </div>
    );
};

const AccountContent = () => {
    const { user, setUser, loading: loading_auth } = useAuth();
    const [accountData, setAccountData] = useState({
        name: user?.name || "",
        full_name: user?.full_name || "",
        whatsapp_no: user?.whatsapp_no || "",
        gender: user?.gender || "",
        date_of_birth: user?.date_of_birth,
        address: user?.address || "",
        pin: user?.pin || "",
        has_presence: user?.has_presence || false
    });

    const [editingField, setEditingField] = useState(null);
    const [tempValue, setTempValue] = useState("");
    const [tempDate, setTempDate] = useState(null);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    // Sync accountData dengan user dari useAuth
    useEffect(() => {
        if (user) {
            setAccountData({
                name: user.name || "",
                full_name: user.full_name || "",
                whatsapp_no: user.whatsapp_no || "",
                gender: user.gender || "",
                date_of_birth: user.date_of_birth,
                address: user.address || "",
                pin: user.pin || "",
                has_presence: user.has_presence || false
            });
        }
    }, [user]);

    // Simple validation
    const validateField = (field, value) => {
        if (!value || (typeof value === 'string' && !value.trim())) {
            return "Field ini wajib diisi";
        }

        if (field === "whatsapp_no") {
            if (!value.startsWith("62")) {
                return "Nomor WhatsApp harus diawali dengan 62";
            }
            if (!/^62\d{9,12}$/.test(value)) {
                return "Format nomor WhatsApp tidak valid (62xxxxxxxxx)";
            }
        }

        return "";
    };

    const handleEdit = (field) => {
        setEditingField(field);
        if (field === "date_of_birth") {
            setTempDate(new Date(accountData[field]));
        } else {
            setTempValue(accountData[field]);
        }
        setErrors({ ...errors, [field]: "" });
    };

    const handleSave = async (field) => {
        const value = field === "date_of_birth" ? tempDate : tempValue;
        const error = validateField(field, value);

        if (error) {
            setErrors({ ...errors, [field]: error });
            return;
        }

        setIsLoading(true);

        try {
            const response = await api.fetch(`${API_URL}/office/profile/update`, {
                method: 'PUT',
                body: JSON.stringify({
                    field: field,
                    value: field === "date_of_birth" ? format(tempDate, "yyyy-MM-dd") : tempValue
                })
            });

            const data = response;

            if (!response?.success) {
                throw new Error(data.message || 'Gagal menyimpan data');
            }

            const newValue = field === "date_of_birth" ? format(tempDate, "yyyy-MM-dd") : tempValue;

            // Update local accountData state
            setAccountData({
                ...accountData,
                [field]: newValue
            });

            // Update user di useAuth context
            setUser({
                ...user,
                [field]: newValue
            });

            setEditingField(null);
            setErrors({ ...errors, [field]: "" });

            toast.success(data.message || "Data berhasil disimpan")

        } catch (error) {
            toast.error(error.message || "Terjadi kesalahan saat menyimpan data");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = (field) => {
        setEditingField(null);
        setTempValue("");
        setTempDate(null);
        setErrors({ ...errors, [field]: "" });
    };

    return (
        <div className='flex flex-col divide-y-2 divide-stone-200/70 divide-dotted dark:divide-slate-800'>
            <div className="flex justify-between py-5 gap-2 items-center">
                <h3 className="text-lg font-semibold text-primary">Personal Information</h3>
            </div>

            {/* Nama Panggilan */}
            {renderEditableField(
                "Nama Panggilan",
                "Masukkan nama panggilan Anda",
                <div className={`${editingField === "name" ? 'items-start' : 'items-center'} w-full flex justify-between gap-2`}>
                    {editingField === "name" ? (
                        <>
                            <div className="flex-1">
                                <InputGroup data-disabled={isLoading} className={errors.name ? 'border-red-500' : ''}>
                                    <InputGroupInput
                                        type="text"
                                        value={tempValue}
                                        onChange={(e) => setTempValue(e.target.value)}
                                        disabled={isLoading}
                                    />
                                    <InputGroupAddon align="inline-end" className={isLoading ? 'flex' : 'hidden'}>
                                        <InputGroupText>Saving...</InputGroupText>
                                        <Spinner />
                                    </InputGroupAddon>
                                </InputGroup>
                                {errors.name && (
                                    <p className="text-xs text-red-600 mt-1">{errors.name}</p>
                                )}
                            </div>
                            <ButtonGroup>
                                <Button
                                    size="icon"
                                    variant="outline"
                                    onClick={() => handleSave("name")}
                                    disabled={isLoading}
                                >
                                    <Save className="h-4 w-4" />
                                </Button>
                                <Button
                                    size="icon"
                                    variant="outline"
                                    onClick={() => handleCancel("name")}
                                    disabled={isLoading}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </ButtonGroup>
                        </>
                    ) : (
                        <>
                            {loading_auth ? (
                                <Skeleton className="h-6 w-40" />
                            ) : !accountData.name ? (
                                '-'
                            ) : (
                                <p className="text-gray-700 dark:text-slate-300 text-sm">{accountData.name}</p>
                            )}
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button size="icon" variant="outline" onClick={() => handleEdit("name")}>
                                        <SquarePen className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="left">Edit</TooltipContent>
                            </Tooltip>
                        </>
                    )}
                </div>
            )}

            {/* Nama Lengkap */}
            {renderEditableField(
                "Nama Lengkap",
                "Masukkan nama lengkap Anda",
                <div className={`${editingField === "full_name" ? 'items-start' : 'items-center'} w-full flex justify-between gap-2`}>
                    {editingField === "full_name" ? (
                        <>
                            <div className="flex-1">
                                <InputGroup data-disabled={isLoading} className={errors.full_name ? 'border-red-500' : ''}>
                                    <InputGroupInput
                                        type="text"
                                        value={tempValue}
                                        onChange={(e) => setTempValue(e.target.value)}
                                        disabled={isLoading}
                                    />
                                    <InputGroupAddon align="inline-end" className={isLoading ? 'flex' : 'hidden'}>
                                        <InputGroupText>Saving...</InputGroupText>
                                        <Spinner />
                                    </InputGroupAddon>
                                </InputGroup>
                                {errors.full_name && (
                                    <p className="text-xs text-red-600 mt-1">{errors.full_name}</p>
                                )}
                            </div>
                            <ButtonGroup>
                                <Button
                                    size="icon"
                                    variant="outline"
                                    onClick={() => handleSave("full_name")}
                                    disabled={isLoading}
                                >
                                    <Save className="h-4 w-4" />
                                </Button>
                                <Button
                                    size="icon"
                                    variant="outline"
                                    onClick={() => handleCancel("full_name")}
                                    disabled={isLoading}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </ButtonGroup>
                        </>
                    ) : (
                        <>
                            {loading_auth ? (
                                <Skeleton className="h-6 w-36" />
                            ) : !accountData.full_name ? (
                                '-'
                            ) : (
                                <p className="text-gray-700 dark:text-slate-300 text-sm">{accountData.full_name}</p>
                            )}
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button size="icon" variant="outline" onClick={() => handleEdit("full_name")}>
                                        <SquarePen className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="left">Edit</TooltipContent>
                            </Tooltip>
                        </>
                    )}
                </div>
            )}

            {/* Nomor WhatsApp */}
            {renderEditableField(
                "Nomor WhatsApp",
                "Format: 62xxxxxxxxx",
                <div className={`${editingField === "whatsapp_no" ? 'items-start' : 'items-center'} w-full flex justify-between gap-2`}>
                    {editingField === "whatsapp_no" ? (
                        <>
                            <div className="flex-1">
                                <InputGroup data-disabled={isLoading} className={errors.whatsapp_no ? 'border-red-500' : ''}>
                                    <InputGroupInput
                                        type="text"
                                        value={tempValue}
                                        onChange={(e) => setTempValue(e.target.value)}
                                        placeholder="628XXXXXXXXX"
                                        disabled={isLoading}
                                    />
                                    <InputGroupAddon align="inline-end" className={isLoading ? 'flex' : 'hidden'}>
                                        <InputGroupText>Saving...</InputGroupText>
                                        <Spinner />
                                    </InputGroupAddon>
                                </InputGroup>
                                {errors.whatsapp_no && (
                                    <p className="text-xs text-red-600 mt-1">{errors.whatsapp_no}</p>
                                )}
                            </div>
                            <ButtonGroup>
                                <Button
                                    size="icon"
                                    variant="outline"
                                    onClick={() => handleSave("whatsapp_no")}
                                    disabled={isLoading}
                                >
                                    <Save className="h-4 w-4" />
                                </Button>
                                <Button
                                    size="icon"
                                    variant="outline"
                                    onClick={() => handleCancel("whatsapp_no")}
                                    disabled={isLoading}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </ButtonGroup>
                        </>
                    ) : (
                        <>
                            {loading_auth ? (
                                <Skeleton className="h-6 w-26" />
                            ) : !accountData.whatsapp_no ? (
                                '-'
                            ) : (
                                <p className="text-gray-700 dark:text-slate-300 text-sm">{accountData.whatsapp_no}</p>
                            )}
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button size="icon" variant="outline" onClick={() => handleEdit("whatsapp_no")}>
                                        <SquarePen className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="left">Edit</TooltipContent>
                            </Tooltip>
                        </>
                    )}
                </div>
            )}

            {/* Jenis Kelamin */}
            {renderEditableField(
                "Jenis Kelamin",
                "Pilih jenis kelamin",
                <div className={`${editingField === "gender" ? 'items-start' : 'items-center'} w-full flex justify-between gap-2`}>
                    {editingField === "gender" ? (
                        <>
                            <div className="flex-1">
                                <Select value={tempValue} onValueChange={setTempValue}>
                                    <SelectTrigger className={errors.gender ? 'border-red-500' : ''}>
                                        <SelectValue placeholder="Pilih jenis kelamin" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="male">Laki-laki</SelectItem>
                                        <SelectItem value="female">Perempuan</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.gender && (
                                    <p className="text-xs text-red-600 mt-1">{errors.gender}</p>
                                )}
                            </div>
                            <ButtonGroup>
                                <Button
                                    size="icon"
                                    variant="outline"
                                    onClick={() => handleSave("gender")}
                                    disabled={isLoading}
                                >
                                    <Save className="h-4 w-4" />
                                </Button>
                                <Button
                                    size="icon"
                                    variant="outline"
                                    onClick={() => handleCancel("gender")}
                                    disabled={isLoading}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </ButtonGroup>
                        </>
                    ) : (
                        <>
                            {loading_auth ? (
                                <Skeleton className="h-6 w-26" />
                            ) : (
                                <p className="text-gray-700 dark:text-slate-300 text-sm">
                                    {!accountData.gender ? '-' : accountData.gender === "male" ? "Laki-laki" : "Perempuan"}
                                </p>
                            )}
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button size="icon" variant="outline" onClick={() => handleEdit("gender")}>
                                        <SquarePen className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="left">Edit</TooltipContent>
                            </Tooltip>
                        </>
                    )}
                </div>
            )}

            {/* Tanggal Lahir dengan Calendar */}
            {renderEditableField(
                "Tanggal Lahir",
                "Pilih tanggal lahir",
                <div className={`${editingField === "date_of_birth" ? 'items-start' : 'items-center'} w-full flex justify-between gap-2`}>
                    {editingField === "date_of_birth" ? (
                        <>
                            <div className="flex-1">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                "w-fit min-w-44 justify-start text-left font-normal",
                                                !tempDate && "text-muted-foreground",
                                                errors.date_of_birth && "border-red-500"
                                            )}
                                            disabled={isLoading}
                                        >
                                            <CalendarIcon className="h-4 w-4" />
                                            {tempDate ? format(tempDate, "PPP", { locale: id }) : <span>Pilih tanggal</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={tempDate}
                                            onSelect={setTempDate}
                                            initialFocus
                                            locale={id}
                                            captionLayout="dropdown"
                                            disabled={(date) => date > new Date()}
                                        />
                                    </PopoverContent>
                                </Popover>
                                {errors.date_of_birth && (
                                    <p className="text-xs text-red-600 mt-1">{errors.date_of_birth}</p>
                                )}
                            </div>
                            <ButtonGroup>
                                <Button
                                    size="icon"
                                    variant="outline"
                                    onClick={() => handleSave("date_of_birth")}
                                    disabled={isLoading}
                                >
                                    <Save className="h-4 w-4" />
                                </Button>
                                <Button
                                    size="icon"
                                    variant="outline"
                                    onClick={() => handleCancel("date_of_birth")}
                                    disabled={isLoading}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </ButtonGroup>
                        </>
                    ) : (
                        <>
                            {loading_auth ? (
                                <Skeleton className="h-6 w-20" />
                            ) : (
                                <p className="text-gray-700 dark:text-slate-300 text-sm">
                                    {accountData.date_of_birth ? format(new Date(accountData.date_of_birth), "PPP", { locale: id }) : '-'}
                                </p>
                            )}
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button size="icon" variant="outline" onClick={() => handleEdit("date_of_birth")}>
                                        <SquarePen className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="left">Edit</TooltipContent>
                            </Tooltip>
                        </>
                    )}
                </div>
            )}

            {/* Alamat */}
            {renderEditableField(
                "Alamat",
                "Masukkan alamat lengkap",
                <div className={`${editingField === "address" ? 'items-start' : 'items-center'} w-full flex justify-between gap-2`}>
                    {editingField === "address" ? (
                        <>
                            <div className="flex-1">
                                <Textarea
                                    value={tempValue}
                                    onChange={(e) => setTempValue(e.target.value)}
                                    className={errors.address ? 'border-red-500' : ''}
                                    disabled={isLoading}
                                />
                                {errors.address && (
                                    <p className="text-xs text-red-600 mt-1">{errors.address}</p>
                                )}
                            </div>
                            <ButtonGroup>
                                <Button
                                    size="icon"
                                    variant="outline"
                                    onClick={() => handleSave("address")}
                                    disabled={isLoading}
                                >
                                    <Save className="h-4 w-4" />
                                </Button>
                                <Button
                                    size="icon"
                                    variant="outline"
                                    onClick={() => handleCancel("address")}
                                    disabled={isLoading}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </ButtonGroup>
                        </>
                    ) : (
                        <>
                            {loading_auth ? (
                                <Skeleton className="h-6 w-46" />
                            ) : !accountData.address ? (
                                '-'
                            ) : (
                                <p className="text-gray-700 dark:text-slate-300 text-sm">{accountData.address}</p>
                            )}
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button size="icon" variant="outline" onClick={() => handleEdit("address")}>
                                        <SquarePen className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="left">Edit</TooltipContent>
                            </Tooltip>
                        </>
                    )}
                </div>
            )}

            <div className="flex justify-between py-5 gap-2 items-center">
                <h3 className="text-lg font-semibold text-primary">Presences</h3>
            </div>

            {/* PIN */}
            {renderEditableField(
                "PIN",
                "Masukkan PIN Anda",
                <div className={`${editingField === "pin" ? 'items-start' : 'items-center'} w-full flex justify-between gap-2`}>
                    {editingField === "pin" ? (
                        <>
                            <div className="flex-1">
                                <InputGroup data-disabled={isLoading} className={errors.pin ? 'border-red-500' : ''}>
                                    <InputGroupInput
                                        type="text"
                                        value={tempValue}
                                        onChange={(e) => setTempValue(e.target.value)}
                                        disabled={isLoading}
                                    />
                                    <InputGroupAddon align="inline-end" className={isLoading ? 'flex' : 'hidden'}>
                                        <InputGroupText>Saving...</InputGroupText>
                                        <Spinner />
                                    </InputGroupAddon>
                                </InputGroup>
                                {errors.pin && (
                                    <p className="text-xs text-red-600 mt-1">{errors.pin}</p>
                                )}
                            </div>
                            <ButtonGroup>
                                <Button
                                    size="icon"
                                    variant="outline"
                                    onClick={() => handleSave("pin")}
                                    disabled={isLoading}
                                >
                                    <Save className="h-4 w-4" />
                                </Button>
                                <Button
                                    size="icon"
                                    variant="outline"
                                    onClick={() => handleCancel("pin")}
                                    disabled={isLoading}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </ButtonGroup>
                        </>
                    ) : (
                        <>
                            {loading_auth ? (
                                <Skeleton className="h-6 w-40" />
                            ) : !accountData.pin ? (
                                '-'
                            ) : (
                                <p className="text-gray-700 dark:text-slate-300 text-sm">
                                    {accountData.pin}
                                </p>
                            )}
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button size="icon" variant="outline" onClick={() => handleEdit("pin")}>
                                        <SquarePen className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="left">Edit</TooltipContent>
                            </Tooltip>
                        </>
                    )}
                </div>
            )}

            {/* Has Presence */}
            {renderEditableField(
                "Status Absensi",
                "Aktifkan jika ingin dihitung saat absen",
                <div className={`${editingField === "has_presence" ? 'items-start' : 'items-center'} w-full flex justify-between gap-2`}>
                    {editingField === "has_presence" ? (
                        <>
                            <Label className="flex items-center gap-3">
                                <Switch
                                    checked={tempValue}
                                    onCheckedChange={(value) => setTempValue(value)}
                                    disabled={isLoading}
                                />
                                <span className="text-sm">
                                    {tempValue ? "Aktif" : "Nonaktif"}
                                </span>
                            </Label>

                            <ButtonGroup>
                                <Button
                                    size="icon"
                                    variant="outline"
                                    onClick={() => handleSave("has_presence")}
                                    disabled={isLoading}
                                >
                                    <Save className="h-4 w-4" />
                                </Button>
                                <Button
                                    size="icon"
                                    variant="outline"
                                    onClick={() => handleCancel("has_presence")}
                                    disabled={isLoading}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </ButtonGroup>
                        </>
                    ) : (
                        <>
                            {loading_auth ? (
                                <Skeleton className="h-6 w-20" />
                            ) : (
                                <p className="text-gray-700 dark:text-slate-300 text-sm">
                                    {accountData.has_presence ? "Aktif" : "Nonaktif"}
                                </p>
                            )}
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        size="icon"
                                        variant="outline"
                                        onClick={() => {
                                            setTempValue(accountData.has_presence)
                                            handleEdit("has_presence")
                                        }}
                                    >
                                        <SquarePen className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="left">Edit</TooltipContent>
                            </Tooltip>
                        </>
                    )}
                </div>
            )}

        </div>
    );
};

const SecurityContent = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });
    const [passwords, setPasswords] = useState({
        current: "",
        new: "",
        confirm: ""
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const validatePasswords = () => {
        const newErrors = {};

        if (!passwords.current.trim()) {
            newErrors.current = "Password saat ini wajib diisi";
        }

        if (!passwords.new.trim()) {
            newErrors.new = "Password baru wajib diisi";
        }

        if (!passwords.confirm.trim()) {
            newErrors.confirm = "Konfirmasi password wajib diisi";
        } else if (passwords.new !== passwords.confirm) {
            newErrors.confirm = "Password tidak cocok";
        }

        return newErrors;
    };

    const handleSave = async () => {
        const validationErrors = validatePasswords();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsLoading(true);

        try {
            const response = await api.fetch(`${API_URL}/office/auth/change-password`, {
                method: 'PUT',
                body: JSON.stringify({
                    current_password: passwords.current,
                    password: passwords.new,
                    password_confirmation: passwords.confirm
                })
            });

            const data = await response;

            if (!response?.success) {
                throw new Error(data.message || 'Gagal mengubah password');
            }

            setIsEditing(false);
            setPasswords({ current: "", new: "", confirm: "" });
            setErrors({});

            toast.success(data.message || "Password berhasil diubah")


        } catch (error) {
            toast.error(error.message || "Terjadi kesalahan saat mengubah password");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setPasswords({ current: "", new: "", confirm: "" });
        setErrors({});
    };

    const togglePasswordVisibility = (field) => {
        setShowPasswords({ ...showPasswords, [field]: !showPasswords[field] });
    };

    return (
        <div className='flex flex-col divide-y-2 divide-gray-200/70 divide-dotted dark:divide-slate-800'>
            {renderEditableField(
                "Password",
                "Ubah password akun",
                <div className={`${isEditing ? 'items-start' : 'items-center'} w-full flex justify-between gap-2`}>
                    {!isEditing ? (
                        <>
                            <p className="text-gray-700 dark:text-slate-300 text-sm">••••••••</p>
                            <Button size="icon" variant="outline" onClick={() => setIsEditing(true)}>
                                <SquarePen className="h-4 w-4" />
                            </Button>
                        </>
                    ) : (
                        <div className="w-full flex flex-col divide-y-2 divide-stone-200/70 divide-dotted dark:divide-slate-800">
                            <div className='py-2'>
                                <div className='space-y-1.5'>
                                    <Label htmlFor="password-current">Password saat ini</Label>
                                    <div className="relative">
                                        <Input
                                            id="password-current"
                                            type={showPasswords.current ? "text" : "password"}
                                            value={passwords.current}
                                            onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                                            className={errors.current ? 'border-red-500 pr-10' : 'pr-10'}
                                            placeholder="••••••••"
                                            disabled={isLoading}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => togglePasswordVisibility('current')}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 cursor-pointer"
                                        >
                                            {showPasswords.current ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>
                                {errors.current ? (
                                    <p className="text-xs text-red-600 mt-1">{errors.current}</p>
                                ) : (
                                    <p className="text-xs text-muted-foreground mt-1">Silakan masukan password saat ini</p>
                                )}
                            </div>

                            <div className='py-2'>
                                <div className='space-y-1.5'>
                                    <Label htmlFor="password-new">Password baru</Label>
                                    <div className="relative">
                                        <Input
                                            id="password-new"
                                            type={showPasswords.new ? "text" : "password"}
                                            value={passwords.new}
                                            onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                                            className={errors.new ? 'border-red-500 pr-10' : 'pr-10'}
                                            placeholder="••••••••"
                                            disabled={isLoading}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => togglePasswordVisibility('new')}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 cursor-pointer"
                                        >
                                            {showPasswords.new ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>
                                {errors.new ? (
                                    <p className="text-xs text-red-600 mt-1">{errors.new}</p>
                                ) : (
                                    <p className="text-xs text-muted-foreground mt-1">Silakan masukan password saat ini</p>
                                )}
                            </div>

                            <div className='py-2'>
                                <div className='space-y-1.5'>
                                    <Label htmlFor="password-confirm">Konfirmasi Password baru</Label>
                                    <div className='relative'>
                                        <Input
                                            id="password-confirm"
                                            type={showPasswords.confirm ? "text" : "password"}
                                            value={passwords.confirm}
                                            onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                                            className={errors.confirm ? 'border-red-500 pr-10' : 'pr-10'}
                                            placeholder="••••••••"
                                            disabled={isLoading}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => togglePasswordVisibility('confirm')}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 cursor-pointer"
                                        >
                                            {showPasswords.confirm ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>
                                {errors.confirm ? (
                                    <p className="text-xs text-red-600 mt-1">{errors.confirm}</p>
                                ) : (
                                    <p className="text-xs text-muted-foreground mt-1">Konfirmasi password baru anda</p>
                                )}
                            </div>

                            <div className="flex gap-2 justify-end pt-4">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={handleSave}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <Spinner />
                                            <span>Menyimpan</span>
                                        </>
                                    ) : (
                                        <>
                                            <Save className="h-4 w-4" />
                                            <span>Simpan</span>
                                        </>
                                    )}

                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={handleCancel}
                                    disabled={isLoading}
                                >
                                    <X className="h-4 w-4" />
                                    Batal
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const tabs = [
    {
        name: "General",
        value: "general",
        icon: User,
        content: AccountContent,
    },
    {
        name: "Security",
        value: "security",
        icon: KeyRound,
        content: SecurityContent,
    },
]



export default function Profile() {
    // ambil user
    const { user, loading } = useAuth();
    // return
    return (
        <LayoutContainer>
            <div className='max-w-6xl mx-auto w-full'>
                <PageTitle title="Profile" subtitle="Manage your profile settings" />

                <div className='flex flex-col gap-5'>
                    <div className='p-5 border rounded-2xl flex gap-5 justify-between divide-y lg:divide-y-0 lg:divide-x flex-col lg:flex-row'>
                        <div className='flex gap-5 flex-1 pb-5 lg:pb-0'>
                            <Avatar className="size-16">
                                <AvatarImage src="https://github.com/shadcn.png" alt={user?.full_name} />
                                <AvatarFallback>{user?.initial_name}</AvatarFallback>
                            </Avatar>
                            <div className='flex items-start justify-center flex-col flex-1'>
                                {loading ? (<Skeleton className="h-6 w-36" />) : (<h4 className='font-bold'>{user?.full_name}</h4>)}
                                {loading ? (<Skeleton className="h-4 w-20 mt-1" />) : (<p className='text-sm'>Web Developer</p>)}
                                {loading ? (<Skeleton className="h-4 w-40 mt-2" />) : (<small className='text-stone-500 mt-1'>✨ Jangan Pernah menyerah</small>)}
                            </div>
                        </div>
                        <div className='flex-1 flex flex-col gap-1'>
                            <Label className="font-semibold">Roles</Label>
                            <div>
                                {loading ? (
                                    <div className='flex gap-2 mt-1'>
                                        <Skeleton className="h-5 w-20" />
                                        <Skeleton className="h-5 w-16" />
                                    </div>
                                ) : user?.roles.map((role, index) => {
                                    return (<Badge key={index} variant="outline" className='rounded-md'>{role}</Badge>)
                                })}
                            </div>
                        </div>
                    </div>
                    <Tabs defaultValue={tabs[0].value} className="w-full">
                        <TabsList className="px-1 ">
                            {tabs.map((tab) => (
                                <TabsTrigger key={tab.value} value={tab.value} className="flex items-center text-xs cursor-pointer">
                                    <tab.icon />
                                    {tab.name}
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        {tabs.map((tab) => {
                            const Content = tab.content
                            return (
                                <TabsContent key={tab.value} value={tab.value}>
                                    <Content />
                                </TabsContent>
                            )
                        })}
                    </Tabs>
                </div>
            </div>
        </LayoutContainer>
    )
}