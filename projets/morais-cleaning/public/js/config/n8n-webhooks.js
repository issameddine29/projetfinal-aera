/**
 * n8n-webhooks.js — Morais Cleaning
 * Configuration globale (non-module) des URLs de webhooks n8n
 * Accessible via window.MORAIS_N8N_WEBHOOKS
 */
(function () {
  window.MORAIS_N8N_WEBHOOKS = {
    MINI_DEVIS: 'https://n8n.morais-cleaning.com/webhook/mini-devis',
    DEVIS_COMPLET: '/api/devis-complet.php',
    RECRUTEMENT: 'https://n8n.morais-cleaning.com/webhook/recrutement',
    CONTACT: 'https://n8n.morais-cleaning.com/webhook/contact'
  };
})();
