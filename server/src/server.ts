import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import cron from "node-cron";

import {SERVER_PORT} from "../../shared/constants";

import playerRoutes from "./routes/Player"
import bookAccountRoutes from "./routes/BookAccount"
import bookSessionRoutes from "./routes/BookSession"

const app = express();

app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors());
app.use(express.json());

app.use('/Player', playerRoutes);
app.use('/BookAccount', bookAccountRoutes);
app.use('/BookSession', bookSessionRoutes);


// begin listening for requests to pass into the installed handlers
app.listen(SERVER_PORT, () => {
    console.log(`Listening on port ${SERVER_PORT}...`);
});


