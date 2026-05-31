# TechWeb - Elite Agency OS & Creative Ecosystem

## 1. VISION & DESIGN PHILOSOPHY
**TechWeb** is not just an ERP; it's a premium operational engine designed for high-end digital agencies. 

- **Ultra-Premium UI:** Inspired by luxury agency aesthetics (KM Agency), the frontend utilizes an **Editorial Layout** with massive bold typography (`tracking-tighter`), dramatic scroll-triggered animations via **Framer Motion**, and high-performance 3D elements using **Three.js**.
- **Glassmorphism & Depth:** Heavily utilizes `backdrop-blur-xl` and sophisticated shadow systems to create a modern, immersive "Dark Mode" focused experience.
- **UX Intent:** Every interaction is designed to feel fluid and "alive," moving away from standard grid systems to a narrative-driven flow.

---

## 2. AI CORE INTEGRATION (Google Gemini 2.5)
The system features a deep, multi-vector AI integration powered by the **Google Gemini Pro** model, acting as a virtual Senior Project Lead and Analyst.

### A. Project AI Advisor
- **Strategic Planning:** Generates a complete execution plan based on budget, timeline, and team composition.
- **Risk Vectors:** Predicts potential bottlenecks and assigns a Risk Level (High/Medium/Low).
- **Success Metrics:** Calculates a "Completion Probability" based on historical client data and current workload.
- **Dynamic Roadmapping:** Suggests technical tasks and phase-based timelines.

### B. Client AI Analyst
- **Relationship Summary:** Analyzes all previous contacts, appointments, and projects to provide a 3-sentence relationship status.
- **Lead Scoring:** Categorizes leads into **Hot, Warm, or Cold** based on interaction frequency and sentiment.
- **Proactive Action:** Suggests the single most important next step and a recommended follow-up date.

### C. Task AI Assistant
- **Technical Breakdown:** Converts vague task titles into detailed technical summaries.
- **Sub-task Generation:** Automatically builds a checklist of technical next steps.
- **Communication Suite:** Drafts professional emails for clients and internal Slack/TeamHub updates tailored to the task's current status.

---

## 3. CORE MODULES & FEATURES

### 🏢 Smart HR & Operations
- **QR Attendance System:** Dynamic, time-sensitive QR code generation. Employees scan to check-in, validated by secure daily tokens.
- **Leave Management:** Full request/approval workflow with automated balance tracking.
- **Smart Salaries:** Automated payslip generation considering base salary, project bonuses (Commercial commissions), and deductions.

### 📈 Mini-ERP & Finance
- **Quote-to-Invoice Pipeline:** Create professional Quotations with PDF generation, then convert them to Invoices with a single click via atomic DB transactions.
- **Expense & Income Tracking:** Categorized tracking of every cent, integrated with financial dashboards.
- **Commercial Commissions:** Integrated system for internal and external commercials with tiered commission tracking.

### 🤝 Collaboration Suite
- **TeamHub:** An internal social network for the agency. Feature-rich "Activities" feed, shared file vaults, and threaded discussions.
- **Real-Time Messaging:** 1-to-1 and Group Chat with "Last Seen" heartbeat tracking, file sharing, and typing indicators.
- **Shared Workspace:** Centralized repository for project files, client assets, and internal templates.

---

## 4. DETAILED PAGE DIRECTORY

### 🌍 Public Site (`/`)
- **Welcome / Home:** Massive hero sections, interactive service cards, and a luxury portfolio showcase.
- **Services:** Editorial breakdown of agency capabilities with smooth parallax reveals.
- **Projects:** A high-end gallery of completed work.
- **Contact:** Lead generation portal integrated directly into the CRM.

### 🛡️ Admin Portal (`/admin/*`)
- **Dashboard:** Command center with Recharts data visualization (productivity, finance, team health).
- **Project Engine:** Detailed Gantt-style views, team assignment, and the **AI Advisor** interface.
- **Financial Hub:** Management of Invoices, Quotes, Expenses, and Salaries.
- **Client CRM:** Database of active clients and prospects with **AI Lead Analysis**.
- **Team Management:** Role-based control (Spatie RBAC), attendance logs, and leave approvals.
- **CMS Control:** Blog management, Template builder, and Creator (talent) database.

### 💻 Member Workspace (`/member/*`)
- **Personal Dashboard:** "At a glance" view of assigned tasks, today's schedule, and attendance status.
- **Task Center:** Kanban-inspired task management with the **AI Task Assistant**.
- **Attendance Scan:** Portal for scanning QR codes and viewing personal history.
- **TeamHub Feed:** Stay updated with company announcements and team activities.

---

## 5. TECHNICAL ARCHITECTURE

- **Backend:** Laravel 12 (PHP 8.2+) - Robust API, State Management, and Job Queuing.
- **Frontend:** React 18 + Inertia.js - Seamless SPA experience without the complexity of a separate API layer.
- **Database:** MySQL 8.0 - Relational integrity for financial and operational data.
- **Styling:** Tailwind CSS 3 - Utility-first styling for the editorial luxury aesthetic.
- **Animations:** Framer Motion - Orchestrated transitions and scroll-scrubbing effects.
- **3D/Visuals:** Three.js + tsparticles - High-end background effects and interactive elements.
- **Real-time:** Laravel Cache-based presence tracking (Heartbeat system).

---

## 6. ROLE-BASED WORKFLOWS

1. **Lead Conversion:** Lead submits form -> Admin reviews **AI Client Analysis** -> Convert to Client -> Create Project.
2. **Project Execution:** Admin assigns Member -> Member uses **AI Task Assistant** for breakdown -> Logs Progress -> Admin monitors via **AI Advisor**.
3. **Financial Closing:** Project hits 100% -> Convert Quote to Invoice -> Record Payment -> System auto-calculates **Commercial Commissions**.

---

## 7. INSTALLATION & SETUP
1. `composer install` & `npm install`
2. Configure `.env` with DB and **`GEMINI_API_KEY`**.
3. `php artisan migrate --seed`
4. `php artisan serve` & `npm run dev`
