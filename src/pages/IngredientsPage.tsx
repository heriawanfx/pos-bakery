import { useEffect, useState } from "react";
import type { Ingredient } from "../types/ingredient";
import { useIngredientStore } from "../stores/useIngredientStore";
import { IngredientTable } from "../components/ingredients/IngredientTable";
import { IngredientForm, type IngredientFormValues } from "../components/ingredients/IngredientForm";
import { Modal } from "../components/ui/Modal";
import { Button } from "../components/ui/Button";
import { useToast } from "../components/ui/ToastProvider";

export function IngredientsPage() {
  const { ingredients, fetch, addIngredient, updateIngredient, deleteIngredient } =
    useIngredientStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Ingredient | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Ingredient | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    fetch();
  }, [fetch])

  const handleAddClick = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const handleEditClick = (ingredient: Ingredient) => {
    setEditing(ingredient);
    setModalOpen(true);
  };

  const handleDeleteClick = (ingredient: Ingredient) => {
    setConfirmDelete(ingredient);
  };

  const handleFormSubmit = async (values: IngredientFormValues) => {
    if (editing) {
      const result = await updateIngredient(editing.id, values);
      
      if (!result.success) {
        showToast({ description: result.error, variant: 'error', title: "Ada Masalah" });
        return;
      }
      showToast({ description: 'Category Updated' });
    } else {
      const result = await addIngredient(values);
      if (!result.success) {
        showToast({ description: result.error, variant: 'error' });
        return;
      }
      
      showToast({ description: 'New Category Added', variant: 'success' });
    }
    setModalOpen(false);
    setEditing(null);
  };

  const handleConfirmDelete = async () => {
    if (confirmDelete) {
      const result = await deleteIngredient(confirmDelete.id);
      if (!result.success) {
        showToast({ description: result.error, variant: 'error', title: "Ada Masalah" });
        return;
      }

      setConfirmDelete(null);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Ingredients</h1>
      <p className="text-sm text-muted-foreground">
        Manage your ingredient stock, units, and purchase prices.
      </p>

      <IngredientTable
        ingredients={ingredients}
        onAdd={handleAddClick}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />

      {/* Modal for Add/Edit */}
      <Modal
        title={editing ? "Edit ingredient" : "Add ingredient"}
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
      >
        <IngredientForm
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
        title="Delete ingredient?"
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

