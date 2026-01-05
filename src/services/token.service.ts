/* Gestion des tokens - Logique métier */

import crypto from "crypto"; // Module (natif node) de sécurité
import { Token } from "../types"; // Importation d'interface

const tokens = new Map<string, Token>(); // Structure de stockage clé-valeur Map(sans bdd)

export function generateToken(email: string) : string {

    const token = crypto.randomBytes(32).toString("hex");

    tokens.set(token, { // stocker dans Map
        token,
        email,
        createdAt : new Date(),
    });

    return token;
}

export function verifyToken(token: string): boolean { // Vérifie la validité
    return tokens.has(token); // si la clé existe dans la Map (true)
}

export function getTokenInfo(token: string): Token | undefined {
    return tokens.get(token); // récupère la valeur associée à la clé si il ai trouvé
}

export function deleteToken(token: string): boolean {
    return tokens.delete(token); // supprime le token + true
}