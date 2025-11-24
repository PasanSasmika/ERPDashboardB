import ChartOfAccount from "../models/ChartOfAccounts.js";
import Invoice from "../models/Invoice.js";
import mongoose from 'mongoose';
import JournalEntry from "../models/JournalEntry.js";


const getAccountByCode = async (code) => {
  const account = await ChartOfAccount.findOne({ code });
  if (!account) throw new Error(`Account with code ${code} not found in Chart of Accounts.`);
  return account._id;
};

const validateInvoiceData = (data) => {
    if (!data.invoiceNo || !data.organizationId || !data.projectId || !data.dueDate) {
        throw new Error('Missing required invoice fields: Invoice No, Organization ID, Project ID, or Due Date.');
    }
    if (!data.lineItems || data.lineItems.length === 0) {
        throw new Error('Invoice must have at least one line item.');
    }
};

export const createInvoice = async (req, res) => {
    const session = await mongoose.startSession(); 
    session.startTransaction();

    try {
        console.log('createInvoice called with body:', req.body);

        const newInvoice = new Invoice(req.body);
        await newInvoice.save({ session });

        
        const totalAmount = newInvoice.total;      
        const taxAmount = newInvoice.taxAmount;    
        const subTotal = newInvoice.subTotal - newInvoice.discount; 

   
        const arAccountId = await getAccountByCode('1200');    
        const salesAccountId = await getAccountByCode('4000'); 
        const taxAccountId = await getAccountByCode('2100');   

        const journalEntry = new JournalEntry({
            date: newInvoice.invoiceDate,
            description: `Invoice #${newInvoice.invoiceNo} generated for Project ${newInvoice.projectId}`,
            reference: newInvoice.invoiceNo,
            relatedInvoice: newInvoice._id,
            relatedProject: newInvoice.projectId, 
            entries: [
                {
                    account: arAccountId,
                    debit: totalAmount,
                    credit: 0
                },
                {
                    account: salesAccountId,
                    debit: 0,
                    credit: subTotal
                },
                {
                    account: taxAccountId,
                    debit: 0,
                    credit: taxAmount
                }
            ],
            status: 'Posted'
        });

        await journalEntry.save({ session });
        
        await session.commitTransaction();
        res.status(201).json({
            message: 'Invoice created and posted to GL successfully.',
            invoice: newInvoice,
        });

    } catch (error) {
        await session.abortTransaction();
        console.error('createInvoice error:', error);
        const statusCode = error.code === 11000 ? 409 : 400; 
        res.status(statusCode).json({
            message: 'Failed to create invoice.',
            error: error.message,
        });
    } finally {
        session.endSession();
    }
};

export const getInvoiceById = async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id).populate('organizationId');
        
        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found.' });
        }
        res.status(200).json(invoice);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve invoice.', error: error.message });
    }
};

export const getInvoicesByProject = async (req, res) => {
    try {
        const { orgId, projectId } = req.params;
        console.log('getInvoicesByProject called with orgId:', orgId, 'projectId:', projectId);
        const invoices = await Invoice.find({ 
            organizationId: new mongoose.Types.ObjectId(orgId), 
            projectId: projectId 
        });
        
        res.status(200).json(invoices);
    } catch (error) {
        console.error('getInvoicesByProject error:', error);
        res.status(500).json({ message: 'Failed to retrieve project invoices.', error: error.message });
    }
};

export const updateInvoice = async (req, res) => {
    try {
        const updatedInvoice = await Invoice.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!updatedInvoice) {
            return res.status(404).json({ message: 'Invoice not found.' });
        }
        res.status(200).json({ 
            message: 'Invoice updated successfully.', 
            invoice: updatedInvoice 
        });
    } catch (error) {
        const statusCode = error.code === 11000 ? 409 : 400; 
        res.status(statusCode).json({ 
            message: 'Failed to update invoice.', 
            error: error.message 
        });
    }
};

export const deleteInvoice = async (req, res) => {
    try {
        const deletedInvoice = await Invoice.findByIdAndDelete(req.params.id);
        
        if (!deletedInvoice) {
            return res.status(404).json({ message: 'Invoice not found.' });
        }
        res.status(200).json({ message: 'Invoice deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete invoice.', error: error.message });
    }
};