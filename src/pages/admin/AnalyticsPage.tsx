import { useOrders } from '@/hooks/useDatabase';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const AnalyticsPage = () => {
  const { data: orders = [] } = useOrders();

  const totalRevenue = orders.reduce((s, o) => s + Number(o.total), 0);
  const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

  // Group orders by date
  const dateMap = new Map<string, { revenue: number; count: number }>();
  orders.forEach(o => {
    const date = new Date(o.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const existing = dateMap.get(date) || { revenue: 0, count: 0 };
    existing.revenue += Number(o.total);
    existing.count += 1;
    dateMap.set(date, existing);
  });
  const revenueData = Array.from(dateMap.entries()).map(([date, d]) => ({ date, revenue: d.revenue, orders: d.count }));

  // Top products from order items
  const productMap = new Map<string, { sales: number; revenue: number }>();
  orders.forEach(o => {
    const items = (o.items as any[]) || [];
    items.forEach((item: any) => {
      const existing = productMap.get(item.productName) || { sales: 0, revenue: 0 };
      existing.sales += item.quantity;
      existing.revenue += item.price * item.quantity;
      productMap.set(item.productName, existing);
    });
  });
  const topProducts = Array.from(productMap.entries())
    .map(([name, d]) => ({ name, ...d }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  const tooltipStyle = { background: '#fff', border: '1px solid hsl(220, 13%, 89%)', borderRadius: 8, fontFamily: 'Inter', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' };
  const gridStroke = 'hsl(220, 13%, 91%)';
  const axisStroke = 'hsl(220, 10%, 60%)';

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold uppercase tracking-wider text-foreground">Analytics</h1>
        <p className="font-body text-sm text-muted-foreground mt-1">Real sales data from your database</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Revenue', value: `RM ${totalRevenue.toLocaleString()}` },
          { label: 'Avg Order Value', value: `RM ${avgOrderValue.toFixed(2)}` },
          { label: 'Total Orders', value: orders.length },
          { label: 'Delivered', value: orders.filter(o => o.status === 'delivered').length },
        ].map(kpi => (
          <div key={kpi.label} className="bg-card border border-border p-5 rounded-lg">
            <p className="font-body text-xs uppercase tracking-wider text-muted-foreground mb-1">{kpi.label}</p>
            <p className="font-heading text-2xl font-bold text-primary">{kpi.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border p-6 rounded-lg mb-4">
        <h3 className="font-heading text-lg font-bold uppercase tracking-wider mb-4 text-foreground">Revenue by Date</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={revenueData}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(217, 91%, 56%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(217, 91%, 56%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
            <XAxis dataKey="date" stroke={axisStroke} fontSize={12} />
            <YAxis stroke={axisStroke} fontSize={12} />
            <Tooltip contentStyle={tooltipStyle} />
            <Area type="monotone" dataKey="revenue" stroke="hsl(217, 91%, 56%)" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-card border border-border p-6 rounded-lg">
        <h3 className="font-heading text-lg font-bold uppercase tracking-wider mb-4 text-foreground">Top Products (by Revenue)</h3>
        <div className="space-y-3">
          {topProducts.length === 0 ? (
            <p className="text-muted-foreground font-body text-sm">No order data yet</p>
          ) : topProducts.map((p, i) => (
            <div key={p.name} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <div className="flex items-center gap-3">
                <span className="font-heading text-lg font-bold text-primary w-6">#{i + 1}</span>
                <div>
                  <p className="font-body text-sm font-semibold text-foreground">{p.name}</p>
                  <p className="font-body text-xs text-muted-foreground">{p.sales} sold</p>
                </div>
              </div>
              <span className="font-body text-sm font-bold text-primary">RM {p.revenue}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
