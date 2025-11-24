import express from 'express';
import { createExpense, getAllExpenses } from '../controllers/ExpenseController.js';

const Expencesrouter = express.Router();

Expencesrouter.post('/', createExpense);
Expencesrouter.get('/', getAllExpenses);

export default Expencesrouter;