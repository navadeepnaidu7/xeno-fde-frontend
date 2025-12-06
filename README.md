# Xeno FDE Frontend - Shopify Analytics Dashboard

A modern, multi-tenant analytics dashboard for Shopify stores built with Next.js 15, TypeScript, and Tailwind CSS. Features real-time data visualization, checkout abandonment tracking, and comprehensive store analytics.

<small>**Live Website:** https://xeno.navadeepnaidu.com</small>
<small>**Backend API:** https://xeno-api.navadeepnaidu.com</small>
<small>**Backend Git Repository:** https://github.com/navadeepnaidu7/xeno-fde-backend</small>

---

## Table of Contents

1. [Assumptions](#1-assumptions)
2. [High-Level Architecture](#2-high-level-architecture)
3. [Features & Pages](#3-features--pages)
4. [Next Steps to Productionize](#4-next-steps-to-productionize)

---

## 1. Assumptions

### Authentication & Authorization

| Assumption | Rationale |
|------------|-----------|
| **Email-based authentication** | Simplified auth using NextAuth.js v5 with credentials provider. In production, OAuth providers (Google, GitHub) would be added. |
| **Session-based auth** | JWT tokens stored in HTTP-only cookies for security. |
| **No role-based access** | All authenticated users have full access. Production would implement admin/viewer roles. |

### User Experience

| Assumption | Rationale |
|------------|-----------|
| **Single user per session** | No collaborative features; one user manages stores at a time. |
| **Desktop-first design** | Optimized for desktop with responsive mobile support. |
| **System theme preference** | Dark/light mode follows OS settings; no manual toggle. |

### Technical Decisions

| Assumption | Rationale |
|------------|-----------|
| **API proxy for CORS** | All backend requests go through `/api/proxy` to avoid CORS issues and hide backend URL. |
| **Client-side data fetching** | Dashboard uses `useEffect` for data fetching; SSR would improve initial load. |
| **No offline support** | Requires active internet connection; no service worker or caching. |

---

## 2. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND (Next.js 15)                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐  │
│  │   Landing   │    │   Sign In   │    │  Dashboard  │    │  Analytics  │  │
│  │    Page     │───▶│    Page     │───▶│    Pages    │───▶│    Page     │  │
│  └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘  │
│                            │                  │                  │          │
│                            ▼                  ▼                  ▼          │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                        NextAuth.js v5 (Session)                      │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                      │                                      │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                      API Proxy (/api/proxy/*)                        │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                      │                                      │
└──────────────────────────────────────│──────────────────────────────────────┘
                                       │
                                       ▼
                    ┌──────────────────────────────────────┐
                    │      Backend API (Express.js)        │
                    │   https://xeno-api.navadeepnaidu.com │
                    └──────────────────────────────────────┘
```

### Component Architecture

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Framework** | Next.js 15 (App Router) | Server/client rendering, routing, API routes |
| **Styling** | Tailwind CSS | Utility-first CSS, dark mode support |
| **UI Components** | Radix UI + Custom | Accessible, composable primitives |
| **Charts** | Recharts | Interactive data visualization |
| **Auth** | NextAuth.js v5 | Session management, protected routes |
| **State** | React useState/useEffect | Local component state, data fetching |
| **Animations** | Framer Motion | Smooth page transitions, micro-interactions |

### Data Flow

1. **Authentication:** User signs in → NextAuth creates session → Redirect to dashboard
2. **Tenant Selection:** Fetch tenants → User selects store → Navigate to tenant dashboard
3. **Data Loading:** Component mounts → Call API proxy → Backend returns data → Render UI
4. **Real-time Updates:** Refresh button/page reload → Fetch latest data from backend

---

## 3. Features & Pages

### Dashboard Pages

| Page | Route | Description |
|------|-------|-------------|
| **Landing** | `/` | Marketing page with feature highlights |
| **Sign In** | `/auth/signin` | Email-based authentication |
| **Dashboard** | `/dashboard/[tenantId]` | Main analytics overview with metrics cards and charts |
| **Orders** | `/dashboard/[tenantId]/orders` | Paginated orders list with customer names |
| **Customers** | `/dashboard/[tenantId]/customers` | Customer list with spending data |
| **Products** | `/dashboard/[tenantId]/products` | Product catalog with pricing |
| **Analytics** | `/dashboard/[tenantId]/analytics` | Checkout abandonment & refund analytics |
| **Settings** | `/dashboard/[tenantId]/settings` | Store configuration and sync controls |

### Key Features

#### Dashboard Metrics
- Total Revenue, Customers, Orders
- Average Order Value
- Revenue per Customer
- Orders per Customer
- **Checkout Conversion Rate**
- **Abandonment Rate & Lost Revenue**

#### Analytics Page
- Checkout funnel visualization (Completed / Abandoned / Pending)
- Abandoned carts table with customer email and cart value
- Refund tracking with reasons and amounts
- Tabbed interface for easy navigation

#### Data Tables
- Pagination with page controls
- Customer name resolution (shows name instead of ID)
- Proper currency formatting (INR support)
- Loading skeletons for better UX

### API Integration

The frontend communicates with the backend via a proxy to avoid CORS:

```typescript
// All requests go through /api/proxy
const API_PREFIX = "/api/proxy";

// Example: Get metrics
GET /api/proxy/tenants/:id/metrics

// Example: Get checkout analytics  
GET /api/proxy/analytics/checkouts/:tenantId
```

#### Endpoints Used

| Category | Endpoints |
|----------|-----------|
| **Tenants** | `GET /tenants`, `GET /tenants/:id`, `POST /tenants`, `PATCH /tenants/:id` |
| **Metrics** | `GET /tenants/:id/metrics?startDate=&endDate=` |
| **Orders** | `GET /tenants/:id/orders?page=&limit=` |
| **Customers** | `GET /tenants/:id/customers?page=&limit=` |
| **Products** | `GET /tenants/:id/products?page=&limit=` |
| **Analytics** | `GET /analytics/checkouts/:id`, `GET /analytics/refunds/:id` |

---

## 4. Next Steps to Productionize

These are the things I would focus on next to make this production ready:

### Security
- **OAuth Providers:** Add Google, GitHub authentication options
- **CSRF Protection:** Implement CSRF tokens for form submissions
- **Rate Limiting:** Add client-side rate limiting for API calls

### Performance
- **Server-Side Rendering:** Move data fetching to server components for faster initial load
- **Static Generation:** Pre-render marketing pages at build time
- **Image Optimization:** Use Next.js Image component for all images
- **Bundle Splitting:** Lazy load dashboard components

### Features
- **Real-time Updates:** WebSocket connection for live order notifications
- **Export Reports:** Download analytics as PDF/CSV
- **Date Range Picker:** More advanced date filtering with presets
- **Search & Filters:** Global search across orders, customers, products
- **Notifications:** In-app notifications for new orders, abandoned carts

### DevOps
- **E2E Testing:** Playwright tests for critical user flows
- **Error Tracking:** Sentry integration for production error monitoring
- **Analytics:** PostHog or Mixpanel for user behavior tracking
- **CI/CD:** GitHub Actions with preview deployments

---

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/     # NextAuth API route
│   │   └── proxy/[...path]/        # Backend API proxy
│   ├── auth/signin/                 # Sign-in page
│   ├── dashboard/
│   │   └── [tenantId]/
│   │       ├── analytics/           # Checkout & refund analytics
│   │       ├── customers/           # Customers list
│   │       ├── orders/              # Orders list
│   │       ├── products/            # Products catalog
│   │       └── settings/            # Store settings
│   ├── layout.tsx                   # Root layout with providers
│   └── page.tsx                     # Landing page
├── components/
│   ├── ui/                          # Button, Input, Table, Badge, etc.
│   ├── MetricsCard.tsx              # Dashboard metric cards
│   ├── RevenueChart.tsx             # Revenue trend chart
│   ├── TopCustomersTable.tsx        # Top customers by spending
│   ├── OrdersTable.tsx              # Orders with pagination
│   ├── CustomersTable.tsx           # Customers with pagination
│   ├── ProductsTable.tsx            # Products catalog table
│   └── providers.tsx                # SessionProvider wrapper
└── lib/
    ├── api.ts                       # Backend API client with types
    ├── auth.ts                      # NextAuth configuration
    └── utils.ts                     # formatCurrency, formatDate, cn()
```

---

## Setting Up Locally

```bash
# Clone and install
git clone https://github.com/navadeepnaidu7/xeno-fde-frontend.git
cd xeno-fde-frontend
npm install

# Environment setup
cp .env.example .env.local
# Edit .env.local with your configuration

# Run development server
npm run dev

# Open http://localhost:3001
```

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_BACKEND_URL` | Backend API URL | `https://xeno-api.navadeepnaidu.com` |
| `NEXTAUTH_URL` | Frontend URL for auth callbacks | `https://xeno.navadeepnaidu.com` |
| `NEXTAUTH_SECRET` | Secret for JWT signing | Random 32+ char string |

---

## Tech Stack

- **Runtime:** Node.js 18+
- **Framework:** Next.js 15 (App Router, Turbopack)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI:** Radix UI primitives + custom components
- **Charts:** Recharts
- **Auth:** NextAuth.js v5
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Deployment:** Railway / Vercel
