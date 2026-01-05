/* Types du projet */

export interface Token { // 1 Token lié à un utilisateur 
    token: string; // Token unique géréré
    email: string; // Mail utilisateur
    createdAt: Date; // Date de création
}

export interface TokenRequestBody {
    email : string;  // Body de la requête
}

//////// Usage : Limite

export interface TokenUsage {
    wordCount: number; // Nombre traités /jour
    date: string;
}

//////// TextJustify

export interface JustifyConfig {
    maxLineLength : number // longueur maximal 
}

//////// Réponses

export interface ErrorResponse { // ERREUR 
    error : string; // Message d'erreur
    code?: string;  //Correspondance code erreur
}

export interface TokenResponse { // SUCCÈS
    token: string;
}