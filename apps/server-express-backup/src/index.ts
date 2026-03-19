import cors from "cors";
import express from "express";

const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 3030;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

app.get("/api/hello", (req, res) => {
  const name = typeof req.query.name === "string" ? req.query.name : "world";
  res.json({ message: `hello ${name}` });
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
