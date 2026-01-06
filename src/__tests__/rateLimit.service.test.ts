/* 
Tests unitaires pour le service de rate limiting
*/

import { countWords, canProcessWords, recordUsage, getRemainingWords } from "../services/rateLimit.service";

describe("countWords", () => {
  
  it("devrait compter correctement les mots", () => {
    expect(countWords("Bonjour le monde")).toBe(3);
    expect(countWords("Un")).toBe(1);
    expect(countWords("")).toBe(0);
  });

  it("devrait gérer les espaces multiples", () => {
    expect(countWords("Bonjour    le     monde")).toBe(3);
  });

  it("devrait gérer les espaces au début et à la fin", () => {
    expect(countWords("   Bonjour le monde   ")).toBe(3);
  });

  it("devrait gérer les retours à la ligne", () => {
    expect(countWords("Bonjour\nle\nmonde")).toBe(3);
  });
});

describe("Rate limiting", () => {
  
  // Token de test unique pour chaque test
  const testToken = "test-token-" + Date.now();

  it("devrait autoriser le traitement sous la limite", () => {
    const token = testToken + "-1";
    expect(canProcessWords(token, 1000)).toBe(true);
  });

  it("devrait enregistrer l'utilisation correctement", () => {
    const token = testToken + "-2";
    
    // Vérifier la limite complète au départ
    expect(getRemainingWords(token)).toBe(80000);
    
    // Enregistrer 1000 mots
    recordUsage(token, 1000);
    
    // Vérifier qu'il reste 79000 mots
    expect(getRemainingWords(token)).toBe(79000);
  });

  it("devrait bloquer si la limite est dépassée", () => {
    const token = testToken + "-3";
    
    // Enregistrer 79000 mots
    recordUsage(token, 79000);
    
    // Essayer d'ajouter 2000 mots (dépasserait 80000)
    expect(canProcessWords(token, 2000)).toBe(false);
  });

  it("devrait autoriser exactement 80000 mots", () => {
    const token = testToken + "-4";
    
    // 80000 mots pile
    expect(canProcessWords(token, 80000)).toBe(true);
    
    recordUsage(token, 80000);
    
    // Plus aucun mot disponible
    expect(getRemainingWords(token)).toBe(0);
  });

  it("devrait accumuler les utilisations", () => {
    const token = testToken + "-5";
    
    // Premier appel : 1000 mots
    recordUsage(token, 1000);
    expect(getRemainingWords(token)).toBe(79000);
    
    // Deuxième appel : 2000 mots supplémentaires
    recordUsage(token, 2000);
    expect(getRemainingWords(token)).toBe(77000);
    
    // Troisième appel : 500 mots supplémentaires
    recordUsage(token, 500);
    expect(getRemainingWords(token)).toBe(76500);
  });
});