import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import Userrouter from './routes/UserRoute.js';
import Projectrouter from './routes/ProjectRoute.js';
import Customerrouter from './routes/Customer.js';
import ResourcesRouter from './routes/Resources.js';
import Organizationrouter from './routes/OrganizationRoute.js';
import searchrouter from './routes/Search.js';
import Invoicerouter from './routes/InvoiceRoute.js';
import TaxRaterouter from './routes/TaxRateRoute.js';
import ChartAccountrouter from './routes/ChartOfAccountRoute.js';
import Expencesrouter from './routes/ExpenseRoute.js';

dotenv.config();

const app = express();
const mongoUrl = process.env.MONGODB_URI;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

mongoose.connect(mongoUrl, {})
  .then(() => {
    console.log("Database connected");
  })
  .catch(err => {
    console.error("Database connection error:", err);
  });

app.use(cors());
app.use(bodyParser.json());

app.use((req, res, next) => {
  const token = (req.header("Authorization"))?.replace("Bearer ", "");
  
  if (token != null) {
    jwt.verify(token, process.env.SECRET, (error, decoded) => {
      if (!error) {
        req.user = decoded;
      }
    });
  }
  next();
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/api/users", Userrouter);
app.use("/api/projects", Projectrouter);
app.use("/api/customers", Customerrouter);
app.use("/api/resources", ResourcesRouter);
app.use("/api/organizations", Organizationrouter);
app.use("/api/finance/accounts", ChartAccountrouter);
app.use("/api/finance/tax-rates", TaxRaterouter);
app.use("/api/finance/expenses", Expencesrouter);
app.use("/api/search", searchrouter);
if (Invoicerouter) {
  app.use("/api/invoices", Invoicerouter.default || Invoicerouter);
  console.log('Invoice routes mounted successfully');
} else {
  console.error('Invoice routes NOT mounted - check file path/syntax');
}app.listen(
  5000,
  ()=>{
    console.log('Server is running on port 5000');
  }
)
