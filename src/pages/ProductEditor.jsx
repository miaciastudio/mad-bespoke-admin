import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Sparkles,
  Plus,
  X,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import ImageUploader from '../components/ImageUploader';
import { fetchProductById, fetchCategories, createProduct, updateProduct } from '../services/adminApi';

export default function ProductEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form Fields
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('personalized-gifts');
  const [price, setPrice] = useState('');
  const [mrp, setMrp] = useState('');
  const [description, setDescription] = useState('');
  const [packaging, setPackaging] = useState('Paper Box Packing');
  const [images, setImages] = useState([]);
  
  // Customization Tags
  const [customisationOptions, setCustomisationOptions] = useState(['With Name Engraving']);
  const [newOptionInput, setNewOptionInput] = useState('');

  // Variants Tags
  const [variants, setVariants] = useState(['Standard']);
  const [newVariantInput, setNewVariantInput] = useState('');

  // Toggles
  const [isBestseller, setIsBestseller] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isInStock, setIsInStock] = useState(true);
  const [bulkAvailable, setBulkAvailable] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        const cats = await fetchCategories();
        setCategories(cats);

        if (isEditMode) {
          const prod = await fetchProductById(id);
          if (prod) {
            setName(prod.name || '');
            setCategoryId(prod.category_id || cats[0]?.id || '');
            setPrice(prod.price || '');
            setMrp(prod.mrp || '');
            setDescription(prod.description || '');
            setPackaging(prod.packaging || 'Standard Packaging');
            setImages(prod.images || []);
            setCustomisationOptions(prod.customisation_options || []);
            setVariants(prod.variants || []);
            setIsBestseller(Boolean(prod.is_bestseller));
            setIsFeatured(Boolean(prod.is_featured));
            setIsInStock(Boolean(prod.is_in_stock));
            setBulkAvailable(Boolean(prod.bulk_available));
          }
        }
      } catch (err) {
        console.error('Error loading product editor:', err);
        setError('Failed to load product data.');
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [id, isEditMode]);

  const handleAddOption = () => {
    if (newOptionInput.trim()) {
      setCustomisationOptions([...customisationOptions, newOptionInput.trim()]);
      setNewOptionInput('');
    }
  };

  const handleRemoveOption = (idx) => {
    setCustomisationOptions(customisationOptions.filter((_, i) => i !== idx));
  };

  const handleAddVariant = () => {
    if (newVariantInput.trim()) {
      setVariants([...variants, newVariantInput.trim()]);
      setNewVariantInput('');
    }
  };

  const handleRemoveVariant = (idx) => {
    setVariants(variants.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    if (!name.trim() || !categoryId || !price) {
      setError('Name, category, and selling price are required.');
      setSaving(false);
      return;
    }

    const payload = {
      name: name.trim(),
      category_id: categoryId,
      price: Number(price),
      mrp: mrp ? Number(mrp) : Number(price) * 1.3,
      description: description.trim(),
      packaging: packaging.trim(),
      images,
      customisation_options: customisationOptions,
      variants,
      is_bestseller: isBestseller ? 1 : 0,
      is_featured: isFeatured ? 1 : 0,
      is_in_stock: isInStock ? 1 : 0,
      bulk_available: bulkAvailable ? 1 : 0,
    };

    try {
      if (isEditMode) {
        await updateProduct(id, payload);
        setSuccess('Product successfully updated in Turso database!');
      } else {
        await createProduct(payload);
        setSuccess('New bespoke product successfully published!');
        setTimeout(() => navigate('/products'), 1000);
      }
    } catch (err) {
      console.error('Save product error:', err);
      setError(err.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-xs text-gray-500">Loading product editor...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8 pb-12">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/products"
            className="p-2 bg-white rounded-xl border border-gray-200 hover:border-gold-500 text-gray-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="font-serif text-2xl font-bold text-gray-900">
              {isEditMode ? `Edit Product: ${name}` : 'Add New Bespoke Product'}
            </h1>
            <p className="text-xs text-gray-500">
              {isEditMode ? `Editing product ID: ${id}` : 'Create a new catalog item with ImageKit media and Turso sync'}
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 bg-burgundy-700 hover:bg-burgundy-800 text-gold-100 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm transition-all"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save Product'}</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-green-50 text-green-800 p-4 rounded-xl border border-green-200 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{success}</span>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Left Column (8 cols) */}
        <div className="md:col-span-8 space-y-6">
          
          {/* Card: Basic Info */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="font-serif font-bold text-sm text-burgundy-950 uppercase tracking-wider">
              Product Information
            </h3>

            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">Product Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Gold Zari Royal Metal Pen"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-canvas px-3.5 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-burgundy-700"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Category *</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full bg-canvas px-3.5 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-burgundy-700 font-medium"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Packaging Description</label>
                <input
                  type="text"
                  placeholder="e.g. Deluxe Velvet Gift Box"
                  value={packaging}
                  onChange={(e) => setPackaging(e.target.value)}
                  className="w-full bg-canvas px-3.5 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-burgundy-700"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">Detailed Description</label>
              <textarea
                rows="4"
                placeholder="Describe materials, precision laser etching specs, and unique selling points..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-canvas px-3.5 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-burgundy-700"
              />
            </div>
          </div>

          {/* Card: Media (ImageKit) */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <ImageUploader images={images} onChange={setImages} />
          </div>

          {/* Card: Customisation & Variants */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
            
            {/* Customisation Tags */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-burgundy-950 block">
                Customisation Capabilities
              </label>
              <div className="flex flex-wrap gap-2">
                {customisationOptions.map((opt, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 bg-gold-100 text-burgundy-950 text-xs font-semibold px-3 py-1 rounded-lg border border-gold-300"
                  >
                    <span>{opt}</span>
                    <button type="button" onClick={() => handleRemoveOption(idx)} className="hover:text-red-600">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="e.g. Name Engraving / Custom Logo / Photo Print"
                  value={newOptionInput}
                  onChange={(e) => setNewOptionInput(e.target.value)}
                  className="flex-1 bg-canvas px-3 py-1.5 text-xs rounded-lg border border-gray-200 focus:ring-1 focus:ring-burgundy-700"
                />
                <button
                  type="button"
                  onClick={handleAddOption}
                  className="bg-gray-800 hover:bg-gray-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg"
                >
                  + Add Option
                </button>
              </div>
            </div>

            {/* Variants Tags */}
            <div className="space-y-3 pt-4 border-t border-gray-100">
              <label className="text-xs font-bold uppercase tracking-wider text-burgundy-950 block">
                Variants (Colors / Materials / Sizes)
              </label>
              <div className="flex flex-wrap gap-2">
                {variants.map((v, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 bg-canvas text-gray-800 text-xs font-semibold px-3 py-1 rounded-lg border border-gray-200"
                  >
                    <span>{v}</span>
                    <button type="button" onClick={() => handleRemoveVariant(idx)} className="hover:text-red-600">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="e.g. Matte Black / Tan Leather / Size M"
                  value={newVariantInput}
                  onChange={(e) => setNewVariantInput(e.target.value)}
                  className="flex-1 bg-canvas px-3 py-1.5 text-xs rounded-lg border border-gray-200 focus:ring-1 focus:ring-burgundy-700"
                />
                <button
                  type="button"
                  onClick={handleAddVariant}
                  className="bg-gray-800 hover:bg-gray-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg"
                >
                  + Add Variant
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* Right Column (4 cols) */}
        <div className="md:col-span-4 space-y-6">
          
          {/* Card: Pricing */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="font-serif font-bold text-sm text-burgundy-950 uppercase tracking-wider">
              Pricing (INR)
            </h3>

            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">Selling Price (₹) *</label>
              <input
                type="number"
                required
                min="0"
                placeholder="250"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-canvas px-3.5 py-2 text-base font-bold text-burgundy-900 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-burgundy-700"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">MRP Reference (₹)</label>
              <input
                type="number"
                min="0"
                placeholder="399"
                value={mrp}
                onChange={(e) => setMrp(e.target.value)}
                className="w-full bg-canvas px-3.5 py-2 text-xs text-gray-500 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-burgundy-700"
              />
            </div>
          </div>

          {/* Card: Visibility & Toggles */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="font-serif font-bold text-sm text-burgundy-950 uppercase tracking-wider">
              Visibility & Badges
            </h3>

            <label className="flex items-center justify-between p-2 rounded-xl hover:bg-canvas cursor-pointer">
              <div>
                <span className="text-xs font-bold text-gray-800 block">Best Seller Badge</span>
                <span className="text-[10px] text-gray-400">Featured in Most Cherished row</span>
              </div>
              <input
                type="checkbox"
                checked={isBestseller}
                onChange={(e) => setIsBestseller(e.target.checked)}
                className="w-4 h-4 text-burgundy-700 rounded focus:ring-burgundy-700"
              />
            </label>

            <label className="flex items-center justify-between p-2 rounded-xl hover:bg-canvas cursor-pointer border-t border-gray-100">
              <div>
                <span className="text-xs font-bold text-gray-800 block">In Stock Status</span>
                <span className="text-[10px] text-gray-400">Available for customer orders</span>
              </div>
              <input
                type="checkbox"
                checked={isInStock}
                onChange={(e) => setIsInStock(e.target.checked)}
                className="w-4 h-4 text-burgundy-700 rounded focus:ring-burgundy-700"
              />
            </label>

            <label className="flex items-center justify-between p-2 rounded-xl hover:bg-canvas cursor-pointer border-t border-gray-100">
              <div>
                <span className="text-xs font-bold text-gray-800 block">Bulk Quantity Option</span>
                <span className="text-[10px] text-gray-400">Shows corporate quote button</span>
              </div>
              <input
                type="checkbox"
                checked={bulkAvailable}
                onChange={(e) => setBulkAvailable(e.target.checked)}
                className="w-4 h-4 text-burgundy-700 rounded focus:ring-burgundy-700"
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 bg-burgundy-700 hover:bg-burgundy-800 text-gold-100 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm transition-all"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save & Publish Product'}</span>
          </button>

        </div>

      </div>

    </form>
  );
}
