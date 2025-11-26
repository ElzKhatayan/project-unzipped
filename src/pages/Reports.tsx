import { FileText, Download, Calendar, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function Reports() {
  const handleGenerateReport = (type: string, format: string) => {
    toast.info(`Generating ${type} report in ${format} format via C# backend`);
    // Will be connected to C# backend API for PDF/CSV generation
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <FileText className="h-8 w-8 text-primary" />
          Reports & Analytics
        </h1>
        <p className="text-muted-foreground mt-1">
          Generate comprehensive reports in CSV and PDF formats
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Inventory Report */}
        <Card className="shadow-medium hover:shadow-strong transition-all">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Inventory Status Report
            </CardTitle>
            <CardDescription>
              Complete overview of current inventory status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• Current stock levels for all products</p>
              <p>• Low stock and out-of-stock items</p>
              <p>• Total inventory value</p>
              <p>• Stock movement trends</p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => handleGenerateReport('inventory', 'PDF')}
                className="flex-1"
              >
                <Download className="h-4 w-4 mr-2" />
                PDF
              </Button>
              <Button
                onClick={() => handleGenerateReport('inventory', 'CSV')}
                variant="outline"
                className="flex-1"
              >
                <Download className="h-4 w-4 mr-2" />
                CSV
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Sales Report */}
        <Card className="shadow-medium hover:shadow-strong transition-all">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-success" />
              Sales Report
            </CardTitle>
            <CardDescription>
              Detailed sales transactions and revenue data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• All sales transactions</p>
              <p>• Revenue by product and category</p>
              <p>• Top-selling products</p>
              <p>• Sales trends and patterns</p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => handleGenerateReport('sales', 'PDF')}
                className="flex-1"
              >
                <Download className="h-4 w-4 mr-2" />
                PDF
              </Button>
              <Button
                onClick={() => handleGenerateReport('sales', 'CSV')}
                variant="outline"
                className="flex-1"
              >
                <Download className="h-4 w-4 mr-2" />
                CSV
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Purchase Report */}
        <Card className="shadow-medium hover:shadow-strong transition-all">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5 text-accent" />
              Purchase Report
            </CardTitle>
            <CardDescription>
              All purchase transactions and supplier data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• Purchase order history</p>
              <p>• Spending by supplier</p>
              <p>• Restocking patterns</p>
              <p>• Cost analysis</p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => handleGenerateReport('purchases', 'PDF')}
                className="flex-1"
              >
                <Download className="h-4 w-4 mr-2" />
                PDF
              </Button>
              <Button
                onClick={() => handleGenerateReport('purchases', 'CSV')}
                variant="outline"
                className="flex-1"
              >
                <Download className="h-4 w-4 mr-2" />
                CSV
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* ML Insights Report */}
        <Card className="shadow-medium hover:shadow-strong transition-all border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              ML Insights Report
            </CardTitle>
            <CardDescription>
              AI predictions and optimization recommendations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• Demand forecasts for all products</p>
              <p>• Reorder recommendations</p>
              <p>• Trend analysis and patterns</p>
              <p>• Model accuracy metrics</p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => handleGenerateReport('ml-insights', 'PDF')}
                className="flex-1"
              >
                <Download className="h-4 w-4 mr-2" />
                PDF
              </Button>
              <Button
                onClick={() => handleGenerateReport('ml-insights', 'CSV')}
                variant="outline"
                className="flex-1"
              >
                <Download className="h-4 w-4 mr-2" />
                CSV
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Generation Info */}
      <Card className="shadow-medium">
        <CardHeader>
          <CardTitle>Report Generation System</CardTitle>
          <CardDescription>
            Powered by C#/.NET backend for professional document creation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <Badge>PDF</Badge>
                Professional Reports
              </h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Formatted layouts with company branding</li>
                <li>• Charts and data visualizations</li>
                <li>• Multi-page comprehensive reports</li>
                <li>• Print-ready quality</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <Badge>CSV</Badge>
                Data Export
              </h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Raw data for further analysis</li>
                <li>• Excel/Google Sheets compatible</li>
                <li>• Custom data filtering options</li>
                <li>• Bulk data operations</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg bg-muted/50 p-4 text-sm">
            <p className="font-medium mb-2">Backend Implementation</p>
            <p className="text-muted-foreground">
              Report generation will be handled by C# backend using libraries like iTextSharp
              (PDF) and CsvHelper (CSV). All reports include real-time data from the database
              with proper formatting and professional presentation.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
