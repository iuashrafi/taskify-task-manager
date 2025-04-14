const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();

// ENV variables
const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL;

// Middlewares
const authenticateUser = require('./middleware/authMiddleware');
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to DB
mongoose
  .connect(MONGO_URL)
  .then(() => console.log("[MONGO_DB] Connected Successfully!"))
  .catch((error) =>
    console.error(`[MONGO_DB] Connecting failed! ERROR :`, error)
  );

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/task", authenticateUser, require("./routes/taskRoutes"));
app.use("/api/column", authenticateUser, require("./routes/columnRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));

app.listen(PORT, () => {
  console.log(`Example app listening on PORT ${PORT}`);
});
