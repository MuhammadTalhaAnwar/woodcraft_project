import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Plus, Edit2, Trash2 } from 'lucide-react';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', address: '' });
  const [editingId, setEditingId] = useState(null);

  const fetchCustomers = async () => {
    try {
      const { data } = await api.get('/customers');
      setCustomers(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/customers/${editingId}`, formData);
      } else {
        await api.post('/customers', formData);
      }
      setIsModalOpen(false);
      setFormData({ name: '', phone: '', address: '' });
      setEditingId(null);
      fetchCustomers();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (customer) => {
    setFormData({ name: customer.name, phone: customer.phone, address: customer.address });
    setEditingId(customer._id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await api.delete(`/customers/${id}`);
        fetchCustomers();
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-text">Customers</h1>
        <button 
          onClick={() => { setFormData({ name: '', phone: '', address: '' }); setEditingId(null); setIsModalOpen(true); }}
          className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          <span>Add Customer</span>
        </button>
      </div>

      <div className="bg-surface rounded-2xl shadow-sm border border-border overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-background border-b border-border">
              <th className="p-4 font-semibold text-sm text-text/70">Name</th>
              <th className="p-4 font-semibold text-sm text-text/70">Phone</th>
              <th className="p-4 font-semibold text-sm text-text/70">Address</th>
              <th className="p-4 font-semibold text-sm text-text/70 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer._id} className="border-b border-border hover:bg-background/50 transition-colors">
                <td className="p-4">{customer.name}</td>
                <td className="p-4">{customer.phone}</td>
                <td className="p-4">{customer.address}</td>
                <td className="p-4 flex justify-end gap-3">
                  <button onClick={() => handleEdit(customer)} className="text-accent hover:text-accent/80 p-2 rounded-lg hover:bg-accent/10">
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => handleDelete(customer._id)} className="text-danger hover:text-danger/80 p-2 rounded-lg hover:bg-danger/10">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr>
                <td colSpan="4" className="p-8 text-center text-text/50">No customers found. Add one to get started.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-in fade-in">
          <div className="bg-surface p-8 rounded-2xl w-full max-w-md shadow-2xl animate-in zoom-in-95">
            <h2 className="text-xl font-bold mb-6">{editingId ? 'Edit Customer' : 'Add New Customer'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input 
                  type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full p-3 border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input 
                  type="text" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
                  className="w-full p-3 border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Address</label>
                <input 
                  type="text" required value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})}
                  className="w-full p-3 border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
              <div className="flex gap-4 mt-8">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 p-3 rounded-xl border border-border hover:bg-background">Cancel</button>
                <button type="submit" className="flex-1 p-3 rounded-xl bg-primary text-white hover:bg-primary/90">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
