// models/Invoice.js
import mongoose from 'mongoose';

const lineItemSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true,
    },
    unitPrice: {
        type: Number,
        required: true,
    },
    qty: {
        type: Number,
        required: true,
    },
    lineTotal: {
        type: Number,
        required: true,
    },
}, { _id: false });

const invoiceSchema = new mongoose.Schema({
    // Relationships
    organizationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required: true,
    },
    projectId: {
        type: String, // Since Project is embedded, we store its string _id
        required: true,
    },
    // Main Invoice Details
    invoiceNo: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    poNo: {
        type: String,
        trim: true,
    },
    invoiceDate: {
        type: Date,
        default: Date.now,
    },
    dueDate: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['Draft', 'Sent', 'Paid', 'Overdue', 'Cancelled'],
        default: 'Draft',
    },
    // Line Items
    lineItems: [lineItemSchema],
    // Totals
    subTotal: {
        type: Number,
        default: 0,
    },
    discount: {
        type: Number,
        default: 0, // Can be amount or a calculation is done on frontend/before save
    },
    taxRate: {
        type: Number,
        default: 0, // e.g., 5, 10, 15
    },
    taxAmount: {
        type: Number,
        default: 0,
    },
    total: {
        type: Number,
        default: 0,
    },
    currency: {
        type: String,
        default: 'LKR',
    },
    // Terms & Notes
    terms: {
        type: String,
        default: '1. Payment is due within 30 days from the invoice date.\n2. All bank or transfer fees are the responsibility of the client.',
    },
    notes: {
        type: String,
    },
    
}, { timestamps: true });

invoiceSchema.index({ invoiceNo: 1, organizationId: 1 }, { unique: true });


const Invoice = mongoose.model('Invoice', invoiceSchema);

export default Invoice;