# cartSutra — Multi-Vendor E-Commerce Admin Panel

A production-grade admin dashboard for **cartSutra**, a multi-vendor e-commerce marketplace. Built to give administrators full operational control over vendors, products, orders, payments, logistics, and content — with real-time data, role-based access, and a polished, responsive UI.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack%20Query-5-FF4154?logo=reactquery&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-green)

---

## Overview

cartSutra Admin is the operations control center for a multi-vendor marketplace — similar in scope to what powers platforms like Amazon Seller Central or Etsy's back office. It's the single interface admins use to approve vendors and products, process orders and refunds, manage payouts, moderate reviews, run analytics, and publish site content, all backed by a REST API and secured behind role-based authentication.

This is a solo-built, feature-complete front end (25+ modules) designed with production concerns in mind: optimistic caching, soft-delete/restore workflows, granular permissions, skeleton loading states, and a fully responsive layout from mobile to desktop.

**Live features at a glance:** vendor approval workflows, product moderation, order lifecycle management, shipment tracking, returns & refunds, payouts, coupons & gift cards, support tickets, sales analytics, CMS, and a global cross-entity search.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Build tool | Vite |
| Routing | React Router v7 (nested layouts, protected routes) |
| Server state | TanStack Query v5 (caching, invalidation, background refetch) |
| Forms & validation | React Hook Form + Zod schemas |
| Styling | Tailwind CSS v4 (CSS-variable theming, dark mode) |
| Charts | Recharts |
| HTTP | Axios (cookie-based auth, multipart upload client) |
| UX | Sonner (toasts), Lucide React (icons), date-fns |
| Dates/formatting | date-fns |

**Architecture patterns used:**
- Feature-first folder structure (`components/`, `hooks/queries/`, `interface/`, `validator/` per domain)
- Centralized API layer via a typed `HttpService` class wrapping Axios
- Query-key based cache invalidation per entity (`QUERY_KEY` constants)
- Two-tier route protection: `Authentication` (session check) → `Authorization` (role check)
- Skeleton-first loading states for every table, form, and detail page (no layout shift)
- Soft-delete + restore + permanent-delete pattern across trashable entities

---

## Core Modules

### Catalog & Inventory
- **Products** — full CRUD, multi-image gallery editor, variant support, approval workflow (pending/approved/rejected with reasons), featured toggling, soft delete/restore, low-stock alerts
- **Categories** — 3-level hierarchical tree (root → child → grandchild) with drag-free tree navigation, search, and status toggling
- **Brands** — CRUD with logo upload and featured flagging
- **Warehouses** — per-vendor warehouse directory with capacity and contact tracking

### Commerce Operations
- **Orders** — status pipeline (pending → confirmed → processing → packed → shipped → delivered), cancellation with reason capture, itemized breakdown, multi-seller fulfillment view
- **Shipping** — carrier assignment, tracking number management, live tracking-event timeline, cancellable pre-dispatch shipments
- **Returns** — full RMA lifecycle: request → approve/reject → pickup → received → refund, with evidence image review
- **Reviews** — moderation queue, report resolution, approve/hide toggling

### Payments & Finance
- **Payments** — payment status tracking and manual refund initiation per order
- **Refunds** — centralized refund queue (order cancellations, returns, manual) with process/retry/cancel actions
- **Vendor Payouts** — payout request review, processing with transaction reference, rejection with wallet reversal, running summary (paid out / pending)
- **Coupons** — percentage/flat discounts with usage caps, per-user limits, validity windows
- **Gift Cards** — issuance, balance tracking, disable/enable, expiry handling

### Vendor & Customer Management
- **Vendors** — KYC document review, approval/rejection with reasons, suspension, bank & tax detail verification, per-vendor performance stats
- **Customers** — account status control (block/unblock), verification status, activity history
- **Admins** — super-admin-gated promotion/demotion of staff to admin roles

### Content & Communication
- **CMS** — banners (position-targeted, scheduled), static/policy pages, blog posts with SEO metadata
- **Notifications** — broadcast/role/user-targeted push notifications, live unread badge, mark-as-read
- **Support Tickets** — threaded conversations with attachments, priority/status/category triage, self-assignment

### Insights
- **Reports & Analytics** — revenue trends, top products/vendors, category-wise sales, customer growth, order-status distribution, live low-stock snapshot, custom date-range filtering
- **Dashboard** — at-a-glance KPIs (revenue, orders, products, vendors, customers) with period-over-period deltas, recent activity feeds

### Platform
- **Global Search** — single search bar querying 18+ entity types in parallel (products, orders, vendors, tickets, refunds, etc.)
- **Settings** — site branding, contact info, tax/shipping defaults, maintenance mode, SEO, social links
- **Profile & Auth** — avatar management, password change, email/OTP-based forgot-password flow, session-based auth guards

---

## Highlights & Engineering Decisions

- **Optimistic, cache-aware data layer** — every mutation invalidates precisely scoped query keys, so lists refresh instantly without full-page reloads or manual state syncing.
- **Soft-delete everywhere it matters** — products, categories, brands, coupons, and gift cards support trash/restore/permanent-delete instead of destructive deletes, matching real marketplace compliance needs.
- **Backend-mirrored state machines on the client** — order and shipment status flows mirror backend-enforced transition rules to prevent invalid actions before they hit the API.
- **Type-safe forms end-to-end** — Zod schemas drive both runtime validation and TypeScript inference, eliminating drift between form state and API payloads.
- **Theming via CSS variables** — a single `App.css` token system (light/dark) drives every component, making rebrand or white-labeling a CSS-only change.
- **Composable skeleton system** — dedicated skeleton primitives (table, stat card, chart, detail rows) so every async view has a matching, layout-stable loading state.
- **Multipart-aware HTTP layer** — a small `HttpService` abstraction switches between JSON and multipart Axios instances transparently, keeping upload-heavy forms (products, KYC docs, banners) simple to write.

---

## Getting Started

### Prerequisites
- Node.js 18+
- A running instance of the cartSutra backend API

### Installation

```bash
git clone <repository-url>
cd cartSutra-admin
npm install
```

### Environment Setup

Create a `.env` file in the project root:

```env
VITE_SERVER_URL=http://localhost:3000/api/v3
```

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
npm run preview
```

---

## Project Structure

```
src/
├── auth/              # Authentication & role-based authorization guards
├── components/        # Feature-organized UI components (products, orders, vendors, ...)
│   └── common/         # Shared primitives: Modal, Button, Table skeletons, Form inputs
├── enums/             # Domain enums shared with the backend contract
├── hooks/
│   └── queries/        # TanStack Query hooks, one file per domain (product, order, vendor...)
├── interface/         # TypeScript interfaces for API data shapes
├── layout/            # Dashboard shell: Sidebar, Topbar, Global Search, Notifications
├── library/           # Axios instances, QueryClient config
├── pages/             # Route-level page components
├── services/          # HttpService — typed Axios wrapper (JSON + multipart)
├── validator/         # Zod schemas for form validation
└── constants/         # API endpoints, query keys, nav config
```

---

## Author

Built and maintained as a solo full-stack project to demonstrate production-oriented front-end architecture for complex, data-heavy admin systems.

## License

This project is available under the MIT License.