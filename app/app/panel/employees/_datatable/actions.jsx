import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Ellipsis, Trash, IdCard } from "lucide-react";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Combobox, ComboboxChip, ComboboxChips, ComboboxChipsInput, ComboboxContent, ComboboxEmpty, ComboboxItem, ComboboxList, ComboboxValue, useComboboxAnchor } from "@/components/ui/combobox"
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const Actions = ({ row, table }) => {
    const anchor = useComboboxAnchor();
    const reload = table.options.meta?.reload;
    const [modalOpen, setModalOpen] = useState(false);
    const [modalOpenRole, setModalOpenRole] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingRole, setLoadingRole] = useState(false);
    const [roles, setRoles] = useState([]);
    const [selectedRoles, setSelectedRoles] = useState([]);

    // Fetch roles saat modal dibuka
    useEffect(() => {
        if (modalOpenRole) {
            fetchRoles();
            // Set selected roles dari data employee
            const currentRoles = row?.original?.roles_name || [];
            setSelectedRoles(currentRoles);
        }
    }, [modalOpenRole]);

    const fetchRoles = async () => {
        try {
            setLoadingRole(true);
            const response = await api.fetch(`${API_URL}/office/employees/roles`, {
                method: 'GET'
            });

            if (response?.success) {
                const roleNames = response.data.map(role => role.name);
                setRoles(roleNames);
            } else {
                toast.error('Gagal mengambil data roles');
            }
        } catch (error) {
            console.error('Error fetching roles:', error);
            toast.error('Gagal mengambil data roles');
        } finally {
            setLoadingRole(false);
        }
    };

    const handleDelete = async (uuid) => {
        try {
            setLoading(true);

            const response = await api.fetch(`${API_URL}/office/employees/${uuid}`, {
                method: 'DELETE'
            });

            if (response?.success) {
                toast.success('Karyawan berhasil dihapus');
                setModalOpen(false);
                if (reload) reload();
            } else {
                toast.error(response.message || 'Gagal menghapus akun');
            }
        } catch {
            toast.error('Gagal menghapus akun');
        } finally {
            setLoading(false);
        }
    };

    const handleAssignRole = async () => {
        try {
            setLoading(true);

            const response = await api.fetch(`${API_URL}/office/employees/${row.original?.uuid}/assign-roles`, {
                method: 'POST',
                body: JSON.stringify({
                    roles: selectedRoles
                })
            });

            if (response?.success) {
                toast.success('Role berhasil diterapkan');
                setModalOpenRole(false);
                if (reload) reload();
            } else {
                toast.error(response.message || 'Gagal menerapkan role');
            }
        } catch (error) {
            console.error('Error assigning roles:', error);
            toast.error('Gagal menerapkan role');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='flex gap-2'>
            {/* Roles */}
            <Button
                size="icon-sm"
                variant="outline"
                onClick={() => setModalOpenRole(true)}
            >
                <IdCard />
            </Button>

            {/* Menu Options */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button size="icon-sm" variant="outline">
                        <Ellipsis />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setModalOpen(true)}>
                        <Trash />
                        <span>Delete</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Delete Account */}
            <AlertDialog open={modalOpen} onOpenChange={setModalOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Ingin menghapus akun {row?.original?.full_name ?? '-'} ?</AlertDialogTitle>
                        <AlertDialogDescription>Tindakan ini akan menghapus akun secara sementara. Jika ingin dipulihkan masih bisa dilakukan.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <Button variant="destructive" onClick={() => handleDelete(row.original?.uuid)} disabled={loading}>
                            {loading ? 'Memproses...' : 'Hapus'}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Dialog Role Assign */}
            <AlertDialog open={modalOpenRole} onOpenChange={setModalOpenRole}>
                <AlertDialogContent className="sm:max-w-sm">
                    <AlertDialogHeader className="gap-0">
                        <AlertDialogTitle>Role Karyawan</AlertDialogTitle>
                        <AlertDialogDescription>Tentukan Role untuk {row?.original?.full_name ?? 'Karyawan'}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className='my-3 flex flex-col gap-1.5'>
                        <Label htmlFor="roles">Roles</Label>
                        {loadingRole ? (
                            <div className="text-sm text-stone-500">Memuat roles...</div>
                        ) : (
                            <Combobox
                                id='roles'
                                multiple
                                autoHighlight
                                items={roles}
                                value={selectedRoles}
                                onValueChange={setSelectedRoles}
                                defaultValue={row?.original?.roles_name || []}
                            >
                                <ComboboxChips ref={anchor}>
                                    <ComboboxValue>
                                        {(values) => (
                                            <React.Fragment>
                                                {values.map((value) => (
                                                    <ComboboxChip key={value}>{value}</ComboboxChip>
                                                ))}
                                                <ComboboxChipsInput placeholder="Pilih role..." />
                                            </React.Fragment>
                                        )}
                                    </ComboboxValue>
                                </ComboboxChips>
                                <ComboboxContent anchor={anchor} style={{ pointerEvents: 'auto' }}>
                                    <ComboboxEmpty>Tidak ada role tersedia.</ComboboxEmpty>
                                    <ComboboxList>
                                        {(item) => (
                                            <ComboboxItem key={item} value={item}>
                                                {item}
                                            </ComboboxItem>
                                        )}
                                    </ComboboxList>
                                </ComboboxContent>
                            </Combobox>
                        )}
                        <p className='text-xs text-stone-600'>Silakan Pilih Role untuk karyawan</p>
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogCancel asChild>
                            <Button variant="outline" disabled={loading}>
                                Batal
                            </Button>
                        </AlertDialogCancel>
                        <Button
                            onClick={handleAssignRole}
                            disabled={loading || loadingRole}
                        >
                            {loading ? 'Menyimpan...' : 'Simpan'}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default Actions;