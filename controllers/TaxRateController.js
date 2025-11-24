import TaxRate from "../models/TaxRates.js";

export const createTaxRate = async (req, res) => {
  try {
    const newRate = new TaxRate(req.body);
    await newRate.save();
    res.status(201).json(newRate);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create tax rate', error: error.message });
  }
};

export const getAllTaxRates = async (req, res) => {
  try {
    const rates = await TaxRate.find({ isActive: true });
    res.status(200).json(rates);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch tax rates', error: error.message });
  }
};

export const updateTaxRate = async (req, res) => {
  try {
    const updatedRate = await TaxRate.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedRate);
  } catch (error) {
    res.status(400).json({ message: 'Update failed', error: error.message });
  }
};