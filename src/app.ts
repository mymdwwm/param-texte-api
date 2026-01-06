/* config express + routes */

import express from "express";
import { tokenRouter } from "./routes/token.routes";
import { justifyRouter } from "./routes/justify.routes";

export const app = express(); // création de l'app

//////// Midlewares

app.use(express.json()); // Middleware (json)

app.use(express.text({ type: "text/plain", limit: "1mb"})); // Middleware (texte à justifier)

//////// Routes

app.get("/health",(_req, res)=>{ // Route de vérification du fonctionnement
    res.status(200).send("OK");
});

app.use("/api", tokenRouter);

app.use("/api", justifyRouter);

//////// Erreurs

app.use((_req, res) => {
    res.status(404).json({ 
      error: "Route noN trouvée" // si aucune route répond
    });
  });

  app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error("erreur serveur : ", err);
    res.status(500).json({
         error: "erreur interne du serveur" // 500 (Internal Server Error)
        });
  });
