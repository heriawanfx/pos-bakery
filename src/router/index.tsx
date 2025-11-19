import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "../components/layout/AppLayout";
import { DashboardPage } from "../pages/DashboardPage";
import { IngredientsPage } from "../pages/IngredientsPage";
import { CategoriesPage } from "../pages/CategoriesPage";
import { ProductsPage } from "../pages/ProductsPage";
import { CustomersPage } from "../pages/CustomersPage";
import { OrdersPage } from "../pages/OrdersPage";
import DemoPage from "../pages/DemoPage";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/ingredients" element={<IngredientsPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/demo" element={<DemoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
