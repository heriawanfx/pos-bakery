import type { Ingredient } from "../../types/ingredient";
import { Button } from "../ui/Button";
import { Card, CardBody, CardHeader } from "../ui/Card";
import { Pencil, Trash2, Package2, Plus } from "lucide-react";

interface IngredientTableProps {
  ingredients: Ingredient[];
  onAdd: () => void;
  onEdit: (ingredient: Ingredient) => void;
  onDelete: (ingredient: Ingredient) => void;
}

export function IngredientTable({
  ingredients,
  onAdd,
  onEdit,
  onDelete,
}: IngredientTableProps) {
  const hasData = ingredients.length > 0;

  return (
    <Card className="p-4 space-y-3">
      <CardHeader
        title="Ingredients"
        description="Manage your ingredient stock and purchase price."
        actions={
          <Button size="sm" onClick={onAdd}>
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        }
      />

      <CardBody>
        {!hasData ? (
          <div className="flex flex-col items-center justify-center py-10 text-center text-sm text-muted-foreground gap-3">
            <Package2 className="h-8 w-8 text-muted-foreground" />
            <div>
              <p className="font-medium">No ingredients yet</p>
              <p className="text-xs">
                Start by adding sugar, flour, butter, and other base materials.
              </p>
            </div>
            <Button size="sm" onClick={onAdd}>
              <Plus className="h-4 w-4 mr-1" />
              Add your first ingredient
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-border text-xs text-muted-foreground">
                  <th className="py-2 pr-2 text-left">Name</th>
                  <th className="py-2 px-2 text-right">Stock</th>
                  <th className="py-2 px-2 text-right">Price / unit</th>
                  <th className="py-2 pl-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {ingredients.map((ing) => (
                  <tr
                    key={ing.id}
                    className="border-b border-border/60 last:border-0"
                  >
                    <td className="py-2 pr-2 align-middle">
                      <div className="font-medium">{ing.name}</div>
                      <div className="text-xs text-muted-foreground">
                        Created: {new Date(ing.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-2 px-2 align-middle text-right">
                      {ing.quantity.toLocaleString()}{" "}
                      <span className="text-xs text-muted-foreground">
                        {ing.unit}
                      </span>
                    </td>
                    <td className="py-2 px-2 align-middle text-right">
                      Rp {ing.purchase_price.toLocaleString()}
                    </td>
                    <td className="py-2 pl-2 align-middle">
                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(ing)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(ing)}
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
