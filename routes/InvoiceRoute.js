// routes/InvoiceRoute.js (updated - POST first, with log)
import express from 'express';
import { createInvoice, deleteInvoice, getInvoiceById, getInvoicesByProject, updateInvoice } from '../controllers/InvoiceController.js';

const Invoicerouter = express.Router();

console.log('Defining invoice routes...');

Invoicerouter.post('/', createInvoice);
Invoicerouter.get('/:id', getInvoiceById);
Invoicerouter.put('/:id', updateInvoice);
Invoicerouter.delete('/:id', deleteInvoice);
Invoicerouter.get('/organization/:orgId/project/:projectId', getInvoicesByProject);

console.log('Invoice routes defined:', Invoicerouter.stack.map(r => r.route.path));

export default Invoicerouter;