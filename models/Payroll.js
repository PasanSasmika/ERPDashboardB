import mongoose from 'mongoose';

const payrollSchema = new mongoose.Schema({
  month: { type: String, required: true }, 
  year: { type: Number, required: true },  
  
  totalGross: { type: Number, default: 0 },
  totalDeductions: { type: Number, default: 0 },
  totalNetPay: { type: Number, default: 0 },
  
 
  records: [{
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
    basic: Number,
    allowance: Number,
    tax: Number,
    netPay: Number
  }],
  
  status: { type: String, enum: ['Draft', 'Processed'], default: 'Processed' }
}, { timestamps: true });

const Payroll = mongoose.model('Payroll', payrollSchema);
export default Payroll;