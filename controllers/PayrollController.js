import Employee from "../models/Employee.js";
import Payroll from "../models/Payroll.js";
import JournalEntry from "../models/JournalEntry.js";
import ChartOfAccount from "../models/ChartOfAccounts.js";
import mongoose from 'mongoose';

const getAccountByCode = async (code) => {
  const account = await ChartOfAccount.findOne({ code });
  if (!account) throw new Error(`GL Account ${code} missing.`);
  return account._id;
};

export const runPayroll = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { month, year } = req.body;

    const employees = await Employee.find({ isActive: true });
    if (employees.length === 0) throw new Error("No active employees found.");

    let totalGross = 0;
    let totalTax = 0;
    let totalNet = 0;
    const payrollRecords = [];

   
    for (const emp of employees) {
        const gross = emp.basicSalary + emp.allowances;
        
      
        const tax = gross * 0.08; 
        
        const net = gross - tax;

        totalGross += gross;
        totalTax += tax;
        totalNet += net;

        payrollRecords.push({
            employee: emp._id,
            basic: emp.basicSalary,
            allowance: emp.allowances,
            tax: tax,
            netPay: net
        });
    }

    
    const newPayroll = new Payroll({
        month,
        year,
        totalGross,
        totalDeductions: totalTax,
        totalNetPay: totalNet,
        records: payrollRecords,
        status: 'Processed'
    });
    await newPayroll.save({ session });

  
    const salaryExpenseId = await getAccountByCode('5000'); 
    const taxPayableId = await getAccountByCode('2100');    
    const bankId = await getAccountByCode('1001');          

    const journalEntry = new JournalEntry({
        date: new Date(),
        description: `Payroll Run: ${month} ${year}`,
        reference: `PAY-${month}-${year}`,
        entries: [
            
            {
                account: salaryExpenseId,
                debit: totalGross,
                credit: 0
            },
            
            {
                account: taxPayableId,
                debit: 0,
                credit: totalTax
            },
            
            {
                account: bankId,
                debit: 0,
                credit: totalNet
            }
        ],
        status: 'Posted'
    });
    
    await journalEntry.save({ session });

    await session.commitTransaction();
    res.status(201).json({ message: 'Payroll processed and posted to GL.', payroll: newPayroll });

  } catch (error) {
    await session.abortTransaction();
    console.error(error);
    res.status(400).json({ message: 'Payroll failed', error: error.message });
  } finally {
    session.endSession();
  }
};

export const createEmployee = async (req, res) => {
    try {
        const emp = new Employee(req.body);
        await emp.save();
        res.status(201).json(emp);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const getEmployees = async (req, res) => {
    try {
        const emps = await Employee.find();
        res.json(emps);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};