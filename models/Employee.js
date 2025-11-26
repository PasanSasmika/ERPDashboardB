import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({

  name: { type: String, required: true },
  age: { type: Number },
  gender: { type: String },
  dob: { type: Date },
  nicPassport: { type: String, required: true },
  address: { type: String },
  phone: { type: String },
  email: { type: String, required: true, unique: true },
  maritalStatus: { type: String },
  
  emergencyContact: {
    name: String,
    relationship: String,
    phone: String
  },

  employeeId: { type: String, required: true, unique: true },
  department: { type: String },
  designation: { type: String }, 
  employmentType: { 
    type: String, 
    enum: ['Full-time', 'Part-time', 'Contract', 'Intern'],
    default: 'Full-time' 
  },
  joiningDate: { type: Date },
  reportingManager: { type: String },
  workLocation: { type: String },
  
  salary: { type: Number, required: true, default: 0 }, 
  allowances: { type: Number, default: 0 },

  bankDetails: {
    bankName: String,
    branch: String,
    accountName: String,
    accountNumber: String
  },

  documents: {
    profilePhoto: String,
    nicScan: String,
    cv: String,
    appointmentLetter: String,
    certificates: [String] 
  },

  systemAccess: {
    emailCreated: { type: Boolean, default: false },
    role: { type: String, default: 'User' },
    assets: [String] 
  },

  salaryHistory: [{
    month: String, 
    amount: Number,
    processedDate: { type: Date, default: Date.now },
    authorizedBy: String
  }],

  isActive: { type: Boolean, default: true }

}, { timestamps: true });

const Employee = mongoose.model('Employee', employeeSchema);
export default Employee;