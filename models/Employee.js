import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
  
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  designation: { type: String },
  
  
  basicSalary: { type: Number, required: true, default: 0 },
  allowances: { type: Number, default: 0 },
  
  
  bankName: String,
  accountNumber: String,
  
 
  isActive: { type: Boolean, default: true },
  joinedDate: { type: Date, default: Date.now }
}, { timestamps: true });

const Employee = mongoose.model('Employee', employeeSchema);
export default Employee;