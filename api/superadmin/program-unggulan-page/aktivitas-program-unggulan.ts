/* eslint-disable @typescript-eslint/no-explicit-any */
const ProgramUnggulanAktivitasService = ({
  baseUrl,
  config,
}: {
  baseUrl: string;
  config: () => Headers;
}) => {
  const programUnggulan = "/cms/admin/program-unggulan/photos";
  const addEdit = "/cms/admin/program-unggulan";

  const safeFetch = async (url: string, requestConfig: any) => {
    try {
      const response = await fetch(url, requestConfig);

      // Handle 204 No Content
      if (response.status === 204) {
        return { success: true, message: "Operation successful" };
      }

      // Try to parse JSON
      let data: any = {};
      try {
        data = await response.json();
      } catch (e) {
        // Not JSON
      }

      if (!response.ok) {
        // Handle specific Laravel "not found" errors
        const msg = (data.message || data.error || "").toString().toLowerCase();
        
        // Check if it's a DELETE (direct or spoofed via _method)
        let isDelete = requestConfig.method === "DELETE";
        if (!isDelete && requestConfig.method === "POST" && requestConfig.body instanceof FormData) {
          isDelete = requestConfig.body.get("_method") === "DELETE";
        }

        if (
          response.status === 404 ||
          msg.includes("no query results") ||
          msg.includes("not found") ||
          msg.includes("tidak ditemukan")
        ) {
          // If it's a DELETE, treat not found as success
          if (isDelete) {
            return { success: true, message: "Foto program unggulan berhasil dihapus" };
          }
        }
        
        return {
          success: false,
          message: data.message || `HTTP error! status: ${response.status}`,
          data: data
        };
      }

      // If response is OK but data doesn't have success field, add it
      if (data.success === undefined) {
        data.success = true;
      }

      return data;
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Network error"
      };
    }
  };

  return {
    getProgramUnggulanActivitiesAll: (
      page: any,
      limit: any,
      prodiId?: number
    ) => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      let url = `${baseUrl}${programUnggulan}?page=${page}&limit=${limit}`;
      if (prodiId) {
        url += `&prodi_id=${prodiId}`;
      }

      return safeFetch(url, requestConfig);
    },

    getProgramUnggulanPhotosByIdProgramUnggulan: (
      programId: number,
      page: number,
      limit: number,
      prodiId?: number
    ) => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      let url = `${baseUrl}${addEdit}/${programId}/photos?page=${page}&limit=${limit}`;
      if (prodiId) {
        url += `&prodi_id=${prodiId}`;
      }

      return safeFetch(url, requestConfig);
    },

    getProgramUnggulanPhotosByProgramId: (
      programId: number,
      page?: number,
      limit?: number
    ) => {
      const headers = config();
      const requestConfig = {
        method: "GET",
        headers: headers,
      };

      let url = `${baseUrl}${programUnggulan}/${programId}`;
      if (page && limit) {
        url += `?page=${page}&limit=${limit}`;
      }

      return safeFetch(url, requestConfig);
    },

    createActivityPhoto: async (id: number, data: any) => {
      const headers = config();
      const photosArray = Array.isArray(data) ? data : [data];
      const validPhotos = photosArray.filter(
        (photo) =>
          photo.title?.trim() ||
          photo.titles?.trim() ||
          photo.description?.trim() ||
          photo.descriptions?.trim() ||
          (photo.imageFile && photo.imageFile instanceof File)
      );

      if (validPhotos.length === 0) {
        return { success: true, message: "No content to upload", data: null };
      }

      const formData = new FormData();
      validPhotos.forEach((photo, index) => {
        const title = photo.title || photo.titles || "";
        const description = photo.description || photo.descriptions || "";
        
        // REVISI: Untuk CREATE, gunakan array flat titles[], descriptions[], dan photos[]
        // sesuai pesan error backend "Kolom titles wajib diisi"
        formData.append(`titles[${index}]`, title.trim());
        formData.append(`descriptions[${index}]`, description.trim());
        
        if (photo.imageFile && photo.imageFile instanceof File) {
          formData.append(`photos[${index}]`, photo.imageFile);
        }
        
        if (photo.prodi_id) {
          formData.append(`prodi_id[${index}]`, photo.prodi_id.toString());
        }
      });

      const formHeaders = new Headers(headers);
      formHeaders.delete("Content-Type");

      const requestConfig = {
        method: "POST",
        body: formData,
        headers: formHeaders,
      };

      return safeFetch(`${baseUrl}${addEdit}/${id}/photos`, requestConfig);
    },

    editActivityPhoto: async (programId: number, data: any): Promise<any> => {
      const headers = config();
      
      // REVISI: Karena endpoint program/{id}/photos melakukan full sync (menghapus yang tidak dikirim),
      // kita harus ambil semua foto yang ada dulu, baru dikirim balik semuanya.
      
      try {
        // 1. Ambil semua foto untuk program ini
        // Menggunakan endpoint yang sudah terbukti benar di getProgramUnggulanPhotosByProgramId
        const response = await fetch(`${baseUrl}${programUnggulan}/${programId}?limit=100`, {
            method: "GET",
            headers: config()
        });
        
        if (!response.ok) {
            throw new Error(`Gagal mengambil data foto lama: ${response.status}`);
        }
        
        const result = await response.json();
        // Laravel biasanya membungkus data di dalam 'data'
        const existingPhotos: any[] = result?.data?.data || result?.data || [];

        const updatedPhoto = Array.isArray(data) ? data[0] : data;
        const formData = new FormData();

        // 2. Loop semua foto untuk dikirim balik (agar tidak hilang)
        existingPhotos.forEach((photo, index) => {
            formData.append(`photos[${index}][id]`, photo.id.toString());
            
            if (photo.id === updatedPhoto.id) {
                // Gunakan data baru untuk foto yang sedang diedit
                formData.append(`photos[${index}][title]`, (updatedPhoto.title || "").trim());
                formData.append(`photos[${index}][description]`, (updatedPhoto.description || "").trim());
                
                if (updatedPhoto.imageFile && updatedPhoto.imageFile instanceof File) {
                    formData.append(`photos[${index}][image]`, updatedPhoto.imageFile);
                }
                
                if (updatedPhoto.prodi_id || photo.prodi_id) {
                    formData.append(`photos[${index}][prodi_id]`, (updatedPhoto.prodi_id || photo.prodi_id).toString());
                }
            } else {
                // Gunakan data lama untuk foto lainnya agar tidak terhapus oleh sync()
                formData.append(`photos[${index}][title]`, (photo.title || "").trim());
                formData.append(`photos[${index}][description]`, (photo.description || "").trim());
                
                if (photo.prodi_id) {
                    formData.append(`photos[${index}][prodi_id]`, photo.prodi_id.toString());
                }
            }
        });

        formData.append("_method", "PUT");
        const updateHeaders = new Headers(headers);
        updateHeaders.delete("Content-Type");

        return safeFetch(`${baseUrl}${addEdit}/${programId}/photos`, {
            method: "POST",
            body: formData,
            headers: updateHeaders,
        });
      } catch (error: any) {
          console.error("[editActivityPhoto] Error:", error);
          return { success: false, message: "Gagal memproses update foto: " + error.message };
      }
    },

    deleteActivityPhoto: (programId: number, photoId: number) => {
      const headers = config();
      const formData = new FormData();
      formData.append("_method", "DELETE");

      const formHeaders = new Headers(headers);
      formHeaders.delete("Content-Type");

      return safeFetch(`${baseUrl}${programUnggulan}/${photoId}`, {
        method: "POST",
        body: formData,
        headers: formHeaders,
      });
    },
  };
};

export default ProgramUnggulanAktivitasService;
