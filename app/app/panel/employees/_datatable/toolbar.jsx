import { useState, useRef } from "react";
import { Plus, Search, X, Save, CalendarIcon, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDebouncedCallback } from 'use-debounce';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { cn } from "@/lib/utils"
import { format } from "date-fns";
import api from "@/lib/api";
import Required from "@/components/partials/Required";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function DataTableToolbar({
    table,
    error,
    params = {},
    onSearch,
    onFilter,
    onRefresh
}) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [localSearch, setLocalSearch] = useState(params?.search || "");
    const prevParamsRef = useRef(params?.search);
    const [form, setForm] = useState({
        full_name: "",
        name: "",
        email: "",
        whatsapp_no: "",
        password: "",
        password_confirmation: "",
        gender: "",
        date_of_birth: "",
        address: ""
    });


    // Sync localSearch dengan params.search jika berubah dari luar
    if (prevParamsRef.current !== params?.search) {
        prevParamsRef.current = params?.search;
        if (localSearch !== params?.search) {
            setLocalSearch(params?.search || "");
        }
    }

    const isFiltered = localSearch;

    // Debounce search
    const debouncedSearch = useDebouncedCallback((value) => {
        if (onSearch) {
            onSearch(value);
        }
    }, 500);

    // Handle search change
    const handleSearchChange = (event) => {
        const value = event.target.value;
        setLocalSearch(value);
    };

    const handleSearchBlur = () => {
        if (onSearch) {
            onSearch(localSearch);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSelect = (name, value) => {
        setForm(prev => ({ ...prev, [name]: value }));
    };

    // Handle reset filters - UPDATE: Tanpa router.push
    const handleResetFilters = () => {
        // Cancel pending search
        debouncedSearch.cancel();

        // Reset local search state
        setLocalSearch("");

        // Reset search via hook (akan trigger fetch ulang dengan search kosong)
        if (onSearch) {
            onSearch("");
        }

        // Reset filters jika ada
        if (onFilter) {
            onFilter({});
        }
    };

    // Handle Create
    const handleRegister = async () => {
        try {
            setIsLoading(true);

            const response = await api.fetch(`${API_URL}/office/employees`, {
                method: 'POST',
                body: JSON.stringify(form),
            });

            const data = response;

            if (data?.success) {
                toast.success(data?.message || "Pendaftaran berhasil");

                // Reset form
                setForm({
                    full_name: "",
                    name: "",
                    email: "",
                    whatsapp_no: "",
                    password: "",
                    password_confirmation: "",
                    gender: "",
                    date_of_birth: "",
                    address: ""
                });

                setModalOpen(false);

                if (onRefresh) onRefresh();
            } else {
                toast.error(data?.message || "Pendaftaran gagal");
            }

        } catch (error) {
            toast.error(error?.message || "Terjadi kesalahan saat mendaftar");
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="flex flex-wrap items-center justify-between gap-2 flex-col-reverse sm:flex-row">
            <div className="flex flex-wrap items-center gap-2 md:flex-row md:justify-start justify-center">
                <div className="relative">
                    <Input
                        disabled={error}
                        placeholder="Search name"
                        value={localSearch}
                        onChange={handleSearchChange}
                        onBlur={handleSearchBlur}
                        className="h-9 ps-9 w-auto border-input rounded-md text-sm focus-visible:ring-transparent"
                    />
                    <Search className="absolute left-3 text-stone-600 top-0 bottom-0 my-auto w-4 h-4" />
                </div>
                <div className="flex gap-2">
                    {(isFiltered || localSearch) && (
                        <Button
                            variant="outline"
                            onClick={handleResetFilters}
                            className="h-9 px-2 lg:px-3"
                        >
                            <X className="h-4 w-4" />
                            Reset
                        </Button>
                    )}
                </div>
            </div>
            <div className="flex gap-2">
                <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" className="h-9">
                            <Plus  />
                            <span>Daftar Akun</span>
                        </Button>
                    </DialogTrigger>

                    <DialogContent className="sm:max-w-lg">
                        <DialogHeader className="gap-0">
                            <DialogTitle className="text-base font-bold">Pendaftaran Akun</DialogTitle>
                            <DialogDescription>Lengkapi data diri Anda</DialogDescription>
                        </DialogHeader>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 border-b pb-4 border-dotted gap-y-6">

                            <div className="flex flex-col gap-4 col-span-1 lg:col-span-2">
                                <div className="space-y-2">
                                    <Label htmlFor="full_name">Nama Lengkap<Required /></Label>
                                    <Input
                                        id="full_name"
                                        name="full_name"
                                        value={form.full_name}
                                        onChange={handleChange}
                                        placeholder="Masukkan nama lengkap"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="name">Nama Panggilan<Required /></Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        placeholder="Masukkan nama panggilan"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="contoh@email.com"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="whatsapp_no">No WhatsApp</Label>
                                <Input
                                    id="whatsapp_no"
                                    name="whatsapp_no"
                                    value={form.whatsapp_no}
                                    onChange={handleChange}
                                    placeholder="08xxxxxxxxxx"
                                />
                            </div>

                            {/* Password */}
                            <div className="space-y-2 relative">
                                <Label htmlFor="password">Password<Required /></Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={form.password}
                                        onChange={handleChange}
                                        placeholder="Minimal 8 karakter"
                                        className="pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                                    >
                                        {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div className="space-y-2 relative">
                                <Label htmlFor="password_confirmation">Konfirmasi Password<Required /></Label>
                                <div className="relative">
                                    <Input
                                        id="password_confirmation"
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="password_confirmation"
                                        value={form.password_confirmation}
                                        onChange={handleChange}
                                        placeholder="Ulangi password"
                                        className="pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                                    >
                                        {showConfirmPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="gender">Jenis Kelamin<Required /></Label>
                                <Select onValueChange={(value) => handleSelect("gender", value)}>
                                    <SelectTrigger id="gender"  className="w-full">
                                        <SelectValue placeholder="Pilih gender" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="male">Laki-laki</SelectItem>
                                        <SelectItem value="female">Perempuan</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="date_of_birth">Tanggal Lahir</Label>
                                <Input
                                    id="date_of_birth"
                                    type="date"
                                    name="date_of_birth"
                                    value={form.date_of_birth}
                                    onChange={handleChange}
                                />
                            </div>

                        </div>



                        <div className="w-full space-y-2">
                            <Label>Alamat</Label>
                            <Textarea placeholder="Masukkan alamat lengkap" />
                        </div>

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>

                            <Button onClick={handleRegister} disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Spinner />
                                        <span>Loading..</span>
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-4 w-4" />
                                        <span>Daftar</span>
                                    </>
                                )}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

            </div>
        </div>
    );
}