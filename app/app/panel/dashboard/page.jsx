"use client"

import PageTitle from '@/components/partials/PageTitle';
import LayoutContainer from '@/components/partials/LayoutContainer';
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function Dashboard() {
    return (
        <LayoutContainer>
            <div className='max-w-6xl mx-auto w-full'>
                <PageTitle title="Dashboard" subtitle="Selamat datang di dashboard" />

                <div className="grid grid-cols-2 gap-4">
                    <Card className="col-span-2 md:col-span-1 gap-0">
                        <CardHeader>
                            <span className="font-medium">Halo, Selamat Pagi 👋</span>
                        </CardHeader>
                        <CardContent>
                            <small>Selamat berkatifikas untuk memulai kegiatan baru</small>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </LayoutContainer>
    )
}