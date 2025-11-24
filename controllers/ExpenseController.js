import Expense from "../models/Expense.js";
import JournalEntry from "../models/JournalEntry.js";
import mongoose from 'mongoose';

export const createExpense = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { 
      date, description, vendor, reference, 
      amount, taxAmount, totalAmount, 
      expenseAccount, paymentAccount, relatedProject 
    } = req.body;

    // 1. Validation: Ensure Accounts are selected
    if (!expenseAccount || !paymentAccount) {
      throw new Error("Expense Account and Payment Account are required.");
    }

    // 2. Create the Expense Record
    const newExpense = new Expense(req.body);
    await newExpense.save({ session });

    // 3. AUTOMATIC GL POSTING
    // ---------------------------------------------------------
    // FIX: We use 'totalAmount' for the Expense Debit to ensure it matches the Bank Credit.
    // This keeps the GL balanced (Total Debit = Total Credit).
    // The breakdown of Tax vs Amount is preserved in the 'Expense' document for tax reporting.
    
    const journalEntry = new JournalEntry({
      date: date || new Date(),
      description: `Expense: ${description} (${vendor})`,
      reference: reference || newExpense._id,
      relatedProject: relatedProject,
      entries: [
        {
          account: expenseAccount, // e.g., "Office Rent"
          debit: totalAmount,      // <--- CHANGED: Use Total (Amount + Tax) to balance
          credit: 0
        },
        {
          account: paymentAccount, // e.g., "Bank"
          debit: 0,
          credit: totalAmount 
        }
      ],
      status: 'Posted'
    });

    await journalEntry.save({ session });
    // ---------------------------------------------------------

    await session.commitTransaction();
    res.status(201).json({ message: 'Expense recorded successfully.', expense: newExpense });

  } catch (error) {
    await session.abortTransaction();
    console.error("Expense Error:", error); // Check your VS Code Terminal for this log
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