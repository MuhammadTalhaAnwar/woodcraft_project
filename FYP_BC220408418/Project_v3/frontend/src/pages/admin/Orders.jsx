import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Plus } from 'lucide-react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [employees, setEmployees] = useState([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    customer: '', type: 'Furniture', materials: [], employees: []
  });

  const [selectedMaterial, setSelectedMaterial] = useState('');
  const [materialQty, setMaterialQty] = useState(1);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [hoursWorked, setHoursWorked] = useState(0);

  const fetchData = async () => {
    try {
      const [ordRes, custRes, matRes, empRes] = await Promise.all([
        api.get('/orders'),
        api.get('/customers'),
        api.get('/materials'),
        api.get('/employees')
      ]);
      setOrders(ordRes.data);
      setCustomers(custRes.data);
      setMaterials(matRes.data);
      setEmployees(empRes.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddMaterial = () => {
    if (!selectedMaterial || materialQty <= 0) return;
    if (formData.materials.some((m) => m.materialId === selectedMaterial)) {
      alert('This material is already added.');
      return;
    }
    setFormData(prev => ({
      ...prev,
      materials: [...prev.materials, { materialId: selectedMaterial, quantity: materialQty }]
    }));
    setSelectedMaterial('');
    setMaterialQty(1);
  };

  const handleAddEmployee = () => {
    if (!selectedEmployee || hoursWorked < 0) return;
    if (formData.employees.some((e) => e.employeeId === selectedEmployee)) {
      alert('This employee is already assigned.');
      return;
    }
    const emp = employees.find(e => e._id === selectedEmployee);
    if (!emp) return;
    
    setFormData(prev => ({
      ...prev,
      employees: [...prev.employees, { employeeId: selectedEmployee, hoursWorked, hourlyRate: emp.hourlyRate }]
    }));
    setSelectedEmployee('');
    setHoursWorked(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/orders', formData);
      setIsModalOpen(false);
      setFormData({ customer: '', type: 'Furniture', materials: [], employees: [] });
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Error creating order');
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/orders/${id}/status`, { status });
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const statusColors = {
    'Pending': 'bg-accent/20 text-accent',
    'In Progress': 'bg-blue-500/20 text-blue-500',
    'Completed': 'bg-success/20 text-success',
    'Delivered': 'bg-text/20 text-text',
    'Cancelled': 'bg-danger/20 text-danger'
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-text">Orders</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-xl flex items-center gap-2"
        >
          <Plus size={20} />
          <span>Create Order</span>
        </button>
      </div>

      <div className="bg-surface rounded-2xl shadow-sm border border-border overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-background border-b border-border">
              <th className="p-4 font-semibold text-sm text-text/70">Customer</th>
              <th className="p-4 font-semibold text-sm text-text/70">Type</th>
              <th className="p-4 font-semibold text-sm text-text/70">Cost (Mat + Lab)</th>
              <th className="p-4 font-semibold text-sm text-text/70">Status</th>
              <th className="p-4 font-semibold text-sm text-text/70 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-b border-border hover:bg-background/50">
                <td className="p-4 font-medium">{order.customer?.name}</td>
                <td className="p-4">{order.type}</td>
                <td className="p-4 font-medium">
                  PKR {order.totalCost} <span className="text-xs text-text/50 font-normal">(PKR {order.materialsCost} + PKR {order.laborCost})</span>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-md text-xs font-medium ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
                </td>
                <td className="p-4 flex justify-end gap-2">
                  <select 
                    value={order.status} 
                    onChange={(e) => updateStatus(order._id, e.target.value)}
                    className="p-1 border border-border rounded text-sm bg-surface outline-none"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-surface p-8 rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-6">Create New Order</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Customer</label>
                  <select required value={formData.customer} onChange={e => setFormData({...formData, customer: e.target.value})} className="w-full p-3 border border-border rounded-xl">
                    <option value="">Select Customer</option>
                    {customers.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <select required value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full p-3 border border-border rounded-xl">
                    <option value="Furniture">Furniture</option>
                    <option value="Repair">Repair</option>
                    <option value="Custom Design">Custom Design</option>
                  </select>
                </div>
              </div>

              {/* Materials Section */}
              <div className="border border-border p-4 rounded-xl">
                <h3 className="font-semibold mb-2 text-sm text-text/70">Assign Materials</h3>
                <div className="flex gap-2 mb-2">
                  <select value={selectedMaterial} onChange={e => setSelectedMaterial(e.target.value)} className="flex-1 p-2 border border-border rounded-lg">
                    <option value="">Select Material</option>
                    {materials.filter(m => m.quantity > 0).map(m => <option key={m._id} value={m._id}>{m.name} ({m.quantity} {m.unit} left)</option>)}
                  </select>
                  <input type="number" min="1" value={materialQty} onChange={e => setMaterialQty(Number(e.target.value))} className="w-24 p-2 border border-border rounded-lg" placeholder="Qty" />
                  <button type="button" onClick={handleAddMaterial} className="bg-accent/10 text-accent px-4 rounded-lg font-medium">Add</button>
                </div>
                <div className="text-sm">
                  {formData.materials.map((m, i) => {
                    const mat = materials.find(x => x._id === m.materialId);
                    return <div key={i} className="flex justify-between p-1 bg-background mb-1 rounded">{mat?.name} x {m.quantity}</div>
                  })}
                </div>
              </div>

              {/* Employees Section */}
              <div className="border border-border p-4 rounded-xl">
                <h3 className="font-semibold mb-2 text-sm text-text/70">Assign Labor</h3>
                <div className="flex gap-2 mb-2">
                  <select value={selectedEmployee} onChange={e => setSelectedEmployee(e.target.value)} className="flex-1 p-2 border border-border rounded-lg">
                    <option value="">Select Employee</option>
                    {employees.map(e => <option key={e._id} value={e._id}>{e.name} (PKR {e.hourlyRate}/hr)</option>)}
                  </select>
                  <input type="number" min="1" value={hoursWorked} onChange={e => setHoursWorked(Number(e.target.value))} className="w-24 p-2 border border-border rounded-lg" placeholder="Hours" />
                  <button type="button" onClick={handleAddEmployee} className="bg-accent/10 text-accent px-4 rounded-lg font-medium">Add</button>
                </div>
                <div className="text-sm">
                  {formData.employees.map((e, i) => {
                    const emp = employees.find(x => x._id === e.employeeId);
                    return <div key={i} className="flex justify-between p-1 bg-background mb-1 rounded">{emp?.name} - {e.hoursWorked} hrs</div>
                  })}
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-border">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 p-3 rounded-xl border border-border hover:bg-background">Cancel</button>
                <button type="submit" className="flex-1 p-3 rounded-xl bg-primary text-white hover:bg-primary/90">Create Order</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
