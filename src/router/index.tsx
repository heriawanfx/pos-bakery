import { Routes, Route, HashRouter } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { DashboardPage } from '../pages/DashboardPage';
import { IngredientsPage } from '../pages/IngredientsPage';
import { CategoriesPage } from '../pages/CategoriesPage';
import { ProductsPage } from '../pages/ProductsPage';
import { CustomersPage } from '../pages/CustomersPage';
import { OrdersPage } from '../pages/OrdersPage';
import DemoPage from '../pages/DemoPage';
import { SettingsPage } from '../pages/SettingsPage';
import { LoginPage } from '../pages/LoginPage';
import { RequireAuth } from '../components/auth/RequireAuth';

export function AppRouter() {
  return (
    //Ganti <BrowserRouter> jika ingin deploy ke selain Github
    <HashRouter> 
        <Routes>
        {/* Public route */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/demo" element={<DemoPage />} />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <RequireAuth>
              <AppLayout />
            </RequireAuth>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="ingredients" element={<IngredientsPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </HashRouter>
  );
}
