import { useState } from "react";
import type { Order } from "../types/order";
import { useOrderStore } from "../stores/useOrderStore";
import { useCustomerStore } from "../stores/useCustomerStore";
import { useProductStore } from "../stores/useProductStore";
import { OrderTable } from "../components/orders/OrderTable";
import { OrderForm, type OrderFormValues } from "../components/orders/OrderForm";
import { Modal } from "../components/ui/Modal";
import { Button } from "../components/ui/Button";

export function OrdersPage() {
  const { orders, addOrder, updateOrder, deleteOrder } = useOrderStore();
  const { customers } = useCustomerStore();
  const { products } = useProductStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Order | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Order | null>(null);

  const handleAddClick = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const handleEditClick = (order: Order) => {
    setEditing(order);
    setModalOpen(true);
  };

  const handleDeleteClick = (order: Order) => {
    setConfirmDelete(order);
  };

  const handleFormSubmit = (values: OrderFormValues) => {
    if (editing) {
      updateOrder(editing.id, values);
    } else {
      addOrder(values);
    }
    setModalOpen(false);
    setEditing(null);
  };

  const handleConfirmDelete = () => {
    if (confirmDelete) {
      deleteOrder(confirmDelete.id);
      setConfirmDelete(null);
    }
  };

  const canCreateOrders = customers.length > 0 && products.length > 0;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Orders</h1>
      <p className="text-sm text-muted-foreground">
        Create and manage customer orders, payment methods and totals.
      </p>

      {!canCreateOrders && (
        <div className="rounded-lg border border-border bg-card px-3 py-2 text-xs text-muted-foreground">
          To create orders, please make sure you have at least{" "}
          <span className="font-semibold">one customer</span> and{" "}
          <span className="font-semibold">one product</span>.
        </div>
      )}

      <OrderTable
        orders={orders}
        customers={customers}
        onAdd={handleAddClick}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />

      {/* Add/Edit modal */}
      <Modal
        title={editing ? "Edit order" : "Create order"}
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
      >
        <OrderForm
          initialValue={editing ?? undefined}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setModalOpen(false);
            setEditing(null);
          }}
        />
      </Modal>

      {/* Confirm delete */}
      <Modal
        title="Delete order?"
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
      >
        <p className="text-sm text-muted-foreground">
          Are you sure you want to delete this order? This action cannot be
          undone.
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <Button
            variant="secondary"
            type="button"
            onClick={() => setConfirmDelete(null)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirmDelete}
          >
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}
