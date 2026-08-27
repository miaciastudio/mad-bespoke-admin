import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';

// Pages
import Dashboard from './pages/Dashboard';
import ProductsList from './pages/ProductsList';
import ProductEditor from './pages/ProductEditor';
import CategoriesList from './pages/CategoriesList';
import EnquiriesList from './pages/EnquiriesList';
import Settings from './pages/Settings';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="products" element={<ProductsList />} />
        <Route path="products/new" element={<ProductEditor />} />
        <Route path="products/edit/:id" element={<ProductEditor />} />
        <Route path="categories" element={<CategoriesList />} />
        <Route path="enquiries" element={<EnquiriesList />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}
