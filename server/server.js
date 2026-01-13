import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/database.js";
import authRoutes from "./routes/auth.js";
import profileRoutes from "./routes/profile.js";
import patientRoutes from "./routes/patient.js";
import testCategoryRoutes from "./routes/testCategories.js";
import testRoutes from "./routes/tests.js";
import "./models/index.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

await connectDB();

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["set-cookie"],
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '5mb' }));

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/patient", patientRoutes);
app.use("/api/categories", testCategoryRoutes);
app.use("/api/tests", testRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
