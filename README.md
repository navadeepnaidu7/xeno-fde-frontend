# Xeno Analytics Frontend

A modern, multi-tenant analytics dashboard for Shopify stores built with Next.js 15, TypeScript, and Tailwind CSS.

## Features

- **Multi-tenant Support**: Manage multiple Shopify stores from a single dashboard
- **Email Authentication**: Simple email-based authentication with NextAuth.js v5
- **Revenue Analytics**: Track revenue trends with interactive charts
- **Customer Insights**: View top customers and their spending patterns
- **Order Management**: Browse and filter orders with pagination
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- **Dark Mode**: Automatic dark mode support based on system preferences

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js v5
- **Charts**: Recharts
- **UI Components**: Custom components with Radix UI primitives
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Backend API running (see [backend repository](../xeno-fde-backend))

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the environment file:
   ```bash
   cp .env.example .env.local
   ```

4. Update `.env.local` with your configuration:
   ```env
   NEXT_PUBLIC_BACKEND_URL=https://xeno-api.navadeepnaidu.com
   NEXTAUTH_URL=http://localhost:3001
   NEXTAUTH_SECRET=your-secret-key-here
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3001](http://localhost:3001) in your browser

## Project Structure

```
src/
├── app/
│   ├── api/auth/[...nextauth]/     # NextAuth API route
│   ├── auth/signin/                 # Sign-in page
│   ├── dashboard/
│   │   ├── [tenantId]/              # Tenant-specific pages
│   │   │   ├── customers/           # Customers list
│   │   │   ├── orders/              # Orders list
│   │   │   └── settings/            # Store settings
│   │   └── new/                     # Add new store
│   ├── layout.tsx                   # Root layout
│   └── page.tsx                     # Landing page
├── components/
│   ├── ui/                          # Reusable UI components
│   ├── MetricsCard.tsx              # Metrics display card
│   ├── RevenueChart.tsx             # Revenue chart
│   ├── TopCustomersTable.tsx        # Top customers table
│   ├── OrdersTable.tsx              # Orders table
│   ├── CustomersTable.tsx           # Customers table
│   └── providers.tsx                # Context providers
└── lib/
    ├── api.ts                       # Backend API client
    ├── auth.ts                      # NextAuth configuration
    └── utils.ts                     # Utility functions
```

## API Integration

The frontend connects to a backend API that provides:

- `/api/v1/tenants` - List/create tenants (stores)
- `/api/v1/tenants/:id/metrics` - Get analytics metrics
- `/api/v1/tenants/:id/orders` - Get paginated orders
- `/api/v1/tenants/:id/customers` - Get paginated customers
- `/api/v1/tenants/:id/products` - Get paginated products

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

### Railway / Other Platforms

1. Set environment variables
2. Build: `npm run build`
3. Start: `npm start`

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_BACKEND_URL` | Backend API URL | `https://xeno-api.navadeepnaidu.com` |
| `NEXTAUTH_URL` | Frontend URL for auth | `https://your-domain.com` |
| `NEXTAUTH_SECRET` | Secret for JWT signing | Random 32+ char string |

## License

This project was created for the Xeno FDE Assignment 2025.
