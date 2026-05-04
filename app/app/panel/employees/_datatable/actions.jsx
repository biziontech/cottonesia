import React, { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Building2, Ellipsis, Trash, IdCard } from "lucide-react";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Combobox, ComboboxChip, ComboboxChips, ComboboxChipsInput, ComboboxContent, ComboboxEmpty, ComboboxItem, ComboboxList, ComboboxValue, useComboboxAnchor } from "@/components/ui/combobox"
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const Actions = ({ row, table }) => {
    const anchor = useComboboxAnchor();
    const reload = table.options.meta?.reload;
    const [modalOpen, setModalOpen] = useState(false);
    const [modalOpenRole, setModalOpenRole] = useState(false);
    const [modalOpenDepartment, setModalOpenDepartment] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingRole, setLoadingRole] = useState(false);
    const [loadingDepartment, setLoadingDepartment] = useState(false);
    const [roles, setRoles] = useState([]);
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [selectedDepartments, setSelectedDepartments] = useState([]);

    const fetchRoles = useCallback(async () => {
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
    }, []);

    const fetchDepartments = useCallback(async () => {
        try {
            setLoadingDepartment(true);

            const [departmentResponse, employeeDepartmentResponse] = await Promise.all([
                api.fetch(`${API_URL}/office/departments/data`, {
                    method: 'GET'
                }),
                api.fetch(`${API_URL}/office/employees/${row.original?.uuid}/departments`, {
                    method: 'GET'
                })
            ]);

            if (departmentResponse?.success) {
                setDepartments(departmentResponse.data || []);
            } else {
                toast.error(departmentResponse?.message || 'Gagal mengambil data department');
            }

            if (employeeDepartmentResponse?.success) {
                const currentDepartments = employeeDepartmentResponse?.data?.departments || [];
                setSelectedDepartments(currentDepartments.map((department) => department.uuid));
            } else {
                toast.error(employeeDepartmentResponse?.message || 'Gagal mengambil department karyawan');
            }
        } catch (error) {
            console.error('Error fetching departments:', error);
            toast.error('Gagal mengambil data department');
        } finally {
            setLoadingDepartment(false);
        }
    }, [row.original?.uuid]);

    // Fetch roles saat modal dibuka
    useEffect(() => {
        if (modalOpenRole) {
            fetchRoles();
            // Set selected roles dari data employee
            const currentRoles = row?.original?.roles_name || [];
            setSelectedRoles(currentRoles);
        }
    }, [fetchRoles, modalOpenRole, row?.original?.roles_name]);

    useEffect(() => {
        if (modalOpenDepartment) {
            fetchDepartments();
        }
    }, [fetchDepartments, modalOpenDepartment]);

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

    const handleToggleDepartment = (uuid, checked) => {
        setSelectedDepartments((prev) => {
            if (checked) {
                return prev.includes(uuid) ? prev : [...prev, uuid];
            }

            return prev.filter((departmentUuid) => departmentUuid !== uuid);
        });
    };

    const handleAssignDepartment = async () => {
        try {
            setLoading(true);

            const response = await api.fetch(`${API_URL}/office/employees/${row.original?.uuid}/assign-departments`, {
                method: 'POST',
                body: JSON.stringify({
                    departments: selectedDepartments
                })
            });

            if (response?.success) {
                toast.success(response.message || 'Department berhasil diterapkan');
                setModalOpenDepartment(false);
                if (reload) reload();
            } else {
                toast.error(response.message || 'Gagal menerapkan department');
            }
        } catch (error) {
            console.error('Error assigning departments:', error);
            toast.error('Gagal menerapkan department');
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

            {/* Departments */}
            <Button
                size="icon-sm"
                variant="outline"
                onClick={() => setModalOpenDepartment(true)}
            >
                <Building2 />
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

            {/* Dialog Department Assign */}
            <AlertDialog open={modalOpenDepartment} onOpenChange={setModalOpenDepartment}>
                <AlertDialogContent className="sm:max-w-md">
                    <AlertDialogHeader className="gap-0">
                        <AlertDialogTitle>Department Karyawan</AlertDialogTitle>
                        <AlertDialogDescription>Tentukan department untuk {row?.original?.full_name ?? 'Karyawan'}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className='my-3 flex flex-col gap-2'>
                        <Label>Departments</Label>
                        {loadingDepartment ? (
                            <div className="flex h-32 items-center justify-center text-sm text-stone-500">Memuat department...</div>
                        ) : (
                            <ScrollArea className="h-64 rounded-xl border">
                                <div className="divide-y">
                                    {departments.length > 0 ? departments.map((department) => {
                                        const checked = selectedDepartments.includes(department.uuid);

                                        return (
                                            <label
                                                key={department.uuid}
                                                className="flex cursor-pointer items-center gap-3 p-3 text-sm hover:bg-accent/50"
                                            >
                                                <Checkbox
                                                    checked={checked}
                                                    onCheckedChange={(value) => handleToggleDepartment(department.uuid, Boolean(value))}
                                                />
                                                <span className="font-medium">{department.name}</span>
                                            </label>
                                        );
                                    }) : (
                                        <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
                                            Tidak ada department tersedia.
                                        </div>
                                    )}
                                </div>
                            </ScrollArea>
                        )}
                        <p className='text-xs text-stone-600'>Pilih satu atau lebih department untuk karyawan ini.</p>
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogCancel asChild>
                            <Button variant="outline" disabled={loading}>
                                Batal
                            </Button>
                        </AlertDialogCancel>
                        <Button
                            onClick={handleAssignDepartment}
                            disabled={loading || loadingDepartment}
                        >
                            {loading ? 'Menyimpan...' : 'Simpan'}
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
