// API Configuration and Endpoints
// This file defines the structure for backend communication
// ChatGPT will implement these endpoints in C#/.NET

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://localhost:7001/api';

// API Endpoints Structure
export const API_ENDPOINTS = {
  // Products
  products: {
    getAll: () => `${API_BASE_URL}/products`,
    getById: (id: string) => `${API_BASE_URL}/products/${id}`,
    create: () => `${API_BASE_URL}/products`,
    update: (id: string) => `${API_BASE_URL}/products/${id}`,
    delete: (id: string) => `${API_BASE_URL}/products/${id}`,
    search: (query: string) => `${API_BASE_URL}/products/search?q=${query}`,
  },
  
  // Transactions
  transactions: {
    getAll: () => `${API_BASE_URL}/transactions`,
    getById: (id: string) => `${API_BASE_URL}/transactions/${id}`,
    create: () => `${API_BASE_URL}/transactions`,
    getByProduct: (productId: string) => `${API_BASE_URL}/transactions/product/${productId}`,
  },
  
  // Alerts
  alerts: {
    getAll: () => `${API_BASE_URL}/alerts`,
    getActive: () => `${API_BASE_URL}/alerts/active`,
    resolve: (id: string) => `${API_BASE_URL}/alerts/${id}/resolve`,
  },
  
  // Dashboard
  dashboard: {
    stats: () => `${API_BASE_URL}/dashboard/stats`,
    charts: () => `${API_BASE_URL}/dashboard/charts`,
  },
  
  // ML Predictions
  ml: {
    predictions: () => `${API_BASE_URL}/ml/predictions`,
    train: () => `${API_BASE_URL}/ml/train`,
    forecast: (productId: string) => `${API_BASE_URL}/ml/forecast/${productId}`,
  },
  
  // Reports
  reports: {
    generate: () => `${API_BASE_URL}/reports/generate`,
    download: (id: string) => `${API_BASE_URL}/reports/${id}/download`,
    list: () => `${API_BASE_URL}/reports`,
  },
};

// SignalR Hub URL for real-time updates
export const SIGNALR_HUB_URL = `${API_BASE_URL.replace('/api', '')}/inventoryHub`;

// API Helper Functions
export class ApiClient {
  private static async request<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<T> {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }

  static get<T>(url: string): Promise<T> {
    return this.request<T>(url, { method: 'GET' });
  }

  static post<T>(url: string, data: any): Promise<T> {
    return this.request<T>(url, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static put<T>(url: string, data: any): Promise<T> {
    return this.request<T>(url, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  static delete<T>(url: string): Promise<T> {
    return this.request<T>(url, { method: 'DELETE' });
  }
}
