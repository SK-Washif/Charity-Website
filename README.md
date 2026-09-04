# ঐক্যতান ফাউন্ডেশন - Charity Management Platform

> **Live Demo:** [Oykotan Foundation](https://oykotan-foundation.vercel.app)

---

## 🚀 Overview

**ঐক্যতান ফাউন্ডেশন** is a full-stack charity management platform that helps NGOs manage scholarship programs, donations, and dynamic content seamlessly. Built with modern web technologies and deployed with industry-standard CI/CD practices.

---

## Key Features

### Public Features
- **Hero Slider** - Dynamic banner carousel with CTA buttons
- **Scholarship Application** - 2-step form with print-ready PDF & Google Sheets integration
- **Donation Modal** - Multiple payment methods (bKash, Nagad, Rocket, Bank)
- **Gallery** - Photo gallery with lightbox preview
- **Contact & Services** - Dynamic content management

### Admin Features
- **Full CRUD Operations** - Manage banners, programs, gallery, contact info
- **Reset Functionality** - One-click restore to default content
- **Image Upload** - Secure backend-proxied upload to ImgBB
- **Authentication** - Clerk-powered admin access with invite-only mode

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - App Router, Server Components
- **React 18** - UI Library
- **Tailwind CSS + DaisyUI** - Styling
- **Framer Motion** - Animations
- **Clerk** - Authentication

### Backend
- **Node.js + Express.js** - REST API
- **MongoDB + Mongoose** - Database
- **Clerk Express** - Auth Middleware
- **Zod** - Validation
- **Multer** - File Upload
- **Google APIs** - Sheets Integration
- **ImgBB** - Image Hosting

### DevOps & Infrastructure
- **Docker** - Containerization
- **Vercel** - Frontend Hosting (Auto-deploy)
- **Render** - Backend Hosting (Auto-deploy)
- **MongoDB Atlas** - Cloud Database
- **GitHub** - Version Control
- **CI/CD** - Auto-deploy on push

---

## 🔧 Environment Variables

## Key Challenges & Solutions

### 1. Scholarship Form - 2-Step Workflow
**Challenge:** Users needed to fill a long form, submit to Google Sheets, and generate a print-ready PDF - all in one seamless flow.

**Solution:** 
- Built a 2-step flow: Form → Print Page
- Data passes via localStorage for instant access
- Background API call submits to Google Sheets without blocking user
- PDF generation with html2canvas + jspdf

---

### 2. Form Validation - User Experience Focus
**Challenge:** Native HTML validation wasn't providing clear, user-friendly error messages.

**Solution:**
- Custom validation with field-level red error messages
- Auto-scroll to first error field
- Errors clear automatically on typing
- Real-time feedback for better UX

---

### 3. Google Sheets Integration
**Challenge:** Need to store scholarship applications without building a separate database.

**Solution:**
- Google Sheets API with Service Account authentication
- Rate limiting (5 requests/15 min) to prevent spam
- Zod validation ensures data integrity

---

### 4. Admin Content Management
**Challenge:** Non-technical admins need to update website content easily.

**Solution:**
- Complete admin panel with CRUD operations
- Real-time updates with localStorage backup
- Reset buttons for one-click default restore
- Secure authentication via Clerk

---

### 5. Authentication & Security
**Challenge:** Need secure, production-ready authentication.

**Solution:**
- Clerk for authentication (industry standard)
- Invite-only admin mode (no public signup)
- JWT tokens automatically added to API requests
- All admin routes protected with Clerk middleware

---

### 6. Docker Containerization
**Challenge:** Need consistent environment across local and production.

**Solution:**
- Dockerized backend with Dockerfile
- Same environment locally and in production
- Easy deployment on Render
- No "works on my machine" issues

---

### 7. CI/CD Pipeline
**Challenge:** Need automatic deployment on every code change.

**Solution:**
- GitHub → Vercel (Frontend auto-deploy)
- GitHub → Render (Backend auto-deploy)
- Push to main branch triggers automatic build & deploy
- Zero-downtime updates

---

### 8. Database Management
**Challenge:** Need cloud database with easy management.

**Solution:**
- MongoDB Atlas for cloud database
- Mongoose ODM for schema management
- Lean queries for performance
- Connection pooling for efficiency

---

### 9. Image Upload
**Challenge:** Need secure image upload without exposing API keys.

**Solution:**
- Backend-proxied upload (frontend → backend → ImgBB)
- Multer validates file types (images only)
- 10MB file size limit
- Admin-only access via Clerk authentication

---

### 10. Accessibility
**Challenge:** Website needs to be accessible for all users.

**Solution:**
- ARIA labels and roles throughout
- Semantic HTML
- Keyboard navigation support
- Screen reader friendly
- Focus indicators on interactive elements

---

### 11. Deployment Strategy
**Challenge:** Need production-ready deployment with monitoring.

**Solution:**
- Docker container for backend
- Vercel for frontend (optimized for Next.js)
- Render for backend (Docker support)
- Health check endpoint for monitoring
- Environment variables management

---

### 12. Rate Limiting & Security
**Challenge:** Prevent abuse and DoS attacks.

**Solution:**
- Express-rate-limit: 120 requests/minute general
- 5 requests/15 minutes for scholarship submissions
- Helmet for security headers
- CORS configured with specific origins
- Input validation with Zod

---

## Security Features

| Feature | Implementation |
|---------|----------------|
| **Authentication** | Clerk (industry standard) |
| **Rate Limiting** | Express-rate-limit |
| **CORS** | Configured origins |
| **Helmet** | Security headers |
| **Input Validation** | Zod |
| **Secure Cookies** | HttpOnly |
| **Environment Variables** | All secrets in .env |

---

## Connect

**Developer:** SK Washif Fishal  
**GitHub:** [SK-Washif](https://github.com/SK-Washif)

