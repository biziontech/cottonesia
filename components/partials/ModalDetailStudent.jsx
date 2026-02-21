import { Label } from '@/components/ui/label';
import { User2Icon, Home, Building } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ModalDetailStudent({ modalOpen, setModalOpen, batch }) {
    return (
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
            <DialogContent className="sm:max-w-3xl p-0 rounded-2xl">
                <div className='flex'>
                    <div className='max-w-60 p-5 border-r flex-1 bg-primary/5'>
                        <div className='flex flex-col gap-4 items-center justify-center'>
                            <Avatar className="size-12">
                                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <DialogHeader className="gap-0 items-center">
                                <DialogTitle className="text-sm">{batch?.user?.full_name}</DialogTitle>
                                <DialogDescription className="text-xs">{batch?.registration_code}</DialogDescription>
                            </DialogHeader>
                        </div>
                        <div className='flex flex-col mt-5 gap-0 divide-y divide-dotted'>
                            <div className='flex flex-col gap-0 pb-2'>
                                <Label className="text-xs text-stone-600">Nama Lengkap</Label>
                                <p className='font-medium text-sm'>{batch?.user?.full_name || '-'}</p>
                            </div>
                            <div className='flex flex-col gap-0 py-2'>
                                <Label className="text-xs text-stone-600">Nama Panggilan</Label>
                                <p className='font-medium text-sm'>{batch?.user?.name || '-'}</p>
                            </div>
                            <div className='flex flex-col gap-0 py-2'>
                                <Label className="text-xs text-stone-600">Jenis Kelamin</Label>
                                <p className='font-medium text-sm'>{batch?.user?.gender === "male" ? "Laki-laki" : "Perempuan"}</p>
                            </div>
                            <div className='flex flex-col gap-0 py-2'>
                                <Label className="text-xs text-stone-600">Tempat Lahir</Label>
                                <p className='font-medium text-sm'>{batch?.user?.place_of_birth || '-'}</p>
                            </div>
                            <div className='flex flex-col gap-0 py-2'>
                                <Label className="text-xs text-stone-600">Tanggal Lahir</Label>
                                <p className='font-medium text-sm'>{batch?.user?.date_of_birth || '-'}</p>
                            </div>
                            <div className='flex flex-col gap-0 py-2'>
                                <Label className="text-xs text-stone-600">No WhatsApp</Label>
                                <p className='font-medium text-sm'>{batch?.user?.whatsapp_no || '-'}</p>
                            </div>
                            <div className='flex flex-col gap-0 py-2'>
                                <Label className="text-xs text-stone-600">Email Siswa</Label>
                                <p className='font-medium text-sm'>{batch?.user?.email || '-'}</p>
                            </div>
                        </div>
                    </div>

                    <ScrollArea className='flex-1 max-h-[600px] overflow-y-auto'>
                        <div className='flex flex-col gap-0 divide-y divide-dashed'>
                            {/* Data Tempat tinggal */}
                            <div className='flex flex-col gap-0 p-5'>
                                <h5 className="font-semibold text-sm flex items-center gap-2">
                                    <Home className='w-4 h-4' />
                                    <span>Data Tempat Tinggal</span>
                                </h5>
                                <div className='flex flex-col mt-3 gap-0 divide-y divide-dotted'>
                                    <div className='flex flex-col gap-0 pb-2'>
                                        <Label className="text-xs text-stone-600">Alamat Rumah</Label>
                                        <p className='font-medium text-sm'>{batch?.user?.address_home || '-'}</p>
                                    </div>
                                    <div className='flex'>
                                        <div className='flex flex-col gap-0 py-2 flex-1'>
                                            <Label className="text-xs text-stone-600">Provinsi</Label>
                                            <p className='font-medium text-sm'>{batch?.user?.province || '-'}</p>
                                        </div>
                                        <div className='flex flex-col gap-0 py-2 flex-1'>
                                            <Label className="text-xs text-stone-600">Kota / Kabupaten</Label>
                                            <p className='font-medium text-sm'>{batch?.user?.city || '-'}</p>
                                        </div>
                                    </div>
                                    <div className='flex'>
                                        <div className='flex flex-col gap-0 py-2 flex-1'>
                                            <Label className="text-xs text-stone-600">Kecamatan</Label>
                                            <p className='font-medium text-sm'>{batch?.user?.district || '-'}</p>
                                        </div>
                                        <div className='flex flex-col gap-0 py-2 flex-1'>
                                            <Label className="text-xs text-stone-600">Kelurahan</Label>
                                            <p className='font-medium text-sm'>{batch?.user?.sub_district || '-'}</p>
                                        </div>
                                        <div className='flex flex-col gap-0 py-2 flex-1'>
                                            <Label className="text-xs text-stone-600">RT</Label>
                                            <p className='font-medium text-sm'>{batch?.user?.rt || '-'}</p>
                                        </div>
                                        <div className='flex flex-col gap-0 py-2 flex-1'>
                                            <Label className="text-xs text-stone-600">RW</Label>
                                            <p className='font-medium text-sm'>{batch?.user?.rw || '-'}</p>
                                        </div>
                                    </div>
                                    <div className='flex'>
                                        <div className='flex flex-col gap-0 py-2 flex-1'>
                                            <Label className="text-xs text-stone-600">No WhatsApp yang Bisa Dihubungi</Label>
                                            <p className='font-medium text-sm'>{batch?.user?.contact_phone || '-'}</p>
                                        </div>
                                        <div className='flex flex-col gap-0 py-2 flex-1'>
                                            <Label className="text-xs text-stone-600">Kode POS</Label>
                                            <p className='font-medium text-sm'>{batch?.user?.postal_code || '-'}</p>
                                        </div>
                                    </div>
                                    <div className='flex flex-col gap-0 py-2'>
                                        <Label className="text-xs text-stone-600">Tempat Tinggal</Label>
                                        <p className='font-medium text-sm'>{batch?.user?.residence_type || '-'}</p>
                                    </div>
                                </div>
                            </div>
                            {/* Data Periodik */}
                            <div className='flex flex-col gap-0 p-5'>
                                <h5 className="font-semibold text-sm flex items-center gap-2">
                                    <User2Icon className='w-4 h-4' />
                                    <span>Data Periodik</span>
                                </h5>
                                <div className='flex flex-col mt-3 gap-0 divide-y divide-dotted'>
                                    <div className='flex'>
                                        <div className='flex flex-col gap-0 pb-2 flex-1'>
                                            <Label className="text-xs text-stone-600">Tinggi Badan (cm)</Label>
                                            <p className='font-medium text-sm'>{batch?.user?.height || '-'}</p>
                                        </div>
                                        <div className='flex flex-col gap-0 pb-2 flex-1'>
                                            <Label className="text-xs text-stone-600">Berat Badan (kg)</Label>
                                            <p className='font-medium text-sm'>{batch?.user?.weight || '-'}</p>
                                        </div>
                                    </div>
                                    <div className='flex'>
                                        <div className='flex flex-col gap-0 py-2 flex-1'>
                                            <Label className="text-xs text-stone-600">Jarak Rumah ke Balemong</Label>
                                            <p className='font-medium text-sm'>{batch?.user?.travel_distance_to_balemong || '-'}</p>
                                        </div>
                                        <div className='flex flex-col gap-0 py-2 flex-1'>
                                            <Label className="text-xs text-stone-600">Waktu Tempuh ke Balemong</Label>
                                            <p className='font-medium text-sm'>{batch?.user?.travel_time_to_balemong || '-'}</p>
                                        </div>
                                    </div>
                                    <div className='flex flex-col gap-0 py-2'>
                                        <Label className="text-xs text-stone-600">Hobi</Label>
                                        <p className='font-medium text-sm'>{batch?.user?.hobbies || '-'}</p>
                                    </div>
                                    <div className='flex flex-col gap-0 py-2'>
                                        <Label className="text-xs text-stone-600">Cita-cita</Label>
                                        <p className='font-medium text-sm'>{batch?.user?.dream || '-'}</p>
                                    </div>
                                </div>
                            </div>
                            {/* Data Asal Sekolah */}
                            <div className='flex flex-col gap-0 p-5'>
                                <h5 className="font-semibold text-sm flex items-center gap-2">
                                    <Building className='w-4 h-4' />
                                    <span>Data Asal Sekolah</span>
                                </h5>
                                <div className='flex flex-col mt-3 gap-0 divide-y divide-dotted'>
                                    <div className='flex flex-col gap-0 pb-2'>
                                        <Label className="text-xs text-stone-600">Asal Sekolah</Label>
                                        <p className='font-medium text-sm'>{batch?.user?.previous_school || '-'}</p>
                                    </div>
                                    <div className='flex flex-col gap-0 py-2'>
                                        <Label className="text-xs text-stone-600">Alamat Sekolah</Label>
                                        <p className='font-medium text-sm'>{batch?.user?.address_school || '-'}</p>
                                    </div>
                                    <div className='flex flex-col gap-0 py-2'>
                                        <Label className="text-xs text-stone-600">Jurusan Sekolah</Label>
                                        <p className='font-medium text-sm'>{batch?.user?.major || '-'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ScrollArea>
                </div>
            </DialogContent>
        </Dialog>
    )
}