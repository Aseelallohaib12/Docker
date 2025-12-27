import express from "express";
import cors from "cors";

const app = express();

// السماح بأي دومين للوصول (يمكن تضييقها لاحقًا)
app.use(cors());

// البقية كما هي
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Docker Backend is running ✅");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
