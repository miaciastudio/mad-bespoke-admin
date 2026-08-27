import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  FolderTree,
  MessageSquareQuote,
  Star,
  PlusCircle,
  TrendingUp,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { fetchStats } from '../services/adminApi';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    bestsellers: 0,
    totalCategories: 0,
    totalEnquiries: 0,
    newEnquiries: 0,
    convertedEnquiries: 0,
  });
  const [recentEnquiries, setRecentEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await fetchStats();
        if (data && data.stats) {
          setStats(data.stats);
          setRecentEnquiries(data.recentEnquiries || []);
        }
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const statCards = [
    {
      title: 'Total Catalog Products',
      value: stats.totalProducts,
      subtitle: 'Active in storefront',
      icon: <Package className="w-6 h-6 text-burgundy-700" />,
      link: '/products',
      bgColor: 'bg-white',
    },
    {
      title: 'Best Seller Creations',
      value: stats.bestsellers,
      subtitle: 'Highlighted items',
      icon: <Star className="w-6 h-6 text-gold-600" />,
      link: '/products?bestseller=1',
      bgColor: 'bg-white',
    },
    {
      title: 'Active Categories',
      value: stats.totalCategories,
      subtitle: 'Catalog segments',
      icon: <FolderTree className="w-6 h-6 text-burgundy-700" />,
      link: '/categories',
      bgColor: 'bg-white',
    },
    {
      title: 'WhatsApp Enquiries',
      value: stats.totalEnquiries,
      subtitle: `${stats.newEnquiries} new leads today`,
      icon: <MessageSquareQuote className="w-6 h-6 text-green-600" />,
      link: '/enquiries',
      bgColor: 'bg-white',
    },
  ];

  return (
    <div className="space-y-8">
      
      {/* Welcome Banner */}
      <div className="bg-canvas-sidebar text-gold-100 rounded-3xl p-8 border-2 border-gold-500 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-burgundy-800 text-gold-300 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Mad Bespoke Studio Manager
          </div>
          <h1 className="font-serif text-3xl font-bold text-gold-100">
            Welcome to Mad Bespoke Admin
          </h1>
          <p className="text-sm text-gold-300/80 max-w-xl leading-relaxed">
            Manage your dynamic product catalog, upload new photos via ImageKit, configure customisation tags, and monitor WhatsApp enquiries in real-time.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <Link
            to="/products/new"
            className="inline-flex items-center justify-center gap-2 bg-gold-500 hover:bg-gold-600 text-burgundy-950 font-bold px-6 py-3.5 rounded-xl text-xs uppercase tracking-wider shadow-sm transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Product</span>
          </Link>
          <Link
            to="/enquiries"
            className="inline-flex items-center justify-center gap-2 bg-burgundy-800 hover:bg-burgundy-700 text-gold-100 px-6 py-3.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all"
          >
            <MessageSquareQuote className="w-4 h-4 text-green-400" />
            <span>View Leads</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, i) => (
          <Link
            key={i}
            to={card.link}
            className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-gold-400 transition-all group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                {card.title}
              </span>
              <div className="p-2.5 rounded-xl bg-canvas">{card.icon}</div>
            </div>
            <div>
              <p className="font-serif text-3xl font-bold text-gray-900 group-hover:text-burgundy-700 transition-colors">
                {loading ? '...' : card.value}
              </p>
              <p className="text-xs text-gray-500 mt-1">{card.subtitle}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent WhatsApp Enquiries & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Recent Enquiries Table (8 Cols) */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-lg font-bold text-gray-900">
                Recent WhatsApp Order Enquiries
              </h2>
              <p className="text-xs text-gray-500">Customer enquiries tracked from product pages</p>
            </div>
            <Link to="/enquiries" className="text-xs font-semibold text-burgundy-700 hover:underline flex items-center gap-1">
              <span>View All</span> <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentEnquiries.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {recentEnquiries.map((enq) => (
                <div key={enq.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                  <div>
                    <strong className="text-gray-900 block font-semibold">{enq.product_name}</strong>
                    <span className="text-gray-500">{enq.customisation_note || 'Standard enquiry'}</span>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-2 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                      enq.status === 'new' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {enq.status}
                    </span>
                    <span className="text-[10px] text-gray-400 block mt-0.5">
                      {new Date(enq.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-gray-400">
              No recent enquiries logged yet. Customers clicking WhatsApp buttons on product pages will appear here.
            </div>
          )}
        </div>

        {/* Quick Management Shortcuts (4 Cols) */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <h2 className="font-serif text-lg font-bold text-gray-900">
            Quick Actions
          </h2>

          <div className="space-y-2">
            <Link
              to="/products/new"
              className="w-full flex items-center justify-between p-3 rounded-xl bg-canvas hover:bg-gold-100 text-xs font-semibold text-burgundy-950 transition-colors"
            >
              <span>+ Add New Product to Store</span>
              <ArrowRight className="w-4 h-4 text-gold-600" />
            </Link>

            <Link
              to="/products"
              className="w-full flex items-center justify-between p-3 rounded-xl bg-canvas hover:bg-gold-100 text-xs font-semibold text-burgundy-950 transition-colors"
            >
              <span>Manage Catalog Prices & Stock</span>
              <ArrowRight className="w-4 h-4 text-gold-600" />
            </Link>

            <Link
              to="/categories"
              className="w-full flex items-center justify-between p-3 rounded-xl bg-canvas hover:bg-gold-100 text-xs font-semibold text-burgundy-950 transition-colors"
            >
              <span>Edit Collections & Categories</span>
              <ArrowRight className="w-4 h-4 text-gold-600" />
            </Link>

            <Link
              to="/settings"
              className="w-full flex items-center justify-between p-3 rounded-xl bg-canvas hover:bg-gold-100 text-xs font-semibold text-burgundy-950 transition-colors"
            >
              <span>Update WhatsApp Number & Settings</span>
              <ArrowRight className="w-4 h-4 text-gold-600" />
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}
