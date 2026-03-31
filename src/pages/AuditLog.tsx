import { useState } from 'react';
import { ClipboardList, Search, Package, ShoppingCart, Bell, FileText, Brain, User, Trash2, Settings } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { mockAuditLogs } from '@/lib/mockData';
import { motion } from 'framer-motion';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';

const actionIcons: Record<string, any> = {
  product_created: Package,
  product_deleted: Trash2,
  stock_updated: Package,
  transaction_created: ShoppingCart,
  alert_triggered: Bell,
  alert_resolved: Bell,
  report_generated: FileText,
  supplier_updated: Settings,
  ml_training: Brain,
  user_login: User,
};

const actionColors: Record<string, string> = {
  product_created: 'bg-success/10 text-success',
  product_deleted: 'bg-destructive/10 text-destructive',
  stock_updated: 'bg-primary/10 text-primary',
  transaction_created: 'bg-accent/10 text-accent',
  alert_triggered: 'bg-warning/10 text-warning',
  alert_resolved: 'bg-success/10 text-success',
  report_generated: 'bg-primary/10 text-primary',
  supplier_updated: 'bg-secondary text-foreground',
  ml_training: 'bg-accent/10 text-accent',
  user_login: 'bg-secondary text-foreground',
};

export default function AuditLog() {
  const [searchQuery, setSearchQuery] = useState('');
  const [entityFilter, setEntityFilter] = useState('all');

  const logs = mockAuditLogs.filter(l => {
    const matchesSearch = l.entityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.user.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesEntity = entityFilter === 'all' || l.entity === entityFilter;
    return matchesSearch && matchesEntity;
  });

  const entities = [...new Set(mockAuditLogs.map(l => l.entity))];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <ClipboardList className="h-8 w-8 text-primary" />
          Audit Log
        </h1>
        <p className="text-muted-foreground mt-1">Complete activity log of all system events</p>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search activity..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-9" />
        </div>
        <Select value={entityFilter} onValueChange={setEntityFilter}>
          <SelectTrigger className="w-36"><SelectValue placeholder="Filter" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Entities</SelectItem>
            {entities.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Activity Timeline</CardTitle>
          <CardDescription>{logs.length} events recorded</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />

            <div className="space-y-1">
              {logs.map((log, i) => {
                const IconComp = actionIcons[log.action] || ClipboardList;
                const colorClass = actionColors[log.action] || 'bg-secondary text-foreground';

                return (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="relative flex items-start gap-4 py-3 pl-2"
                  >
                    <div className={`relative z-10 h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${colorClass}`}>
                      <IconComp className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-medium text-sm">{log.entityName}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{log.details}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <Badge variant="outline" className="text-xs">{log.entity}</Badge>
                          <p className="text-[10px] text-muted-foreground mt-1">
                            {new Date(log.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">by <span className="font-medium text-foreground">{log.user}</span></p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
