import mongoose from 'mongoose';

const journalEntrySchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  description: {
    type: String,
    required: true,
  },
  reference: {
    type: String, 
  },
  
  relatedProject: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  relatedInvoice: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice' },
  
  entries: [
    {
      account: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'ChartOfAccount', 
        required: true 
      },
      debit: { 
        type: Number, 
        default: 0 
      },
      credit: { 
        type: Number, 
        default: 0 
      }
    }
  ],
  
  status: {
    type: String,
    enum: ['Draft', 'Posted', 'Void'],
    default: 'Posted'
  }
}, { timestamps: true });


journalEntrySchema.pre('save', function(next) {
  const totalDebit = this.entries.reduce((sum, entry) => sum + (entry.debit || 0), 0);
  const totalCredit = this.entries.reduce((sum, entry) => sum + (entry.credit || 0), 0);

  if (Math.abs(totalDebit - totalCredit) > 0.01) {
    const err = new Error(`Journal Entry Unbalanced: Total Debit (${totalDebit}) does not equal Total Credit (${totalCredit})`);
    return next(err);
  }
  next();
});

const JournalEntry = mongoose.model('JournalEntry', journalEntrySchema);
export default JournalEntry;