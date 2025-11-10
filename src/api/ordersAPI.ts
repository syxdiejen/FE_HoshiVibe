import { api } from './axios';

export type OrderDetail = {
  orderDetail_Id?: string;
  order_Id?: string;
  product_Id?: string;
  quantity?: number;
  price?: number;
  totalPrice?: number;
  productName?: string;
  productImageUrl?: string;
};

export type Order = {
  order_Id: string;
  user_Id: string;
  voucher_Id: string | null;
  totalPrice: number;
  discountAmount: number;
  finalPrice: number;
  shippingAddress: string;
  phoneNumber: number | string;
  orderDate: string;
  status: string;
  orderDetails: OrderDetail[];
};

function getToken(): string {
  const t1 = localStorage.getItem('hv_token');
  if (t1) return t1;
  try {
    const user = JSON.parse(localStorage.getItem('hv_user') || 'null');
    return user?.acessToken || user?.Token || '';
  } catch {
    return '';
  }
}

/**
 * Get all orders
 * GET /api/Order/all
 */
export async function getAllOrders(): Promise<Order[]> {
  const token = getToken();
  const res = await api.get<Order[]>('/Order/all', {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return res.data;
}

/**
 * Get order by ID
 * GET /api/Order/{orderId}
 */
export async function getOrderById(orderId: string): Promise<Order> {
  const token = getToken();
  const res = await api.get<Order>(`/Order/${orderId}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return res.data;
}

