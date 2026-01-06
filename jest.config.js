/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    // Utilise ts-jest pour compiler TypeScript pendant les tests
    preset: 'ts-jest',
    
    // Environnement Node.js
    testEnvironment: 'node',
    
    // Dossiers où chercher les tests
    roots: ['<rootDir>/src'],
    
    // Pattern pour trouver les fichiers de test
    testMatch: [
      '**/__tests__/**/*.ts',
      '**/?(*.)+(spec|test).ts'
    ],
    
    // Dossiers à ignorer
    testPathIgnorePatterns: [
      '/node_modules/',
      '/dist/'
    ],
    
    // Coverage (couverture de code)
    collectCoverageFrom: [
      'src/**/*.ts',
      '!src/**/*.test.ts',
      '!src/**/*.spec.ts',
      '!src/server.ts' // Fichier de démarrage, pas besoin de le tester
    ],
    
    // Seuils de couverture (optionnel, ajuste selon tes besoins)
    coverageThreshold: {
      global: {
        branches: 70,
        functions: 70,
        lines: 70,
        statements: 70
      }
    }
  };