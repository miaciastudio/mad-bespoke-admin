import React, { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon,
  Save,
  CheckCircle2,
  Database,
  Cloud,
  Layers,
  Sparkles,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { fetchSettings, updateSettings } from '../services/adminApi';

export default function Settings() {
  const [settings, setSettings] = useState({
    whatsapp_number: '919730672323',
    instagram_handle: 'mad-bespoke',
    contact_phone: '+91 9730672323',
    contact_email: 'orders@madbespoke.in',
    contact_location: 'Mumbai, Maharashtra • Pan India Delivery',
    banner_announcement: '✨ Complimentary Laser Name Engraving on all curated sets this week • Pan-India Safe Delivery',
  });

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchSettings();
        if (data && Object.keys(data).length > 0) {
          setSettings((prev) => ({ ...prev, ...data }));
        }
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess('');
    try {
      await updateSettings(settings);
      setSuccess('Settings updated successfully!');
    } catch (err) {
      alert('Error updating settings: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">
          Store & Architecture Settings
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Configure WhatsApp routing, social media channels, and review Turso / ImageKit cloud connections.
        </p>
      </div>

      {success && (
        <div className="p-4 bg-green-50 text-green-800 text-xs rounded-xl border border-green-200 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{success}</span>
        </div>
      )}

      {/* Cloud Architecture Status Panel */}
      <div className="bg-canvas-sidebar text-gold-100 p-6 rounded-2xl border-2 border-gold-500 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-gold-400" />
          <h2 className="font-serif font-bold text-base text-gold-200">
            Cloudflare • Turso • ImageKit Architecture Sync
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          
          <div className="bg-burgundy-900/60 p-4 rounded-xl border border-gold-500/30 space-y-1">
            <div className="flex items-center gap-2 font-bold text-gold-200">
              <Database className="w-4 h-4 text-gold-400" />
              <span>Turso Database</span>
            </div>
            <p className="text-gray-300 text-[11px]">LibSQL Edge Engine</p>
            <span className="inline-block mt-2 bg-green-900/80 text-green-300 text-[10px] font-bold px-2 py-0.5 rounded">
              Active & Connected
            </span>
          </div>

          <div className="bg-burgundy-900/60 p-4 rounded-xl border border-gold-500/30 space-y-1">
            <div className="flex items-center gap-2 font-bold text-gold-200">
              <Cloud className="w-4 h-4 text-gold-400" />
              <span>ImageKit CDN</span>
            </div>
            <p className="text-gray-300 text-[11px]">Dynamic Media Optimizer</p>
            <span className="inline-block mt-2 bg-gold-900/80 text-gold-300 text-[10px] font-bold px-2 py-0.5 rounded">
              Direct API Upload Ready
            </span>
          </div>

          <div className="bg-burgundy-900/60 p-4 rounded-xl border border-gold-500/30 space-y-1">
            <div className="flex items-center gap-2 font-bold text-gold-200">
              <Layers className="w-4 h-4 text-gold-400" />
              <span>Cloudflare Edge</span>
            </div>
            <p className="text-gray-300 text-[11px]">High-Speed Caching & SSL</p>
            <span className="inline-block mt-2 bg-green-900/80 text-green-300 text-[10px] font-bold px-2 py-0.5 rounded">
              Zero Latency Edge
            </span>
          </div>

        </div>
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
        
        <h3 className="font-serif font-bold text-base text-gray-900 pb-2 border-b border-gray-100">
          Storefront Communication Channels
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">WhatsApp Order Number (without +) *</label>
            <input
              type="text"
              required
              value={settings.whatsapp_number}
              onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
              className="w-full bg-canvas p-2.5 text-xs rounded-xl border border-gray-200 font-mono focus:ring-2 focus:ring-burgundy-700"
            />
            <span className="text-[10px] text-gray-400 mt-1 block">Receives all 1-click WhatsApp customer enquiries</span>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">Instagram Profile Handle</label>
            <input
              type="text"
              value={settings.instagram_handle}
              onChange={(e) => setSettings({ ...settings, instagram_handle: e.target.value })}
              className="w-full bg-canvas p-2.5 text-xs rounded-xl border border-gray-200 focus:ring-2 focus:ring-burgundy-700"
            />
            <span className="text-[10px] text-gray-400 mt-1 block">e.g. mad-bespoke</span>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">Public Contact Email</label>
            <input
              type="email"
              value={settings.contact_email}
              onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
              className="w-full bg-canvas p-2.5 text-xs rounded-xl border border-gray-200 focus:ring-2 focus:ring-burgundy-700"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">Location & Shipping Label</label>
            <input
              type="text"
              value={settings.contact_location}
              onChange={(e) => setSettings({ ...settings, contact_location: e.target.value })}
              className="w-full bg-canvas p-2.5 text-xs rounded-xl border border-gray-200 focus:ring-2 focus:ring-burgundy-700"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-700 block mb-1">Top Announcement Banner Text</label>
          <textarea
            rows="2"
            value={settings.banner_announcement}
            onChange={(e) => setSettings({ ...settings, banner_announcement: e.target.value })}
            className="w-full bg-canvas p-2.5 text-xs rounded-xl border border-gray-200 focus:ring-2 focus:ring-burgundy-700"
          />
        </div>

        <div className="pt-4 border-t border-gray-100 flex items-center justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 bg-burgundy-700 hover:bg-burgundy-800 text-gold-100 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm transition-all"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>

      </form>

    </div>
  );
}
