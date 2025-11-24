
import mongoose from 'mongoose';
import JournalEntry from '../models/JournalEntry.js';
import Expense from '../models/Expense.js';

export const createExpense = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { 
      date, description, vendor, reference, 
      amount, taxAmount, totalAmount, 
      expenseAccount, paymentAccount, relatedProject 
    } = req.body;

    const newExpense = new Expense(req.body);
    await newExpense.save({ session });

    
    const journalEntry = new JournalEntry({
      date: date || new Date(),
      description: `Expense: ${description} (${vendor})`,
      reference: reference || newExpense._id,
      relatedProject: relatedProject,
      entries: [
        {
          account: expenseAccount, 
          debit: amount,
          credit: 0
        },
        {
          account: paymentAccount, 
          debit: 0,
          credit: totalAmount 
        }
      ],
      status: 'Posted'
    });

    
    if (taxAmount > 0) {
       
    }

    await journalEntry.save({ session });
    

    await session.commitTransaction();
    res.status(201).json({ message: 'Expense recorded and posted to GL.', expense: newExpense });

  } catch (error) {
    await session.abortTransaction();
    res.status(400).json({ message: 'Failed to record expense', error: error.message });
  } finally {
    session.endSession();
  }
};

export const getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find()
      .populate('expenseAccount', 'name code')
      .populate('paymentAccount', 'name code')
      .sort({ date: -1 });
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch expenses', error: error.message });
  }
};