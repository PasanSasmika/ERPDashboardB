import JournalEntry from "../models/JournalEntry.js";
import ChartOfAccount from "../models/ChartOfAccounts.js";

export const getTrialBalance = async (req, res) => {
  try {
    const report = await JournalEntry.aggregate([
      { $match: { status: 'Posted' } },

      
      { $unwind: "$entries" },

      {
        $group: {
          _id: "$entries.account",
          totalDebit: { $sum: "$entries.debit" },
          totalCredit: { $sum: "$entries.credit" }
        }
      },

      {
        $lookup: {
          from: "chartofaccounts",
          localField: "_id",
          foreignField: "_id",
          as: "accountDetails"
        }
      },

      { $unwind: "$accountDetails" },

      {
        $project: {
          _id: 1,
          code: "$accountDetails.code",
          accountName: "$accountDetails.name",
          type: "$accountDetails.type",
          totalDebit: 1,
          totalCredit: 1,
          netBalance: { $subtract: ["$totalDebit", "$totalCredit"] }
        }
      },

      { $sort: { code: 1 } }
    ]);

    res.status(200).json(report);
  } catch (error) {
    console.error("Reporting Error:", error);
    res.status(500).json({ message: "Failed to generate Trial Balance", error: error.message });
  }
};