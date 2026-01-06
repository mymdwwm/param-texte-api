/* 
Tests d'intégration pour l'API
Teste les endpoints complets
*/

import request from "supertest";
import { app } from "../app";

describe("API Endpoints", () => {
  
  // Variable pour stocker le token entre les tests
  let authToken: string;

  // Test de santé
  describe("GET /health", () => {
    it("devrait retourner OK", async () => {
      const response = await request(app).get("/health");
      
      expect(response.status).toBe(200);
      expect(response.text).toBe("OK");
    });
  });

  // Test de génération de token
  describe("POST /api/token", () => {
    it("devrait générer un token avec un email valide", async () => {
      const response = await request(app)
        .post("/api/token")
        .send({ email: "test@example.com" });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("token");
      expect(typeof response.body.token).toBe("string");
      expect(response.body.token.length).toBe(64); // 32 bytes en hex
      
      // Sauvegarder le token pour les tests suivants
      authToken = response.body.token;
    });

    it("devrait rejeter une requête sans email", async () => {
      const response = await request(app)
        .post("/api/token")
        .send({});
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
    });

    it("devrait rejeter un email invalide", async () => {
      const response = await request(app)
        .post("/api/token")
        .send({ email: "invalid-email" });
      
      expect(response.status).toBe(400);
      expect(response.body.error).toContain("invalide");
    });
  });

  // Test de justification
  describe("POST /api/justify", () => {
    
    // Générer un token avant tous les tests de justify
    beforeAll(async () => {
      const response = await request(app)
        .post("/api/token")
        .send({ email: "justify-test@example.com" });
      
      authToken = response.body.token;
    });

    it("devrait justifier un texte avec un token valide", async () => {
      const text = "Longtemps je me suis couché de bonne heure";
      
      const response = await request(app)
        .post("/api/justify")
        .set("Content-Type", "text/plain")
        .set("Authorization", `Bearer ${authToken}`)
        .send(text);
      
      expect(response.status).toBe(200);
      expect(response.type).toBe("text/plain");
      expect(response.text).toBeTruthy();
    });

    it("devrait rejeter une requête sans token", async () => {
      const response = await request(app)
        .post("/api/justify")
        .set("Content-Type", "text/plain")
        .send("Test");
      
      expect(response.status).toBe(401);
      expect(response.body.error).toContain("Token manquant");
    });

    it("devrait rejeter un token invalide", async () => {
      const response = await request(app)
        .post("/api/justify")
        .set("Content-Type", "text/plain")
        .set("Authorization", "Bearer invalid-token-12345")
        .send("Test");
      
      expect(response.status).toBe(401);
      expect(response.body.error).toContain("invalide");
    });

    it("devrait rejeter un texte vide", async () => {
      const response = await request(app)
        .post("/api/justify")
        .set("Content-Type", "text/plain")
        .set("Authorization", `Bearer ${authToken}`)
        .send("");
      
      expect(response.status).toBe(400);
    });

    it("devrait rejeter si le format Authorization est incorrect", async () => {
      const response = await request(app)
        .post("/api/justify")
        .set("Content-Type", "text/plain")
        .set("Authorization", authToken) // Sans "Bearer"
        .send("Test");
      
      expect(response.status).toBe(401);
      expect(response.body.error).toContain("Format");
    });
  });

  // Test 404
  describe("Routes non existantes", () => {
    it("devrait retourner 404 pour une route inexistante", async () => {
      const response = await request(app).get("/route-inexistante");
      
      expect(response.status).toBe(404);
      expect(response.body.error).toContain("non trouvée");
    });
  });
});