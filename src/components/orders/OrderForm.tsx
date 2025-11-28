import { useMemo, useState, type FormEvent } from 'react';
import type { Order, OrderItem, PaymentMethod } from '../../types/order';
import { useCustomerStore } from '../../stores/useCustomerStore';
import { useProductStore } from '../../stores/useProductStore';
import { calculateOrderTotal } from '../../utils/pricing';
import { Select } from '../ui/Select';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Card, CardBody } from '../ui/Card';
import { CurrencyInput } from '../ui/CurrencyInput';
import { Plus, Trash2 } from 'lucide-react';

export interface OrderFormValues {
  customer_id: number;
  items: OrderItem[];
  payment_method: PaymentMethod;
  order_via: string;
  total_price: number;
}

interface OrderFormProps {
  initialValue?: Order;
  onSubmit: (values: OrderFormValues) => void;
  onCancel?: () => void;
}

const payment_methods: { value: PaymentMethod; label: string }[] = [
  { value: 'cash', label: 'Cash' },
  { value: 'transfer', label: 'Bank transfer' },
];

export function OrderForm({
  initialValue,
  onSubmit,
  onCancel,
}: OrderFormProps) {
  const { customers } = useCustomerStore();
  const { products } = useProductStore();

  const [customer_id, setCustomerId] = useState(
    initialValue?.customer_id ?? customers[0]?.id ?? -1
  );
  const [payment_method, setPaymentMethod] = useState<PaymentMethod>(
    initialValue?.payment_method ?? 'cash'
  );
  const [via, setVia] = useState(initialValue?.order_via ?? 'WhatsApp');

  const [items, setItems] = useState<OrderItem[]>(
    initialValue?.items ??
      (products[0]
        ? [
            {
              product_id: products[0].id,
              quantity: 1,
              order_id: initialValue?.id ?? -1,
              unit_price: products[0].selling_price,
              created_at: new Date().toISOString(),
            },
          ]
        : [])
  );

  const hasCustomers = customers.length > 0;
  const hasProducts = products.length > 0;

  const total_price = useMemo(
    () => calculateOrderTotal(items, products),
    [items, products]
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const cleanedItems = items.filter((i) => i.product_id && i.quantity > 0);
    if (!customer_id || !cleanedItems.length || total_price <= 0) return;

    onSubmit({
      customer_id,
      items: cleanedItems,
      payment_method,
      order_via: via.trim() || 'N/A',
      total_price,
    });
  };

  const handleAddItem = () => {
    if (!hasProducts) return;
    setItems((prev) => [
      ...prev,
      {
        product_id: products[0].id,
        quantity: 1,
        order_id: initialValue?.id ?? -1,
        unit_price: products[0].selling_price,
        created_at: new Date().toISOString(),
      },
    ]);
  };

  const handleUpdateItem = (index: number, patch: Partial<OrderItem>) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, ...patch } : item))
    );
  };

  const handleRemoveItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const canSubmit =
    hasCustomers &&
    hasProducts &&
    customer_id &&
    total_price > 0 &&
    items.some((i) => i.quantity > 0);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic order info */}
      <Card className="p-4 space-y-3">
        <h3 className="text-sm font-semibold">Order details</h3>
        <div className="grid gap-3 md:grid-cols-3">
          <Select
            label="Customer"
            value={customer_id}
            onChange={(e) => setCustomerId(Number.parseInt(e.target.value))}
          >
            <option value="">Select customer…</option>
            {customers.map((cust) => (
              <option key={cust.id} value={cust.id}>
                {cust.name}
              </option>
            ))}
          </Select>

          <Select
            label="Payment method"
            value={payment_method}
            onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
          >
            {payment_methods.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </Select>

          <Input
            label="Order via"
            value={via}
            onChange={(e) => setVia(e.target.value)}
            placeholder="e.g. WhatsApp, Instagram"
          />
        </div>

        {(!hasCustomers || !hasProducts) && (
          <p className="text-xs text-destructive">
            You need at least one customer and one product to create an order.
          </p>
        )}
      </Card>

      {/* Items */}
      <Card className="p-4 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-semibold">Order items</h3>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleAddItem}
            disabled={!hasProducts}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add product
          </Button>
        </div>

        {!hasProducts ? (
          <p className="text-xs text-muted-foreground">
            No products available. Please create products first.
          </p>
        ) : (
          <CardBody>
            <div className="space-y-3">
              {items.map((item, index) => {
                const prod = products.find((p) => p.id === item.product_id);
                const lineTotal =
                  prod && item.quantity > 0
                    ? item.quantity * prod.selling_price
                    : 0;

                const showLabels = index === 0;

                return (
                  <div
                    key={index}
                    className="rounded-xl border border-border/60 bg-background/40 px-3 py-3
                               space-y-3 md:space-y-0
                               md:grid md:grid-cols-[minmax(0,2fr),minmax(0,1fr),minmax(0,1fr),auto] md:gap-3"
                  >
                    <Select
                      label={showLabels ? 'Product' : undefined}
                      value={item.product_id}
                      onChange={(e) =>
                        handleUpdateItem(index, {
                          product_id: Number.parseInt(e.target.value),
                        })
                      }
                    >
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} (Rp {p.selling_price.toLocaleString('id-ID')}
                          )
                        </option>
                      ))}
                    </Select>

                    <Input
                      label={showLabels ? 'Qty' : undefined}
                      type="number"
                      min={1}
                      step="1"
                      value={item.quantity || ''}
                      onChange={(e) =>
                        handleUpdateItem(index, {
                          quantity: Number(e.target.value) || 0,
                        })
                      }
                      placeholder="1"
                    />

                    <div>
                      {showLabels && (
                        <label className="block text-sm font-medium text-foreground">
                          Line total
                        </label>
                      )}
                      <div className="mt-1 text-sm">
                        {lineTotal > 0 ? (
                          <span>Rp {lineTotal.toLocaleString('id-ID')}</span>
                        ) : (
                          <span className="text-muted-foreground">Rp 0</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-end justify-end">
                      <button
                        type="button"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:bg-muted"
                        onClick={() => handleRemoveItem(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardBody>
        )}
      </Card>

      {/* Summary */}
      <Card className="p-4 space-y-3">
        <h3 className="text-sm font-semibold">Summary</h3>
        <div className="grid gap-3 md:grid-cols-2">
          <CurrencyInput
            label="Total price (calculated)"
            value={total_price}
            onChange={() => {}}
            readOnly
            hint="Total is calculated from items above"
          />
          <div className="flex items-end justify-end text-sm">
            <span className="text-muted-foreground">
              Items:{' '}
              <span className="font-medium text-foreground">
                {items.reduce((acc, i) => acc + (i.quantity || 0), 0)}
              </span>
            </span>
          </div>
        </div>
      </Card>

      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={!canSubmit}>
          {initialValue ? 'Save order' : 'Create order'}
        </Button>
      </div>
    </form>
  );
}
