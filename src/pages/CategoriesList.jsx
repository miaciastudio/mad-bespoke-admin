import React, { useState, useEffect } from 'react';
import { FolderTree, Plus, CheckCircle2, AlertCircle } from 'lucide-react';
import { fetchCategories, createCategory } from '../services/adminApi';

export default function CategoriesList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCat, setNewCat] = useState({ id: '', name: '', icon: '🎁', description: '', display_order: 1 });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const slug = newCat.id || newCat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      await createCategory({ ...newCat, id: slug });
      setMessage('Category added successfully!');
      setShowAddModal(false);
      const updated = await fetchCategories();
      setCategories(updated);
    } catch (err) {
      alert('Error creating category: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-gray-900">
            Catalog Categories ({categories.length})
          </h1>
          <p className="text-xs text-gray-500">
            Collections displayed across the storefront navigation and filters
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 bg-burgundy-700 hover:bg-burgundy-800 text-gold-100 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      {message && (
        <div className="p-3 bg-green-50 text-green-800 text-xs rounded-xl border border-green-200">
          {message}
        </div>
      )}

      {/* Grid of categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((c) => (
          <div key={c.id} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3 flex flex-col justify-between">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-50 border border-gray-200 p-0.5 shrink-0 flex items-center justify-center">
                  <img
                    src={c.image_url || `/categories/${c.id}.jpg`}
                    alt={c.name}
                    className="w-full h-full object-cover rounded-lg"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `/categories/${c.id}.jpg`;
                    }}
                  />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-gray-900">{c.name}</h3>
                  <span className="text-[10px] text-gray-400 font-mono">Slug: {c.id}</span>
                </div>
              </div>
              <span className="bg-gold-100 text-gold-800 text-[10px] font-bold px-2 py-0.5 rounded">
                {c.product_count || 0} items
              </span>
            </div>

            <p className="text-xs text-gray-500 line-clamp-2">
              {c.description || 'No description set'}
            </p>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
              <span>Order: #{c.display_order}</span>
              <a
                href={`http://localhost:5173/shop?category=${c.id}`}
                target="_blank"
                rel="noreferrer"
                className="text-burgundy-700 font-semibold hover:underline"
              >
                View on Store →
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleCreate} className="bg-white p-6 rounded-3xl max-w-md w-full shadow-warm-lg space-y-4">
            <h3 className="font-serif text-xl font-bold text-burgundy-950">Add New Category</h3>
            
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">Category Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Executive Desk Sets"
                value={newCat.name}
                onChange={(e) => setNewCat({ ...newCat, name: e.target.value })}
                className="w-full bg-canvas p-2.5 text-xs rounded-xl border border-gray-200"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Emoji Icon</label>
                <input
                  type="text"
                  placeholder="✨"
                  value={newCat.icon}
                  onChange={(e) => setNewCat({ ...newCat, icon: e.target.value })}
                  className="w-full bg-canvas p-2.5 text-xs rounded-xl border border-gray-200"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Display Order</label>
                <input
                  type="number"
                  value={newCat.display_order}
                  onChange={(e) => setNewCat({ ...newCat, display_order: e.target.value })}
                  className="w-full bg-canvas p-2.5 text-xs rounded-xl border border-gray-200"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">Description</label>
              <textarea
                rows="2"
                placeholder="Short description for shop cards..."
                value={newCat.description}
                onChange={(e) => setNewCat({ ...newCat, description: e.target.value })}
                className="w-full bg-canvas p-2.5 text-xs rounded-xl border border-gray-200"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-xs font-semibold text-gray-500 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="bg-burgundy-700 text-gold-100 px-5 py-2 rounded-xl text-xs font-bold uppercase"
              >
                {saving ? 'Creating...' : 'Create Category'}
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
