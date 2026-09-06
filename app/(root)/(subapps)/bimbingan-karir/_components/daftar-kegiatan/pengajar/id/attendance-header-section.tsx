"use client"

import { Calendar, Clock, MapPin, User } from "lucide-react"

type Props = {
  title: string
  startDate: Date
  endDate: Date
  location: string
  pengajarName?: string
}

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date)

export default function AttendanceHeaderSection({ title, startDate, endDate, location, pengajarName }: Props) {

  return (
    <>
      <h1 className="text-xl font-semibold mb-2">{title}</h1>

      <div className="flex mb-4">
        <div className="flex gap-1 text-muted-foreground text-xs">
          <Calendar size={14} />
          <span>{formatDate(startDate)} - {formatDate(endDate)}</span>
        </div>
        <span className="text-xs mx-2 text-gray-300">|</span>
        <div className="flex gap-1 text-muted-foreground text-xs">
          <Clock size={14} />
          <span>
            {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -
            {endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        <span className="text-xs mx-2 text-gray-300">|</span>
        <div className="flex gap-1 text-muted-foreground text-xs">
          <MapPin size={14} />
          <span>{location}</span>
        </div>
        {pengajarName && (
          <>
            <span className="text-xs mx-2 text-gray-300">|</span>
            <div className="flex gap-1 text-muted-foreground text-xs">
              <User size={14} />
              <span>{pengajarName}</span>
            </div>
          </>
        )}
      </div>
    </>
  )
}
