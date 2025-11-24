import express from 'express';
import { createTaxRate, getAllTaxRates, updateTaxRate } from '../controllers/TaxRateController.js';
 
 

const TaxRaterouter = express.Router();

TaxRaterouter.post('/', createTaxRate);
TaxRaterouter.get('/', getAllTaxRates);
TaxRaterouter.put('/:id', updateTaxRate);

export default TaxRaterouter;