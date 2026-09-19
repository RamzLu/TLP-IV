import 'dotenv/config';
import express from 'express';
import mongoose, { mongo } from 'mongoose';
import { errorHandler } from './middlewares/errorHandler';
import { DB } from './config/database';

const app = express();
app.use(express.json());
app.use(errorHandler)

const PORT = Number(process.env.PORT ?? 3000);

const dbConfig = {
  mongoUrl: process.env.MONGO_URI ?? 'mongodb://localhost:27017',
  dbName: 'employees_db'
}

const database = new DB(dbConfig);

database.connect().then(() => {
  app.listen(PORT, () =>{
    console.log(`Servidor escuchando en http://localhost:${PORT}`)
  })
})
