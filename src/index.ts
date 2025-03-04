import express from "express";
import campaign from "./routes/campaigns.js";
import process from "process";

const { SERVER_PORT } = process.env;

const app = express();

app.use(express.json())

app.use('/campaigns', campaign);

app.listen(SERVER_PORT, () => console.log('server is ready in port ' + SERVER_PORT));