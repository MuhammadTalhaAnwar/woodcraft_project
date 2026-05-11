import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { TrendingUp, Package, Users, ClipboardList } from 'lucide-react';

const COLORS = ['#10B981', '#3B82F6', '#16A34A', '#DC2626', '#1F1F1F'];

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await api.get('/analytics');
        setData(response.data);
      } catch (error) {
        console.error('Failed to fetch analytics', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center gap-3 text-text/50">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <span className="text-sm">Loading dashboard...</span>
      </div>
    </div>
  );

  if (!data) return (
    <div className="flex items-center justify-center h-64">
      <div className="bg-danger/10 text-danger px-6 py-4 rounded-xl text-sm">
        Could not load dashboard data. Make sure the server is running.
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        <StatCard icon={<ClipboardList />} title="Total Orders" value={data.totalOrders} color="text-primary" />
        <StatCard icon={<TrendingUp />} title="Pending Orders" value={data.pendingOrders} color="text-accent" />
        <StatCard icon={<Package />} title="Avg Completion" value={`${data.avgCompletionDays || 0} Days`} color="text-primary" />
        <StatCard icon={<Package />} title="Revenue" value={`PKR ${data.revenueVsExpenses[0].amount}`} color="text-success" />
        <StatCard icon={<Users />} title="Expenses" value={`PKR ${data.revenueVsExpenses[1].amount}`} color="text-danger" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface p-6 rounded-2xl shadow-sm border border-border">
          <h3 className="text-lg font-semibold mb-6">Revenue vs Expenses</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.revenueVsExpenses}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Legend />
                <Bar dataKey="amount" fill="#10B981" radius={[4, 4, 0, 0]} maxBarSize={60} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-surface p-6 rounded-2xl shadow-sm border border-border">
          <h3 className="text-lg font-semibold mb-6">Most Used Materials</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.mostUsedMaterials}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="quantityUsed"
                  nameKey="name"
                  label
                >
                  {data.mostUsedMaterials.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-surface p-6 rounded-2xl shadow-sm border border-border lg:col-span-2">
          <h3 className="text-lg font-semibold mb-6">Employee Productivity (Jobs Completed)</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.employeeProductivity} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Legend />
                <Bar dataKey="jobsCompleted" fill="#3B82F6" radius={[0, 4, 4, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value, color }) => (
  <div className="bg-surface p-6 rounded-2xl shadow-sm border border-border flex items-center gap-4 hover:shadow-md transition-shadow">
    <div className={`p-4 rounded-xl bg-background ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-text/60 font-medium">{title}</p>
      <h4 className="text-2xl font-bold text-text mt-1">{value}</h4>
    </div>
  </div>
);

export default Dashboard;
