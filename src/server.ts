/* 
Port d'entrée - Start Express
*/

import { app } from "./app";

const PORT = Number(process.env.PORT) || 3000; // Définition du PORT d'écoute par défaut

app.listen(PORT, ()=> {  // Démarrage du serveur 
    console.log(`Serveur sur http://localhost:${PORT}`);
});