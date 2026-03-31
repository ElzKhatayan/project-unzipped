export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  quantity: number;
  minThreshold: number;
  price: number;
  supplier: string;
  lastRestocked: string;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
  image?: string;
}

export interface Transaction {
  id: string;
  productId: string;
  productName: string;
  type: 'purchase' | 'sale' | 'adjustment';
  quantity: number;
  price: number;
  total: number;
  date: string;
  user: string;
  notes?: string;
}

export interface Alert {
  id: string;
  productId: string;
  productName: string;
  type: 'low-stock' | 'out-of-stock' | 'reorder';
  message: string;
  currentQuantity: number;
  threshold: number;
  severity: 'high' | 'medium' | 'low';
  createdAt: string;
  resolved: boolean;
}

export interface DashboardStats {
  totalProducts: number;
  lowStockItems: number;
  outOfStockItems: number;
  totalValue: number;
  todayTransactions: number;
  weeklyGrowth: number;
}

export interface MLPrediction {
  productId: string;
  productName: string;
  predictedDemand: number;
  currentStock: number;
  recommendedReorder: number;
  confidence: number;
  trend: 'increasing' | 'stable' | 'decreasing';
}

export interface Report {
  id: string;
  name: string;
  type: 'inventory' | 'sales' | 'purchases' | 'ml-insights';
  generatedAt: string;
  format: 'csv' | 'pdf';
  status: 'generating' | 'ready' | 'failed';
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  productsSupplied: number;
  totalOrders: number;
  rating: number;
  status: 'active' | 'inactive';
}

export interface AuditLog {
  id: string;
  action: string;
  entity: string;
  entityId: string;
  entityName: string;
  user: string;
  timestamp: string;
  details: string;
}
