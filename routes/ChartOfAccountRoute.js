import express from 'express';
import { createAccount, deleteAccount, getAllAccounts, updateAccount } from '../controllers/ChartOfAccountController.js';


const ChartAccountrouter = express.Router();

ChartAccountrouter.post('/', createAccount);
ChartAccountrouter.get('/', getAllAccounts);
ChartAccountrouter.put('/:id', updateAccount);
ChartAccountrouter.delete('/:id', deleteAccount);

export default ChartAccountrouter;