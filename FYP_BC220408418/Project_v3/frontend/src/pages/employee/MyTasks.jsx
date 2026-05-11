import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { ClipboardList, Clock } from 'lucide-react';

const MyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const storedUser = JSON.parse(localStorage.getItem('woodcraft_user'));
  const userId = storedUser?._id;

  const fetchTasks = async () => {
    try {
      const { data } = await api.get('/employees/tasks');
      setTasks(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/orders/${id}/status`, { status });
      fetchTasks();
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
        <h1 className="text-2xl font-bold text-text">My Tasks</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task) => (
          <div key={task._id} className="bg-surface p-6 rounded-2xl shadow-sm border border-border flex flex-col h-full hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-primary/10 p-3 rounded-xl text-primary">
                <ClipboardList size={24} />
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[task.status]}`}>
                {task.status}
              </span>
            </div>
            
            <h3 className="text-lg font-bold mb-2">{task.type} Job</h3>
            
            <div className="text-sm text-text/70 mb-4 flex-1">
              <p className="mb-1"><span className="font-semibold text-text">Customer:</span> {task.customer?.name}</p>
              <p className="mb-1"><span className="font-semibold text-text">Address:</span> {task.customer?.address}</p>
              <p className="mb-1"><span className="font-semibold text-text">Phone:</span> {task.customer?.phone}</p>
              
              <div className="mt-4 flex items-center gap-2 text-accent bg-accent/10 px-3 py-2 rounded-lg inline-flex">
                <Clock size={16} />
                <span className="font-semibold text-accent text-sm">
                  Logged: {task.employees.find(e => (e.employeeId?.toString?.() ?? String(e.employeeId)) === userId)?.hoursWorked || 0} hrs
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-border">
              <label className="block text-sm font-semibold mb-2">Update Status</label>
              <select 
                value={task.status} 
                onChange={(e) => updateStatus(task._id, e.target.value)}
                className="w-full p-3 border border-border rounded-xl bg-background outline-none focus:ring-2 focus:ring-primary"
                disabled={task.status === 'Delivered' || task.status === 'Cancelled'}
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>
        ))}

        {tasks.length === 0 && (
          <div className="col-span-full p-12 text-center bg-surface border border-border rounded-2xl text-text/50">
            <ClipboardList size={48} className="mx-auto mb-4 text-text/30" />
            <h2 className="text-xl font-medium">No tasks assigned</h2>
            <p>You currently have no active jobs assigned to you.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTasks;
