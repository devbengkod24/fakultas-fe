"use client"

import LogBimbinganActivityLog from "./activity-log"

const LogAktivitasDosen = () => {
  return (
    <div className="container mx-auto h-full flex flex-col">
      <div className="flex-1 h-full">
        <LogBimbinganActivityLog userType="dosen" />
      </div>
    </div>
  )
}

export default LogAktivitasDosen
