import { useState } from 'react';
import { FileText, Download, Calendar, TrendingUp, Brain, Package, Clock, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { mockProducts, mockTransactions } from '@/lib/mockData';
import { Report } from '@/types';
import { motion } from 'framer-motion';

export default function Reports() {
  const [generatedReports, setGeneratedReports] = useState<Report[]>([]);

  const generateCSV = (type: string) => {
    let csv = '';
    let filename = '';

    switch (type) {
      case 'inventory':
        csv = 'SKU,Name,Category,Quantity,Min Threshold,Price,Supplier,Status\n';
        csv += mockProducts.map(p =>
          `${p.sku},${p.name},${p.category},${p.quantity},${p.minThreshold},${p.price},${p.supplier},${p.status}`
        ).join('\n');
        filename = 'inventory_report.csv';
        break;
      case 'sales':
        csv = 'Date,Product,Type,Quantity,Price,Total,User,Notes\n';
        csv += mockTransactions.filter(t => t.type === 'sale').map(t =>
          `${new Date(t.date).toLocaleDateString()},${t.productName},${t.type},${t.quantity},${t.price},${t.total},${t.user},${t.notes || ''}`
        ).join('\n');
        filename = 'sales_report.csv';
        break;
      case 'purchases':
        csv = 'Date,Product,Type,Quantity,Price,Total,User,Notes\n';
        csv += mockTransactions.filter(t => t.type === 'purchase').map(t =>
          `${new Date(t.date).toLocaleDateString()},${t.productName},${t.type},${t.quantity},${t.price},${t.total},${t.user},${t.notes || ''}`
        ).join('\n');
        filename = 'purchases_report.csv';
        break;
      default:
        csv = 'Product,Predicted Demand,Current Stock,Recommended Reorder\n';
        filename = 'ml_insights_report.csv';
    }

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);

    const report: Report = {
      id: String(Date.now()),
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} Report`,
      type: type as Report['type'],
      generatedAt: new Date().toISOString(),
      format: 'csv',
      status: 'ready',
    };
    setGeneratedReports(prev => [report, ...prev]);
    toast.success(`${type} CSV report generated and downloaded!`);
  };

  const handlePDF = (type: string) => {
    const report: Report = {
      id: String(Date.now()),
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} Report`,
      type: type as Report['type'],
      generatedAt: new Date().toISOString(),
      format: 'pdf',
      status: 'generating',
    };
    setGeneratedReports(prev => [report, ...prev]);
    toast.info('PDF generation will be handled by C# backend using iTextSharp');

    setTimeout(() => {
      setGeneratedReports(prev => prev.map(r => r.id === report.id ? { ...r, status: 'ready' } : r));
      toast.success('PDF report ready (mock)');
    }, 2000);
  };

  const reportTypes = [
    { type: 'inventory', title: 'Inventory Status Report', desc: 'Current stock levels and status', icon: Package, color: 'text-primary', items: ['Current stock levels', 'Low/out-of-stock items', 'Total inventory value', 'Stock movement trends'] },
    { type: 'sales', title: 'Sales Report', desc: 'Revenue and sales analytics', icon: TrendingUp, color: 'text-success', items: ['All sales transactions', 'Revenue by product', 'Top-selling products', 'Sales trends'] },
    { type: 'purchases', title: 'Purchase Report', desc: 'Supplier orders and spending', icon: Calendar, color: 'text-accent', items: ['Purchase order history', 'Spending by supplier', 'Restocking patterns', 'Cost analysis'] },
    { type: 'ml-insights', title: 'ML Insights Report', desc: 'AI predictions and recommendations', icon: Brain, color: 'text-primary', items: ['Demand forecasts', 'Reorder recommendations', 'Trend analysis', 'Model accuracy metrics'] },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <FileText className="h-8 w-8 text-primary" />
          Reports & Analytics
        </h1>
        <p className="text-muted-foreground mt-1">Generate comprehensive reports in CSV and PDF formats</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {reportTypes.map((report, i) => (
          <motion.div key={report.type} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className="shadow-sm hover:shadow-md transition-all h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <report.icon className={`h-5 w-5 ${report.color}`} />
                  {report.title}
                </CardTitle>
                <CardDescription>{report.desc}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  {report.items.map(item => (
                    <li key={item} className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="flex gap-2">
                  <Button onClick={() => handlePDF(report.type)} className="flex-1" size="sm">
                    <Download className="h-4 w-4 mr-2" /> PDF
                  </Button>
                  <Button onClick={() => generateCSV(report.type)} variant="outline" className="flex-1" size="sm">
                    <Download className="h-4 w-4 mr-2" /> CSV
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Generated Reports History */}
      {generatedReports.length > 0 && (
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Recently Generated Reports</CardTitle>
            <CardDescription>Your report generation history</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {generatedReports.map((report) => (
              <div key={report.id} className="flex items-center justify-between border rounded-lg p-3">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium text-sm">{report.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge variant="outline" className="text-xs">{report.format.toUpperCase()}</Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(report.generatedAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
                <Badge
                  variant={report.status === 'ready' ? 'default' : 'secondary'}
                  className={report.status === 'ready' ? 'bg-success/10 text-success border-success/20' : ''}
                >
                  {report.status === 'ready' ? (
                    <><CheckCircle className="h-3 w-3 mr-1" /> Ready</>
                  ) : (
                    <><Clock className="h-3 w-3 mr-1 animate-spin" /> Generating...</>
                  )}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
