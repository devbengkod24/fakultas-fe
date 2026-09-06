export interface AnalisisKegiatanActivity {
  id: string
  name: string
  date: string
  duration: string
  location: string
  participants: number
  satisfaction: number
}

export type LSPStatistik = {
  periode_1: {
    kompeten: number
    tidak_kompeten: number
    tidak_hadir: number
  }
  periode_2: {
    kompeten: number
    tidak_kompeten: number
    tidak_hadir: number
  }
}

export type TOEFLStatistik = {
  periode_1: {
    jumlah_capai_target: number
    rata_rata: number
    distribusi: {
      "<400": number
      "400-450": number
      ">450": number
    }
  }
  periode_2: {
    jumlah_capai_target: number
    rata_rata: number
    distribusi: {
      "<400": number
      "400-450": number
      ">450": number
    }
  }
}

export type WorkshopStatistik = {
  periode_1: {
    web: number
    mobile: number
    ds: number
  }
  periode_2: {
    web: number
    mobile: number
    ds: number
  }
}

