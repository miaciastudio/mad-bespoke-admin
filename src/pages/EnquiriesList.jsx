import React, { useState, useEffect } from 'react';
import {
  MessageSquareQuote,
  Search,
  Filter,
  CheckCircle,
  Clock,
  Archive,
  ExternalLink,
  MessageCircle
} from 'lucide-react';
import { fetchEnquiries, updateEnquiryStatus } from '../services/adminApi';

export default function EnquiriesList() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await fetchEnquiries({ status: statusFilter });
        setEnquiries(data);
      } catch (err) {
        console.error('Error fetching enquiries:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [statusFilter]);

  const handleStatusChange = async (id, nextStatus) => {
    try {
      await updateEnquiryStatus(id, nextStatus);
      setEnquiries(enquiries.map((e) => (e.id === id ? { ...e, status: nextStatus } : e)));
    } catch (err) {
      alert('Error updating status: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">
            WhatsApp Order & Leads Tracker
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Logs every time a prospective client clicks "Enquire on WhatsApp" on the storefront
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-white border border-gray-200 rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-burgundy-700 font-semibold"
          >
            <option value="all">All Leads ({enquiries.length})</option>
            <option value="new">New Inquiries</option>
            <option value="contacted">Contacted</option>
            <option value="converted">Converted Orders</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-gray-500">Loading enquiries from database...</div>
        ) : enquiries.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-600">
              <thead className="bg-canvas border-b border-gray-200 font-bold uppercase tracking-wider text-[10px] text-burgundy-950">
                <tr>
                  <th className="py-3.5 px-4">Date & ID</th>
                  <th className="py-3.5 px-4">Product / Item</th>
                  <th className="py-3.5 px-4">Customer Info</th>
                  <th className="py-3.5 px-4">Customisation Notes</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {enquiries.map((enq) => (
                  <tr key={enq.id} className="hover:bg-canvas/40 transition-colors">
                    
                    <td className="py-3 px-4">
                      <strong className="text-gray-900 block font-mono text-[11px]">{enq.id}</strong>
                      <span className="text-[10px] text-gray-400">
                        {new Date(enq.created_at).toLocaleString()}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <strong className="text-gray-900 block font-serif text-sm">{enq.product_name}</strong>
                      <span className="text-[10px] text-gray-400">Qty: {enq.quantity || 1} pcs</span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-semibold text-gray-900 block">{enq.customer_name || 'Guest'}</span>
                      {enq.phone && <span className="text-[10px] text-gray-500 font-mono">{enq.phone}</span>}
                    </td>

                    <td className="py-3 px-4 max-w-xs">
                      <p className="text-xs text-gray-700 font-medium line-clamp-2">
                        {enq.customisation_note || '—'}
                      </p>
                    </td>

                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        enq.type === 'bulk_corporate' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {enq.type === 'bulk_corporate' ? 'Corporate' : 'Retail'}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <select
                        value={enq.status || 'new'}
                        onChange={(e) => handleStatusChange(enq.id, e.target.value)}
                        className={`text-[10px] font-bold uppercase py-1 px-2 rounded-lg border focus:outline-none ${
                          enq.status === 'converted'
                            ? 'bg-green-100 text-green-800 border-green-300'
                            : enq.status === 'contacted'
                            ? 'bg-amber-100 text-amber-800 border-amber-300'
                            : 'bg-red-100 text-red-800 border-red-300'
                        }`}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="converted">Converted</option>
                        <option value="archived">Archived</option>
                      </select>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <a
                        href={`https://wa.me/919730672323?text=${encodeURIComponent(`Hi! Follow-up on inquiry ${enq.id} for ${enq.product_name}`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-[10px] font-bold uppercase transition-colors"
                      >
                        <MessageCircle className="w-3 h-3" />
                        <span>Chat</span>
                      </a>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center space-y-3">
            <MessageSquareQuote className="w-10 h-10 text-gray-300 mx-auto" />
            <p className="text-sm font-semibold text-gray-700">No leads recorded yet</p>
            <p className="text-xs text-gray-400">Customer WhatsApp inquiries will be automatically recorded here.</p>
          </div>
        )}
      </div>

    </div>
  );
}
