import { useState, useEffect, useRef } from 'react';
import api from '../../api/axios';
import { useReactToPrint } from 'react-to-print';
import { Printer } from 'lucide-react';

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState(0);

  const printRef = useRef();

  const fetchInvoices = async () => {
    try {
      const { data } = await api.get('/invoices');
      setInvoices(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
  });

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/invoices/${selectedInvoice._id}/pay`, { amount: paymentAmount });
      setIsModalOpen(false);
      setSelectedInvoice(null);
      setPaymentAmount(0);
      fetchInvoices();
    } catch (error) {
      console.error(error);
      alert('Error updating payment');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-text">Invoices & Billing</h1>
      </div>

      <div className="bg-surface rounded-2xl shadow-sm border border-border overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-background border-b border-border">
              <th className="p-4 font-semibold text-sm text-text/70">Date</th>
              <th className="p-4 font-semibold text-sm text-text/70">Customer</th>
              <th className="p-4 font-semibold text-sm text-text/70">Amount</th>
              <th className="p-4 font-semibold text-sm text-text/70">Status</th>
              <th className="p-4 font-semibold text-sm text-text/70 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv._id} className="border-b border-border hover:bg-background/50">
                <td className="p-4">{new Date(inv.createdAt).toLocaleDateString()}</td>
                <td className="p-4 font-medium">{inv.customer?.name}</td>
                <td className="p-4 font-medium">
                  PKR {inv.totalAmount}
                  <div className="text-xs text-text/50">Paid: PKR {inv.paidAmount}</div>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                    inv.status === 'Paid' ? 'bg-success/20 text-success' :
                    inv.status === 'Partially Paid' ? 'bg-accent/20 text-accent' :
                    'bg-danger/20 text-danger'
                  }`}>
                    {inv.status}
                  </span>
                </td>
                <td className="p-4 flex justify-end gap-2">
                  {inv.status !== 'Paid' && (
                    <button 
                      onClick={() => { setSelectedInvoice(inv); setIsModalOpen(true); }}
                      className="text-sm bg-accent/10 text-accent px-3 py-1.5 rounded-lg font-medium hover:bg-accent/20"
                    >
                      Record Pay
                    </button>
                  )}
                  <button 
                    onClick={() => { setSelectedInvoice(inv); setTimeout(handlePrint, 100); }}
                    className="p-1.5 text-text/60 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                  >
                    <Printer size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && selectedInvoice && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-surface p-8 rounded-2xl w-full max-w-sm shadow-2xl">
            <h2 className="text-xl font-bold mb-4">Record Payment</h2>
            <p className="text-sm text-text/70 mb-4">Remaining Balance: PKR {(selectedInvoice.totalAmount - selectedInvoice.paidAmount).toFixed(2)}</p>
            <form onSubmit={handlePaymentSubmit}>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-1">Payment Amount (PKR)</label>
                <input 
                  type="number" required max={selectedInvoice.totalAmount - selectedInvoice.paidAmount}
                  value={paymentAmount} onChange={e => setPaymentAmount(Number(e.target.value))}
                  className="w-full p-3 border border-border rounded-xl" 
                />
              </div>
              <div className="flex gap-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 p-3 rounded-xl border border-border hover:bg-background">Cancel</button>
                <button type="submit" className="flex-1 p-3 rounded-xl bg-primary text-white hover:bg-primary/90">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Hidden Invoice Template for Printing */}
      <div className="hidden">
        <div ref={printRef} className="p-10 font-sans text-text bg-white">
          {selectedInvoice && (
            <>
              <div className="flex justify-between items-center border-b-2 border-primary pb-6 mb-6">
                <div>
                  <h1 className="text-4xl font-bold text-primary mb-2">The Woodcraft</h1>
                  <p className="text-text/70">Premium Woodwork Business</p>
                </div>
                <div className="text-right">
                  <h2 className="text-3xl font-bold mb-2">INVOICE</h2>
                  <p className="text-text/70">Date: {new Date(selectedInvoice.createdAt).toLocaleDateString()}</p>
                  <p className="text-text/70">Invoice ID: {selectedInvoice._id.slice(-6).toUpperCase()}</p>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="font-bold text-lg border-b border-border pb-2 mb-2">Bill To</h3>
                <p className="font-semibold text-lg">{selectedInvoice.customer?.name}</p>
                <p>{selectedInvoice.customer?.phone}</p>
                <p>{selectedInvoice.customer?.address}</p>
              </div>

              <table className="w-full text-left border-collapse mb-8">
                <thead>
                  <tr className="bg-background">
                    <th className="p-3 border-b border-border">Description</th>
                    <th className="p-3 border-b border-border text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-3 border-b border-border">Woodcraft Order ({selectedInvoice.order?.type})</td>
                    <td className="p-3 border-b border-border text-right">PKR {selectedInvoice.totalAmount.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>

              <div className="flex justify-end text-lg">
                <div className="w-64">
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold">Total Amount:</span>
                    <span>PKR {selectedInvoice.totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-2 text-success">
                    <span className="font-semibold">Paid:</span>
                    <span>-PKR {selectedInvoice.paidAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t-2 border-primary pt-2 font-bold text-xl">
                    <span>Balance Due:</span>
                    <span>PKR {(selectedInvoice.totalAmount - selectedInvoice.paidAmount).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-16 text-center text-text/50 text-sm">
                <p>Thank you for your business!</p>
              </div>
            </>
          )}
        </div>
      </div>

    </div>
  );
};

export default Invoices;
