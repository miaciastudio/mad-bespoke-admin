import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  FolderTree,
  MessageSquareQuote,
  Settings as SettingsIcon,
  ExternalLink,
  Sparkles
} from 'lucide-react';

export default function AdminLayout() {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard className="w-4 h-4" /> },
    { name: 'All Products', path: '/products', icon: <Package className="w-4 h-4" /> },
    { name: 'Add Product', path: '/products/new', icon: <PlusCircle className="w-4 h-4" /> },
    { name: 'Categories', path: '/categories', icon: <FolderTree className="w-4 h-4" /> },
    { name: 'WhatsApp Enquiries', path: '/enquiries', icon: <MessageSquareQuote className="w-4 h-4" /> },
    { name: 'Settings & Cloud', path: '/settings', icon: <SettingsIcon className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen flex bg-canvas">
      
      {/* Dark Luxury Sidebar */}
      <aside className="w-64 bg-canvas-sidebar text-gold-100 flex flex-col justify-between shrink-0 border-r-2 border-gold-500/40">
        <div>
          
          {/* Brand header */}
          <div className="p-6 border-b border-burgundy-900/60 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gold-500 bg-canvas-card">
              <img src="/logo.jpg" alt="" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="font-serif font-bold text-lg tracking-wide text-gold-200">
                MAD BESPOKE
              </h1>
              <span className="text-[10px] text-gold-400 font-semibold tracking-widest uppercase">
                Admin Suite V1
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path) && item.path !== '/products');
              const isExact = location.pathname === item.path;

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                    (item.path === '/' ? isExact : isActive)
                      ? 'bg-burgundy-700 text-gold-100 shadow-md border-l-4 border-gold-400'
                      : 'text-gold-200/70 hover:bg-burgundy-900/50 hover:text-gold-100'
                  }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

        </div>

        {/* Bottom Quick Link */}
        <div className="p-4 border-t border-burgundy-900/60 space-y-2">
          <a
            href="http://localhost:5173"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-burgundy-800 hover:bg-gold-500 hover:text-burgundy-950 text-gold-200 text-xs font-semibold py-2.5 rounded-xl transition-all duration-200"
          >
            <span>Open Live Store</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <p className="text-[10px] text-center text-gold-400/60">
            Turso LibSQL • ImageKit CDN
          </p>
        </div>
      </aside>

      {/* Main Content Body */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <header className="bg-white border-b border-canvas-subtle py-4 px-8 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-gold-600" />
            <span className="text-xs font-semibold uppercase tracking-wider text-burgundy-900">
              Mad Bespoke Master Catalog Management
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            <span>Database: Connected</span>
          </div>
        </header>

        <main className="p-8">
          <Outlet />
        </main>
      </div>

    </div>
  );
}
