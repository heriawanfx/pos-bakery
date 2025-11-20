import { useMemo } from "react";
import { useIngredientStore } from "../stores/useIngredientStore";
import { useCategoryStore } from "../stores/useCategoryStore";
import { useProductStore } from "../stores/useProductStore";
import { useCustomerStore } from "../stores/useCustomerStore";
import { useOrderStore } from "../stores/useOrderStore";
import { Card, CardBody, CardHeader } from "../components/ui/Card";
import {
  Package,
  Cookie,
  Users,
  ReceiptText,
  TrendingUp,
  AlertTriangle,
  Clock,
} from "lucide-react";
import { formatRupiah } from "../utils/format";

const LOW_STOCK_THRESHOLD = 200; // bebas diubah

interface DashboardStatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  hint?: string;
}

function DashboardStatCard({ icon, label, value, hint }: DashboardStatCardProps) {
  return (
    <Card className="p-3 md:p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            {label}
          </span>
          <span className="text-lg md:text-xl font-semibold text-foreground">
            {value}
          </span>
          {hint && (
            <span className="text-[11px] text-muted-foreground">{hint}</span>
          )}
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
          {icon}
        </div>
      </div>
    </Card>
  );
}

export function DashboardPage() {
  const { ingredients } = useIngredientStore();
  const { categories } = useCategoryStore();
  const { products } = useProductStore();
  const { customers } = useCustomerStore();
  const { orders } = useOrderStore();

  // --- Summary metrics ---
  const totalRevenue = useMemo(
    () => orders.reduce((sum, o) => sum + o.totalPrice, 0),
    [orders]
  );
  const totalOrders = orders.length;
  const averageOrder =
    totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

  const totalIngredients = ingredients.length;
  const totalCategories = categories.length;
  const totalProducts = products.length;
  const totalCustomers = customers.length;

  // --- Low stock ingredients ---
  const lowStockIngredients = useMemo(
    () =>
      ingredients
        .filter((ing) => ing.quantity > 0 && ing.quantity <= LOW_STOCK_THRESHOLD)
        .sort((a, b) => a.quantity - b.quantity)
        .slice(0, 5), //Ambil 5 terakhir
    [ingredients]
  );

  // --- Recent orders ---
  const recentOrders = useMemo(
    () =>
      [...orders]
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 5),
    [orders]
  );

  // --- Top products by quantity sold ---
  const topProducts = useMemo(() => {
    if (!orders.length || !products.length) return [];

    const counter = new Map<string, number>();

    for (const order of orders) {
      for (const item of order.items) {
        const prev = counter.get(item.productId) ?? 0;
        counter.set(item.productId, prev + (item.quantity || 0));
      }
    }

    const entries = Array.from(counter.entries())
      .map(([productId, qty]) => {
        const prod = products.find((p) => p.id === productId);
        return prod
          ? {
              product: prod,
              quantity: qty,
            }
          : null;
      })
      .filter(Boolean) as { product: (typeof products)[number]; quantity: number }[];

    return entries
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);
  }, [orders, products]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Quick overview of your bakery business: sales, products, and stock.
        </p>
      </div>

      {/* Top stats */}
      <div className="grid gap-3 md:grid-cols-4">
        <DashboardStatCard
          icon={<ReceiptText className="h-4 w-4" />}
          label="Total revenue"
          value={formatRupiah(totalRevenue)}
          hint={totalOrders > 0 ? `${totalOrders} orders` : "No orders yet"}
        />
        <DashboardStatCard
          icon={<TrendingUp className="h-4 w-4" />}
          label="Avg. order value"
          value={formatRupiah(averageOrder)}
          hint={totalOrders > 0 ? "Per completed order" : "Waiting for first order"}
        />
        <DashboardStatCard
          icon={<Cookie className="h-4 w-4" />}
          label="Products"
          value={totalProducts}
          hint={`${totalCategories} categories`}
        />
        <DashboardStatCard
          icon={<Users className="h-4 w-4" />}
          label="Customers"
          value={totalCustomers}
          hint={totalCustomers > 0 ? "Returning & new customers" : "No customers yet"}
        />
      </div>

      {/* Middle section: Recent orders + Low stock */}
      <div className="grid gap-4 lg:grid-cols-[3fr,2fr]">
        {/* Recent orders */}
        <Card className="p-4 space-y-3">
          <CardHeader
            title="Recent orders"
            description="Last few orders placed by your customers."
          />
          <CardBody>
            {recentOrders.length === 0 ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>No orders yet. Once you create orders, they will appear here.</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-xs text-muted-foreground">
                      <th className="py-2 pr-2 text-left">Date</th>
                      <th className="py-2 px-2 text-left">Customer</th>
                      <th className="py-2 px-2 text-left">Via</th>
                      <th className="py-2 px-2 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((ord) => {
                      const customer = customers.find((c) => c.id === ord.customerId);
                      return (
                        <tr
                          key={ord.id}
                          className="border-b border-border/60 last:border-0"
                        >
                          <td className="py-2 pr-2 align-middle text-xs text-muted-foreground">
                            {new Date(ord.createdAt).toLocaleString()}
                          </td>
                          <td className="py-2 px-2 align-middle text-sm">
                            {customer ? customer.name : (
                              <span className="text-xs text-destructive">
                                (Customer missing)
                              </span>
                            )}
                          </td>
                          <td className="py-2 px-2 align-middle text-xs">
                            {ord.via}
                          </td>
                          <td className="py-2 px-2 align-middle text-right text-sm">
                            {formatRupiah(ord.totalPrice)}
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

        {/* Low stock + counts */}
        <div className="space-y-4">
          <Card className="p-4 space-y-3">
            <CardHeader
              title="Low stock ingredients"
              description={`Ingredients below ${LOW_STOCK_THRESHOLD.toLocaleString("id-ID")} units.`}
            />
            <CardBody>
              {lowStockIngredients.length === 0 ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <AlertTriangle className="h-4 w-4" />
                  <span>All ingredients are above the low stock threshold.</span>
                </div>
              ) : (
                <div className="space-y-2">
                  {lowStockIngredients.map((ing) => (
                    <div
                      key={ing.id}
                      className="flex items-center justify-between gap-2 rounded-lg border border-border/60 bg-background/60 px-3 py-2"
                    >
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="text-sm font-medium">{ing.name}</div>
                          <div className="text-[11px] text-muted-foreground">
                            Purchase price: {formatRupiah(ing.purchasePrice)} / {ing.unit}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold">
                          {ing.quantity.toLocaleString("id-ID")}{" "}
                          <span className="text-xs text-muted-foreground">
                            {ing.unit}
                          </span>
                        </div>
                        <div className="text-[11px] text-destructive">
                          Low stock
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>

          {/* Top products */}
          <Card className="p-4 space-y-3">
            <CardHeader
              title="Top products"
              description="Most frequently sold products."
            />
            <CardBody>
              {topProducts.length === 0 ? (
                <div className="text-sm text-muted-foreground">
                  No sales yet. Once orders include products, the ranking will appear here.
                </div>
              ) : (
                <div className="space-y-2">
                  {topProducts.map(({ product, quantity }, index) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between gap-2 rounded-lg border border-border/60 bg-background/60 px-3 py-2"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            #{index + 1}
                          </span>
                          <span className="text-sm font-medium">
                            {product.name}
                          </span>
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          Price: {formatRupiah(product.sellingPrice)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold">
                          {quantity}x
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          Sold quantity
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
