import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const PORT = process.env.PORT || 5001;

const app = express()

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ["http://localhost:3000", "https://henok-birhanu.vercel.app"],
  credentials: true
}));


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
