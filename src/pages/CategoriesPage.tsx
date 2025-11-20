import { useState } from "react";
import type { Category } from "../types/category";
import { useCategoryStore } from "../stores/useCategoryStore";
import { CategoryTable } from "../components/categories/CategoryTable";
import { CategoryForm } from "../components/categories/CategoryForm";
import { Modal } from "../components/ui/Modal";
import { Button } from "../components/ui/Button";
import { useToast } from "../components/ui/ToastProvider";

export function CategoriesPage() {
  const { categories, addCategory, updateCategory, deleteCategory } =
    useCategoryStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Category | null>(null);
  const { showToast } = useToast();

  const handleAddClick = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const handleEditClick = (category: Category) => {
    setEditing(category);
    setModalOpen(true);
  };

  const handleDeleteClick = (category: Category) => {
    setConfirmDelete(category);
  };

  const handleFormSubmit = (name: string) => {
    if (editing) {
      updateCategory(editing.id, { name });
      showToast({description: "Category Updated"});
    } else {
      addCategory(name);
      showToast({description: "New Category Added", variant: "success"});
    }
    setModalOpen(false);
    setEditing(null);
  };

  const handleConfirmDelete = () => {
    if (confirmDelete) {
      deleteCategory(confirmDelete.id);
      setConfirmDelete(null);
      showToast({description: "Category Deleted"});
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Categories</h1>
      <p className="text-sm text-muted-foreground">
        Manage product categories used by your bakery items.
      </p>

      <CategoryTable
        categories={categories}
        onAdd={handleAddClick}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />

      {/* Modal Add/Edit */}
      <Modal
        title={editing ? "Edit category" : "Add category"}
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
      >
        <CategoryForm
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
        title="Delete category?"
        open={!!confirmDelete} //Paksa value jadi boolean murni (confirmDelete !== null) 
        onClose={() => setConfirmDelete(null)}
      >
        <p className="text-sm text-muted-foreground">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-foreground">
            {confirmDelete?.name}
          </span>
          ? This action cannot be undone, and products using this category
          might show as “Category missing”.
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
