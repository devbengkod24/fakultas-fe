export interface Pengumuman {
    id: number;
    judul: string;
    type?: string;
    user?: string;
    isi: string;
    published_at: string;
    created_at?: string;
    updated_at?: string;
}

export interface PengumumanListResponse {
    data: Pengumuman[]
    meta: {
    total: number
    page: number
    limit: number
    totalPages: number
    }
}

export interface PengumumanResponse {
    data: Pengumuman
}

export interface ApiResponse<T> {
    status: string
    message: string
    data: T
}