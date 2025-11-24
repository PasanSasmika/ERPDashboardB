import ChartOfAccount from "../models/ChartOfAccounts.js";

export const createAccount = async (req, res) => {
  try {
    const newAccount = new ChartOfAccount(req.body);
    await newAccount.save();
    res.status(201).json({ message: 'Account created successfully', account: newAccount });
  } catch (error) {
    res.status(400).json({ message: 'Failed to create account', error: error.message });
  }
};

export const getAllAccounts = async (req, res) => {
  try {
    const accounts = await ChartOfAccount.find().sort({ code: 1 });
    res.status(200).json(accounts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch accounts', error: error.message });
  }
};

export const updateAccount = async (req, res) => {
  try {
    const updatedAccount = await ChartOfAccount.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    if (!updatedAccount) return res.status(404).json({ message: 'Account not found' });
    res.status(200).json(updatedAccount);
  } catch (error) {
    res.status(400).json({ message: 'Update failed', error: error.message });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    
    await ChartOfAccount.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Delete failed', error: error.message });
  }
};