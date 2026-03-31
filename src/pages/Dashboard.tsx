import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, AlertTriangle, TrendingUp, DollarSign, ShoppingCart, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';
import { mockDashboardStats, mockProducts, mockTransactions, salesChartData, categoryDistribution, monthlyTrend, stockLevelData } from '@/lib/mockData';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend,
} from 'recharts';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.4, ease: 'easeOut' },
  }),
};

const COLORS = ['hsl(217, 91%, 60%)', 'hsl(270, 70%, 60%)', 'hsl(142, 76%, 45%)', 'hsl(38, 92%, 50%)'];

export default function Dashboard() {
  const stats = mockDashboardStats;
  const recentTransactions = mockTransactions.slice(0, 5);
  const lowStockProducts = mockProducts.filter(p => p.status === 'low-stock' || p.status === 'out-of-stock');

  const statCards = [
    { title: 'Total Products', value: stats.totalProducts, icon: Package, subtitle: 'Active inventory items', color: 'text-primary' },
    { title: 'Low Stock Items', value: stats.lowStockItems, icon: AlertTriangle, subtitle: 'Needs attention', color: 'text-warning', valueColor: 'text-warning' },
    { title: 'Total Value', value: `$${stats.totalValue.toLocaleString()}`, icon: DollarSign, subtitle: `+${stats.weeklyGrowth}% from last week`, color: 'text-success', trend: true },
    { title: "Today's Transactions", value: stats.todayTransactions, icon: ShoppingCart, subtitle: 'Sales & purchases', color: 'text-primary' },
  ];

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
        {statCards.map((stat, i) => (
          <motion.div key={stat.title} custom={i} variants={cardVariants} initial="hidden" animate="visible">
            <Card className="shadow-sm hover:shadow-md transition-all border-0 bg-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <div className={`h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${stat.valueColor || ''}`}>{stat.value}</div>
                {stat.trend ? (
                  <div className="flex items-center text-xs text-success mt-1">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    <span>{stat.subtitle}</span>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground mt-1">{stat.subtitle}</p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Sales vs Purchases Area Chart */}
        <motion.div className="lg:col-span-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Sales vs Purchases (This Week)
              </CardTitle>
              <CardDescription>Revenue comparison across the week</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={salesChartData}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorPurchases" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(270, 70%, 60%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(270, 70%, 60%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(215, 20%, 88%)" />
                  <XAxis dataKey="name" stroke="hsl(215, 15%, 45%)" fontSize={12} />
                  <YAxis stroke="hsl(215, 15%, 45%)" fontSize={12} />
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', border: '1px solid hsl(215, 20%, 88%)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                    formatter={(value: number) => [`$${value.toLocaleString()}`, undefined]}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="sales" stroke="hsl(217, 91%, 60%)" fillOpacity={1} fill="url(#colorSales)" strokeWidth={2} />
                  <Area type="monotone" dataKey="purchases" stroke="hsl(270, 70%, 60%)" fillOpacity={1} fill="url(#colorPurchases)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Category Pie Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Stock by Category</CardTitle>
              <CardDescription>Distribution of inventory items</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={categoryDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {categoryDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [`${value}%`, undefined]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {categoryDistribution.map((cat, i) => (
                  <div key={cat.name} className="flex items-center gap-2 text-xs">
                    <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                    <span className="text-muted-foreground">{cat.name}</span>
                    <span className="font-semibold ml-auto">{cat.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Stock Levels Bar Chart */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Stock Levels vs Thresholds</CardTitle>
            <CardDescription>Current stock compared to minimum required levels</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={stockLevelData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(215, 20%, 88%)" />
                <XAxis dataKey="name" stroke="hsl(215, 15%, 45%)" fontSize={11} />
                <YAxis stroke="hsl(215, 15%, 45%)" fontSize={12} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid hsl(215, 20%, 88%)' }} />
                <Legend />
                <Bar dataKey="current" fill="hsl(217, 91%, 60%)" radius={[4, 4, 0, 0]} name="Current Stock" />
                <Bar dataKey="threshold" fill="hsl(0, 84%, 60%)" radius={[4, 4, 0, 0]} name="Min Threshold" opacity={0.5} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Low Stock Alert */}
        <Card className="shadow-sm">
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
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-2xl">{product.image}</span>
                  <div className="space-y-1">
                    <p className="font-medium text-sm">{product.name}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant={product.status === 'out-of-stock' ? 'destructive' : 'default'} className="text-xs">
                        {product.quantity} units
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        Min: {product.minThreshold}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="w-20">
                  <Progress
                    value={Math.min((product.quantity / product.minThreshold) * 100, 100)}
                    className="h-2"
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Latest inventory movements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                    transaction.type === 'sale' ? 'bg-success/10' : transaction.type === 'purchase' ? 'bg-primary/10' : 'bg-warning/10'
                  }`}>
                    {transaction.type === 'sale' ? (
                      <ArrowUpRight className="h-4 w-4 text-success" />
                    ) : transaction.type === 'purchase' ? (
                      <ArrowDownRight className="h-4 w-4 text-primary" />
                    ) : (
                      <TrendingUp className="h-4 w-4 text-warning" />
                    )}
                  </div>
                  <div className="space-y-0.5">
                    <p className="font-medium text-sm">{transaction.productName}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant={transaction.type === 'sale' ? 'default' : 'secondary'} className="text-xs">
                        {transaction.type}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {transaction.quantity} units
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">${transaction.total.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">{transaction.user}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Monthly Revenue Trend */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-success" />
              Monthly Revenue Trend
            </CardTitle>
            <CardDescription>Revenue and order growth over the last 7 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={monthlyTrend}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(142, 76%, 45%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(142, 76%, 45%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(215, 20%, 88%)" />
                <XAxis dataKey="month" stroke="hsl(215, 15%, 45%)" fontSize={12} />
                <YAxis stroke="hsl(215, 15%, 45%)" fontSize={12} />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: '1px solid hsl(215, 20%, 88%)' }}
                  formatter={(value: number, name: string) => [
                    name === 'revenue' ? `$${value.toLocaleString()}` : value,
                    name === 'revenue' ? 'Revenue' : 'Orders'
                  ]}
                />
                <Legend />
                <Area type="monotone" dataKey="revenue" stroke="hsl(142, 76%, 45%)" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2} name="Revenue" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
