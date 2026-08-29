import axios from "axios";

const apiClient = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000, // ✅ 30s → 15s (DoS protection)
});

//Request Interceptor - Security & Token
apiClient.interceptors.request.use(
  async (config) => {
    //Only run in browser
    if (typeof window !== "undefined" && window.Clerk?.session) {
      try {
        const token = await window.Clerk.session.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error("Failed to get Clerk token:", error);
        //Don't proceed if token fails (security)
        return Promise.reject(error);
      }
    }
    
    //Security: Prevent caching of sensitive requests
    if (config.method === 'post' || config.method === 'put' || config.method === 'delete') {
      config.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
    }
    
    //Log only in development, not in production
    if (process.env.NODE_ENV === "development") {
      console.log(`📤 ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

//Response Interceptor - Security & Error Handling
apiClient.interceptors.response.use(
  (response) => {
    if (process.env.NODE_ENV === "development") {
      console.log(`📥 ${response.config.method?.toUpperCase()} ${response.config.url} → ${response.status}`);
    }
    return response;
  },
  async (error) => {
    //Log error details (but not sensitive data)
    console.error("❌ API Error:", {
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      status: error.response?.status,
      //Don't log sensitive data
    });

    //Handle 401 Unauthorized
    if (error.response?.status === 401 && typeof window !== "undefined") {
      try {
        //Clear sensitive data before logout
        localStorage.removeItem('oikkotan_admin_about');
        localStorage.removeItem('oikkotan_admin_gallery');
        localStorage.removeItem('oikkotan_admin_banners');
        
        await window.Clerk?.signOut();
        window.location.href = "/admin/login";
      } catch (signOutError) {
        console.error("Sign out error:", signOutError);
      }
    }
    
    //Handle 403 Forbidden
    if (error.response?.status === 403 && typeof window !== "undefined") {
      window.location.href = "/admin/login";
    }
    
    return Promise.reject(error);
  }
);

export const api = {
  //Generic Methods
  get: async (url, options = {}) => {
    const response = await apiClient.get(url, {
      ...options,
    });
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

  //Banner / Hero APIs
  getBanners: async () => api.get("/content/banners"),
  createBanner: async (data) => api.post("/content/banners", data),
  updateBanner: async (id, data) => api.put(`/content/banners/${id}`, data),
  deleteBanner: async (id) => api.delete(`/content/banners/${id}`),

  //Stats APIs
  getStats: async () => api.get("/content/stats"),
  updateStats: async (data) => api.put("/content/stats", data),

  //About APIs
  getAbout: async () => api.get("/content/about"),
  updateAbout: async (data) => api.put("/content/about", data),

  //Programs APIs
  getPrograms: async () => api.get("/programs"),
  createProgram: async (data) => api.post("/programs", data),
  updateProgram: async (id, data) => api.put(`/programs/${id}`, data),
  deleteProgram: async (id) => api.delete(`/programs/${id}`),

  //Gallery APIs
  getGallery: async () => api.get("/gallery"),
  createGalleryItem: async (data) => api.post("/gallery", data),
  updateGalleryItem: async (id, data) => api.put(`/gallery/${id}`, data),
  deleteGalleryItem: async (id) => api.delete(`/gallery/${id}`),

  //Image Upload
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const response = await apiClient.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.data;
  },

  //Scholarship Preview APIs
  getScholarshipPreview: async () => api.get("/content/scholarship-preview"),
  updateScholarshipPreview: async (data) => api.put("/content/scholarship-preview", data),

  //Contact Cards APIs
  getContactCards: async () => api.get("/content/contact-cards"),
  createContactCard: async (data) => api.post("/content/contact-cards", data),
  updateContactCard: async (id, data) => api.put(`/content/contact-cards/${id}`, data),
  deleteContactCard: async (id) => api.delete(`/content/contact-cards/${id}`),

  //Social Links APIs
  getSocialLinks: async () => api.get("/content/social-links"),
  createSocialLink: async (data) => api.post("/content/social-links", data),
  updateSocialLink: async (id, data) => api.put(`/content/social-links/${id}`, data),
  deleteSocialLink: async (id) => api.delete(`/content/social-links/${id}`),

  //Donation Methods APIs
  getDonationMethods: async () => api.get("/content/donation-methods"),
  createDonationMethod: async (data) => api.post("/content/donation-methods", data),
  updateDonationMethod: async (id, data) => api.put(`/content/donation-methods/${id}`, data),
  deleteDonationMethod: async (id) => api.delete(`/content/donation-methods/${id}`),

  // Donation Settings APIs
  getDonationSettings: async () => api.get("/content/donation-settings"),
  updateDonationSettings: async (data) => api.put("/content/donation-settings", data),

  //Bank Items APIs (একাধিক ব্যাংক/কার্ড আইটেম) 
  getBankItems: async () => api.get("/content/bank-items"),
  createBankItem: async (data) => api.post("/content/bank-items", data),
  updateBankItem: async (id, data) => api.put(`/content/bank-items/${id}`, data),
  deleteBankItem: async (id) => api.delete(`/content/bank-items/${id}`),

  //Scholarship Submit
  submitScholarship: async (data) => api.post("/scholarship", data),
};

export default apiClient;