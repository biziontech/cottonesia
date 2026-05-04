import { useState, useRef } from "react";
import { Plus, Search, X, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDebouncedCallback } from "use-debounce";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import api from "@/lib/api";
import Required from "@/components/partials/Required";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const initialForm = {
    name: "",
    description: "",
};

export default function DataTableToolbar({
    error,
    params = {},
    onSearch,
    onFilter,
    onRefresh,
}) {
    const [modalOpen, setModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [localSearch, setLocalSearch] = useState(params?.search || "");
    const prevParamsRef = useRef(params?.search);
    const [form, setForm] = useState(initialForm);

    if (prevParamsRef.current !== params?.search) {
        prevParamsRef.current = params?.search;
        if (localSearch !== params?.search) {
            setLocalSearch(params?.search || "");
        }
    }

    const isFiltered = localSearch;

    const debouncedSearch = useDebouncedCallback((value) => {
        if (onSearch) {
            onSearch(value);
        }
    }, 500);

    const handleSearchChange = (event) => {
        const value = event.target.value;
        setLocalSearch(value);
        debouncedSearch(value);
    };

    const handleSearchBlur = () => {
        if (onSearch) {
            onSearch(localSearch);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleResetFilters = () => {
        debouncedSearch.cancel();
        setLocalSearch("");

        if (onSearch) {
            onSearch("");
        }

        if (onFilter) {
            onFilter({});
        }
    };

    const handleCreate = async () => {
        try {
            setIsLoading(true);

            const response = await api.fetch(`${API_URL}/office/departments`, {
                method: "POST",
                body: JSON.stringify(form),
            });

            if (response?.success) {
                toast.success(response?.message || "Department berhasil ditambahkan");
                setForm(initialForm);
                setModalOpen(false);

                if (onRefresh) onRefresh();
            } else {
                toast.error(response?.message || "Gagal menambahkan department");
            }
        } catch (error) {
            toast.error(error?.message || "Terjadi kesalahan saat menambahkan department");
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
                        placeholder="Cari department"
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
                            <Plus />
                            <span>Tambah Department</span>
                        </Button>
                    </DialogTrigger>

                    <DialogContent className="sm:max-w-md">
                        <DialogHeader className="gap-0">
                            <DialogTitle className="text-base font-bold">Tambah Department</DialogTitle>
                            <DialogDescription>Lengkapi nama dan deskripsi department.</DialogDescription>
                        </DialogHeader>

                        <div className="grid grid-cols-1 gap-4 border-b border-dotted pb-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nama Department<Required /></Label>
                                <Input
                                    id="name"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="Contoh: Operasional"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Deskripsi<Required /></Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    placeholder="Masukkan deskripsi department"
                                />
                            </div>
                        </div>

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline" disabled={isLoading}>Batal</Button>
                            </DialogClose>

                            <Button onClick={handleCreate} disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Spinner />
                                        <span>Loading..</span>
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-4 w-4" />
                                        <span>Simpan</span>
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
