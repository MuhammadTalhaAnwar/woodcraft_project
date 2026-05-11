import Invoice from '../models/Invoice.js';

// fetch all invoices with order type and customer info
const getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find({})
      .populate('order', 'type totalCost')
      .populate('customer', 'name phone');
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// record a payment against an invoice and update its status accordingly
const updateInvoicePayment = async (req, res) => {
  const { amount } = req.body;

  try {
    const paymentAmount = Number(amount);
    if (!Number.isFinite(paymentAmount) || paymentAmount <= 0) {
      return res.status(400).json({ message: 'Payment amount must be greater than zero' });
    }

    const invoice = await Invoice.findById(req.params.id);

    if (invoice) {
      invoice.paidAmount += paymentAmount;

      // mark as fully paid if total is reached, otherwise partially paid
      if (invoice.paidAmount >= invoice.totalAmount) {
        invoice.status = 'Paid';
        invoice.paidAmount = invoice.totalAmount; // cap it to avoid overpayment
      } else if (invoice.paidAmount > 0) {
        invoice.status = 'Partially Paid';
      }

      const updatedInvoice = await invoice.save();
      res.json(updatedInvoice);
    } else {
      res.status(404).json({ message: 'Invoice not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getInvoices, updateInvoicePayment };
