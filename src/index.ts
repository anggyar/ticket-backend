import express from "express";
import router from "./routes/api";

import bodyParser from "body-parser";

import db from "./utils/database";

async function init() {
  try {
    // Connect to the database
    const result = await db();
    console.info("Database connection result:", result);

    // Initialize Express app
    const app = express();
    const PORT = 3003;

    // Middleware
    app.use(bodyParser.json());

    app.use("/api/", router);

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.info(error);
  }
}

init();
