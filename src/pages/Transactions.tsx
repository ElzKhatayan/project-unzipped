import { useState } from 'react';
import { ArrowUpRight, ArrowDownRight, Filter, Download, Plus, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { mockTransactions, mockProducts } from '@/lib/mockData';
import { Transaction } from '@/types';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [formData, setFormData] = useState({
    productId: '', type: 'sale' as Transaction['type'], quantity: '', price: '', notes: '',
  });

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.user.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || t.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const totalSales = transactions.filter(t => t.type === 'sale').reduce((s, t) => s + t.total, 0);
  const totalPurchases = transactions.filter(t => t.type === 'purchase').reduce((s, t) => s + t.total, 0);

  const handleAddTransaction = () => {
    const product = mockProducts.find(p => p.id === formData.productId);
    if (!product || !formData.quantity) {
      toast.error('Please fill in all required fields');
      return;
    }
    const qty = parseInt(formData.quantity);
    const price = parseFloat(formData.price) || product.price;
    const newTx: Transaction = {
      id: String(Date.now()),
      productId: product.id,
      productName: product.name,
      type: formData.type,
      quantity: qty,
      price,
      total: qty * price,
      date: new Date().toISOString(),
      user: 'Current User',
      notes: formData.notes || undefined,
    };
    setTransactions(prev => [newTx, ...prev]);
    setIsAddOpen(false);
    setFormData({ productId: '', type: 'sale', quantity: '', price: '', notes: '' });
    toast.success(`${formData.type} recorded successfully!`);
  };

  const handleExportCSV = () => {
    const headers = ['Date,Type,Product,Quantity,Price,Total,User,Notes'];
    const rows = filteredTransactions.map(t =>
      `${new Date(t.date).toLocaleString()},${t.type},${t.productName},${t.quantity},${t.price},${t.total},${t.user},${t.notes || ''}`
    );
    const csv = [...headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transactions_export.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Transactions exported as CSV');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground mt-1">Complete history of all inventory movements</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportCSV}>
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="mr-2 h-4 w-4" /> New Transaction</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Record Transaction</DialogTitle>
                <DialogDescription>Add a new sale, purchase, or adjustment</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Product *</Label>
                  <Select value={formData.productId} onValueChange={v => setFormData(f => ({ ...f, productId: v }))}>
                    <SelectTrigger><SelectValue placeholder="Select product" /></SelectTrigger>
                    <SelectContent>
                      {mockProducts.map(p => (
                        <SelectItem key={p.id} value={p.id}>{p.image} {p.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Type *</Label>
                    <Select value={formData.type} onValueChange={v => setFormData(f => ({ ...f, type: v as Transaction['type'] }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sale">Sale</SelectItem>
                        <SelectItem value="purchase">Purchase</SelectItem>
                        <SelectItem value="adjustment">Adjustment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Quantity *</Label>
                    <Input type="number" value={formData.quantity} onChange={e => setFormData(f => ({ ...f, quantity: e.target.value }))} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Price per Unit ($)</Label>
                  <Input type="number" step="0.01" value={formData.price} onChange={e => setFormData(f => ({ ...f, price: e.target.value }))} placeholder="Auto from product" />
                </div>
                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Textarea value={formData.notes} onChange={e => setFormData(f => ({ ...f, notes: e.target.value }))} placeholder="Optional notes..." />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                <Button onClick={handleAddTransaction}>Record Transaction</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm">
          <CardContent className="pt-4 pb-3">
            <div className="text-2xl font-bold">{transactions.length}</div>
            <p className="text-xs text-muted-foreground">Total Transactions</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="pt-4 pb-3">
            <div className="text-2xl font-bold text-success">${totalSales.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total Sales</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="pt-4 pb-3">
            <div className="text-2xl font-bold text-primary">${totalPurchases.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total Purchases</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="pt-4 pb-3">
            <div className={`text-2xl font-bold ${totalSales - totalPurchases >= 0 ? 'text-success' : 'text-destructive'}`}>
              ${Math.abs(totalSales - totalPurchases).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Net {totalSales >= totalPurchases ? 'Profit' : 'Loss'}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>{filteredTransactions.length} transactions</CardDescription>
            </div>
            <div className="flex gap-2">
              <Input placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-48" />
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="sale">Sales</SelectItem>
                  <SelectItem value="purchase">Purchases</SelectItem>
                  <SelectItem value="adjustment">Adjustments</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((tx) => (
                  <motion.tr
                    key={tx.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b hover:bg-muted/50"
                  >
                    <TableCell className="font-mono text-xs">
                      {new Date(tx.date).toLocaleDateString()}
                      <br />
                      <span className="text-muted-foreground">{new Date(tx.date).toLocaleTimeString()}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={tx.type === 'sale' ? 'default' : tx.type === 'purchase' ? 'secondary' : 'outline'}
                        className={`flex items-center gap-1 w-fit ${tx.type === 'sale' ? 'bg-success/10 text-success border-success/20' : ''}`}>
                        {tx.type === 'sale' ? <ArrowUpRight className="h-3 w-3" /> : tx.type === 'purchase' ? <ArrowDownRight className="h-3 w-3" /> : <RefreshCw className="h-3 w-3" />}
                        {tx.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{tx.productName}</TableCell>
                    <TableCell className="text-right font-bold">{tx.quantity}</TableCell>
                    <TableCell className="text-right font-mono">${tx.price.toFixed(2)}</TableCell>
                    <TableCell className={`text-right font-bold font-mono ${tx.type === 'sale' ? 'text-success' : ''}`}>
                      {tx.total > 0 ? `$${tx.total.toFixed(2)}` : '-'}
                    </TableCell>
                    <TableCell className="text-sm">{tx.user}</TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-32 truncate">{tx.notes || '-'}</TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
