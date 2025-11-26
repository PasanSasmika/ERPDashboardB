import FinanceRecord from "../models/FinanceRecord.js";


export const addRecord = async (req, res) => {
  try {
    const newRecord = new FinanceRecord(req.body);
    await newRecord.save();
    res.status(201).json({ message: "Record added successfully", record: newRecord });
  } catch (error) {
    res.status(400).json({ message: "Failed to add record", error: error.message });
  }
};


export const getFinanceReport = async (req, res) => {
  try {
    const { month, year } = req.query; 
    
    let query = {};

    
    if (month && year) {
      const startDate = new Date(Number(year), Number(month) - 1, 1);
      const endDate = new Date(Number(year), Number(month), 0, 23, 59, 59);
      query.date = { $gte: startDate, $lte: endDate };
    }

    const records = await FinanceRecord.find(query).sort({ date: -1 });

    
    let totalIncoming = 0;
    let totalOutgoing = 0;

    records.forEach(record => {
      if (record.type === 'Incoming') {
        totalIncoming += record.amount;
      } else if (record.type === 'Outgoing') {
        totalOutgoing += record.amount;
      }
    });

    const profit = totalIncoming - totalOutgoing;

    res.status(200).json({
      summary: {
        totalIncoming,
        totalOutgoing,
        profit
      },
      records 
    });

  } catch (error) {
    res.status(500).json({ message: "Failed to generate report", error: error.message });
  }
};