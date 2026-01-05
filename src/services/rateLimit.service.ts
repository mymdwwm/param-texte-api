/* Gestion de mots par token  : 80 000 / jour */

import { TokenUsage } from "../types";

const usageMap = new Map<string, TokenUsage>(); // clé = token -> valeur = nmbr mots

const DAILY_LIMIT = 80000;

function getTodayDate(): string {
    return new Date().toISOString().split("T")[0];
}

export function countWords(text: string): number {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
} // Compteur de mots

export function canProcessWords(token: string, wordCount: number): boolean {
    const today = getTodayDate(); // Date du jour
    const usage = usageMap.get(token) // utilise le token

    if (!usage || usage.date !== today) { 
        usageMap.set(token, {
        date: today,
        wordCount: 0 // reinitialisation 
        });
        return wordCount <= DAILY_LIMIT;
    }

    return (usage.wordCount + wordCount) <= DAILY_LIMIT;
}

export function recordUsage(token: string, wordCount: number): void {
    const today = getTodayDate();
    const usage = usageMap.get(token);

    if (!usage || usage.date !== today) { // si nouveau
        usageMap.set(token, {
        date: today,
        wordCount: wordCount // démarrage
        });
    } else{ // ou ajout 
        usage.wordCount += wordCount;
    }
}

export function getRemainingWords(token: string): number { // nombre de mots restant /jour
    const today = getTodayDate();
    const usage = usageMap.get(token);

    if (!usage || usage.date !== today) {
        return DAILY_LIMIT;
    }
    // si utilisé
    return Math.max(DAILY_LIMIT - usage.wordCount, 0);
}