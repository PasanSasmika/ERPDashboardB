import Employee from "../models/Employee.js";
import FinanceRecord from "../models/FinanceRecord.js";


export const createEmployee = async (req, res) => {
  try {
    // 1. Parse the JSON string containing all text data
    // The frontend now sends everything in 'employeeData'
    let employeeData;
    try {
        employeeData = JSON.parse(req.body.employeeData);
    } catch (e) {
        return res.status(400).json({ message: "Invalid data format. JSON parse failed." });
    }

    // 2. Handle Files (Map paths to the nested documents object)
    employeeData.documents = {};
    
    if (req.files) {
        // Helper to clean path (remove backslashes for Windows compatibility)
        const getPath = (fileArray) => fileArray ? `/${fileArray[0].path.replace(/\\/g, '/')}` : null;

        if (req.files.profilePhoto) employeeData.documents.profilePhoto = getPath(req.files.profilePhoto);
        if (req.files.nicScan) employeeData.documents.nicScan = getPath(req.files.nicScan);
        if (req.files.cv) employeeData.documents.cv = getPath(req.files.cv);
        if (req.files.appointmentLetter) employeeData.documents.appointmentLetter = getPath(req.files.appointmentLetter);
    }

    // 3. Save to Database
    const newEmployee = new Employee(employeeData);
    await newEmployee.save();
    
    res.status(201).json({ message: "Employee added successfully", employee: newEmployee });

  } catch (error) {
    console.error("Create Employee Error:", error);
    res.status(400).json({ message: "Failed to add employee", error: error.message });
  }
};

export const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find({ isActive: true }).sort({ createdAt: -1 });
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch employees", error: error.message });
  }
};

export const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: "Employee not found" });
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch employee", error: error.message });
  }
};


export const processSalary = async (req, res) => {
  try {
    const { employeeId, month, amount, authorizedBy } = req.body;

    const employee = await Employee.findById(employeeId);
    if (!employee) return res.status(404).json({ message: "Employee not found" });

    const financeEntry = new FinanceRecord({
      date: new Date(),
      description: `Salary Payment: ${employee.name} (${month})`,
      amount: Number(amount),
      type: 'Outgoing',
      category: 'Payroll',
      relatedEmployee: employee._id,
      authorizedBy: authorizedBy
    });
    await financeEntry.save();

    employee.salaryHistory.push({
      month,
      amount: Number(amount),
      processedDate: new Date(),
      authorizedBy
    });
    await employee.save();

    res.status(200).json({ 
      message: "Salary processed successfully", 
      financeRecord: financeEntry 
    });

  } catch (error) {
    console.error("Payroll Error:", error);
    res.status(500).json({ message: "Payroll processing failed", error: error.message });
  }
};