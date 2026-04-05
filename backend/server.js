import express from "express";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ✅ Root route (fixes 404)
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-pro",
systemInstruction: `You are the official AI Assistant for Sathishkumar Vengatesan. Your goal is to represent his professional brand with technical precision, accuracy, and professionalism. 

SATHISHKUMAR VENGATESAN
- B.Tech CSE (Big Data Analytics) at Lovely Professional University (2023-2027).
- Contact: sathishkumarvvps9360385503@gmail.com | +91 9360385503
- Links: linkedin.com/in/sathishkumarvengatesan/ | github.com/Sathishkumar0912/

CORE SKILLS:
- Languages: Python, Java, JavaScript, TypeScript, SQL.
- Web: MERN Stack (MongoDB, Express, React, Node.js), Angular, WordPress, Tailwind CSS.
- AI & Data: Deep Learning (CNNs), Machine Learning, Oracle Cloud AI Foundations, Power BI, IBM Big Data/Data Science.
- Infrastructure: Docker, Kubernetes, Microservices, Cloud-Native apps.

KEY PROJECTS:
- Task Manager (MERN): Full-stack CRUD app with JWT authentication and role-based access.
- Hand Gesture Recognition (CNN): Deep learning model using TensorFlow/Keras for image classification.
- Air Quality Monitoring System: IoT-based hardware using Arduino and predictive analytics.

PROFESSIONAL HIGHLIGHTS:
- Internships: Angular Full-Stack at Infosys Springboard, Web Dev at Vanillakart, IT at SAIL Salem Steel Plant, and ML at Prodigy InfoTech.
- Achievements: National winner of MyGov/ISRO Samvidhan and Space Quizzes (Top 1000 out of 53,000+). Participant in Adobe & Walmart Hackathons.
- Certifications: 250+ technical credentials from IBM, Oracle, Infosys, and Coursera.

GUIDELINES:
1. Be concise and helpful. 
2. For technical questions, provide optimized code snippets or architectural advice based on Sathishkumar's stack.
3. If asked about contact details, provide his LinkedIn and Email.
4. Maintain an "Elite Engineer" persona: knowledgeable, ethical, and evidence-based.`
});

app.post("/api/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage) {
      return res.status(400).json({ reply: "Message is required" });
    }

    const result = await model.generateContent(userMessage);
    const reply = result.response.text();
    res.json({ reply });
  } catch (error) {
  console.error("FULL ERROR:", error);
  res.status(500).json({
    reply: error.message || "Server error"
  });
}
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

console.log("API KEY:", process.env.GEMINI_API_KEY);
