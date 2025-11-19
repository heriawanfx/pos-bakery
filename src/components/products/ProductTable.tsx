import type { Product } from "../../types/product";
import type { Category } from "../../types/category";
import { Card, CardBody, CardHeader } from "../ui/Card";
import { Button } from "../ui/Button";
import { Plus, Pencil, Trash2, Cookie } from "lucide-react";

interface ProductTableProps {
  products: Product[];
  categories: Category[];
  onAdd: () => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export function ProductTable({
  products,
  categories,
  onAdd,
  onEdit,
  onDelete,
}: ProductTableProps) {
  const hasData = products.length > 0;
  const categoryMap = new Map(categories.map((c) => [c.id, c.name]));

  return (
    <Card className="p-4 space-y-3">
      <CardHeader
        title="Products"
        description="List of products, HPP, selling price, and margin."
        actions={
          <Button size="sm" onClick={onAdd}>
            <Plus className="h-4 w-4 mr-1" />
            Add product
          </Button>
        }
      />

      <CardBody>
        {!hasData ? (
          <div className="flex flex-col items-center justify-center py-10 text-center text-sm text-muted-foreground gap-3">
            <Cookie className="h-8 w-8 text-muted-foreground" />
            <div>
              <p className="font-medium">No products yet</p>
              <p className="text-xs">
                Start by creating products like Nastar 250g, Putri Salju, etc.
              </p>
            </div>
            <Button size="sm" onClick={onAdd}>
              <Plus className="h-4 w-4 mr-1" />
              Add your first product
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-border text-xs text-muted-foreground">
                  <th className="py-2 pr-2 text-left">Name</th>
                  <th className="py-2 px-2 text-left">Category</th>
                  <th className="py-2 px-2 text-right">HPP</th>
                  <th className="py-2 px-2 text-right">Selling price</th>
                  <th className="py-2 px-2 text-right">Margin</th>
                  <th className="py-2 pl-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((prod) => (
                  <tr
                    key={prod.id}
                    className="border-b border-border/60 last:border-0"
                  >
                    <td className="py-2 pr-2 align-middle">
                      <div className="font-medium">{prod.name}</div>
                      <div className="text-xs text-muted-foreground">
                        Updated: {new Date(prod.updatedAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-2 px-2 align-middle text-left">
                      {categoryMap.get(prod.categoryId) ?? (
                        <span className="text-xs text-destructive">
                          (Category missing)
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-2 align-middle text-right">
                      Rp {prod.costOfGoods.toLocaleString("id-ID")}
                    </td>
                    <td className="py-2 px-2 align-middle text-right">
                      Rp {prod.sellingPrice.toLocaleString("id-ID")}
                    </td>
                    <td className="py-2 px-2 align-middle text-right">
                      {prod.marginPercentage.toFixed(1)}%
                    </td>
                    <td className="py-2 pl-2 align-middle">
                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(prod)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(prod)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
