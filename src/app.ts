/* config express + routes */

import express from "express";

export const app = express(); // création de l'app

app.use(express.json()); // Middleware (json)

app.use(express.text({ type: "text/plain" })); // Middleware (texte)

app.get("/health",(_req, res)=>{ // Route de vérification 
    res.status(200).send("OK");
});