/* Justification de texte à 80 caractères*/

export function justifyText(text: string, maxLenght: number = 80): string {

    const words = text.trim().split(/\s+/).filter(word => word.length > 0);

  if (words.length === 0) {
    return ""; // Si le texte est vide, retourne une chaîne vide
  }
  const lines = createLines(words, maxLenght); // ligne avec longueur max

  const justifiedLines = lines.map((line, index) => { // Justifier les lignes *
    const isLastLine = index === lines.length - 1; // sauf la dernière
    
    if (isLastLine) {
      return line.join(" ");
    } else {
      return justifyLine(line, maxLenght); // <- sauf la dernière
    }
  });

  return justifiedLines.join("\n"); // retour à la ligne
}

function createLines(words: string[], maxLength: number): string[][] {
  const lines: string[][] = [];
  let currentLine: string[] = [];
  let currentLength = 0; 

  for (const word of words) {
    // Calculer la longueur si on ajoute ce mot
    const lengthWithWord = currentLength + (currentLine.length > 0 ? 1 : 0) + word.length;

    // Si ça dépasse = nouvelle ligne
    if (lengthWithWord > maxLength && currentLine.length > 0) {
      lines.push(currentLine);
      currentLine = [word];
      currentLength = word.length;
    } else {
      // Sinon = ajout sur la même ligne
      currentLine.push(word);
      currentLength = lengthWithWord;
    }
  }

  if (currentLine.length > 0) {
    lines.push(currentLine);
  }
  return lines;
}


function justifyLine(words: string[], maxLength: number): string {
  // Cas particulier : un seul mot dans la ligne = alignement
  if (words.length === 1) {
    return words[0];
  }

  const totalWordLength = words.reduce((sum, word) => sum + word.length, 0); // Calcul du nombre d'espaces à répartir
  const totalSpaces = maxLength - totalWordLength;

  const gaps = words.length - 1; // Nombre de gaps entre les mots 

  // Répartition des espaces - uniformité
  const spacesPerGap = Math.floor(totalSpaces / gaps); // par defaut
  const extraSpaces = totalSpaces % gaps; // Espaces supplémentaires

  let result = "";

  for (let i = 0; i < words.length; i++) {
    result += words[i];

    if (i < words.length - 1) {
      result += " ".repeat(spacesPerGap);
      if (i < extraSpaces) {
        result += " ";
      }
    }
  }
  return result;
}
