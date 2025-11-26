import mongoose from 'mongoose';

const financeRecordSchema = new mongoose.Schema({
  date: { 
    type: Date, 
    required: true, 
    default: Date.now 
  },
  description: { 
    type: String, 
    required: true 
  },
  amount: { 
    type: Number, 
    required: true 
  },
  type: { 
    type: String, 
    enum: ['Incoming', 'Outgoing'], 
    required: true 
  },
  category: { 
    type: String,
    default: 'General'
  },
  // Link to employee if this is a Salary payment
  relatedEmployee: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Employee' 
  },
  authorizedBy: { 
    type: String 
  }
}, { timestamps: true });

const FinanceRecord = mongoose.model('FinanceRecord', financeRecordSchema);
export default FinanceRecord;