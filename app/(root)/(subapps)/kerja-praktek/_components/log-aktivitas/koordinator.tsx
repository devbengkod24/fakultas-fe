"use client"

import LogBimbinganActivityLog from "./activity-log"

const LogAktivitasKoordinator = () => {
  return (
    <div className="container mx-auto h-full flex flex-col">
      <div className="flex-1 h-full">
        <LogBimbinganActivityLog userType="koordinator" />
      </div>
    </div>
  )
}

export default LogAktivitasKoordinator
