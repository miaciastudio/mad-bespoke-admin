import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  Star,
  ExternalLink,
  Filter,
  Check,
  X,
  AlertCircle
} from 'lucide-react';
import { fetchProducts, fetchCategories, deleteProduct } from '../services/adminApi';

export default function ProductsList() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [cats, prods] = await Promise.all([
          fetchCategories(),
          fetchProducts({ category: categoryFilter, search }),
        ]);
        setCategories(cats);
        setProducts(prods);
      } catch (err) {
        console.error('Error fetching products list:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [categoryFilter, search]);

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      setProducts(products.filter((p) => p.id !== id));
      setDeleteConfirmId(null);
    } catch (err) {
      alert('Failed to delete product: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">
            Product Catalogue Manager
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Total {products.length} products loaded from Turso database
          </p>
        </div>

        <Link
          to="/products/new"
          className="inline-flex items-center gap-2 bg-burgundy-700 hover:bg-burgundy-800 text-gold-100 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search catalog by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-canvas rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-burgundy-700"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs bg-canvas border border-gray-200 rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-burgundy-700 font-medium"
          >
            <option value="all">All Categories ({categories.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-gray-500">Loading catalog from database...</div>
        ) : products.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-600">
              <thead className="bg-canvas border-b border-gray-200 font-bold uppercase tracking-wider text-[10px] text-burgundy-950">
                <tr>
                  <th className="py-3.5 px-4">Item</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">MRP</th>
                  <th className="py-3.5 px-4">Customisation</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((prod) => {
                  const image = (prod.images && prod.images.length > 0) ? prod.images[0] : 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=100&q=80';
                  
                  return (
                    <tr key={prod.id} className="hover:bg-canvas/40 transition-colors">
                      
                      {/* Image & Title */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                            <img src={image} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <strong className="text-gray-900 font-semibold block text-sm font-serif">
                              {prod.name}
                            </strong>
                            <span className="text-[10px] text-gray-400 font-mono">
                              ID: {prod.id}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4">
                        <span className="inline-block bg-canvas px-2.5 py-1 rounded-lg text-ink-secondary font-medium">
                          {prod.category_name || prod.category_id}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-3 px-4 font-bold text-burgundy-900 text-sm">
                        ₹{prod.price}
                      </td>

                      {/* MRP */}
                      <td className="py-3 px-4 text-gray-400 line-through">
                        ₹{prod.mrp || prod.price}
                      </td>

                      {/* Customisation summary */}
                      <td className="py-3 px-4">
                        {prod.customisation_options && prod.customisation_options.length > 0 ? (
                          <span className="bg-gold-100 text-gold-800 font-semibold px-2 py-0.5 rounded-full text-[10px]">
                            {prod.customisation_options[0]} {prod.customisation_options.length > 1 ? `+${prod.customisation_options.length - 1}` : ''}
                          </span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>

                      {/* Badges / Status */}
                      <td className="py-3 px-4">
                        <div className="flex flex-col gap-1 items-start">
                          {prod.is_bestseller ? (
                            <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded">
                              ★ Best Seller
                            </span>
                          ) : null}
                          <span className="text-[10px] text-green-700 font-semibold">
                            ● In Stock
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/products/edit/${prod.id}`}
                            className="p-2 hover:bg-canvas text-gray-700 hover:text-burgundy-700 rounded-lg transition-colors"
                            title="Edit product"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Link>

                          {deleteConfirmId === prod.id ? (
                            <div className="flex items-center gap-1 bg-red-50 p-1 rounded-lg border border-red-200">
                              <button
                                onClick={() => handleDelete(prod.id)}
                                className="bg-red-600 text-white p-1 rounded text-[10px] font-bold"
                                title="Confirm delete"
                              >
                                Delete
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(null)}
                                className="text-gray-500 p-1"
                                title="Cancel"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirmId(prod.id)}
                              className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-lg transition-colors"
                              title="Delete product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center space-y-3">
            <Package className="w-10 h-10 text-gray-300 mx-auto" />
            <p className="text-sm font-semibold text-gray-700">No products found</p>
            <p className="text-xs text-gray-400">Try adjusting your search or category filter.</p>
          </div>
        )}
      </div>

    </div>
  );
}
