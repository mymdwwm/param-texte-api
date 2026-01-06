/* 
Tests unitaires pour le service de justification
*/

import { justifyText } from "../services/justify.service";

// Groupe de tests pour la fonction justifyText
describe("justifyText", () => {
  
  // Test 1 : Texte simple sur une ligne
  it("devrait justifier un texte court sur une seule ligne", () => {
    const input = "Bonjour le monde";
    const result = justifyText(input, 20);
    
    // Le texte est trop court pour être justifié, il reste tel quel
    expect(result).toBe("Bonjour le monde");
  });

  // Test 2 : Texte qui nécessite plusieurs lignes
  it("devrait justifier un texte sur plusieurs lignes", () => {
    const input = "Longtemps je me suis couché de bonne heure";
    const result = justifyText(input, 20);
    
    const lines = result.split("\n");
    
    // Vérifier qu'il y a bien plusieurs lignes
    expect(lines.length).toBeGreaterThan(1);
    
    // Vérifier que les lignes (sauf la dernière) font 20 caractères
    for (let i = 0; i < lines.length - 1; i++) {
      expect(lines[i].length).toBe(20);
    }
    
    // La dernière ligne peut être plus courte
    expect(lines[lines.length - 1].length).toBeLessThanOrEqual(20);
  });

  // Test 3 : Texte avec la longueur par défaut (80)
  it("devrait utiliser 80 caractères par défaut", () => {
    const input = "Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua";
    const result = justifyText(input);
    
    const lines = result.split("\n");
    
    // Vérifier que les lignes (sauf la dernière) font 80 caractères
    for (let i = 0; i < lines.length - 1; i++) {
      expect(lines[i].length).toBe(80);
    }
  });

  // Test 4 : Texte vide
  it("devrait retourner une chaîne vide pour un texte vide", () => {
    expect(justifyText("")).toBe("");
    expect(justifyText("   ")).toBe("");
  });

  // Test 5 : Un seul mot
  it("devrait gérer un texte avec un seul mot", () => {
    const result = justifyText("Bonjour", 20);
    expect(result).toBe("Bonjour");
  });

  // Test 6 : Espaces multiples entre les mots
  it("devrait gérer les espaces multiples", () => {
    const input = "Bonjour    le     monde";
    const result = justifyText(input, 20);
    
    // Les espaces multiples sont normalisés
    expect(result).toContain("Bonjour");
    expect(result).toContain("monde");
  });

  // Test 7 : Texte avec retours à la ligne
  it("devrait gérer les retours à la ligne dans le texte d'entrée", () => {
    const input = "Bonjour\nle\nmonde";
    const result = justifyText(input, 20);
    
    // Les retours à la ligne sont traités comme des espaces
    expect(result).toContain("Bonjour");
    expect(result).toContain("monde");
  });

  // Test 8 : Mot plus long que la longueur maximale
  it("devrait gérer un mot plus long que la longueur maximale", () => {
    const input = "Anticonstitutionnellement est un mot long";
    const result = justifyText(input, 20);
    
    // Le mot long doit être sur sa propre ligne
    expect(result).toContain("Anticonstitutionnellement");
  });
});