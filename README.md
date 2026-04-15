# Techweb Agency Management System

![Laravel](https://img.shields.io/badge/Laravel-12.x-FF2D20?style=for-the-badge&logo=laravel)
![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?style=for-the-badge&logo=tailwind-css)
![Inertia.js](https://img.shields.io/badge/Inertia.js-2.x-9553E9?style=for-the-badge&logo=inertia)

A professional, full-stack Agency Management System (ERP) designed for **Techweb**. This platform streamlines project workflows, team collaboration, attendance tracking, and client interactions through a modern, high-performance interface.

---

## 🚀 Overview

Techweb Management System is a centralized hub for digital agencies to manage their entire lifecycle. It bridges the gap between administrative oversight and team execution.


-   **Admin Portal:** Total control over projects, finances (via templates), team monitoring, and content management.
-   **Member Portal:** Focused environment for developers/staff to track tasks, report progress, and manage daily attendance.
-   **Public Presence:** A visually rich website showcasing services, portfolio templates, and company insights via a blog.

---

## ✨ Core Features

### 🛠 Administrative Management
*   **Advanced Dashboard:** Real-time analytics with task trends (Line Charts), status distribution (Bar Charts), and upcoming deadline alerts.
*   **Project & Task Lifecycle:** Hierarchical management from Categories to Projects and individual Tasks with assigned members and priorities.
*   **Member Management:** Full CRUD for team members, including role assignment and profile management.
*   **Customer Relations:** Integrated Contact Us handling with email reply capabilities directly from the panel.

### 🤝 TeamHub (Collaboration)
*   **Activity Feed:** Stay updated with a live stream of team actions and updates.
*   **Smart Messaging:** Real-time direct messaging between Admin and Members.
*   **File Repository:** Centralized file sharing within project activities and tasks.
*   **Notification System:** Unread message tracking and activity alerts.

### ⏰ Attendance & Planning
*   **QR Code Attendance:** Innovative check-in system where members scan a dynamic QR code to log their presence.
*   **Scheduling:** Full interactive calendar (FullCalendar) for planning events, milestones, and daily schedules.
*   **Progress Reports:** Systematic tracking of task completion with member-submitted updates.

### 📝 CMS (Content Management System)
*   **Blog Engine:** Complete publishing platform for company news and technical articles.
*   **Template Showcase:** Manage and display project templates/portfolios to potential clients.

---

## 🛠 Technology Stack

### Backend
- **Laravel 12:** The PHP Framework for Web Artisans.
- **MySQL:** Relational database for robust data integrity.
- **Inertia.js:** Seamlessly connecting Laravel with React without building a separate API.

### Frontend
- **React 18:** Modern UI components and state management.
- **Tailwind CSS:** Utility-first styling with high-end responsiveness.
- **Framer Motion:** Smooth UI transitions and animations.
- **Recharts:** Dynamic data visualization for the dashboard.
- **FullCalendar:** Enterprise-grade scheduling interface.

### Tools & Libraries
- **Vite:** Next-generation frontend tooling.
- **Axios:** For asynchronous HTTP requests.
- **Lucide & Heroicons:** Clean and consistent iconography.
- **Three.js / Particles.js:** High-end visual effects and interactive backgrounds.

---

## 📂 Project Structure

```text
├── app/
│   ├── Http/Controllers/    # Role-based logic (Admin, Member, Auth)
│   ├── Models/              # Database entities (User, Task, Project, etc.)
│   └── Mail/                # Email notification templates
├── config/                  # System & Service configurations
├── database/
│   ├── migrations/          # Schema definitions
│   └── seeders/             # Initial system data
├── resources/
│   ├── js/
│   │   ├── Components/      # Reusable UI elements
│   │   ├── Layouts/         # Role-specific wrappers (AdminLayout, MemberLayout)
│   │   └── Pages/           # React views (Inertia Pages)
│   └── views/               # Root Blade template
├── routes/
│   ├── web.php              # Main application routes
│   └── auth.php             # Authentication routes
└── public/                  # Static assets & Build files
```

---

## ⚙️ Installation Guide

Follow these steps to set up the project locally:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/techweb-management.git
   cd techweb-management
   ```

2. **Install Backend Dependencies:**
   ```bash
   composer install
   ```

3. **Install Frontend Dependencies:**
   ```bash
   npm install
   ```

4. **Environment Setup:**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```
   *Configure your `DB_DATABASE`, `DB_USERNAME`, and `DB_PASSWORD` in the `.env` file.*

5. **Database Migration & Seeding:**
   ```bash
   php artisan migrate --seed
   ```

6. **Run the Application:**
   *Open two terminals:*
   ```bash
   # Terminal 1: Vite Dev Server
   npm run dev

   # Terminal 2: Laravel Server
   php artisan serve
   ```

---

## 📖 Usage Guide

-   **Admin Access:** Use the admin credentials (usually seeded) to access `/admin/dashboard`. Here you can create projects, assign tasks, and monitor the team.
-   **Member Access:** Log in as a member to see your assigned tasks, submit progress updates, and mark attendance via the QR code section.
-   **QR Attendance:** On the Member Dashboard, scan the displayed QR code with a logged-in mobile device to verify location/presence.
-   **TeamHub:** Access the 'TeamHub' section from the sidebar to join discussions or share files.

---

## 🔮 Future Improvements
- [ ] Integration with Slack/Discord for notifications.
- [ ] Real-time WebSocket support for Chat (using Laravel Reverb).
- [ ] Advanced financial reporting and invoicing.
- [ ] Dark Mode full optimization across all dashboards.

---

**Developed for Techweb Agency** - *Empowering technology with structured management.*



ana anqolk  shnu bagha n3ml kaml wnzeed wnta etini ra2yek wktbeli prompt lgemini cli bash  y3mlii dekshii , mohim ana bagha fash member ybghi yzeed shi client khass ytla3lo mn les infos li y9dar y3amar ta logo mohim ana bagha les infos li nqdar nzeed kamlin 3tini des infos ntina ktaar proposer shi wahedin mn eandek , wkhsseni yzeed ta possibilite yqdar y uploadi shiii document wla picture wla ay haja bgha member yzeeda ela qbel client yaeni tzadlo wahed l3iba dyal upload , wkhssenii  thayed dek icon dyal notification qdim li makhadamshi ybqali gher hadak jdid li ead emlnah w dek qdim ythayed mn navbar , wkhssni nzeed wahed l3iba isma history fnavbar fhal shi icon fih history dyal akhiir hajaat 3mlom admin wlaa member yaeni la zad shi projet tla3lo bli akhir haja hiya zdti project la eml task tla3lo la accepta rdv tla3loo ,,,,,