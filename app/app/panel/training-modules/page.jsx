"use client"

import { toast } from 'sonner';
import { api } from '@/lib/api';
import { useTheme } from "next-themes";
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import PageTitle from '@/components/partials/PageTitle';
import BasePagination from '@/components/partials/BasePagination';
import LayoutContainer from '@/components/partials/LayoutContainer';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ToggleGroup, ToggleGroupItem } from '@/components/animate-ui/components/radix/toggle-group';
import { SelectContent, SelectGroup, SelectItem, SelectLabel } from "@/components/ui/select"
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupSelect } from "@/components/ui/input-group";
import { Search, List, Grid2X2, ListFilter, X, Brain, Plus, FilePenIcon, Archive, Box, CircleCheckBig } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from '@/components/ui/skeleton';
import { useDebounce } from "use-debounce";
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Badge } from '@/components/ui/badge';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Inline Pagination Component

// Skeleton
const SkeletonModule = ({ isListView }) => {
    return (
        <>
            {Array.from({ length: 8 }, (_, index) => (
                <div key={index} className="w-full transition-all duration-300 ease-in-out">
                    <Card className="border-0 bg-card text-card-foreground shadow-xs rounded-2xl py-0">
                        <CardContent className="flex p-0 flex-col">
                            <div className={`flex p-0 group transition-all duration-500 ease-in-out ${isListView ? 'flex-row' : 'flex-col'}`}>
                                <div className={`aspect-256/211 relative m-2 overflow-hidden transition-all duration-500 ease-in-out ${isListView ? 'w-full max-w-42 rounded-xl' : 'rounded-t-xl'}`}>
                                    <Skeleton className="aspect-256/211 rounded-t-2xl" />
                                    <div className='absolute bottom-4 left-4 z-10'>
                                        <Skeleton className="w-[55px] h-[22px] rounded-sm" />
                                    </div>
                                    {!isListView && (
                                        <div className='absolute bottom-0 bg-linear-to-t from-white to-transparent dark:from-card left-0 right-0 w-full h-14' />
                                    )}
                                </div>
                                <div className={`p-4 pb-2 pt-3 flex flex-col gap-2 ${isListView ? 'flex-1' : 'flex'}`}>
                                    <Skeleton className="w-full h-[16px] rounded-sm" />
                                    <Skeleton className="w-full h-[13px] rounded-sm" />
                                    <Skeleton className="w-2/5 h-[12px] rounded-sm" />
                                    {isListView && (
                                        <>
                                            <div className='flex items-center justify-between gap-5'>
                                                <div className='flex gap-2 items-center justify-start text-xs font-medium flex-1 cursor-pointer'>
                                                    <Skeleton className="w-5 h-5 rounded-full" />
                                                    <Skeleton className="w-20 h-[13px] rounded-sm" />
                                                </div>
                                                <div>

                                                </div>
                                            </div>
                                            <div className='p-4 pt-1.5 flex items-center divide-x justify-evenly'>
                                                <div className='flex-1 flex justify-center'>
                                                    <Skeleton className="w-[50px] h-[13px] rounded-sm" />
                                                </div>
                                                <div className='flex-1 flex justify-center'>
                                                    <Skeleton className="w-[50px] h-[13px] rounded-sm" />
                                                </div>
                                                <div className='flex-1 flex justify-center'>
                                                    <Skeleton className="w-[50px] h-[13px] rounded-sm" />
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                            {!isListView && (
                                <>
                                    <div className='px-4 py-2 flex items-center justify-between gap-5'>
                                        <div className='flex gap-2 items-center justify-start text-xs font-medium flex-1 cursor-pointer'>
                                            <Skeleton className="w-6 h-5 rounded-full" />
                                            <Skeleton className="w-full h-[13px] rounded-sm" />
                                        </div>
                                        <div>
                                            <Skeleton className="w-[50px] h-[13px] rounded-sm" />
                                        </div>
                                    </div>
                                    <div className='p-4 pt-1.5 flex items-center divide-x justify-evenly'>
                                        <div className='flex-1 flex justify-center'>
                                            <Skeleton className="w-[50px] h-[13px] rounded-sm" />
                                        </div>
                                        <div className='flex-1 flex justify-center'>
                                            <Skeleton className="w-[50px] h-[13px] rounded-sm" />
                                        </div>
                                        <div className='flex-1 flex justify-center'>
                                            <Skeleton className="w-[50px] h-[13px] rounded-sm" />
                                        </div>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </div>
            ))}
        </>
    )
}

// Detail Module
const DetailModule = ({ module, isListView }) => {
    // return 
    return (
        <>
            {/* Author */}
            <div className={`py-3 flex items-center justify-between transition-all duration-300 ${!isListView && 'px-4'}`}>
                <div className='flex gap-2 items-center justify-start text-xs font-medium flex-1 cursor-default text-foreground'>
                    <Avatar className="w-5 h-5">
                        <AvatarImage src="https://github.com/shadcn.png" alt={module?.creator?.initial_name} />
                        <AvatarFallback className="!text-xs">{module?.creator?.initial_name}</AvatarFallback>
                    </Avatar>
                    <span className='line-clamp-1'>{module?.creator ? module?.creator?.full_name : 'Unknown'}</span>
                </div>
                <div className='flex gap-2'>
                    {(module?.questions?.length > 0) && (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className='px-1 py-1 me-1 bg-lime-200 dark:text-accent text-xs rounded-md font-semibold cursor-pointer'>
                                    <Brain className='size-3.5' />
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Quiz tersedia</p>
                            </TooltipContent>
                        </Tooltip>
                    )}
                </div>
            </div>
            {/* detail */}
            <div className={`pt-1 flex items-center divide-x justify-evenly transition-all duration-300 ${isListView ? 'py-4' : 'p-4'}`}>
                <div className='flex-1 flex justify-center'>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span className='text-[11px] font-normal text-muted-foreground hover:text-foreground cursor-pointer'>12+ read</span>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{module?.read_count}+ orang membaca modul ini</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
                <div className='flex-1 flex justify-center'>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span className='text-[11px] font-normal text-muted-foreground hover:text-foreground cursor-pointer'>12 pages</span>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{module?.pages_count} Materi pembelajaran</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
                <div className='flex-1 flex justify-center'>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span className='text-[11px] font-normal text-muted-foreground hover:text-foreground cursor-pointer'>123 min</span>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{module?.reading_duration} menit baca</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
            </div>
        </>
    )
}

// Module Card Component
const ModuleCard = ({ module, isListView }) => {
    const { resolvedTheme } = useTheme();
    const defaultThumbnail = resolvedTheme === 'dark' ? '/images/thumbnail_dark.webp' : '/images/thumbnail.webp';

    return (
        <div className="w-full transition-all duration-300 ease-in-out group">
            <Card className="border-0 bg-card text-card-foreground shadow-xs rounded-2xl py-0 hover:shadow-sm transition-all duration-300">
                <CardContent className="flex p-0 flex-col">
                    <div className={`flex p-0 group transition-all duration-500 ease-in-out ${isListView ? 'flex-row' : 'flex-col'}`}>
                        <div className={`aspect-256/211 relative m-2 overflow-hidden transition-all duration-500 ease-in-out ${isListView ? 'w-full max-w-42 rounded-xl' : 'rounded-t-xl'}`}>
                            <Link href={`/app/panel/training-modules/${module?.uuid}`}>
                                <img
                                    src={module?.cover_page ?? defaultThumbnail}
                                    alt={module?.title}
                                    //fill
                                    className="object-cover transition-transform duration-300 group-hover:scale-105 h-full w-full"
                                />
                                {/* Rating */}
                                <div className='absolute bottom-3 left-3 flex gap-2'>
                                    <div className='z-10 bg-card/95 rounded-md flex gap-1 py-1 ps-1 pe-2 items-center transition-all duration-300 border border-border/60'>
                                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path opacity="0.55" d="M4.56583 11.8333C4.64375 11.4862 4.50208 10.9904 4.25417 10.7425L2.53292 9.02124C1.99459 8.48291 1.78209 7.90916 1.93792 7.41332C2.10084 6.91749 2.60375 6.57749 3.35459 6.44999L5.56458 6.08166C5.88333 6.02499 6.27292 5.74166 6.42167 5.45124L7.64 3.00749C7.99417 2.30624 8.47583 1.91666 9 1.91666C9.52417 1.91666 10.0058 2.30624 10.36 3.00749L11.5783 5.45124C11.6704 5.63541 11.8617 5.81249 12.0671 5.93291L4.43833 13.5617C4.33917 13.6608 4.16917 13.5687 4.1975 13.4271L4.56583 11.8333Z" fill="#FF8500" />
                                            <path d="M13.7458 10.7425C13.4908 10.9975 13.3491 11.4862 13.4341 11.8333L13.9229 13.9654C14.1283 14.8508 14.0008 15.5167 13.5616 15.8354C13.3845 15.9629 13.172 16.0267 12.9241 16.0267C12.5629 16.0267 12.1379 15.8921 11.6704 15.6158L9.59494 14.3833C9.26911 14.1921 8.73078 14.1921 8.40494 14.3833L6.32953 15.6158C5.54328 16.0762 4.87036 16.1542 4.43828 15.8354C4.27536 15.715 4.15494 15.5521 4.07703 15.3396L12.6904 6.72625C13.0162 6.40042 13.4766 6.25166 13.9229 6.32958L14.6383 6.45C15.3891 6.5775 15.892 6.9175 16.0549 7.41333C16.2108 7.90917 15.9983 8.48291 15.4599 9.02125L13.7458 10.7425Z" fill="#FFA800" />
                                        </svg>
                                        <span className='text-[12px] font-semibold text-[#FF8500]'>4.4</span>
                                    </div>
                                </div>

                                {/* Draft */}
                                <div className='absolute top-2 right-2 flex gap-2 z-10'>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            {module?.status == 1 ? (
                                                <div className='px-1 py-1 me-1 bg-card/95 text-orange-500 shadow-sm text-xs rounded-md font-semibold cursor-pointer'>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24">
                                                        <g>
                                                            <path opacity="0.4" d="M21.0395 7.19L11.9995 12.42L2.95947 7.19C3.35947 6.45 3.93947 5.8 4.58947 5.44L9.92947 2.48C11.0695 1.84 12.9295 1.84 14.0695 2.48L19.4095 5.44C20.0595 5.8 20.6395 6.45 21.0395 7.19Z" className='fill-orange-500' />
                                                            <path opacity="0.6" d="M11.9996 12.4195V21.9995C11.2496 21.9995 10.4996 21.8395 9.92965 21.5195L4.58965 18.5595C3.37965 17.8895 2.38965 16.2095 2.38965 14.8295V9.16945C2.38965 8.52945 2.60965 7.82945 2.95965 7.18945L11.9996 12.4195Z" className='fill-orange-500' />
                                                            <path d="M21.6095 9.16945V14.8295C21.6095 16.2095 20.6195 17.8895 19.4095 18.5595L14.0695 21.5195C13.4995 21.8395 12.7495 21.9995 11.9995 21.9995V12.4195L21.0395 7.18945C21.3895 7.82945 21.6095 8.52945 21.6095 9.16945Z" className='fill-orange-500' />
                                                        </g>
                                                        <defs>
                                                            <clipPath>
                                                                <rect width="14" height="14" fill="white" transform="translate(-0.000976562)" />
                                                            </clipPath>
                                                        </defs>
                                                    </svg>
                                                </div>
                                            ) : (
                                                <div className='px-1 py-1 me-1  bg-card/95 text-green-600 shadow-sm text-xs rounded-md font-semibold cursor-pointer'>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24">
                                                        <g>
                                                            <path d="M10.7499 2.45031C11.4399 1.86031 12.5699 1.86031 13.2699 2.45031L14.8499 3.81031C15.1499 4.07031 15.7099 4.28031 16.1099 4.28031H17.8099C18.8699 4.28031 19.7399 5.15031 19.7399 6.21031V7.91031C19.7399 8.30031 19.9499 8.87031 20.2099 9.17031L21.5699 10.7503C22.1599 11.4403 22.1599 12.5703 21.5699 13.2703L20.2099 14.8503C19.9499 15.1503 19.7399 15.7103 19.7399 16.1103V17.8103C19.7399 18.8703 18.8699 19.7403 17.8099 19.7403H16.1099C15.7199 19.7403 15.1499 19.9503 14.8499 20.2103L13.2699 21.5703C12.5799 22.1603 11.4499 22.1603 10.7499 21.5703L9.16988 20.2103C8.86988 19.9503 8.30988 19.7403 7.90988 19.7403H6.17988C5.11988 19.7403 4.24988 18.8703 4.24988 17.8103V16.1003C4.24988 15.7103 4.03988 15.1503 3.78988 14.8503L2.43988 13.2603C1.85988 12.5703 1.85988 11.4503 2.43988 10.7603L3.78988 9.17031C4.03988 8.87031 4.24988 8.31031 4.24988 7.92031V6.20031C4.24988 5.14031 5.11988 4.27031 6.17988 4.27031H7.90988C8.29988 4.27031 8.86988 4.06031 9.16988 3.80031L10.7499 2.45031Z" className='fill-sky-500' />
                                                            <path d="M10.7901 15.1693C10.5901 15.1693 10.4001 15.0893 10.2601 14.9493L7.84006 12.5293C7.55006 12.2393 7.55006 11.7593 7.84006 11.4693C8.13006 11.1793 8.61006 11.1793 8.90006 11.4693L10.7901 13.3593L15.0901 9.0593C15.3801 8.7693 15.8601 8.7693 16.1501 9.0593C16.4401 9.3493 16.4401 9.8293 16.1501 10.1193L11.3201 14.9493C11.1801 15.0893 10.9901 15.1693 10.7901 15.1693Z" className='fill-sky-100' />
                                                        </g>
                                                        <defs>
                                                            <clipPath>
                                                                <rect width="14" height="14" fill="white" />
                                                            </clipPath>
                                                        </defs>
                                                    </svg>
                                                </div>
                                            )}
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            {module?.status == 1 ? (
                                                <p>Draft</p>
                                            ) : (
                                                <p>Published</p>
                                            )}
                                        </TooltipContent>
                                    </Tooltip>
                                </div>

                                {!isListView && (
                                    <div className='absolute bottom-[-1px] bg-linear-to-t from-white to-transparent dark:from-card left-0 right-0 w-full h-14 transition-opacity duration-300'>
                                    </div>
                                )}
                            </Link>
                        </div>
                        <div className='p-4 pt-3 pb-0 flex flex-col gap-1.5 transition-all duration-300'>
                            <Link href={`/app/panel/training-modules/${module?.uuid}`}>
                                <span className='text-[15px] font-medium text-foreground group-hover:text-sky-600 group-focus:text-sky-600 transition-colors leading-snug line-clamp-2'>{module?.title}</span>
                            </Link>
                            <small className='line-clamp-2 cursor-default text-muted-foreground leading-snug text-xs font-normal'>{module?.summary}</small>
                            {isListView && (
                                <div className="transition-all duration-300 ease-in-out">
                                    <DetailModule module={module} isListView={isListView} />
                                </div>
                            )}
                        </div>
                    </div>
                    {!isListView && (
                        <div className="transition-all duration-300 ease-in-out">
                            <DetailModule module={module} isListView={isListView} />
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default function TrainingModules() {
    const [modules, setModules] = useState([]);
    const [viewMode, setViewMode] = useState("grid");
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedQuery] = useDebounce(searchTerm, 500);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortOrder, setSortOrder] = useState("newest");
    const [loading, setLoading] = useState(false);
    const [loadingCreate, setLoadingCreate] = useState(false);
    const router = useRouter();
    // fetch data
    const fetchData = async (page = 1, search = "", order = "newest") => {
        setLoading(true);
        try {
            const filterSort = order === "newest" ? "desc" : "asc";
            const response = await api.fetch(
                `${API_URL}/office/trainings?page=${page}&search=${search}&sort_order=${filterSort}`,
                { method: "GET" }
            );
            // response success
            if (response?.success) {
                setModules(response.data);
                setCurrentPage(page);
            } else {
                toast.error(response?.message || "Error loading data");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };
    // create module
    const handleCreateModule = async () => {
        setLoadingCreate(true);
        try {
            const response = await api.fetch(
                `${API_URL}/office/trainings`,
                { method: "POST" }
            );
            // response success
            if (response?.success) {
                toast.success(response?.message || "Training berhasil dibuat");
                // direct
                router.push(`/app/panel/training-modules/${response?.data?.uuid}`);
            } else {
                toast.error(response?.message || "Error loading data");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoadingCreate(false);
        }
    }
    // first fetch
    useEffect(() => {
        fetchData(currentPage, "");
    }, []);

    // search
    useEffect(() => {
        fetchData(1, debouncedQuery);
    }, [debouncedQuery]);

    // sort order
    useEffect(() => {
        fetchData(1, debouncedQuery, sortOrder);
    }, [sortOrder]);

    // go to page
    const goToPage = (page) => {
        if (page >= 1) {
            fetchData(page, debouncedQuery, sortOrder);
        }
    };

    return (
        <LayoutContainer>
            <div className='max-w-6xl mx-auto w-full mb-10'>
                <PageTitle title="Training Modules" subtitle="Daftar materi pelatihan yang tersedia" />

                <div className='flex flex-col gap-5'>
                    <div className='flex flex-col gap-3'>
                        <div className='flex flex-col gap-5'>
                            <div className='flex justify-between gap-5 flex-col lg:flex-row '>
                                {/* Left */}
                                <div className='flex'>
                                    <InputGroup className="bg-background border-border">
                                        <InputGroupAddon>
                                            <Search />
                                        </InputGroupAddon>
                                        <InputGroupInput
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            placeholder="Search..."
                                        />
                                        {searchTerm && (
                                            <InputGroupAddon align="inline-end" className="cursor-pointer" onClick={() => setSearchTerm('')}>
                                                <X />
                                            </InputGroupAddon>
                                        )}
                                    </InputGroup>
                                </div>
                                {/* Right */}
                                <div className="flex gap-3 items-center">
                                    <InputGroup className="bg-background border-border">
                                        <InputGroupAddon className="font-medium">
                                            <ListFilter />
                                            <span className='hidden lg:block text-xs'>Sort by</span>
                                        </InputGroupAddon>
                                        <InputGroupSelect modal={true} className="font-medium min-w-24" defaultValue="newest" onValueChange={(value) => setSortOrder(value)}>
                                            <SelectContent position='popper' align="end" side="bottom">
                                                <SelectGroup>
                                                    <SelectItem value="newest">Newest</SelectItem>
                                                    <SelectItem value="oldest">Oldest</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </InputGroupSelect>
                                    </InputGroup>
                                    <ToggleGroup type="single" variant="outline" defaultValue="grid" size="icon" className="bg-background border-border">
                                        <ToggleGroupItem className="cursor-pointer size-8 text-muted-foreground data-[state=on]:bg-accent data-[state=on]:text-accent-foreground" value="grid" aria-label="Toggle bold" onClick={() => setViewMode('grid')}>
                                            <Grid2X2 />
                                        </ToggleGroupItem>
                                        <ToggleGroupItem className="cursor-pointer size-8 text-muted-foreground data-[state=on]:bg-accent data-[state=on]:text-accent-foreground" value="list" aria-label="Toggle italic" onClick={() => setViewMode('list')}>
                                            <List />
                                        </ToggleGroupItem>
                                    </ToggleGroup>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                size="sm"
                                                onClick={handleCreateModule}
                                                disabled={loadingCreate}
                                            >
                                                {loadingCreate ? (
                                                    <>
                                                        <Spinner />
                                                        <span>Loading..</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Plus />
                                                        <span>New Module</span>
                                                    </>
                                                )}
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Buat Modul Training Baru</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </div>
                            </div>
                        </div>
                        {searchTerm && (
                            <div className='mx-2'>
                                <p className='text-sm text-muted-foreground'>Menampilkan hasil pencarian :&nbsp;&nbsp;<span className='italic'>{searchTerm}</span></p>
                            </div>
                        )}
                        <div className={`grid gap-4 items-start justify-start flex-wrap transition-all duration-500 ${viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1 xl:grid-cols-2'}`}>
                            {loading ? (
                                <SkeletonModule isListView={viewMode === 'list'} />
                            ) : modules?.data?.length === 0 ? (
                                <div className='flex min-h-96 items-center justify-center col-span-4 gap-4 rounded-2xl border border-dashed border-border bg-muted/40'>
                                    <small className='text-muted-foreground'>Tidak ada data yang ditemukan</small>
                                </div>
                            ) : modules?.data?.map((module, index) => (
                                <ModuleCard key={index} module={module} isListView={viewMode === 'list'} />
                            ))}
                        </div>
                    </div>

                    <div className='flex justify-between'>
                        <div className='flex-1'>
                            <p className='text-sm text-muted-foreground'>Menampilkan {modules?.from ?? '0'} - {modules?.to ?? '0'} dari {modules?.total} data</p>
                        </div>
                        <BasePagination
                            data={modules}
                            currentPage={currentPage}
                            onPageChange={goToPage}
                        />
                    </div>
                </div>
            </div>
        </LayoutContainer>
    )
}
