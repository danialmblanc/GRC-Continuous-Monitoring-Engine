import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import cors from "cors";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // GRC Monitoring API
  app.get("/api/grc/dashboard", async (req, res) => {
    try {
      const { runAllControls } = await import('./src/modules/grc-monitoring/controls/all-controls');
      const results = await runAllControls();
      
      const categories = [...new Set(results.map(r => r.category))];
      const summary = categories.map(cat => {
        const catResults = results.filter(r => r.category === cat);
        return {
          category: cat,
          total: catResults.length,
          green: catResults.filter(r => r.status === "pass").length,
          yellow: catResults.filter(r => r.status === "warning").length,
          red: catResults.filter(r => r.status === "fail").length,
          gray: catResults.filter(r => r.status === "unknown").length,
        };
      });

      res.json({ results, summary });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch GRC dashboard data" });
    }
  });

  app.post("/api/grc/run-control", async (req, res) => {
    const { control_id } = req.body;
    try {
      const { allControls } = await import('./src/modules/grc-monitoring/controls/all-controls');
      const controlFn = allControls[control_id];
      if (!controlFn) {
        return res.status(404).json({ error: "Control not found" });
      }
      const result = await controlFn();
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to run control" });
    }
  });

  app.get("/api/grc/control/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const { allControls } = await import('./src/modules/grc-monitoring/controls/all-controls');
      const controlFn = allControls[id];
      if (!controlFn) {
        return res.status(404).json({ error: "Control not found" });
      }
      const result = await controlFn();
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch control details" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
