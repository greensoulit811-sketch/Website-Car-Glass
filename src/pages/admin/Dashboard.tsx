import { useOrders, useProducts } from '@/hooks/useDatabase';
import { Package, ShoppingCart, DollarSign, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

const Dashboard = () => {
  const { data: orders = [] } = useOrders();
  const { data: products = [] } = useProducts();
  const [appointments, setAppointments] = useState<any[]>([]);

  useEffect(() => {
    supabase.from('checkout_leads').select('*').eq('status', 'appointment').then(({data}) => {
      if (data) setAppointments(data);
    });
  }, []);

  const totalApptRevenue = appointments.filter(a => a.contacted).reduce((s, a) => s + Number(a.cart_total || 0), 0);
  const totalOrderRevenue = orders.reduce((s, o) => s + Number(o.total), 0);
  const totalRevenue = totalOrderRevenue + totalApptRevenue;

  const pendingOrders = orders.filter(o => o.status === 'pending').length + appointments.filter(a => !a.contacted).length;
  const deliveredOrders = orders.filter(o => o.status === 'delivered').length + appointments.filter(a => a.contacted).length;
  const totalCount = orders.length + appointments.length;

  const stats = [
    { label: 'Total Revenue', value: `RM ${totalRevenue.toFixed(2)}`, icon: DollarSign, change: `${totalCount} orders & appts` },
    { label: 'Total Orders & Appts', value: totalCount, icon: ShoppingCart, change: `${pendingOrders} pending` },
    { label: 'Products', value: products.length, icon: Package, change: `${products.filter(p => p.is_active).length} active` },
    { label: 'Completed/Delivered', value: deliveredOrders, icon: Clock, change: `${Math.round((deliveredOrders / (totalCount || 1)) * 100)}% rate` },
  ];

  // Build revenue by status
  const statusData = [
    { name: 'Pending', value: orders.filter(o => o.status === 'pending').length + appointments.filter(a => !a.contacted).length },
    { name: 'Confirmed', value: orders.filter(o => o.status === 'confirmed').length },
    { name: 'Shipped', value: orders.filter(o => o.status === 'shipped').length },
    { name: 'Delivered/Completed', value: orders.filter(o => o.status === 'delivered').length + appointments.filter(a => a.contacted).length },
    { name: 'Cancelled', value: orders.filter(o => o.status === 'cancelled').length },
  ].filter(d => d.value > 0);

  // Category breakdown from products
  const catMap = new Map<string, number>();
  products.forEach(p => catMap.set(p.category, (catMap.get(p.category) || 0) + 1));
  const categoryData = Array.from(catMap.entries()).map(([name, value]) => ({ name, value }));

  const COLORS = ['hsl(217, 91%, 56%)', 'hsl(210, 100%, 45%)', 'hsl(0, 80%, 56%)', 'hsl(45, 100%, 50%)', 'hsl(160, 70%, 40%)'];
  const tooltipStyle = { background: '#fff', border: '1px solid hsl(220, 13%, 89%)', borderRadius: 8, fontFamily: 'Inter', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' };
  const gridStroke = 'hsl(220, 13%, 91%)';
  const axisStroke = 'hsl(220, 10%, 60%)';

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700', confirmed: 'bg-blue-100 text-blue-700',
    shipped: 'bg-purple-100 text-purple-700', delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
    completed: 'bg-green-100 text-green-700'
  };

  const combinedRecent = [
    ...orders.map(o => ({
      id: o.id,
      number: o.order_number,
      customer: o.customer_name,
      total: Number(o.total),
      status: o.status,
      date: new Date(o.created_at)
    })),
    ...appointments.map(a => ({
      id: a.id,
      number: 'APPT-' + a.id.substring(0, 4).toUpperCase(),
      customer: a.customer_name,
      total: Number(a.cart_total || 0),
      status: a.contacted ? 'completed' : 'pending',
      date: new Date(a.created_at)
    }))
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  // Revenue per order for chart
  const revenueByOrder = combinedRecent.slice().reverse().slice(0, 10).map((o, i) => ({
    name: o.number || `#${i + 1}`,
    revenue: o.total,
  }));

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold uppercase tracking-wider text-foreground">Dashboard</h1>
        <p className="font-body text-sm text-muted-foreground mt-1">Welcome back to SJ Tinted Shop admin</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(stat => (
          <div key={stat.label} className="bg-card border border-border p-6 rounded-lg hover:border-primary/30 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <stat.icon className="w-5 h-5 text-primary" />
              <span className="font-body text-xs text-primary font-semibold">{stat.change}</span>
            </div>
            <p className="font-heading text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="font-body text-xs text-muted-foreground mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mb-8">
        <div className="lg:col-span-2 bg-card border border-border p-6 rounded-lg">
          <h3 className="font-heading text-lg font-bold uppercase tracking-wider mb-4 text-foreground">Revenue by Order & Appt</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={revenueByOrder}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
              <XAxis dataKey="name" stroke={axisStroke} fontSize={12} />
              <YAxis stroke={axisStroke} fontSize={12} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="revenue" fill="hsl(217, 91%, 56%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border border-border p-6 rounded-lg">
          <h3 className="font-heading text-lg font-bold uppercase tracking-wider mb-4 text-foreground">Products by Category</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-card border border-border p-6 rounded-lg">
          <h3 className="font-heading text-lg font-bold uppercase tracking-wider mb-4 text-foreground">Order & Appt Status</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={statusData}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
              <XAxis dataKey="name" stroke={axisStroke} fontSize={12} />
              <YAxis stroke={axisStroke} fontSize={12} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="value" fill="hsl(217, 91%, 56%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border border-border p-6 rounded-lg">
          <h3 className="font-heading text-lg font-bold uppercase tracking-wider mb-4 text-foreground">Recent Orders & Appts</h3>
          <div className="space-y-3">
            {combinedRecent.slice(0, 5).map(order => (
              <div key={order.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <p className="font-body text-sm font-semibold text-foreground">{order.number}</p>
                  <p className="font-body text-xs text-muted-foreground">{order.customer}</p>
                </div>
                <div className="text-right">
                  <p className="font-body text-sm font-bold text-primary">RM {order.total.toFixed(2)}</p>
                  <span className={`inline-block px-2 py-0.5 text-xs font-body font-semibold rounded-full uppercase ${statusColors[order.status] || ''}`}>{order.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
