import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { MessageSquare, Trash2, CheckCircle, Clock } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

export default function ContactLeadsManager() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewingLead, setViewingLead] = useState<any>(null);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const { data, error } = await supabase
        .from('checkout_leads')
        .select('*')
        .eq('status', 'contact_form')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load contact messages');
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
      fetchLeads();
      toast.success(currentStatus ? 'Marked as unread' : 'Marked as read');
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const deleteLead = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    try {
      const { error } = await supabase
        .from('checkout_leads')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      fetchLeads();
      toast.success('Message deleted');
    } catch (err) {
      toast.error('Failed to delete message');
    }
  };

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading...</div>;

  return (
    <div className="pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-black uppercase text-foreground">Contact Messages</h1>
        <p className="text-muted-foreground mt-1 text-sm">View messages submitted from the landing page contact form.</p>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-secondary text-secondary-foreground uppercase font-bold tracking-wider text-xs">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Phone / Email</th>
                <th className="px-6 py-4">Message Snippet</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">No messages found.</td>
                </tr>
              ) : (
                leads.map(lead => (
                  <tr key={lead.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                      {new Date(lead.created_at).toLocaleDateString()} <br/>
                      <span className="text-xs">{new Date(lead.created_at).toLocaleTimeString()}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground">{lead.customer_phone || '-'}</div>
                      <div className="text-muted-foreground text-xs">{lead.customer_email || '-'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-[300px] truncate">{lead.notes || 'No message provided'}</div>
                    </td>
                    <td className="px-6 py-4">
                      {lead.contacted ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-green-500/10 text-green-500 border border-green-500/20">
                          <CheckCircle className="w-3.5 h-3.5" /> Read
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                          <Clock className="w-3.5 h-3.5" /> Unread
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => setViewingLead(lead)}
                          className="p-2 text-[#F59E0B] hover:bg-[#F59E0B]/10 rounded transition-colors"
                          title="View Details"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => markAsRead(lead.id, !!lead.contacted)}
                          className="p-2 text-primary hover:bg-primary/10 rounded transition-colors"
                          title={lead.contacted ? "Mark as unread" : "Mark as read"}
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => deleteLead(lead.id)}
                          className="p-2 text-red-500 hover:bg-red-500/10 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={!!viewingLead} onOpenChange={(open) => !open && setViewingLead(null)}>
        <DialogContent className="sm:max-w-md bg-card border border-border">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Message Details</DialogTitle>
            <DialogDescription>
              Received on {viewingLead ? new Date(viewingLead.created_at).toLocaleString() : ''}
            </DialogDescription>
          </DialogHeader>
          
          {viewingLead && (
            <div className="space-y-6 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Phone Number</h4>
                  <p className="text-sm font-medium">{viewingLead.customer_phone || '-'}</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Email Address</h4>
                  <p className="text-sm font-medium">{viewingLead.customer_email || '-'}</p>
                </div>
              </div>
              
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Address</h4>
                <p className="text-sm p-3 bg-background border border-border rounded">{viewingLead.shipping_address || 'No address provided'}</p>
              </div>
              
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Message</h4>
                <p className="text-sm p-3 bg-background border border-border rounded whitespace-pre-wrap min-h-[100px]">{viewingLead.notes || 'No message'}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
