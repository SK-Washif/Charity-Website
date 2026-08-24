import axios from "axios";


const apiClient = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});


apiClient.interceptors.request.use(
  async (config) => {
    if (typeof window !== "undefined" && window.Clerk?.session) {
      const token = await window.Clerk.session.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);


apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      await window.Clerk?.signOut();
      window.location.href = "/admin/login";
    }
    return Promise.reject(error);
  }
);

export const api = {
  get: async (url) => {
    const response = await apiClient.get(url);
    return response.data.data;
  },
  post: async (url, data) => {
    const response = await apiClient.post(url, data);
    return response.data.data;
  },
  put: async (url, data) => {
    const response = await apiClient.put(url, data);
    return response.data.data;
  },
  delete: async (url) => {
    const response = await apiClient.delete(url);
    return response.data.data;
  },


  // 📌 Banner / Hero APIs
  getBanners: async () => api.get("/content/banners"),
  createBanner: async (data) => api.post("/content/banners", data),
  updateBanner: async (id, data) => api.put(`/content/banners/${id}`, data),
  deleteBanner: async (id) => api.delete(`/content/banners/${id}`),

  // 📌 Stats APIs
  getStats: async () => api.get("/content/stats"),
  updateStats: async (data) => api.put("/content/stats", data),

  // 📌 About APIs
  getAbout: async () => api.get("/content/about"),
  updateAbout: async (data) => api.put("/content/about", data),

  
  getPrograms: async () => api.get("/programs"),
  createProgram: async (data) => api.post("/programs", data),
  updateProgram: async (id, data) => api.put(`/programs/${id}`, data),
  deleteProgram: async (id) => api.delete(`/programs/${id}`),

  
  getGallery: async () => api.get("/gallery"),
  createGalleryItem: async (data) => api.post("/gallery", data),
  updateGalleryItem: async (id, data) => api.put(`/gallery/${id}`, data),
  deleteGalleryItem: async (id) => api.delete(`/gallery/${id}`),

 
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const response = await apiClient.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.data; // { url }
  },

  // Scholarship Preview APIs
  getScholarshipPreview: async () => api.get("/content/scholarship-preview"),
  updateScholarshipPreview: async (data) => api.put("/content/scholarship-preview", data),

  // Contact Cards APIs
  getContactCards: async () => api.get("/content/contact-cards"),
  createContactCard: async (data) => api.post("/content/contact-cards", data),
  updateContactCard: async (id, data) => api.put(`/content/contact-cards/${id}`, data),
  deleteContactCard: async (id) => api.delete(`/content/contact-cards/${id}`),

  // Social Links APIs
  getSocialLinks: async () => api.get("/content/social-links"),
  createSocialLink: async (data) => api.post("/content/social-links", data),
  updateSocialLink: async (id, data) => api.put(`/content/social-links/${id}`, data),
  deleteSocialLink: async (id) => api.delete(`/content/social-links/${id}`),

  // Donation (মোবাইল ব্যাংকিং / ব্যাংক / কার্ড) APIs
  getDonationMethods: async () => api.get("/content/donation-methods"),
  createDonationMethod: async (data) => api.post("/content/donation-methods", data),
  updateDonationMethod: async (id, data) => api.put(`/content/donation-methods/${id}`, data),
  deleteDonationMethod: async (id) => api.delete(`/content/donation-methods/${id}`),
  getDonationSettings: async () => api.get("/content/donation-settings"),
  updateDonationSettings: async (data) => api.put("/content/donation-settings", data),

  
  submitScholarship: async (data) => api.post("/scholarship", data),
};

export default apiClient;
