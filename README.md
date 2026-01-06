# API de Justification de Texte

API REST pour justifier du texte avec authentification par token et rate limiting.

## Fonctionnalités

-  Génération de tokens d'authentification
-  Justification de texte sur 80 caractères par ligne
-  Rate limiting : 80 000 mots maximum par token et par jour
-  Tests unitaires et d'intégration
-  TypeScript


## 🔧 Installation

```bash
# Cloner le projet
git clone <https://github.com/mymdwwm/param-texte-api.git>

# Installer les dépendances
npm install

# Compiler TypeScript
npm run build
```

## Démarrage
### Mode développement (avec rechargement automatique)
```bash
npm run dev
```

### Mode production
```bash
npm run build
npm start
```

Le serveur démarre sur `http://localhost:3000`

## Endpoints
### 1. Vérification health

```http
GET /health
```

**Réponse :**
```
OK
```

### 2. Générer un token

```http
POST /api/token
Content-Type: application/json

{
  "email": "test@example.com"
}
ou
{
    email": "foo@bar.com
}


```

**Réponse (200) :**
```json
{
  "token": "a3f5d8c2e1b4f7a9c8d2e5f1b3a6c9d2e4f7a0c3d6e9f2b5a8c1d4e7f0a3b6c9"
}
```

**Erreurs possibles :**
- `400` : Email manquant ou invalide

---

### 3. Justifier un texte

```http
POST /api/justify
Content-Type: text/plain
Authorization: Bearer <token>

Longtemps, je me suis couché de bonne heure. Parfois, à peine ma bougie éteinte...
```

**Réponse (200) :**
```
Content-Type: text/plain

Longtemps,  je  me  suis  couché  de bonne heure. Parfois, à peine ma bougie
éteinte, mes yeux se fermaient si vite que je n'avais pas le temps de me dire:
'Je m'endors.'
```

**Erreurs possibles :**
- `400` : Texte manquant ou vide
- `401` : Token manquant ou invalide
- `402` : Rate limit dépassé (plus de 80 000 mots aujourd'hui) : Payment required

---

## Tests

```bash
# Lancer tous les tests
npm test

# Avec couverture de code
npm run test:coverage

# Mode watch
npm run test:watch
```

## Exemples d'utilisation

### Avec cURL

```bash
# 1. Obtenir un token
TOKEN=$(curl -s -X POST http://localhost:3000/api/token \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}' | jq -r '.token')

# 2. Justifier du texte
curl -X POST http://localhost:3000/api/justify \
  -H "Content-Type: text/plain" \
  -H "Authorization: Bearer $TOKEN" \
  -d "Longtemps, je me suis couché de bonne heure. Parfois, à peine ma bougie éteinte, mes yeux se fermaient si vite que je n'avais pas le temps de me dire: 'Je m'endors.'"
```


##  Sécurité

- Tokens générés avec `crypto.randomBytes` 
- Authentification Bearer token requise pour `/api/justify`
- Rate limiting par token 
- Validation des entrées (email, texte)







(mailto:myriam.malki@hotmail.fr)