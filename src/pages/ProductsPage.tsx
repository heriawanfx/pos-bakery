import { useEffect, useState } from "react";
import type { Product } from "../types/product";
import { useProductStore } from "../stores/useProductStore";
import { useCategoryStore } from "../stores/useCategoryStore";
import { useIngredientStore } from "../stores/useIngredientStore";
import { ProductTable } from "../components/products/ProductTable";
import { ProductForm, type ProductFormValues } from "../components/products/ProductForm";
import { Modal } from "../components/ui/Modal";
import { Button } from "../components/ui/Button";
import { useToast } from "../components/ui/ToastProvider";
import { Result } from "../utils/result";

export function ProductsPage() {
  const { products, addProduct, updateProduct, deleteProduct } = useProductStore();
  const { categories } = useCategoryStore();
  const { ingredients } = useIngredientStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Product | null>(null);

  const { showToast } = useToast();

  const handleAddClick = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const handleEditClick = (product: Product) => {
    setEditing(product);
    setModalOpen(true);
  };

  const handleDeleteClick = (product: Product) => {
    setConfirmDelete(product);
  };

  const handleFormSubmit = async (values: ProductFormValues) => {
    var product;

    if (editing) {
      //updateProduct(editing.id, values);

       const result = await updateProduct(editing.id, values);
      if (!result.success) {
        showToast({ description: result.error, variant: 'error', title: "Ada Masalah" });
        return Result.success(null)
      }

      showToast({ description: 'Data Updated' });

      product = result.data;

    } else {
      //addProduct(values);
      const result = await addProduct(values);
      if (!result.success) {
        showToast({ description: result.error, variant: 'error' });
        return Result.success(null)
      }

      showToast({ description: 'New Data Added', variant: 'success' });

      product = result.data;
    }

    setModalOpen(false);
    setEditing(null);

    return Result.success(product)
  };

  const handleConfirmDelete = () => {
    if (confirmDelete) {
      deleteProduct(confirmDelete.id);
      setConfirmDelete(null);
    }
  };

  const canCreateProducts = categories.length > 0 && ingredients.length > 0;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Products</h1>
      <p className="text-sm text-muted-foreground">
        Manage products, ingredients usage (HPP), selling price, and margin.
      </p>

      {!canCreateProducts && (
        <div className="rounded-lg border border-border bg-card px-3 py-2 text-xs text-muted-foreground">
          To create products, please make sure you have at least{" "}
          <span className="font-semibold">one category</span> and{" "}
          <span className="font-semibold">one ingredient</span>.
        </div>
      )}

      <ProductTable
        products={products}
        categories={categories}
        onAdd={handleAddClick}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />

      {/* Modal Add/Edit */}
      <Modal
        title={editing ? "Edit product" : "Add product"}
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
      >
        <ProductForm
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
        title="Delete product?"
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
