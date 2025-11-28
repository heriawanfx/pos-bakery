import type { Order } from '../../types/order';
import type { Customer } from '../../types/customer';
import { Card, CardBody, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Plus, Pencil, Trash2, ReceiptText } from 'lucide-react';

interface OrderTableProps {
  orders: Order[];
  customers: Customer[];
  onAdd: () => void;
  onEdit: (order: Order) => void;
  onDelete: (order: Order) => void;
}

export function OrderTable({
  orders,
  customers,
  onAdd,
  onEdit,
  onDelete,
}: OrderTableProps) {
  const hasData = orders.length > 0;
  const customerMap = new Map(customers.map((c) => [c.id, c.name]));

  return (
    <Card className="p-4 space-y-3">
      <CardHeader
        title="Orders"
        description="List of orders, customers, payment methods, and totals."
        actions={
          <Button size="sm" onClick={onAdd}>
            <Plus className="h-4 w-4 mr-1" />
            New order
          </Button>
        }
      />

      <CardBody>
        {!hasData ? (
          <div className="flex flex-col items-center justify-center py-10 text-center text-sm text-muted-foreground gap-3">
            <ReceiptText className="h-8 w-8 text-muted-foreground" />
            <div>
              <p className="font-medium">No orders yet</p>
              <p className="text-xs">
                Once you start taking orders, they will appear here.
              </p>
            </div>
            <Button size="sm" onClick={onAdd}>
              <Plus className="h-4 w-4 mr-1" />
              Create your first order
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-border text-xs text-muted-foreground">
                  <th className="py-2 pr-2 text-left">Date</th>
                  <th className="py-2 px-2 text-left">Customer</th>
                  <th className="py-2 px-2 text-left">Payment</th>
                  <th className="py-2 px-2 text-left">Via</th>
                  <th className="py-2 px-2 text-right">Total</th>
                  <th className="py-2 pl-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((ord) => {
                  console.log('orders', orders);
                  return (
                    <tr
                      key={ord.id}
                      className="border-b border-border/60 last:border-0"
                    >
                      <td className="py-2 pr-2 align-middle text-xs text-muted-foreground">
                        {new Date(ord.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-2 px-2 align-middle">
                        {customerMap.get(ord.customer_id) ?? (
                          <span className="text-xs text-destructive">
                            (Customer missing)
                          </span>
                        )}
                      </td>
                      <td className="py-2 px-2 align-middle text-xs capitalize">
                        {ord.payment_method}
                      </td>
                      <td className="py-2 px-2 align-middle text-xs">
                        {ord.order_via}
                      </td>
                      <td className="py-2 px-2 align-middle text-right">
                        Rp {ord.total_price.toLocaleString('id-ID')}
                      </td>
                      <td className="py-2 pl-2 align-middle">
                        <div className="flex justify-end gap-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit(ord)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => onDelete(ord)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
