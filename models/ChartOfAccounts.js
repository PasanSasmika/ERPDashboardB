import mongoose from 'mongoose';

const chartOfAccountsSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true, 
  },
  name: {
    type: String,
    required: true,
    trim: true, 
  },
  type: {
    type: String,
    required: true,
    enum: ['Asset', 'Liability', 'Equity', 'Income', 'Expense'],
  },
  subType: {
    type: String,
  },
  description: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  }
}, { timestamps: true });

const ChartOfAccount = mongoose.model('ChartOfAccount', chartOfAccountsSchema);
export default ChartOfAccount;