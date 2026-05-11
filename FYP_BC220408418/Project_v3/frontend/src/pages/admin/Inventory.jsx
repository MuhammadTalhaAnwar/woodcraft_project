import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Plus, Edit2, Trash2, AlertTriangle } from 'lucide-react';

const Inventory = () => {
  const [materials, setMaterials] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ 
    name: '', category: '', quantity: 0, unit: '', pricePerUnit: 0, 
    lowStockThreshold: 10, supplierName: '', supplierContact: '' 
  });
  const [editingId, setEditingId] = useState(null);

  const fetchMaterials = async () => {
    try {
      const { data } = await api.get('/materials');
      setMaterials(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/materials/${editingId}`, formData);
      } else {
        await api.post('/materials', formData);
      }
      setIsModalOpen(false);
      setFormData({ name: '', category: '', quantity: 0, unit: '', pricePerUnit: 0, lowStockThreshold: 10, supplierName: '', supplierContact: '' });
      setEditingId(null);
      fetchMaterials();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (material) => {
    setFormData({ ...material });
    setEditingId(material._id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this material?')) {
      try {
        await api.delete(`/materials/${id}`);
        fetchMaterials();
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-text">Inventory</h1>
        <button 
          onClick={() => { 
            setFormData({ name: '', category: '', quantity: 0, unit: '', pricePerUnit: 0, lowStockThreshold: 10, supplierName: '', supplierContact: '' }); 
            setEditingId(null); setIsModalOpen(true); 
          }}
          className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-xl flex items-center gap-2"
        >
          <Plus size={20} />
          <span>Add Material</span>
        </button>
      </div>

      <div className="bg-surface rounded-2xl shadow-sm border border-border overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-background border-b border-border">
              <th className="p-4 font-semibold text-sm text-text/70">Name</th>
              <th className="p-4 font-semibold text-sm text-text/70">Category</th>
              <th className="p-4 font-semibold text-sm text-text/70">Stock</th>
              <th className="p-4 font-semibold text-sm text-text/70">Price/Unit</th>
              <th className="p-4 font-semibold text-sm text-text/70">Supplier</th>
              <th className="p-4 font-semibold text-sm text-text/70 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {materials.map((mat) => (
              <tr key={mat._id} className="border-b border-border hover:bg-background/50">
                <td className="p-4 font-medium flex items-center gap-2">
                  {mat.name}
                  {mat.quantity <= mat.lowStockThreshold && (
                    <AlertTriangle size={16} className="text-danger" title="Low Stock" />
                  )}
                </td>
                <td className="p-4">{mat.category}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-md text-xs font-medium ${mat.quantity <= mat.lowStockThreshold ? 'bg-danger/10 text-danger' : 'bg-success/10 text-success'}`}>
                    {mat.quantity} {mat.unit}
                  </span>
                </td>
                <td className="p-4">PKR {mat.pricePerUnit}</td>
                <td className="p-4 text-sm">{mat.supplierName}<br/><span className="text-text/50">{mat.supplierContact}</span></td>
                <td className="p-4 flex justify-end gap-3">
                  <button onClick={() => handleEdit(mat)} className="text-accent hover:bg-accent/10 p-2 rounded-lg"><Edit2 size={18} /></button>
                  <button onClick={() => handleDelete(mat._id)} className="text-danger hover:bg-danger/10 p-2 rounded-lg"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-surface p-8 rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-6">{editingId ? 'Edit Material' : 'Add Material'}</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-3 border border-border rounded-xl" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <input required type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full p-3 border border-border rounded-xl" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Unit (e.g. kg, boards)</label>
                <input required type="text" value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})} className="w-full p-3 border border-border rounded-xl" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Quantity</label>
                <input required type="number" value={formData.quantity} onChange={e => setFormData({...formData, quantity: Number(e.target.value)})} className="w-full p-3 border border-border rounded-xl" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Price per Unit (PKR)</label>
                <input required type="number" value={formData.pricePerUnit} onChange={e => setFormData({...formData, pricePerUnit: Number(e.target.value)})} className="w-full p-3 border border-border rounded-xl" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Low Stock Threshold</label>
                <input required type="number" value={formData.lowStockThreshold} onChange={e => setFormData({...formData, lowStockThreshold: Number(e.target.value)})} className="w-full p-3 border border-border rounded-xl" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Supplier Name</label>
                <input required type="text" value={formData.supplierName} onChange={e => setFormData({...formData, supplierName: e.target.value})} className="w-full p-3 border border-border rounded-xl" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Supplier Contact</label>
                <input required type="text" value={formData.supplierContact} onChange={e => setFormData({...formData, supplierContact: e.target.value})} className="w-full p-3 border border-border rounded-xl" />
              </div>
              
              <div className="col-span-2 flex gap-4 mt-4">
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

export default Inventory;
