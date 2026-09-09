"use strict";

const express = require("express");
const path = require("path");

const app = express();

// Render يحدد PORT تلقائياً
const PORT = process.env.PORT || 3000;

// استقبال JSON
app.use(express.json());

// ملفات الواجهة
app.use(express.static(path.join(__dirname, "public")));

// الصفحة الرئيسية
app.get("/", (req, res) => {
    res.sendFile(
        path.join(__dirname, "public", "index.html")
    );
});

// فحص حالة السيرفر
app.get("/api/status", (req, res) => {
    res.json({
        success: true,
        game: "مَن يزيد؟",
        status: "online"
    });
});

// تشغيل السيرفر
app.listen(PORT, () => {
    console.log("=================================");
    console.log("      مَن يزيد؟ - LIVE GAME");
    console.log("=================================");
    console.log(`Server running on port ${PORT}`);
});
