import express from 'express';
import { createEmployee, getEmployees, runPayroll } from '../controllers/PayrollController.js';

const Payrollrouter = express.Router();

Payrollrouter.post('/employees', createEmployee);
Payrollrouter.get('/employees', getEmployees);

Payrollrouter.post('/run', runPayroll);

export default Payrollrouter;