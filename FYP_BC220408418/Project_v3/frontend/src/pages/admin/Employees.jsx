import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Plus, Trash2 } from 'lucide-react';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', hourlyRate: 0 });

  const fetchEmployees = async () => {
    try {
      const { data } = await api.get('/employees');
      setEmployees(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/employees', formData);
      setIsModalOpen(false);
      setFormData({ name: '', email: '', password: '', hourlyRate: 0 });
      fetchEmployees();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Error adding employee');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await api.delete(`/employees/${id}`);
        fetchEmployees();
      } catch (error) {
        console.error(error);
        alert('Error deleting employee');
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-text">Employees</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-xl flex items-center gap-2"
        >
          <Plus size={20} />
          <span>Add Employee</span>
        </button>
      </div>

      <div className="bg-surface rounded-2xl shadow-sm border border-border overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-background border-b border-border">
              <th className="p-4 font-semibold text-sm text-text/70">Name</th>
              <th className="p-4 font-semibold text-sm text-text/70">Email</th>
              <th className="p-4 font-semibold text-sm text-text/70">Hourly Rate</th>
              <th className="p-4 font-semibold text-sm text-text/70">Joined Date</th>
              <th className="p-4 font-semibold text-sm text-text/70 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp._id} className="border-b border-border hover:bg-background/50">
                <td className="p-4 font-medium">{emp.name}</td>
                <td className="p-4 text-text/70">{emp.email}</td>
                <td className="p-4">PKR {emp.hourlyRate}/hr</td>
                <td className="p-4 text-text/70">{new Date(emp.createdAt).toLocaleDateString()}</td>
                <td className="p-4 flex justify-end">
                  <button 
                    onClick={() => handleDelete(emp._id)}
                    className="p-2 text-danger hover:bg-danger/10 rounded-lg transition-colors"
                    title="Delete Employee"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-surface p-8 rounded-2xl w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold mb-6">Register Employee</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-3 border border-border rounded-xl" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full p-3 border border-border rounded-xl" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <input required type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full p-3 border border-border rounded-xl" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Hourly Rate (PKR)</label>
                <input required type="number" value={formData.hourlyRate} onChange={e => setFormData({...formData, hourlyRate: Number(e.target.value)})} className="w-full p-3 border border-border rounded-xl" />
              </div>
              <div className="flex gap-4 mt-8">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 p-3 rounded-xl border border-border hover:bg-background">Cancel</button>
                <button type="submit" className="flex-1 p-3 rounded-xl bg-primary text-white hover:bg-primary/90">Register</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees;
