
import express from "express"
export const app = express();
import cookieParser from "cookie-parser";
import connectDB from "./src/configure/db.js";
import cors from 'cors'
import index from './src/route/index.js'


app.use(
  cors({
    origin: [
      "http://localhost:3000",
    
    ],
    credentials: true,
  })
);



app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());


app.use('/api', index)

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");

});

connectDB()