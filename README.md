# 🍎 ApexEduTasks – School Task Tracking CRM

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Build](https://img.shields.io/badge/build-ready-orange.svg)
![Deployment](https://img.shields.io/badge/deploy-Vercel-black.svg)

**ApexEduTasks** is a high-performance, offline-first CRM specifically designed for modern educational institutions. It streamlines the workflow between school administrators, Heads of Departments (HODs), and teaching staff through intuitive task monitoring and personal productivity dashboards.

---

## 🚀 Key Features

### 🏢 Administrative & HOD Console
*   **School Performance Dashboard:** Real-time analytics on task distribution and completion rates across the institution.
*   **Teacher Directory:** Comprehensive staff management, including role assignments and department tracking.
*   **Task Monitor:** Global oversight of all educational workflows with priority-based filtering.
*   **Profile Management:** Full control over teacher profiles, including contact details and profile image uploads.

### 👨‍🏫 Teacher Portal
*   **Onboarding Flow:** Simplified multi-step registration for new staff to set up their profile and initial tasks.
*   **Personal Overview:** Visual completion metrics and workload statistics.
*   **Task Stream:** Dedicated space for managing assigned lessons, lab preparations, and administrative duties.
*   **Profile Customization:** Ability to upload custom profile images and maintain contact information.

### 🛠 Technical Excellence
*   **Offline-First Architecture:** Powered by **Dexie.js** (IndexedDB) for seamless functionality without an internet connection.
*   **Modern UI/UX:** Built with **Tailwind CSS** and **Manrope** typography for a professional, distraction-free aesthetic.
*   **Lightweight & Fast:** Zero AI bloat. Pure, efficient React-based CRM logic.
*   **Vercel Optimized:** Ready for instant deployment with automated routing configuration.

---

## 💻 Tech Stack

| Category | Technology |
| :--- | :--- |
| **Frontend** | React 19, TypeScript |
| **State Management** | Zustand |
| **Database** | Dexie.js (Offline Persistence) |
| **Styling** | Tailwind CSS |
| **Charts** | Recharts |
| **Build Tool** | Vite |

---

## 🔐 Access Credentials

The system comes pre-seeded with administrative access for the primary overseer:

*   **Admin Username:** `ApexEduTasksCRM@admin.co.za`
*   **Admin Password:** `Ap3xEduTasksCRM`
*   **Administrator Name:** Vaughan Blignaut

---

## 🛠 Installation & Setup

1.  **Clone the repository**
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Run development server:**
    ```bash
    npm run dev
    ```
4.  **Build for production:**
    ```bash
    npm run build
    ```

---

## 📦 Deployment

This project is configured for **Vercel**. Simply connect your GitHub repository to Vercel, and it will automatically detect the Vite configuration and deploy using the `dist` output directory. The `vercel.json` ensures all client-side routes are handled correctly.

---

## 📝 Recent Updates
*   ✅ **AI Removal:** All Gemini API integrations removed for a lean administrative experience.
*   ✅ **Profile Images:** Implemented local file upload system for teacher avatars.
*   ✅ **Teacher Onboarding:** New multi-step signup process for staff.
*   ✅ **Contact Integration:** Added email and telephone fields to staff profiles.
*   ✅ **Admin Identity:** Updated default administrator to Vaughan Blignaut.

---

*Designed for educators, by engineers. © 2024 ApexEdu CRM.*
