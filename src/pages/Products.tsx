import { useState } from 'react';
import { Plus, Search, Filter, Download, Edit, Trash2, Package, Eye, X, Grid3X3, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { mockProducts } from '@/lib/mockData';
import { Product } from '@/types';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Progress } from '@/components/ui/progress';

export default function Products() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [viewProduct, setViewProduct] = useState<Product | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Form state
  const [formData, setFormData] = useState({
    sku: '', name: '', category: '', quantity: '', minThreshold: '', price: '', supplier: '',
  });

  const categories = [...new Set(mockProducts.map(p => p.category))];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusBadge = (status: Product['status']) => {
    const config = {
      'in-stock': { variant: 'default' as const, className: 'bg-success/10 text-success border-success/20' },
      'low-stock': { variant: 'default' as const, className: 'bg-warning/10 text-warning border-warning/20' },
      'out-of-stock': { variant: 'destructive' as const, className: '' },
    };
    const c = config[status];
    return <Badge variant={c.variant} className={c.className}>{status.replace('-', ' ')}</Badge>;
  };

  const handleDelete = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    toast.success('Product deleted successfully');
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      sku: product.sku,
      name: product.name,
      category: product.category,
      quantity: String(product.quantity),
      minThreshold: String(product.minThreshold),
      price: String(product.price),
      supplier: product.supplier,
    });
  };

  const handleSaveEdit = () => {
    if (!editingProduct) return;
    const qty = parseInt(formData.quantity);
    const threshold = parseInt(formData.minThreshold);
    const status: Product['status'] = qty === 0 ? 'out-of-stock' : qty < threshold ? 'low-stock' : 'in-stock';

    setProducts(prev => prev.map(p =>
      p.id === editingProduct.id ? {
        ...p,
        ...formData,
        quantity: qty,
        minThreshold: threshold,
        price: parseFloat(formData.price),
        status,
      } : p
    ));
    setEditingProduct(null);
    toast.success('Product updated successfully');
  };

  const handleAddProduct = () => {
    if (!formData.name || !formData.sku) {
      toast.error('Please fill in required fields');
      return;
    }
    const qty = parseInt(formData.quantity) || 0;
    const threshold = parseInt(formData.minThreshold) || 10;
    const status: Product['status'] = qty === 0 ? 'out-of-stock' : qty < threshold ? 'low-stock' : 'in-stock';
    const newProduct: Product = {
      id: String(Date.now()),
      sku: formData.sku,
      name: formData.name,
      category: formData.category || 'Uncategorized',
      quantity: qty,
      minThreshold: threshold,
      price: parseFloat(formData.price) || 0,
      supplier: formData.supplier || 'Unknown',
      lastRestocked: new Date().toISOString().split('T')[0],
      status,
      image: '📦',
    };
    setProducts(prev => [newProduct, ...prev]);
    setIsAddDialogOpen(false);
    setFormData({ sku: '', name: '', category: '', quantity: '', minThreshold: '', price: '', supplier: '' });
    toast.success('Product added successfully!');
  };

  const handleExportCSV = () => {
    const headers = ['SKU,Name,Category,Quantity,Min Threshold,Price,Supplier,Status'];
    const rows = filteredProducts.map(p =>
      `${p.sku},${p.name},${p.category},${p.quantity},${p.minThreshold},${p.price},${p.supplier},${p.status}`
    );
    const csv = [...headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'products_export.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Products exported as CSV');
  };

  const ProductForm = () => (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="sku">SKU *</Label>
          <Input id="sku" value={formData.sku} onChange={e => setFormData(f => ({ ...f, sku: e.target.value }))} placeholder="PRD-001" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Input id="category" value={formData.category} onChange={e => setFormData(f => ({ ...f, category: e.target.value }))} placeholder="Electronics" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="name">Product Name *</Label>
        <Input id="name" value={formData.name} onChange={e => setFormData(f => ({ ...f, name: e.target.value }))} placeholder="Product name" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity</Label>
          <Input id="quantity" type="number" value={formData.quantity} onChange={e => setFormData(f => ({ ...f, quantity: e.target.value }))} placeholder="0" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="threshold">Min Threshold</Label>
          <Input id="threshold" type="number" value={formData.minThreshold} onChange={e => setFormData(f => ({ ...f, minThreshold: e.target.value }))} placeholder="10" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price ($)</Label>
          <Input id="price" type="number" step="0.01" value={formData.price} onChange={e => setFormData(f => ({ ...f, price: e.target.value }))} placeholder="0.00" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="supplier">Supplier</Label>
          <Input id="supplier" value={formData.supplier} onChange={e => setFormData(f => ({ ...f, supplier: e.target.value }))} placeholder="Supplier name" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground mt-1">Manage your inventory with full CRUD operations</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportCSV}>
            <Download className="mr-2 h-4 w-4" /> Export CSV
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
                <DialogDescription>Create a new product in your inventory system</DialogDescription>
              </DialogHeader>
              <ProductForm />
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleAddProduct}>Create Product</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm">
          <CardContent className="pt-4 pb-3">
            <div className="text-2xl font-bold">{products.length}</div>
            <p className="text-xs text-muted-foreground">Total Products</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="pt-4 pb-3">
            <div className="text-2xl font-bold text-success">{products.filter(p => p.status === 'in-stock').length}</div>
            <p className="text-xs text-muted-foreground">In Stock</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="pt-4 pb-3">
            <div className="text-2xl font-bold text-warning">{products.filter(p => p.status === 'low-stock').length}</div>
            <p className="text-xs text-muted-foreground">Low Stock</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="pt-4 pb-3">
            <div className="text-2xl font-bold text-destructive">{products.filter(p => p.status === 'out-of-stock').length}</div>
            <p className="text-xs text-muted-foreground">Out of Stock</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Product Inventory</CardTitle>
              <CardDescription>{filteredProducts.length} of {products.length} products</CardDescription>
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-8 w-48" />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-36"><SelectValue placeholder="Category" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="in-stock">In Stock</SelectItem>
                  <SelectItem value="low-stock">Low Stock</SelectItem>
                  <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex border rounded-md">
                <Button variant={viewMode === 'table' ? 'default' : 'ghost'} size="icon" className="h-9 w-9 rounded-r-none" onClick={() => setViewMode('table')}>
                  <List className="h-4 w-4" />
                </Button>
                <Button variant={viewMode === 'grid' ? 'default' : 'ghost'} size="icon" className="h-9 w-9 rounded-l-none" onClick={() => setViewMode('grid')}>
                  <Grid3X3 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === 'table' ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10"></TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {filteredProducts.map((product) => (
                      <motion.tr
                        key={product.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="border-b transition-colors hover:bg-muted/50"
                      >
                        <TableCell className="text-xl">{product.image}</TableCell>
                        <TableCell className="font-mono text-xs">{product.sku}</TableCell>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell><Badge variant="outline">{product.category}</Badge></TableCell>
                        <TableCell className="text-right">
                          <div className="flex flex-col items-end">
                            <span className="font-bold">{product.quantity}</span>
                            <span className="text-[10px] text-muted-foreground">min: {product.minThreshold}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-mono">${product.price.toFixed(2)}</TableCell>
                        <TableCell>{getStatusBadge(product.status)}</TableCell>
                        <TableCell className="text-xs">{product.supplier}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setViewProduct(product)}>
                              <Eye className="h-3.5 w-3.5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(product)}>
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(product.id)}>
                              <Trash2 className="h-3.5 w-3.5 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence>
                {filteredProducts.map((product) => (
                  <motion.div key={product.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
                    <Card className="hover:shadow-md transition-all cursor-pointer" onClick={() => setViewProduct(product)}>
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between mb-3">
                          <span className="text-3xl">{product.image}</span>
                          {getStatusBadge(product.status)}
                        </div>
                        <h3 className="font-semibold text-sm">{product.name}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">{product.sku} • {product.category}</p>
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
                          <span className="text-sm font-medium">{product.quantity} units</span>
                        </div>
                        <Progress value={Math.min((product.quantity / Math.max(product.minThreshold, 1)) * 100, 100)} className="h-1.5 mt-2" />
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Product Dialog */}
      <Dialog open={!!viewProduct} onOpenChange={() => setViewProduct(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="text-2xl">{viewProduct?.image}</span>
              {viewProduct?.name}
            </DialogTitle>
          </DialogHeader>
          {viewProduct && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-muted-foreground">SKU:</span> <span className="font-mono font-bold ml-2">{viewProduct.sku}</span></div>
                <div><span className="text-muted-foreground">Category:</span> <span className="font-medium ml-2">{viewProduct.category}</span></div>
                <div><span className="text-muted-foreground">Quantity:</span> <span className="font-bold ml-2">{viewProduct.quantity}</span></div>
                <div><span className="text-muted-foreground">Min Threshold:</span> <span className="font-medium ml-2">{viewProduct.minThreshold}</span></div>
                <div><span className="text-muted-foreground">Price:</span> <span className="font-bold ml-2">${viewProduct.price.toFixed(2)}</span></div>
                <div><span className="text-muted-foreground">Supplier:</span> <span className="font-medium ml-2">{viewProduct.supplier}</span></div>
                <div><span className="text-muted-foreground">Status:</span> <span className="ml-2">{getStatusBadge(viewProduct.status)}</span></div>
                <div><span className="text-muted-foreground">Last Restocked:</span> <span className="font-medium ml-2">{viewProduct.lastRestocked}</span></div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Stock Level</p>
                <Progress value={Math.min((viewProduct.quantity / Math.max(viewProduct.minThreshold, 1)) * 100, 100)} className="h-3" />
                <p className="text-xs text-muted-foreground mt-1">{viewProduct.quantity} / {viewProduct.minThreshold} minimum</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>Update product details</DialogDescription>
          </DialogHeader>
          <ProductForm />
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingProduct(null)}>Cancel</Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
