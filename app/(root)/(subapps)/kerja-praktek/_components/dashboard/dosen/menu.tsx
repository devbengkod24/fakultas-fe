"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Users, BookText, CalendarCheck, MoveRight } from 'lucide-react'
import React from 'react'
import Link from 'next/link';

const informasi = [
    {
      title: "Mahasiswa Bimbingan",
      subtitle: "Data Mahasiswa Bimbingan",
      url: "kerja-praktek/mahasiswa-bimbingan",
      icon: <Users className="text-primary-600"/>
    },
    {
      title: "Logbook Mahasiswa",
      subtitle: "Progress Logbook Mahasiswa",
      url: "kerja-praktek/logbook-mahasiswa",
      icon: <BookText className="text-secondary-400"/>
    },
    {
      title: "Sidang",
      subtitle: "Data Pengajuan & Hasil Sidang",
      url: "kerja-praktek/hasil-sidang",
      icon: <CalendarCheck className="text-orange-500"/>
    }
  ]

const DashboardDosenMenu = () => {
  return (
    <div className="grid grid-cols-3 gap-4">
        {informasi.map((i, index) => (
            <Card key={index} className="text-sm rounded-md">
                <CardHeader className="flex-row gap-4 p-4 pb-2">
                <div className="flex items-center">
                    {i.icon}
                </div>
                <div className="flex-col">
                    <CardTitle>{i.title}</CardTitle>
                    <CardDescription className="text-xs mt-1">{i.subtitle}</CardDescription>
                </div>
                </CardHeader>
                <Link href={i.url}>
                  <CardFooter className="flex justify-between p-2 px-4 bg-blue-500/5">
                      <p className="text-primary text-xs">View details</p>
                      <MoveRight size={15} strokeWidth={1.5} className="text-gray-700"/>
                  </CardFooter>     
                </Link>
            </Card>
            ))}
    </div>
  )
}

export default DashboardDosenMenu