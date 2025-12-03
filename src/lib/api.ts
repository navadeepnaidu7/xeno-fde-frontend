const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";
const API_PREFIX = "/api/v1";

interface FetchOptions extends RequestInit {
  token?: string;
}

export async function fetchFromBackend<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { token, ...init } = options;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const url = `${BACKEND_URL}${API_PREFIX}${endpoint}`;
  const response = await fetch(url, {
    ...init,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || `Backend error: ${response.status}`);
  }

  return response.json();
}

// Types
export interface Tenant {
  id: string;
  name: string;
  shopDomain: string;
  createdAt: string;
}

export interface CreateTenantInput {
  name: string;
  shopDomain: string;
  webhookSecret: string;
  accessToken?: string;
}

export interface TopCustomer {
  customerId: string;
  email: string;
  name: string | null;
  totalSpent: number;
  ordersCount: number;
}

export interface OrdersByDate {
  date: string;
  orders: number;
  revenue: number;
}

export interface Metrics {
  customersCount: number;
  ordersCount: number;
  totalRevenue: number;
  topCustomers: TopCustomer[];
  ordersByDate: OrdersByDate[];
}

export interface Order {
  id: string;
  orderNumber: string;
  total: number;
  currency: string;
  customerId: string;
  createdAt: string;
}

export interface Customer {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  totalSpent: number;
  ordersCount: number;
  createdAt: string;
}

export interface Product {
  id: string;
  shopifyProductId: string;
  title: string;
  vendor: string | null;
  productType: string | null;
  price: number | null;
  createdAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
}

export interface PaginatedOrders {
  orders: Order[];
  pagination: Pagination;
}

export interface PaginatedCustomers {
  customers: Customer[];
  pagination: Pagination;
}

export interface PaginatedProducts {
  products: Product[];
  pagination: Pagination;
}

// Tenants
export async function getTenants() {
  return fetchFromBackend<Tenant[]>("/tenants");
}

export async function getTenant(id: string) {
  return fetchFromBackend<Tenant>(`/tenants/${id}`);
}

export async function createTenant(data: CreateTenantInput) {
  return fetchFromBackend<Tenant>("/tenants", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// Metrics
export async function getMetrics(tenantId: string, startDate?: string, endDate?: string) {
  const params = new URLSearchParams();
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);
  const query = params.toString() ? `?${params.toString()}` : "";
  return fetchFromBackend<Metrics>(`/tenants/${tenantId}/metrics${query}`);
}

// Orders
export async function getOrders(tenantId: string, page = 1, limit = 20) {
  return fetchFromBackend<PaginatedOrders>(`/tenants/${tenantId}/orders?page=${page}&limit=${limit}`);
}

// Customers
export async function getCustomers(tenantId: string, page = 1, limit = 20) {
  return fetchFromBackend<PaginatedCustomers>(`/tenants/${tenantId}/customers?page=${page}&limit=${limit}`);
}

// Products
export async function getProducts(tenantId: string, page = 1, limit = 20) {
  return fetchFromBackend<PaginatedProducts>(`/tenants/${tenantId}/products?page=${page}&limit=${limit}`);
}

// Health check
export async function checkHealth() {
  const response = await fetch(`${BACKEND_URL}/health`);
  return response.json();
}
