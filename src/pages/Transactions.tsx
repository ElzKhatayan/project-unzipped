import { useState } from 'react';
import { ArrowUpRight, ArrowDownRight, Edit2, Filter, Download } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { mockTransactions } from '@/lib/mockData';

export default function Transactions() {
  const [searchQuery, setSearchQuery] = useState('');
  const transactions = mockTransactions;

  const filteredTransactions = transactions.filter(t =>
    t.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.user.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTypeIcon = (type: string) => {
    return type === 'sale' ? (
      <ArrowUpRight className="h-4 w-4 text-success" />
    ) : (
      <ArrowDownRight className="h-4 w-4 text-primary" />
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
        <p className="text-muted-foreground mt-1">
          Complete history of all inventory movements
        </p>
      </div>

      <Card className="shadow-medium">
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>
                {filteredTransactions.length} transactions recorded
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64"
              />
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
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
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-mono text-sm">
                      {new Date(transaction.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant={transaction.type === 'sale' ? 'default' : 'secondary'} className="flex items-center gap-1 w-fit">
                        {getTypeIcon(transaction.type)}
                        {transaction.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{transaction.productName}</TableCell>
                    <TableCell className="text-right font-bold">
                      {transaction.quantity}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      ${transaction.price.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right font-bold font-mono">
                      ${transaction.total.toFixed(2)}
                    </TableCell>
                    <TableCell>{transaction.user}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {transaction.notes || '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
