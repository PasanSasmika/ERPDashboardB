import mongoose from 'mongoose';

const taxRateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, 
  },
  rate: {
    type: Number,
    required: true,
  },
  description: String,
  isActive: {
    type: Boolean,
    default: true,
  },
  effectiveDate: {
    type: Date,
    default: Date.now,
  }
}, { timestamps: true });

const TaxRate = mongoose.model('TaxRate', taxRateSchema);
export default TaxRate;