import type { Category } from "../../types/category";
import { Card, CardBody, CardHeader } from "../ui/Card";
import { Button } from "../ui/Button";
import { Plus, Pencil, Trash2, FolderTree } from "lucide-react";

interface CategoryTableProps {
  categories: Category[];
  onAdd: () => void;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

export function CategoryTable({
  categories,
  onAdd,
  onEdit,
  onDelete,
}: CategoryTableProps) {
  const hasData = categories.length > 0;

  return (
    <Card className="p-4 space-y-3">
      <CardHeader
        title="Categories"
        description="Organize your products into categories like dry cookies, cakes, etc."
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
            <FolderTree className="h-8 w-8 text-muted-foreground" />
            <div>
              <p className="font-medium">No categories yet</p>
              <p className="text-xs">
                Create some categories, for example: Dry cookies, Brownies, Tarts.
              </p>
            </div>
            <Button size="sm" onClick={onAdd}>
              <Plus className="h-4 w-4 mr-1" />
              Add your first category
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-border text-xs text-muted-foreground">
                  <th className="py-2 pr-2 text-left">Name</th>
                  <th className="py-2 px-2 text-left">Created</th>
                  <th className="py-2 pl-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr
                    key={cat.id}
                    className="border-b border-border/60 last:border-0"
                  >
                    <td className="py-2 pr-2 align-middle">
                      <div className="font-medium">{cat.name}</div>
                    </td>
                    <td className="py-2 px-2 align-middle text-left text-xs text-muted-foreground">
                      {new Date(cat.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-2 pl-2 align-middle">
                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(cat)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(cat)}
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
