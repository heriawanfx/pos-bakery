import type { Customer } from "../../types/customer";
import { Card, CardBody, CardHeader } from "../ui/Card";
import { Button } from "../ui/Button";
import { Plus, Pencil, Trash2, Users, Phone, MapPin } from "lucide-react";

interface CustomerTableProps {
  customers: Customer[];
  onAdd: () => void;
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
}

export function CustomerTable({
  customers,
  onAdd,
  onEdit,
  onDelete,
}: CustomerTableProps) {
  const hasData = customers.length > 0;

  return (
    <Card className="p-4 space-y-3">
      <CardHeader
        title="Customers"
        description="Manage customer names, addresses, and phone numbers."
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
            <Users className="h-8 w-8 text-muted-foreground" />
            <div>
              <p className="font-medium">No customers yet</p>
              <p className="text-xs">
                Add your regular customers to make ordering faster.
              </p>
            </div>
            <Button size="sm" onClick={onAdd}>
              <Plus className="h-4 w-4 mr-1" />
              Add your first customer
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-border text-xs text-muted-foreground">
                  <th className="py-2 pr-2 text-left">Name</th>
                  <th className="py-2 px-2 text-left">Contact</th>
                  <th className="py-2 px-2 text-left">Address</th>
                  <th className="py-2 pl-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((cust) => (
                  <tr
                    key={cust.id}
                    className="border-b border-border/60 last:border-0"
                  >
                    <td className="py-2 pr-2 align-middle">
                      <div className="font-medium">{cust.name}</div>
                      <div className="text-xs text-muted-foreground">
                        Created: {new Date(cust.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-2 px-2 align-middle">
                      {cust.phone ? (
                        <div className="flex items-center gap-1 text-xs">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          <span>{cust.phone}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          No phone
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-2 align-middle">
                      {cust.address ? (
                        <div className="flex items-start gap-1 text-xs">
                          <MapPin className="h-3 w-3 mt-[2px] text-muted-foreground" />
                          <span>{cust.address}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          No address
                        </span>
                      )}
                    </td>
                    <td className="py-2 pl-2 align-middle">
                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(cust)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(cust)}
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
