# 🏗️ Technical Architecture - Frontend

## 🎯 Overview

Dokumen ini menjelaskan arsitektur teknis frontend untuk proyek STI Frontend, yang dibangun dengan Next.js 15 menggunakan App Router, TypeScript, dan Tailwind CSS. Sistem ini terdiri dari 5 modul utama: Kerja Praktek, Tugas Akhir, Bimbingan Karir, Alumni, dan Admin.

---

## 📐 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Browser                       │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│                    Next.js 15 App Router                    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Route Groups (Organization)             │   │
│  │  • (auth)      - Authentication pages                │   │
│  │  • (landing)   - Public pages                        │   │
│  │  • (subapps)   - Protected application modules       │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                 Application Modules                  │   │
│  │  • kerja-praktek    - Internship management          │   │
│  │  • tugas-akhir      - Final project management       │   │
│  │  • bimbingan-karir  - Career guidance                │   │
│  │  • alumni           - Alumni & job portal            │   │
│  │  • admin            - CMS administration             │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│                  Frontend Layer Architecture                │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐             │
│  │   Client   │  │   Server   │  │  Shared    │             │
│  │ Components │  │ Components │  │ Components │             │
│  └────────────┘  └────────────┘  └────────────┘             │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│                      State Management                       │
│  • React Context (Profile, Auth)                            │
│  • SWR (Data fetching & caching)                            │
│  • React Hook Form (Form state)                             │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│                       API Layer                             │
│  • Service Factory Pattern                                  │
│  • Centralized HTTP Client                                  │
│  • Type-safe API calls                                      │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│                    Backend REST API                         │
│              (https://api-sti.dinus.id)                     │
└─────────────────────────────────────────────────────────────┘
```

---

## 🗂️ Folder Structure & Architecture

### High-Level Structure

```
sti-fe/
├── api/
│   ├── alumni/
│   │   ├── alumnus/
│   │   │   └── data-cv/
│   │   ├── koor/
│   │   ├── mahasiswa/
│   │   │   └── data-cv/
│   │   └── mitra/
│   ├── authentication/
│   ├── bimbingan-karir/
│   │   ├── koordinator/
│   │   │   ├── analisis-kegiatan/
│   │   │   ├── daftar-kegiatan/
│   │   │   ├── daftar-mahasiswa/
│   │   │   ├── dashboard/
│   │   │   ├── log-aktivitas/
│   │   │   ├── periode/
│   │   │   ├── rekap-nilai/
│   │   │   └── riwayat/
│   │   └── mahasiswa/
│   │       ├── daftar-kegiatan/
│   │       ├── dashboard/
│   │       └── rekap-nilai/
│   ├── kerja-praktek/
│   ├── link-group/
│   ├── pengumuman/
│   ├── superadmin/
│   │   ├── akademik-page/
│   │   ├── landing-page/
│   │   ├── profile-page/
│   │   ├── program-unggulan-page/
│   │   ├── publikasi-page/
│   │   └── users/
│   └── tugas-akhir/
├── app/
│   ├── (root)/
│   │   ├── (auth)/
│   │   │   ├── callback-google/
│   │   │   ├── login/
│   │   │   └── unauthorized/
│   │   ├── (landing)/
│   │   │   ├── about/developer/
│   │   │   ├── akademik/
│   │   │   ├── pengumuman/
│   │   │   ├── profil/
│   │   │   ├── program-unggulan/
│   │   │   ├── publikasi/
│   │   │   ├── detail/
│   │   │   └── dosen/
│   │   ├── (subapps)/
│   │   │   ├── admin/
│   │   │   │   ├── _components/
│   │   │   │   ├── akademik-page/
│   │   │   │   ├── landing-page/
│   │   │   │   ├── profile-page/
│   │   │   │   ├── program-unggulan/
│   │   │   │   ├── publikasi-page/
│   │   │   │   └── users/
│   │   │   ├── alumni/
│   │   │   │   ├── _components/
│   │   │   │   ├── _hooks/
│   │   │   │   ├── (dashboard)/
│   │   │   │   ├── (lowongan)/
│   │   │   │   ├── (survei)/
│   │   │   │   ├── (tracer)/
│   │   │   │   ├── analitik/
│   │   │   │   ├── data-alumni/
│   │   │   │   ├── data-cv/
│   │   │   │   ├── manajemen-users/
│   │   │   │   ├── pengumuman/
│   │   │   │   ├── profil/
│   │   │   │   └── rekap/
│   │   │   ├── bimbingan-karir/
│   │   │   │   ├── _components/
│   │   │   │   ├── (dashboard)/
│   │   │   │   ├── analisis-kegiatan/
│   │   │   │   ├── daftar-kegiatan/
│   │   │   │   ├── daftar-mahasiswa/
│   │   │   │   ├── log-aktivitas/
│   │   │   │   ├── pengumuman/
│   │   │   │   ├── periode-ajaran/
│   │   │   │   ├── profile/
│   │   │   │   ├── rekap-nilai/
│   │   │   │   └── riwayat/
│   │   │   ├── kerja-praktek/
│   │   │   │   ├── _components/
│   │   │   │   ├── (dashboard)/
│   │   │   │   ├── daftar-dosen/
│   │   │   │   ├── daftar-mahasiswa/
│   │   │   │   ├── gelombang/
│   │   │   │   ├── log-aktivitas/
│   │   │   │   ├── logbook-bimbingan/
│   │   │   │   ├── logbook-mahasiswa/
│   │   │   │   ├── mahasiswa-bimbingan/
│   │   │   │   ├── monitoring-sidang/
│   │   │   │   ├── pengajuan-kp/
│   │   │   │   ├── pengajuan-sidang/
│   │   │   │   ├── pengumuman/
│   │   │   │   ├── periode/
│   │   │   │   ├── plotting-jadwal/
│   │   │   │   └── profile/
│   │   │   ├── onboarding/alumni/
│   │   │   ├── register/
│   │   │   └── tugas-akhir/
│   │   │       ├── _components/
│   │   │       ├── (dashboard)/
│   │   │       ├── (monitoring-sidang)/
│   │   │       ├── data-dosen/
│   │   │       ├── data-mahasiswa/
│   │   │       ├── data-mahasiswa-all/
│   │   │       ├── kuota-dosen/
│   │   │       ├── log-aktivitas/
│   │   │       ├── logbook/
│   │   │       ├── pengajuan-mahasiswa/
│   │   │       ├── pengumuman/
│               └── periode-ajaran/
└── profile/
│   │   ├── apps/
│   │   ├── components/
│   │   ├── documentation-api/
│   │   └── hoc/
├── components/
│   └── ui/
├── context/
├── data/
├── docs/
│   ├── development_guide/
│   └── software_vision/
├── hooks/
│   ├── landing-page/
│   └── pengumuman/
├── lib/
│   ├── alumni/validation/
│   ├── bimbingan-karir/
│   ├── constant/
│   ├── landing-page/pengumuman/
│   └── tugas-akhir/
├── public/
│   ├── assets/
│   │   ├── landingpage/
│   │   ├── img/
│   │   │   ├── akreditasi/
│   │   │   ├── background/
│   │   │   ├── dosen/struktur-organisasi/
│   │   │   ├── FotoLanyard/
│   │   │   ├── profesiLulusan/
│   │   │   ├── slidesbow-old/
│   │   │   └── slideshow-new/
│   │   ├── logo/
│   │   ├── layanan/
│   │   └── program-unggulan/
│   └── docs-siadin/
├── src/
│   ├── components/
│   ├── hooks/
│   └── styles/
└── types/
    ├── admin/
    │   ├── akademik-page/
    │   ├── landing-page/
    │   ├── profile-page/
    │   ├── program-unggulan/
    │   ├── publikasi-page/
    │   └── users/
    ├── alumni/
    │   ├── analitik/
    │   ├── dashboard/
    │   ├── data-cv/
    │   ├── import-user/
    │   ├── kelola-lowongan/
    │   ├── lowongan/
    │   ├── manajemen-user/
    │   ├── onboarding/
    │   ├── pertanyaan-survei/
    │   ├── profil-alumni/
    │   ├── profil-mitra/
    │   ├── rekap/
    │   ├── survei/
    │   ├── tabel-alumniDi-mitra/
    │   ├── tambah-alumniDi-mitra/
    │   └── tracer/
    ├── bimbingan-karir/
    │   ├── koordinator/
    │   │   ├── analisis-kegiatan/
    │   │   ├── daftar-kegiatan/
    │   │   ├── daftar-mahasiswa/
    │   │   ├── dashboard/
    │   │   ├── pengumuman/
    │   │   ├── rekap-nilai/
    │   │   └── riwayat/
    │   └── mahasiswa/
    ├── kerja-praktek/
    ├── landing-page/
    │   └── pengumuman/
    └── tugas-akhir/
```
---

## 🔧 Core Technologies

### Framework & Language

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 15.x | React framework with App Router |
| **React** | 18.x | UI library |
| **TypeScript** | 5.x | Type safety |
| **Tailwind CSS** | 3.x | Utility-first CSS framework |

### UI & Component Libraries

| Library | Purpose |
|---------|---------|
| **shadcn/ui** | Pre-built accessible components |
| **Lucide React** | Icon library |
| **TanStack Table** | Advanced table functionality |

### State Management

| Solution | Use Case |
|----------|----------|
| **React Context** | Global auth & profile state |
| **SWR** | Data fetching, caching, revalidation |
| **React Hook Form** | Form state management |

### Form & Validation

| Library | Purpose |
|---------|---------|
| **React Hook Form** | Form handling |
| **Zod** | Schema validation |

### HTTP & API

| Technology | Purpose |
|------------|---------|
| **SWR** | Data fetching & caching |
| **cookies-next** | Cookie management |

---

## 🎨 Component Architecture

### Component Types

```typescript
// 1. Server Components (Default)
// - Data fetching
// - SEO optimization
// - No interactivity

// app/(root)/(subapps)/kerja-praktek/page.tsx
export default function Page() {
  return <ClientWrapper />;
}

// 2. Client Components ("use client")
// - Interactive features
// - Browser APIs
// - Event handlers

// app/(root)/(subapps)/kerja-praktek/client-page.tsx
"use client";
export default function ClientPage() {
  const [state, setState] = useState();
  return <InteractiveUI />;
}

// 3. Shared Components
// - Reusable across modules
// - Design system components

// components/ui/button.tsx
export const Button = ({ ... }) => { ... };
```

---

## 🔐 Authentication & Authorization

### Authentication Flow

```
User Login
    ↓
POST /api/auth/login
    ↓
Receive JWT Token
    ↓
Store in HTTP-only Cookie
    ↓
Set user_role Cookie
    ↓
Redirect to Dashboard
```

### Authorization Layers

#### 1. HOC Layer
```typescript
// Validate token via cookies
// Fetch and inject user profile to get role
// Redirect if unauthorized or onboarding not completed
// Handle loading state
```

#### 2. Component Layer
```typescript
// Role-based rendering
{role === "koordinator" && <KoordinatorFeature />}
{role === "dosen" && <DosenFeature />}
{role === "mahasiswa" && <MahasiswaFeature />}
```

### Protected Route Structure

```
/kerja-praktek/*
├── client-page.tsx applies withAuth HOC
└── Role-based navigation & content
    ├── koordinator → Koordinator access
    ├── dosen → Dosen access
    └── mahasiswa → Student access
```
---

## 📊 Data Flow Architecture

### Client-Side Data Fetching (SWR)

```
Component Renders
    ↓
useSWR
    ↓
├─ Cache Hit → Immediate data
└─ Cache Miss
    ↓
    Fetch from API
    ↓
    Update Cache
    ↓
    Revalidate in Background
```

### Server-Side Data Fetching

```
Page Request
    ↓
Server Component
    ↓
Direct API Call
    ↓
Return Pre-rendered HTML
    ↓
Hydrate on Client
```

### Form Submission Flow

```
User Input
    ↓
React Hook Form
    ↓
Zod Validation
    ↓
├─ Valid → Submit to API
│   ↓
│   API Response
│   ↓
│   ├─ Success
│   │   ├─ Update local state
│   │   ├─ Revalidate SWR cache
│   │   └─ Show success toast
│   └─ Error
│       └─ Show error message
└─ Invalid → Show validation errors
```

---

## 🎯 Role-Based Architecture

### Role Types

```typescript
type Role = "dosen" | "koordinator" | "mahasiswa";

```

### Dynamic Navigation

```typescript
// Sidebar configuration per role
const sidebarData = {
  koordinator: { menus: [...], navMain: [...] },
  dosen: { menus: [...], navMain: [] },
  mahasiswa: { menus: [...], navMain: [] }
};

// Render based on role
<NavMenu menu={sidebarData[role].menus} />
```

---

## 🚀 Performance Optimization

### Rendering Strategy

| Page Type | Strategy | Reason |
|-----------|----------|--------|
| Landing pages | SSG | SEO, speed |
| Dashboard | SSR | Fresh data |
| Interactive forms | CSR | User input |
| Data tables | SSR + CSR | Initial data + interactions |

---

## 📱 Responsive Design

### Breakpoint Strategy

```
Mobile First Approach

sm:  640px  → Small devices (portrait tablets)
md:  768px  → Medium devices (landscape tablets)
lg:  1024px → Large devices (laptops)
xl:  1280px → Extra large devices (desktops)
2xl: 1536px → 2X large devices (large desktops)
```

### Responsive Patterns

```typescript
// Grid layout
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">

// Visibility
<div className="hidden md:block">

// Sizing
<div className="text-sm md:text-base lg:text-lg">
```

---

## 🔄 State Management Architecture

### State Categories

```
Global State (Context)
├── Authentication (tokens, user)
└── Profile (user data, permissions)

Server State (SWR)
├── API data
├── Cache management
└── Revalidation

Local State (useState)
├── UI state
├── Form inputs
└── Component state

Form State (React Hook Form)
├── Field values
├── Validation errors
└── Submit state
```
---

## 🛡️ Security Architecture

### Security Layers

```
1. Network Layer
   ├── HTTPS only
   ├── CORS configured
   └── Rate limiting (backend)

2. Authentication Layer
   ├── JWT tokens
   ├── HTTP-only cookies
   ├── Token expiry validation
   └── Refresh token flow

3. Authorization Layer
   ├── Middleware checks
   ├── HOC guards
   └── Component-level checks

4. Input Validation Layer
   ├── Zod schemas
   ├── Form validation
   └── Type checking
```

### Third-Party Libraries

```
UI/UX
├── shadcn/ui → Component library
└── Lucide → Icons

Data
├── SWR → Fetching
└── TanStack Table → Tables

Forms
├── React Hook Form → Management
└── Zod → Validation
```

---

## 📝 Type System Architecture

### Type Organization

```
types/
├── api-response.tsx → Generic API types
├── role.tsx → User role types
├── kerja-praktek/ → Module-specific
│   ├── mahasiswa.ts
│   ├── dosen.ts
│   ├── pengajuan.ts
│   └── ...
├── tugas-akhir/
├── bimbingan-karir/
└── alumni/
```

### Type Safety Flow

```
Backend API
    ↓ (Define types)
TypeScript Interfaces
    ↓ (Use in services)
API Services
    ↓ (Type-safe calls)
Components
    ↓ (Type-safe props)
UI Rendering
```

---

## 🎯 Module Independence

### Module Isolation

```
Each module is self-contained:
├── Own layout
├── Own navigation
├── Own components (_components/)
├── Own API services
└── Own type definitions

Shared resources:
├── Global components (components/)
├── Common types (types/)
├── Utilities (lib/)
└── Hooks (hooks/)
```

### Server Configuration

```
Next.js Server
├── Node.js runtime
├── Port: 3000
├── PM2 process manager
└── Nginx reverse proxy

Static Assets
├── Served by Nginx
├── CDN integration
└── Gzip compression
```

---


## 🔮 Future Architecture Considerations

### Scalability

```
Potential Enhancements:
├── Edge functions for auth
├── Incremental Static Regeneration
├── Server Actions for mutations
├── Streaming SSR
└── Partial Prerendering
```

### Module Expansion

```
Easy to add new modules:
1. Create folder in (subapps)
2. Define layout & navigation
3. Create API services
4. Add type definitions
5. Update middleware if needed
```

---



The frontend architecture is built on:

1. **Next.js 15 App Router** for modern React development
2. **TypeScript** for type safety and better DX
3. **Modular Design** for scalability and maintainability
4. **Role-Based Access** for security and personalization
5. **Optimized Performance** for fast user experience
6. **Component Library** (shadcn/ui) for consistent UI
7. **SWR** for efficient data management
8. **Middleware & HOCs** for authentication layers

This architecture supports 5 independent modules with shared infrastructure, ensuring consistent UX while maintaining module isolation.

---

**Last Updated**: November 2025  
**Version**: 1.0.0