import express from 'express';
import { getTrialBalance } from '../controllers/ReportController.js';

const Reportrouter = express.Router();

Reportrouter.get('/trial-balance', getTrialBalance);

export default Reportrouter;