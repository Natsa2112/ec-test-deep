import { app, prisma } from "./app.js";

const PORT = process.env.PORT ?? 3001;

app.listen(PORT, () => {
  console.log(`🚀 TechStore API running on http://localhost:${PORT}`);
});
