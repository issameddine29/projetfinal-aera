/**
* CONFIGURATION N8N - MORAIS CLEANING (legacy)
*
* Ce fichier était écrit en module ES (avec `export`) et pouvait casser s'il était chargé
* via une balise <script> classique. On le rend "safe" en attachant les URLs à `window`.
*
* Source of truth: `public/js/config/n8n-webhooks.js` (window.MORAIS_N8N_WEBHOOKS)
*/
(function () {
  window.MORAIS_N8N_WEBHOOKS = window.MORAIS_N8N_WEBHOOKS || {};
  window.MORAIS_N8N_WEBHOOKS.CONTACT = window.MORAIS_N8N_WEBHOOKS.CONTACT || 'https://n8n.morais-cleaning.com/webhook/contact';
  window.MORAIS_N8N_WEBHOOKS.RECRUTEMENT = window.MORAIS_N8N_WEBHOOKS.RECRUTEMENT || 'https://n8n.morais-cleaning.com/webhook/recrutement';
})();
