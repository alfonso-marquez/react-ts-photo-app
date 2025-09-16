const API_BASE = "http://127.0.0.1:8000/api/photos";

export const PHOTO_API = {
  list: `${API_BASE}`,
  create: `${API_BASE}`,
  get: (id: string) => `${API_BASE}/${id}`,
  //   restore: (id: string) => `${API_BASE}/${id}/restore`,
  update: (id: number | string) => `${API_BASE}/${id}`,
  delete: (id: number | string) => `${API_BASE}/${id}`,
};

// Fetch photos with pagination + search
export const fetchPhotosApi = async (page: number = 1, query: string = "") => {
  let url = `${PHOTO_API.list}?page=${page}`;
  let errorMsg;

  try {
    if (query) {
      url += `&search=${encodeURIComponent(query)}`;
    }
    const response = await fetch(url);
    if (!response.ok) {
      errorMsg = "Failed to fetch photos";
      throw new Error(errorMsg);
    }

    const resData = await response.json();
    return {
      pageData: resData.data,
      errorMsg,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    return {
      pageData: null,
      errorMsg: e.message || "An unexpected error occurred.",
    };
  }
};

//Create photo

export const createPhotoApi = async (formData: FormData) => {
  const response = await fetch(PHOTO_API.create, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    return {
      success: false,
      message: data.message || "Failed to create photo",
    };
  }

  return { success: true, data: data.data };
};

// Update photo by ID
export const updatePhotoApi = async (photoId: number, formData: FormData) => {
  const response = await fetch(PHOTO_API.update(photoId), {
    method: "POST", // **Important** for Laravel PUT route with FormData
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    return {
      success: false,
      message: data.message || "Failed to update photo",
    };
  }

  return { success: true, data: data.data };
};

// Delete photo by ID
export async function deletePhotoApi(photoId: number) {
  const response = await fetch(PHOTO_API.delete(photoId), {
    method: "DELETE",
  });

  const data = await response.json();

  if (!response.ok) {
    return {
      success: false,
      message: data.message || "Failed to delete photo",
    };
  }

  return { success: true, data: data.data };
}
