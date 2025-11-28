import { useEffect, useState } from "react";
import type { Customer } from "../types/customer";
import { useCustomerStore } from "../stores/useCustomerStore";
import { CustomerTable } from "../components/customers/CustomerTable";
import { CustomerForm, type CustomerFormValues } from "../components/customers/CustomerForm";
import { Modal } from "../components/ui/Modal";
import { Button } from "../components/ui/Button";

export function CustomersPage() {
  const { customers, fetch, loading, addCustomer, updateCustomer, deleteCustomer } =
    useCustomerStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Customer | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Customer | null>(null);

  useEffect(() => {fetch()}, [fetch]);

  const handleAddClick = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const handleEditClick = (customer: Customer) => {
    setEditing(customer);
    setModalOpen(true);
  };

  const handleDeleteClick = (customer: Customer) => {
    setConfirmDelete(customer);
  };

  const handleFormSubmit = (values: CustomerFormValues) => {
    if (editing) {
      updateCustomer(editing.id, values);
    } else {
      addCustomer(values);
    }
    setModalOpen(false);
    setEditing(null);
  };

  const handleConfirmDelete = () => {
    if (confirmDelete) {
      deleteCustomer(confirmDelete.id);
      setConfirmDelete(null);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Customers</h1>
      <p className="text-sm text-muted-foreground">
        Manage customer records to speed up order entry.
      </p>

     {loading ? (
        <div className="text-sm text-muted-foreground">
          Loading...
        </div>
      ) : ( <CustomerTable
        customers={customers}
        onAdd={handleAddClick}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />)}

      {/* Add/Edit modal */}
      <Modal
        title={editing ? "Edit customer" : "Add customer"}
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
      >
        <CustomerForm
          initialValue={editing ?? undefined}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setModalOpen(false);
            setEditing(null);
          }}
        />
      </Modal>

      {/* Confirm delete modal */}
      <Modal
        title="Delete customer?"
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
      >
        <p className="text-sm text-muted-foreground">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-foreground">
            {confirmDelete?.name}
          </span>
          ? This action cannot be undone.
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
