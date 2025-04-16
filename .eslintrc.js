module.exports = {
  env: {
    node: true, // Variables globales de Node.js (module, require, __dirname)
    es2021: true, // Soporte para ES2021 (async/await, etc.)
  },
  extends: [
    "eslint:recommended", // Reglas estándar
    "prettier", // Evita conflictos con Prettier
  ],
  rules: {
    "no-console": "warn", // Advertencia por console.log (pero no error)
    "no-unused-vars": "error",
  },
};
