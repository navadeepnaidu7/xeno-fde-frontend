// Use the proxy API route to avoid CORS issues
const API_PREFIX = "/api/proxy";

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

  // Use local proxy to avoid CORS issues
  const url = `${API_PREFIX}${endpoint}`;
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

// Analytics Types
export type CheckoutStatus = 'PENDING' | 'COMPLETED' | 'ABANDONED';

export interface CheckoutAnalytics {
  totalCheckouts: number;
  completedCheckouts: number;
  abandonedCheckouts: number;
  pendingCheckouts: number;
  conversionRate: number;
  abandonmentRate: number;
  abandonedValue: number;
  completedValue: number;
}

export interface CheckoutAnalyticsResponse {
  tenantId: string;
  tenantName: string;
  analytics: CheckoutAnalytics;
}

export interface Checkout {
  id: string;
  shopifyCheckoutId: string;
  email: string | null;
  totalPrice: number;
  currency: string;
  status: CheckoutStatus;
  lineItemsCount: number;
  createdAt: string;
  completedAt: string | null;
  abandonedAt: string | null;
}

export interface CheckoutsListResponse {
  checkouts: Checkout[];
  total: number;
  limit: number;
  offset: number;
}

export interface RefundAnalytics {
  totalRefunds: number;
  totalRefundAmount: number;
  averageRefundAmount: number;
}

export interface RefundAnalyticsResponse {
  tenantId: string;
  tenantName: string;
  analytics: RefundAnalytics;
}

export interface Refund {
  id: string;
  shopifyRefundId: string;
  shopifyOrderId: string;
  amount: number;
  currency: string;
  reason: string | null;
  createdAt: string;
}

export interface RefundsListResponse {
  refunds: Refund[];
  total: number;
  limit: number;
  offset: number;
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
export async function getOrders(tenantId: string, page = 1, limit = 20, startDate?: string, endDate?: string) {
  const params = new URLSearchParams();
  params.append("page", page.toString());
  params.append("limit", limit.toString());
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);

  return fetchFromBackend<PaginatedOrders>(`/tenants/${tenantId}/orders?${params.toString()}`);
}

// Customers
export async function getCustomers(tenantId: string, page = 1, limit = 20) {
  return fetchFromBackend<PaginatedCustomers>(`/tenants/${tenantId}/customers?page=${page}&limit=${limit}`);
}

// Products
export async function getProducts(tenantId: string, page = 1, limit = 20) {
  return fetchFromBackend<PaginatedProducts>(`/tenants/${tenantId}/products?page=${page}&limit=${limit}`);
}

// Analytics - Checkouts
export async function getCheckoutAnalytics(
  tenantId: string,
  startDate?: string,
  endDate?: string
): Promise<CheckoutAnalyticsResponse> {
  const params = new URLSearchParams();
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);
  const query = params.toString() ? `?${params.toString()}` : "";
  return fetchFromBackend<CheckoutAnalyticsResponse>(`/analytics/checkouts/${tenantId}${query}`);
}

export async function getCheckouts(
  tenantId: string,
  status?: CheckoutStatus,
  limit = 50,
  offset = 0
): Promise<CheckoutsListResponse> {
  const params = new URLSearchParams();
  params.append("limit", limit.toString());
  params.append("offset", offset.toString());
  if (status) params.append("status", status);
  return fetchFromBackend<CheckoutsListResponse>(`/analytics/checkouts/${tenantId}/list?${params.toString()}`);
}

// Analytics - Refunds
export async function getRefundAnalytics(
  tenantId: string,
  startDate?: string,
  endDate?: string
): Promise<RefundAnalyticsResponse> {
  const params = new URLSearchParams();
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);
  const query = params.toString() ? `?${params.toString()}` : "";
  return fetchFromBackend<RefundAnalyticsResponse>(`/analytics/refunds/${tenantId}${query}`);
}

export async function getRefunds(
  tenantId: string,
  limit = 50,
  offset = 0
): Promise<RefundsListResponse> {
  const params = new URLSearchParams();
  params.append("limit", limit.toString());
  params.append("offset", offset.toString());
  return fetchFromBackend<RefundsListResponse>(`/analytics/refunds/${tenantId}/list?${params.toString()}`);
}

export async function triggerAbandonmentDetection(tenantId: string): Promise<{ success: boolean; abandonedCount: number }> {
  return fetchFromBackend<{ success: boolean; abandonedCount: number }>(`/analytics/detect-abandoned/${tenantId}`, {
    method: "POST",
  });
}

// Sync
export interface SyncResult {
  message: string;
  success: boolean;
  products: { synced: number; errors: number };
  customers: { synced: number; errors: number };
  orders: { synced: number; errors: number };
  duration?: number;
}

export interface SyncStatus {
  tenantId: string;
  name: string;
  shopDomain: string;
  hasAccessToken: boolean;
  counts: {
    products: number;
    customers: number;
    orders: number;
  };
}

export async function triggerSync(tenantId: string): Promise<SyncResult> {
  return fetchFromBackend<SyncResult>("/sync", {
    method: "POST",
    body: JSON.stringify({ tenantId }),
  });
}

export async function getSyncStatus(tenantId: string): Promise<SyncStatus> {
  return fetchFromBackend<SyncStatus>(`/sync/status/${tenantId}`);
}

// Health check
export async function checkHealth() {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
  const response = await fetch(`${backendUrl}/health`);
  return response.json() as Promise<{ status: string }>;
}
