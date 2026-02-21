'use client';

import { useState, useEffect } from "react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { CartesianGrid, Line, LineChart } from "recharts";
import { CountingNumber } from "./CountingNumber";
import { toast } from "sonner";
import api from "@/lib/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function CardStatsBatch({ batch }) {
    // check stats
    const [stats, setStats] = useState({
        total_registrations: 0,
        total_registrations_verified: 0,
        total_registrations_accepted: 0,
        total_registrations_rejected: 0
    })

    const chartData = [
        { month: "January", desktop: 186 },
        { month: "February", desktop: 305 },
        { month: "March", desktop: 237 },
        { month: "April", desktop: 73 },
        { month: "May", desktop: 209 },
        { month: "June", desktop: 214 },
    ]

    const chartConfig = {
        desktop: {
            label: "Desktop",
            color: "var(--chart-1)",
        },
    }

    useEffect(() => {
        // check
        if (!batch?.uuid) return;
        // load batch pertama kali
        loadBatch(batch.uuid);
        // handler notifikasi
        const handler = () => {
            loadBatch(batch.uuid);
        };

        window.addEventListener('notification:new', handler);
        return () => window.removeEventListener('notification:new', handler);
    }, [batch?.uuid]);


    const loadBatch = async (uuid) => {
        try {
            // fetch
            const response = await api.fetch(`${API_URL}/office/batches/${uuid}/stats`, {
                method: 'GET'
            });
            // set error
            if (response?.success) {
                // set stats
                setStats(response.data);
            }
        } catch (error) {
            toast.error('Error loading batch');
            console.log(error);
        } finally {

        }
    };


    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className='p-5 rounded-2xl w-full border flex flex-col gap-1'>
                <div className='flex gap-2'>
                    <div className='flex flex-col gap-2 mb-1 flex-1'>
                        <div className='flex flex-col gap-2 justify-between'>
                            <p className='text-sm text-stone-700 line-clamp-1'>Total Pendaftar</p>
                        </div>
                        <div className='flex'>
                            <h2 className='text-2xl font-poppins font-bold'>
                                <CountingNumber
                                    number={stats?.total_registrations || 0}
                                />
                            </h2>
                        </div>
                    </div>
                    <div className='min-w-20'>
                        <ChartContainer config={chartConfig}>
                            <LineChart
                                accessibilityLayer
                                data={chartData}
                                margin={{
                                    left: 12,
                                    right: 12,
                                }}
                            >
                                <CartesianGrid vertical={false} />
                                <ChartTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent hideLabel />}
                                />
                                <Line
                                    dataKey="desktop"
                                    type="linear"
                                    stroke="var(--color-desktop)"
                                    strokeWidth={2}
                                    dot={false}
                                />
                            </LineChart>
                        </ChartContainer>
                    </div>
                </div>
                <small className='text-xs text-stone-500'>Jumlah Pendaftar pada angkatan ini</small>
            </div>
            <div className='p-5 rounded-2xl w-full border flex flex-col gap-1'>
                <div className='flex gap-2'>
                    <div className='flex flex-col gap-2 mb-1 flex-1'>
                        <div className='flex flex-col gap-2 justify-between'>
                            <p className='text-sm text-stone-700 line-clamp-1'>Jumlah Lolos Seleksi</p>
                        </div>
                        <div className='flex'>
                            <h2 className='text-2xl font-poppins font-bold'>
                                <CountingNumber
                                    number={stats?.total_registrations_verified || 0}
                                />
                            </h2>
                        </div>
                    </div>
                    <div className='min-w-20'>
                        <ChartContainer config={chartConfig}>
                            <LineChart
                                accessibilityLayer
                                data={chartData}
                                margin={{
                                    left: 12,
                                    right: 12,
                                }}
                            >
                                <CartesianGrid vertical={false} />
                                <ChartTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent hideLabel />}
                                />
                                <Line
                                    dataKey="desktop"
                                    type="linear"
                                    stroke="var(--color-desktop)"
                                    strokeWidth={2}
                                    dot={false}
                                />
                            </LineChart>
                        </ChartContainer>
                    </div>
                </div>
                <small className='text-xs text-stone-500'>Jumlah yang lolos seleksi</small>
            </div>
            <div className='p-5 rounded-2xl w-full border flex flex-col gap-1'>
                <div className='flex gap-2'>
                    <div className='flex flex-col gap-2 mb-1 flex-1'>
                        <div className='flex flex-col gap-2 justify-between'>
                            <p className='text-sm text-stone-700 line-clamp-1'>Jumlah di Terima</p>
                        </div>
                        <div className='flex'>
                            <h2 className='text-2xl font-poppins font-bold'>
                                <CountingNumber
                                    number={stats?.total_registrations_accepted || 0}
                                />
                            </h2>
                        </div>
                    </div>
                    <div className='min-w-20'>
                        <ChartContainer config={chartConfig}>
                            <LineChart
                                accessibilityLayer
                                data={chartData}
                                margin={{
                                    left: 12,
                                    right: 12,
                                }}
                            >
                                <CartesianGrid vertical={false} />
                                <ChartTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent hideLabel />}
                                />
                                <Line
                                    dataKey="desktop"
                                    type="linear"
                                    stroke="var(--color-desktop)"
                                    strokeWidth={2}
                                    dot={false}
                                />
                            </LineChart>
                        </ChartContainer>
                    </div>
                </div>
                <small className='text-xs text-stone-500'>Jumlah Siswa yang diterima</small>
            </div>
            <div className='p-5 rounded-2xl w-full border flex flex-col gap-1'>
                <div className='flex gap-2'>
                    <div className='flex flex-col gap-2 mb-1 flex-1'>
                        <div className='flex flex-col gap-2 justify-between'>
                            <p className='text-sm text-stone-700 line-clamp-1'>Jumlah di Tolak</p>
                        </div>
                        <div className='flex'>
                            <h2 className='text-2xl font-poppins font-bold'>
                                <CountingNumber
                                    number={stats?.total_registrations_rejected || 0}
                                />
                            </h2>
                        </div>
                    </div>
                    <div className='min-w-20'>
                        <ChartContainer config={chartConfig}>
                            <LineChart
                                accessibilityLayer
                                data={chartData}
                                margin={{
                                    left: 12,
                                    right: 12,
                                }}
                            >
                                <CartesianGrid vertical={false} />
                                <ChartTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent hideLabel />}
                                />
                                <Line
                                    dataKey="desktop"
                                    type="linear"
                                    stroke="var(--color-desktop)"
                                    strokeWidth={2}
                                    dot={false}
                                />
                            </LineChart>
                        </ChartContainer>
                    </div>
                </div>
                <small className='text-xs text-stone-500'>Jumlah Siswa yang ditolak</small>
            </div>

        </div>
    )
}