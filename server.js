import express from "express";
import dotenv from "dotenv";
dotenv.config();

import cookieParser from "cookie-parser";
import cors from "cors";
import { swaggerUi, swaggerSpec } from "./config/swagger.js";
import authRoutes from "./routes/authRoutes.js";
import { connectDB, disconnectDB } from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";



const PORT = process.env.PORT || 5001;
if(!PORT){
  console.error("PORT is not set");

}
const app = express();


app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));


app.use(
  cors({
    origin: ["http://localhost:3000", "https://henok-birhanu.vercel.app","http://localhost:5001","http://localhost:8080"],
    credentials: true,
  })
);

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} ${new Date().toISOString()}`);
  next();
})

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/comments", commentRoutes);

const startServer = async () => {
  try {
    await connectDB();
    console.log(" Database connected");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error(" Error starting server:", error);
    process.exit(1);
  }
};

// ----------------------
// Graceful Shutdown
// ----------------------
const shutdown = async (signal) => {
  console.log(`\n Received ${signal}. Shutting down gracefully...`);

  try {
    await disconnectDB();
    console.log(" Database disconnected");
    process.exit(0);
  } catch (error) {
    console.error(" Error during shutdown:", error);
    process.exit(1);
  }
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

startServer();

export default app;
