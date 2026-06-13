import { useState, useMemo } from 'react';
import { useQuotations, useUpdateQuotation, useDeleteQuotation, type Quotation } from '@/hooks/useQuotations';
import { Search, Trash2, Eye, FileText, CheckCircle, Clock, X, Building2, Mail, Phone, MapPin, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  viewed: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const statusLabels: Record<string, string> = {
  pending: 'Pending',
  viewed: 'Viewed',
  completed: 'Quotation Sent',
  cancelled: 'Cancelled',
};

const statusFilters = ['all', 'pending', 'viewed', 'completed', 'cancelled'];

const QuotationsManager = () => {
  const { data: quotations = [], isLoading } = useQuotations();
  const updateQuotation = useUpdateQuotation();
  const deleteQuotation = useDeleteQuotation();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewingQuotation, setViewingQuotation] = useState<Quotation | null>(null);
  const [isEditingPrice, setIsEditingPrice] = useState(false);
  const [editedPrice, setEditedPrice] = useState('');

  const filtered = useMemo(() => {
    return quotations.filter(q => {
      if (statusFilter !== 'all' && q.status !== statusFilter) return false;
      if (search) {
        const query = search.toLowerCase();
        return (
          q.customer_name.toLowerCase().includes(query) ||
          q.company_name.toLowerCase().includes(query) ||
          q.customer_email.toLowerCase().includes(query) ||
          q.contact_number.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [quotations, search, statusFilter]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateQuotation.mutateAsync({ id, status: newStatus as any });
      toast.success(`Status updated to ${statusLabels[newStatus]}`);
      if (viewingQuotation) {
        setViewingQuotation({ ...viewingQuotation, status: newStatus as any });
      }
    } catch { toast.error('Failed to update status'); }
  };

  const handleUpdatePrice = async () => {
    if (!viewingQuotation) return;
    try {
      await updateQuotation.mutateAsync({ 
        id: viewingQuotation.id, 
        cart_total: Number(editedPrice) 
      });
      setViewingQuotation({ ...viewingQuotation, cart_total: Number(editedPrice) });
      setIsEditingPrice(false);
      toast.success('Price updated successfully');
    } catch { toast.error('Failed to update price'); }
  };

  const handleSendEmail = (quotation: Quotation) => {
    if (!quotation.customer_email) {
      toast.error('No email address found');
      return;
    }
    
    // Still copy to clipboard just in case
    navigator.clipboard.writeText(quotation.customer_email);
    toast.success('Email address copied!');
    
    const subject = encodeURIComponent(`Quotation: ${quotation.company_name}`);
    const body = encodeURIComponent(`Dear ${quotation.customer_name},\n\nWe have prepared your quotation. Please check the attachment.\n\nTotal: RM ${Number(quotation.cart_total).toFixed(2)}\n\nBest regards,\nBright Beam Team`);
    
    // Open directly in Gmail (Web)
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${quotation.customer_email}&su=${subject}&body=${body}`;
    window.open(gmailUrl, '_blank');
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this quotation request?')) return;
    try {
      await deleteQuotation.mutateAsync(id);
      toast.success('Quotation request deleted');
    } catch { toast.error('Failed to delete'); }
  };

  const handleView = (quotation: Quotation) => {
    setViewingQuotation(quotation);
    setEditedPrice(quotation.cart_total.toString());
    setIsEditingPrice(false);
    if (quotation.status === 'pending') {
      handleStatusChange(quotation.id, 'viewed');
    }
  };

  if (isLoading) return <div className="flex items-center justify-center min-h-[400px]"><p className="text-muted-foreground">Loading quotations...</p></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold uppercase tracking-wider text-foreground">Quotations</h1>
          <p className="font-body text-sm text-muted-foreground mt-1">Manage corporate quotation requests</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search by name, company, or email..." 
            value={search} 
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-2 border border-border bg-card rounded-md font-body text-sm text-foreground focus:outline-none focus:border-primary transition-colors" 
          />
        </div>
        <div className="flex gap-2 bg-card border border-border p-1 rounded-md overflow-x-auto">
          {statusFilters.map(s => (
            <button 
              key={s} 
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                statusFilter === s ? 'bg-primary text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {s === 'all' ? 'All' : statusLabels[s]}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="p-4 font-heading text-xs uppercase tracking-wider text-muted-foreground">Date</th>
                <th className="p-4 font-heading text-xs uppercase tracking-wider text-muted-foreground">Customer / Company</th>
                <th className="p-4 font-heading text-xs uppercase tracking-wider text-muted-foreground">Contact</th>
                <th className="p-4 font-heading text-xs uppercase tracking-wider text-muted-foreground text-center">Items</th>
                <th className="p-4 font-heading text-xs uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="p-4 font-heading text-xs uppercase tracking-wider text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border font-body text-sm">
              {filtered.map(q => (
                <tr key={q.id} className="hover:bg-secondary/50 transition-colors">
                  <td className="p-4 text-muted-foreground">
                    {new Date(q.created_at).toLocaleDateString('en-GB')}
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-foreground">{q.company_name}</div>
                    <div className="text-xs text-muted-foreground uppercase">{q.customer_name} ({q.company_reg_no})</div>
                  </td>
                  <td className="p-4">
                    <div>{q.customer_email}</div>
                    <div className="text-xs text-muted-foreground">{q.contact_number}</div>
                  </td>
                  <td className="p-4 text-center">
                    <span className="bg-secondary px-2.5 py-1 rounded-full text-xs font-bold">
                      {q.cart_items?.length || 0}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${statusColors[q.status]}`}>
                      {statusLabels[q.status]}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleView(q)} title="View Details">
                        <Eye className="w-4 h-4 text-muted-foreground" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleSendEmail(q)} title="Send Email">
                        <Mail className="w-4 h-4 text-blue-500" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleStatusChange(q.id, 'completed')} title="Mark Sent" disabled={q.status === 'completed'}>
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(q.id)} title="Delete">
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-muted-foreground italic">
                    No quotation requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {viewingQuotation && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-card border border-border w-full max-w-2xl rounded-xl shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-border flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-primary" />
                <h2 className="font-heading text-xl font-bold uppercase tracking-wider">Quotation Request</h2>
              </div>
              <button onClick={() => setViewingQuotation(null)} className="p-2 hover:bg-secondary rounded-full transition-colors">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto font-body">
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-2"><Building2 className="w-3 h-3" /> Company Information</h3>
                    <div className="bg-secondary/40 p-4 rounded-lg space-y-1">
                      <p className="text-lg font-bold text-foreground">{viewingQuotation.company_name}</p>
                      <p className="text-sm text-muted-foreground">Reg No: {viewingQuotation.company_reg_no}</p>
                      <div className="flex items-start gap-2 text-sm text-foreground mt-2">
                        <MapPin className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                        <span>{viewingQuotation.company_address}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-2"><FileText className="w-3 h-3" /> Message / Notes</h3>
                    <div className="bg-secondary/40 p-4 rounded-lg italic text-sm text-foreground">
                      {viewingQuotation.message || "No additional message provided."}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-2"><Clock className="w-3 h-3" /> Customer Contact</h3>
                    <div className="bg-secondary/40 p-4 rounded-lg space-y-3">
                      <div>
                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-tighter">Person in Charge</p>
                        <p className="text-sm font-semibold">{viewingQuotation.customer_name}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-4 h-4 text-primary" />
                          <span>{viewingQuotation.customer_email}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-4 h-4 text-primary" />
                          <span>{viewingQuotation.contact_number}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-2">Request Status</h3>
                    <div className="flex flex-wrap gap-2">
                      {['pending', 'viewed', 'completed', 'cancelled'].map(s => (
                        <button 
                          key={s} 
                          onClick={() => handleStatusChange(viewingQuotation.id, s)}
                          className={`px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest border transition-all ${
                            viewingQuotation.status === s ? statusColors[s] + ' border-current' : 'bg-transparent border-muted-foreground/30 text-muted-foreground hover:border-primary'
                          }`}
                        >
                          {statusLabels[s]}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">Requested Products</h3>
                <div className="bg-card border border-border rounded-lg overflow-hidden">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-muted font-heading text-[10px] uppercase tracking-widest text-muted-foreground border-b border-border">
                        <th className="p-4">Product Name</th>
                        <th className="p-4 text-center">Qty</th>
                        <th className="p-4 text-right">Unit Price</th>
                        <th className="p-4 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border text-sm">
                      {(viewingQuotation.cart_items as any[])?.map((item: any, i: number) => (
                        <tr key={i}>
                          <td className="p-4 font-bold">{item.name || item.productName}</td>
                          <td className="p-4 text-center">{item.quantity}</td>
                          <td className="p-4 text-right">RM {Number(item.price).toFixed(2)}</td>
                          <td className="p-4 text-right font-bold text-primary">RM {(item.price * item.quantity).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-muted/30 font-bold border-t border-border">
                        <td colSpan={3} className="p-4 text-right uppercase text-xs tracking-widest">Estimated Total</td>
                        <td className="p-4 text-right text-lg text-primary">
                          <div className="flex items-center justify-end gap-2">
                            {isEditingPrice ? (
                              <div className="flex items-center gap-1">
                                <span className="text-sm font-normal text-muted-foreground mr-1">RM</span>
                                <Input 
                                  type="number" 
                                  value={editedPrice} 
                                  onChange={(e) => setEditedPrice(e.target.value)}
                                  className="w-24 h-8 text-right font-bold text-primary"
                                />
                                <Button size="sm" variant="outline" className="h-8 px-2" onClick={handleUpdatePrice}>Save</Button>
                                <Button size="sm" variant="ghost" className="h-8 px-2" onClick={() => setIsEditingPrice(false)}>Cancel</Button>
                              </div>
                            ) : (
                              <>
                                <span>RM {Number(viewingQuotation.cart_total).toFixed(2)}</span>
                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsEditingPrice(true)}>
                                  <Edit2 className="w-3 h-3 text-muted-foreground" />
                                </Button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-border flex items-center justify-end flex-shrink-0">
               <Button onClick={() => setViewingQuotation(null)}>Close Details</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuotationsManager;
