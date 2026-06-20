import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Calendar, Trash2, CheckCircle, Clock, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

export default function AppointmentsManager() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewingAppt, setViewingAppt] = useState<any>(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const { data, error } = await supabase
        .from('checkout_leads')
        .select('*')
        .eq('status', 'appointment')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAppointments(data || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('checkout_leads')
        .update({ contacted: !currentStatus })
        .eq('id', id);
        
      if (error) throw error;
      fetchAppointments();
      toast.success(currentStatus ? 'Marked as pending' : 'Marked as completed');
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const deleteAppt = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this appointment?')) return;
    try {
      const { error } = await supabase
        .from('checkout_leads')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      fetchAppointments();
      toast.success('Appointment deleted');
    } catch (err) {
      toast.error('Failed to delete appointment');
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString();
  };

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading...</div>;

  return (
    <div className="pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-black uppercase text-foreground">Appointments</h1>
        <p className="text-muted-foreground mt-1 text-sm">Manage appointments booked from the landing page.</p>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-secondary text-secondary-foreground uppercase font-bold tracking-wider text-xs">
              <tr>
                <th className="px-6 py-4">Booking Date</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Service & Time</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {appointments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">No appointments found.</td>
                </tr>
              ) : (
                appointments.map(appt => {
                  const items = appt.cart_items as any;
                  return (
                    <tr key={appt.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                        {new Date(appt.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-foreground">{appt.customer_name}</div>
                        <div className="text-muted-foreground text-xs">{appt.customer_phone}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold">{items?.service?.title || 'Unknown Service'}</div>
                        <div className="text-[#F59E0B] text-xs font-bold">{formatDate(items?.date)} at {items?.time}</div>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {items?.location || 'Unknown'}
                      </td>
                      <td className="px-6 py-4">
                        {appt.contacted ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-green-500/10 text-green-500 border border-green-500/20">
                            <CheckCircle className="w-3.5 h-3.5" /> Completed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                            <Clock className="w-3.5 h-3.5" /> Pending
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => setViewingAppt(appt)}
                            className="p-2 text-[#F59E0B] hover:bg-[#F59E0B]/10 rounded transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => markAsRead(appt.id, !!appt.contacted)}
                            className="p-2 text-primary hover:bg-primary/10 rounded transition-colors"
                            title={appt.contacted ? "Mark as pending" : "Mark as completed"}
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => deleteAppt(appt.id)}
                            className="p-2 text-red-500 hover:bg-red-500/10 rounded transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={!!viewingAppt} onOpenChange={(open) => !open && setViewingAppt(null)}>
        <DialogContent className="sm:max-w-xl bg-card border border-border">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#F59E0B]" /> Appointment Details
            </DialogTitle>
            <DialogDescription>
              Booked on {viewingAppt ? new Date(viewingAppt.created_at).toLocaleString() : ''}
            </DialogDescription>
          </DialogHeader>
          
          {viewingAppt && (
            <div className="space-y-6 pt-4">
              <div className="grid grid-cols-2 gap-6 bg-muted/30 p-4 rounded-lg border border-border">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Service & Time</h4>
                  <p className="text-base font-bold text-[#F59E0B]">{viewingAppt.cart_items?.service?.title}</p>
                  <p className="text-sm">{formatDate(viewingAppt.cart_items?.date)} at {viewingAppt.cart_items?.time}</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Location</h4>
                  <p className="text-sm font-medium">{viewingAppt.cart_items?.location}</p>
                  <p className="text-xs text-muted-foreground">{viewingAppt.shipping_address}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Customer Name</h4>
                  <p className="text-sm font-medium">{viewingAppt.customer_name || '-'}</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Price</h4>
                  <p className="text-sm font-medium">RM {viewingAppt.cart_total || '0'}</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Phone Number</h4>
                  <p className="text-sm font-medium">{viewingAppt.customer_phone || '-'}</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Email Address</h4>
                  <p className="text-sm font-medium">{viewingAppt.customer_email || '-'}</p>
                </div>
              </div>
              
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Car & Notes</h4>
                <p className="text-sm p-3 bg-background border border-border rounded whitespace-pre-wrap min-h-[100px]">{viewingAppt.notes || 'No notes provided'}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
