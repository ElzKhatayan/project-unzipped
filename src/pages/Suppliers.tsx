import { useState } from 'react';
import { Truck, Search, Plus, Star, Mail, Phone, MapPin, Edit, Trash2, Eye } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { mockSuppliers } from '@/lib/mockData';
import { Supplier } from '@/types';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [viewSupplier, setViewSupplier] = useState<Supplier | null>(null);
  const [formData, setFormData] = useState({
    name: '', contactPerson: '', email: '', phone: '', address: '',
  });

  const filteredSuppliers = suppliers.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.contactPerson.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = () => {
    if (!formData.name) { toast.error('Name is required'); return; }
    const newSupplier: Supplier = {
      id: String(Date.now()),
      ...formData,
      productsSupplied: 0,
      totalOrders: 0,
      rating: 0,
      status: 'active',
    };
    setSuppliers(prev => [newSupplier, ...prev]);
    setIsAddOpen(false);
    setFormData({ name: '', contactPerson: '', email: '', phone: '', address: '' });
    toast.success('Supplier added!');
  };

  const handleDelete = (id: string) => {
    setSuppliers(prev => prev.filter(s => s.id !== id));
    toast.success('Supplier removed');
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-3.5 w-3.5 ${i < Math.round(rating) ? 'text-warning fill-warning' : 'text-muted'}`} />
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Truck className="h-8 w-8 text-primary" />
            Supplier Management
          </h1>
          <p className="text-muted-foreground mt-1">Manage your suppliers and their information</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> Add Supplier</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Supplier</DialogTitle>
              <DialogDescription>Register a new supplier in the system</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Company Name *</Label>
                <Input value={formData.name} onChange={e => setFormData(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Contact Person</Label>
                <Input value={formData.contactPerson} onChange={e => setFormData(f => ({ ...f, contactPerson: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" value={formData.email} onChange={e => setFormData(f => ({ ...f, email: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input value={formData.phone} onChange={e => setFormData(f => ({ ...f, phone: e.target.value }))} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <Input value={formData.address} onChange={e => setFormData(f => ({ ...f, address: e.target.value }))} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
              <Button onClick={handleAdd}>Add Supplier</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm">
          <CardContent className="pt-4 pb-3">
            <div className="text-2xl font-bold">{suppliers.length}</div>
            <p className="text-xs text-muted-foreground">Total Suppliers</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="pt-4 pb-3">
            <div className="text-2xl font-bold text-success">{suppliers.filter(s => s.status === 'active').length}</div>
            <p className="text-xs text-muted-foreground">Active</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="pt-4 pb-3">
            <div className="text-2xl font-bold">{suppliers.reduce((s, sup) => s + sup.totalOrders, 0)}</div>
            <p className="text-xs text-muted-foreground">Total Orders</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="pt-4 pb-3">
            <div className="text-2xl font-bold text-warning">{(suppliers.reduce((s, sup) => s + sup.rating, 0) / suppliers.length).toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">Avg Rating</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search suppliers..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-9" />
      </div>

      {/* Supplier Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {filteredSuppliers.map((supplier, i) => (
            <motion.div key={supplier.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="shadow-sm hover:shadow-md transition-all h-full">
                <CardContent className="pt-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{supplier.name}</h3>
                      <p className="text-sm text-muted-foreground">{supplier.contactPerson}</p>
                    </div>
                    <Badge variant={supplier.status === 'active' ? 'default' : 'secondary'}
                      className={supplier.status === 'active' ? 'bg-success/10 text-success border-success/20' : ''}>
                      {supplier.status}
                    </Badge>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-3.5 w-3.5" />
                      <span className="truncate">{supplier.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-3.5 w-3.5" />
                      <span>{supplier.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" />
                      <span>{supplier.address}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 mt-3">
                    {renderStars(supplier.rating)}
                    <span className="text-sm font-medium ml-1">{supplier.rating}</span>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t text-xs text-muted-foreground">
                    <span>{supplier.productsSupplied} products</span>
                    <span>{supplier.totalOrders} orders</span>
                  </div>

                  <div className="flex gap-1 mt-3">
                    <Button variant="ghost" size="sm" className="flex-1" onClick={() => setViewSupplier(supplier)}>
                      <Eye className="h-3.5 w-3.5 mr-1" /> View
                    </Button>
                    <Button variant="ghost" size="sm" className="flex-1" onClick={() => handleDelete(supplier.id)}>
                      <Trash2 className="h-3.5 w-3.5 mr-1 text-destructive" /> Remove
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* View Dialog */}
      <Dialog open={!!viewSupplier} onOpenChange={() => setViewSupplier(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{viewSupplier?.name}</DialogTitle>
            <DialogDescription>Supplier details</DialogDescription>
          </DialogHeader>
          {viewSupplier && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">Contact:</span> <span className="font-medium ml-1">{viewSupplier.contactPerson}</span></div>
                <div><span className="text-muted-foreground">Status:</span> <Badge variant="outline" className="ml-1">{viewSupplier.status}</Badge></div>
                <div><span className="text-muted-foreground">Email:</span> <span className="font-medium ml-1">{viewSupplier.email}</span></div>
                <div><span className="text-muted-foreground">Phone:</span> <span className="font-medium ml-1">{viewSupplier.phone}</span></div>
                <div className="col-span-2"><span className="text-muted-foreground">Address:</span> <span className="font-medium ml-1">{viewSupplier.address}</span></div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-lg bg-secondary/50 p-3 text-center">
                  <div className="text-xl font-bold">{viewSupplier.productsSupplied}</div>
                  <p className="text-xs text-muted-foreground">Products</p>
                </div>
                <div className="rounded-lg bg-secondary/50 p-3 text-center">
                  <div className="text-xl font-bold">{viewSupplier.totalOrders}</div>
                  <p className="text-xs text-muted-foreground">Orders</p>
                </div>
                <div className="rounded-lg bg-secondary/50 p-3 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Star className="h-4 w-4 text-warning fill-warning" />
                    <span className="text-xl font-bold">{viewSupplier.rating}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Rating</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
