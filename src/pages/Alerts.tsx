import { useState } from 'react';
import { AlertTriangle, CheckCircle, XCircle, Clock, Bell, BellOff, Filter } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockAlerts } from '@/lib/mockData';
import { Alert } from '@/types';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';

export default function Alerts() {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [filter, setFilter] = useState('active');

  const displayedAlerts = alerts.filter(a => {
    if (filter === 'active') return !a.resolved;
    if (filter === 'resolved') return a.resolved;
    return true;
  });

  const activeAlerts = alerts.filter(a => !a.resolved);
  const highPriority = activeAlerts.filter(a => a.severity === 'high');

  const handleResolve = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, resolved: true } : a));
    toast.success('Alert resolved successfully!');
  };

  const handleResolveAll = () => {
    setAlerts(prev => prev.map(a => ({ ...a, resolved: true })));
    toast.success('All alerts resolved!');
  };

  const getSeverityConfig = (severity: string) => {
    switch (severity) {
      case 'high': return { variant: 'destructive' as const, className: '', color: 'text-destructive' };
      case 'medium': return { variant: 'default' as const, className: 'bg-warning/10 text-warning border-warning/20', color: 'text-warning' };
      default: return { variant: 'secondary' as const, className: '', color: 'text-muted-foreground' };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Bell className="h-8 w-8 text-warning" />
            Alerts & Notifications
          </h1>
          <p className="text-muted-foreground mt-1">Automatic alerts when stock levels fall below threshold</p>
        </div>
        {activeAlerts.length > 0 && (
          <Button variant="outline" onClick={handleResolveAll}>
            <BellOff className="mr-2 h-4 w-4" /> Resolve All
          </Button>
        )}
      </div>

      {/* Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-sm border-destructive/20">
          <CardContent className="pt-4 pb-3 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <div className="text-2xl font-bold text-destructive">{activeAlerts.length}</div>
              <p className="text-xs text-muted-foreground">Active Alerts</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-warning/20">
          <CardContent className="pt-4 pb-3 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-warning/10 flex items-center justify-center">
              <XCircle className="h-6 w-6 text-warning" />
            </div>
            <div>
              <div className="text-2xl font-bold text-warning">{highPriority.length}</div>
              <p className="text-xs text-muted-foreground">High Priority</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-success/20">
          <CardContent className="pt-4 pb-3 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-success/10 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-success" />
            </div>
            <div>
              <div className="text-2xl font-bold text-success">{alerts.filter(a => a.resolved).length}</div>
              <p className="text-xs text-muted-foreground">Resolved</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alert List */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Alert Feed</CardTitle>
              <CardDescription>Real-time notifications from the system</CardDescription>
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="all">All</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <AnimatePresence>
            {displayedAlerts.map((alert) => {
              const config = getSeverityConfig(alert.severity);
              const stockPercent = alert.threshold > 0 ? (alert.currentQuantity / alert.threshold) * 100 : 0;
              return (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className={`flex items-start gap-4 rounded-xl border p-4 transition-colors ${alert.resolved ? 'opacity-60 bg-muted/30' : 'hover:bg-muted/50'}`}
                >
                  <div className="mt-1">
                    {alert.type === 'out-of-stock' ? (
                      <XCircle className="h-6 w-6 text-destructive" />
                    ) : (
                      <AlertTriangle className="h-6 w-6 text-warning" />
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{alert.productName}</h3>
                        <p className="text-sm text-muted-foreground mt-0.5">{alert.message}</p>
                      </div>
                      <Badge variant={config.variant} className={config.className}>{alert.severity}</Badge>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Stock: <strong className="text-destructive">{alert.currentQuantity}</strong></span>
                          <span>Threshold: {alert.threshold}</span>
                        </div>
                        <Progress value={stockPercent} className="h-1.5" />
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                        <Clock className="h-3 w-3" />
                        {new Date(alert.createdAt).toLocaleString()}
                      </div>
                    </div>
                    {!alert.resolved && (
                      <Button size="sm" onClick={() => handleResolve(alert.id)} className="mt-1">
                        <CheckCircle className="h-3.5 w-3.5 mr-1" /> Resolve
                      </Button>
                    )}
                    {alert.resolved && (
                      <Badge variant="outline" className="bg-success/10 text-success border-success/20 text-xs">
                        <CheckCircle className="h-3 w-3 mr-1" /> Resolved
                      </Badge>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          {displayedAlerts.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <CheckCircle className="h-12 w-12 mx-auto mb-3 text-success" />
              <p className="font-medium">All clear!</p>
              <p className="text-sm">No {filter} alerts at this time.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
