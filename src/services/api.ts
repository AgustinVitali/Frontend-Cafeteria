import { API_BASE_URL } from '../config/auth0';
import { MenuItem, Order, OrderItem } from '../types';

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  // Métodos públicos (sin autenticación)
  async getPublicMenu(): Promise<MenuItem[]> {
    const response = await fetch(`${this.baseUrl}/public/menu`);
    if (!response.ok) {
      throw new Error('Error al obtener el menú');
    }
    return response.json();
  }

  // Métodos privados (con autenticación)
  private async makeAuthenticatedRequest(
    endpoint: string,
    options: RequestInit = {},
    token: string
  ) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error en la petición: ${response.status}`);
    }

    return response.json();
  }

  // Métodos para clientes
  async createOrder(orderItems: OrderItem[], token: string): Promise<Order> {
    return this.makeAuthenticatedRequest(
      '/private/orders',
      {
        method: 'POST',
        body: JSON.stringify({ items: orderItems }),
      },
      token
    );
  }

  async getMyOrders(token: string): Promise<Order[]> {
    return this.makeAuthenticatedRequest('/private/orders/my', {}, token);
  }

  // Métodos para baristas
  async getAllOrders(token: string): Promise<Order[]> {
    return this.makeAuthenticatedRequest('/private/orders', {}, token);
  }

  async updateOrderStatus(orderId: string, status: string, token: string): Promise<Order> {
    return this.makeAuthenticatedRequest(
      `/private/orders/${orderId}/status`,
      {
        method: 'PUT',
        body: JSON.stringify({ status }),
      },
      token
    );
  }

  // Métodos para administradores
  async addMenuItem(menuItem: Omit<MenuItem, 'id'>, token: string): Promise<MenuItem> {
    return this.makeAuthenticatedRequest(
      '/private/menu',
      {
        method: 'POST',
        body: JSON.stringify(menuItem),
      },
      token
    );
  }

  async updateMenuItem(id: string, menuItem: Partial<MenuItem>, token: string): Promise<MenuItem> {
    return this.makeAuthenticatedRequest(
      `/private/menu/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(menuItem),
      },
      token
    );
  }

  async deleteMenuItem(id: string, token: string): Promise<void> {
    return this.makeAuthenticatedRequest(
      `/private/menu/${id}`,
      { method: 'DELETE' },
      token
    );
  }

  async getFullMenu(token: string): Promise<MenuItem[]> {
    return this.makeAuthenticatedRequest('/private/menu', {}, token);
  }
}

export const apiService = new ApiService(); 