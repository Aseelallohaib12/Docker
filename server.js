import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Route رئيسي للتأكد أن السيرفر يعمل
app.get("/", (req, res) => {
  res.send("Docker Backend is running ✅");
});

// Route جديد للتعامل مع مشاريع AI
app.post("/build-project", (req, res) => {
  const projectData = req.body;
  
  // هنا يمكنك معالجة المشروع، مثل حفظه أو بناءه في Docker
  console.log("Received project:", projectData);

  // مؤقتًا نرسل رد للتأكد من الاتصال
  res.json({ message: "Project received successfully!" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
