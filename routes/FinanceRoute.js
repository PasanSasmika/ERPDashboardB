import express from 'express';
import { addRecord, getFinanceReport } from '../controllers/FinanceController.js';

const Financerouter = express.Router();

Financerouter.post('/add', addRecord);

Financerouter.get('/report', getFinanceReport);

export default Financerouter;