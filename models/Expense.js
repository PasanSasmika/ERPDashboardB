import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  description: { type: String, required: true }, 
  vendor: { type: String, required: true },      
  reference: { type: String },                   
  
  amount: { type: Number, required: true },
  taxAmount: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true }, 

  expenseAccount: { type: mongoose.Schema.Types.ObjectId, ref: 'ChartOfAccount', required: true },
  paymentAccount: { type: mongoose.Schema.Types.ObjectId, ref: 'ChartOfAccount', required: true }, 
  
  relatedProject: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' }, 
  receiptUrl: { type: String }, 
  
  status: { type: String, enum: ['Draft', 'Posted'], default: 'Posted' }
}, { timestamps: true });

const Expense = mongoose.model('Expense', expenseSchema);
export default Expense;