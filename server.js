// server.js
import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { exec } from "child_process";

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" })); // دعم مشاريع كبيرة

const PROJECTS_DIR = path.join(process.cwd(), "projects");
if (!fs.existsSync(PROJECTS_DIR)) fs.mkdirSync(PROJECTS_DIR);

// Route رئيسي للتأكد من عمل السيرفر
app.get("/", (req, res) => {
  res.send("Docker Backend is running ✅");
});

// Route لاستقبال مشاريع AI وبناءها
app.post("/build-project", async (req, res) => {
  try {
    const { name, files, type } = req.body; 
    // type: react / vue / flutter-web

    if (!name || !files || !Array.isArray(files)) {
      return res.status(400).json({ error: "Invalid project format" });
    }

    const projectPath = path.join(PROJECTS_DIR, name);
    if (!fs.existsSync(projectPath)) fs.mkdirSync(projectPath);

    // حفظ كل الملفات المرسلة
    for (let file of files) {
      const filePath = path.join(projectPath, file.name);
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, file.content);
    }

    // تحديد أمر البناء حسب نوع المشروع
    let buildCommand = "";
    if (type === "react" || type === "vue") {
      buildCommand = `cd ${projectPath} && npm install && npm run build`;
    } else if (type === "flutter-web") {
      buildCommand = `cd ${projectPath} && flutter pub get && flutter build web`;
    } else {
      return res.status(400).json({ error: "Unsupported project type" });
    }

    // تنفيذ البناء
    exec(buildCommand, (err, stdout, stderr) => {
      if (err) {
        console.error("Build error:", stderr);
        return res.status(500).json({ error: "Failed to build project" });
      }

      // تحديد رابط معاينة حسب نوع المشروع
      let previewURL = "";
      if (type === "react" || type === "vue") {
        previewURL = `https://ai-preview-backend.onrender.com/projects/${name}/dist/index.html`;
      } else if (type === "flutter-web") {
        previewURL = `https://ai-preview-backend.onrender.com/projects/${name}/build/web/index.html`;
      }

      console.log(`Project built: ${name} → ${previewURL}`);
      res.json({ previewURL });
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// Serve مجلد المشاريع كـ Static files
app.use("/projects", express.static(PROJECTS_DIR));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
