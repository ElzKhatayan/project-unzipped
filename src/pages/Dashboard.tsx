import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, AlertTriangle, TrendingUp, DollarSign, ShoppingCart, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { mockDashboardStats, mockProducts, mockTransactions } from '@/lib/mockData';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export default function Dashboard() {
  const stats = mockDashboardStats;
  const recentTransactions = mockTransactions.slice(0, 5);
  const lowStockProducts = mockProducts.filter(p => p.status === 'low-stock' || p.status === 'out-of-stock');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Real-time overview of your inventory management system
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-soft hover:shadow-medium transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">Active inventory items</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft hover:shadow-medium transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{stats.lowStockItems}</div>
            <p className="text-xs text-muted-foreground">Needs attention</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft hover:shadow-medium transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalValue.toLocaleString()}</div>
            <div className="flex items-center text-xs text-success mt-1">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              <span>+{stats.weeklyGrowth}% from last week</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft hover:shadow-medium transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Transactions</CardTitle>
            <ShoppingCart className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayTransactions}</div>
            <p className="text-xs text-muted-foreground">Sales & purchases</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Low Stock Alert */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Low Stock Alert
            </CardTitle>
            <CardDescription>Products requiring immediate attention</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {lowStockProducts.map((product) => (
              <div key={product.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                <div className="space-y-1 flex-1">
                  <p className="font-medium">{product.name}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant={product.status === 'out-of-stock' ? 'destructive' : 'default'}>
                      {product.quantity} units
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Min: {product.minThreshold}
                    </span>
                  </div>
                </div>
                <div className="w-24">
                  <Progress 
                    value={(product.quantity / product.minThreshold) * 100} 
                    className="h-2"
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Latest inventory movements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                <div className="space-y-1">
                  <p className="font-medium">{transaction.productName}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant={transaction.type === 'sale' ? 'default' : 'secondary'}>
                      {transaction.type}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {transaction.quantity} units
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">${transaction.total.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">{transaction.user}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Stock Distribution Chart Placeholder */}
      <Card className="shadow-medium">
        <CardHeader>
          <CardTitle>Stock Distribution by Category</CardTitle>
          <CardDescription>Visual overview of inventory categories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center bg-muted/20 rounded-lg border-2 border-dashed">
            <div className="text-center space-y-2">
              <Package className="h-12 w-12 mx-auto text-muted-foreground" />
              <p className="text-sm font-medium">Chart Component Ready</p>
              <p className="text-xs text-muted-foreground">
                Will be populated with real-time data from C# backend
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
