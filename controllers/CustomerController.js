import Customer from "../models/Customers.js";

// Get all customers
export const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve customers.', error: error.message });
  }
};

// Create a new customer
export const createCustomer = async (req, res) => {
  try {
    const newCustomer = await Customer.create(req.body);
    res.status(201).json({ message: 'Customer created successfully.', customer: newCustomer });
  } catch (error) {
    res.status(400).json({ message: 'Failed to create customer.', error: error.message });
  }
};

// Get a single customer by ID
export const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found.' });
    }
    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve customer.', error: error.message });
  }
};

// Update a customer
export const updateCustomer = async (req, res) => {
  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedCustomer) {
      return res.status(404).json({ message: 'Customer not found.' });
    }
    res.status(200).json({ message: 'Customer updated successfully.', customer: updatedCustomer });
  } catch (error) {
    res.status(400).json({ message: 'Failed to update customer.', error: error.message });
  }   
};

// Delete a customer
export const deleteCustomer = async (req, res) => {
  try {
    const deletedCustomer = await Customer.findByIdAndDelete(req.params.id);
    if (!deletedCustomer) {
      return res.status(404).json({ message: 'Customer not found.' });
    }
    res.status(200).json({ message: 'Customer deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete customer.', error: error.message });
  }
};