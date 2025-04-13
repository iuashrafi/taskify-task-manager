const express = require('express')
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const app = express()

// ENV variables
const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL;

// Middlewares
app.use(cors());
app.use(express.json());

// Connect to DB
mongoose.connect(MONGO_URL).then(()=>console.log('[MONGO_DB] Connected Successfully!')).catch((error)=>
console.error(`[MONGO_DB] Connecting failed! ERROR :`, error))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use("/api/task", require("./routes/taskRoutes"))
app.use("/api/column", require("./routes/columnRoutes"))

app.listen(PORT, () => {
  console.log(`Example app listening on PORT ${PORT}`)
})