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

export function AppRouter() {
  return (
    //Ganti <BrowserRouter> jika ingin deploy ke selain Github
    <HashRouter> 
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/ingredients" element={<IngredientsPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/customers" element={<CustomersPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/demo" element={<DemoPage />} />
          </Route>
        </Routes>
    </HashRouter>
  );
}
