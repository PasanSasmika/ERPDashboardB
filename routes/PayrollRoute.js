import express from 'express';
import multer from 'multer';
import path from 'path';
import { createEmployee, getEmployeeById, getEmployees, processSalary } from '../controllers/PayrollController.js';

const PayRollrouter = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `hr-${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`)
});

const upload = multer({ storage });

// UPDATE THIS ROUTE:
PayRollrouter.post('/employees', upload.fields([
    { name: 'profilePhoto', maxCount: 1 },
    { name: 'nicScan', maxCount: 1 },
    { name: 'cv', maxCount: 1 },
    { name: 'appointmentLetter', maxCount: 1 }
]), createEmployee);


PayRollrouter.post('/employees', upload.array('documents'), createEmployee);
PayRollrouter.get('/employees', getEmployees);
PayRollrouter.get('/employees/:id', getEmployeeById);
PayRollrouter.post('/process-salary', processSalary);

export default PayRollrouter;