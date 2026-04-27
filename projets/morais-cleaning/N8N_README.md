# n8n Integration Guide for Morais Cleaning

This document collects the current conventions, helper code and email templates used
by the various n8n workflows powering the Morais Cleaning website.

## 1. Payload normalization & spam check

All incoming webhook data should pass through the `normalize-spam.js` function node.
It performs the following tasks:

1. Convert every field value to a string. Objects/arrays are JSON-stringified.
2. Replace `null`/`undefined` with empty strings to avoid `Cannot convert object to primitive` errors.
3. Add a new `is_spam` field (`'yes'` or `'no'`) based on simple heuristics:
   * Blacklisted email domains (e.g. `@test.com`, `@mailinator.com`).
   * Phone numbers starting with suspicious country codes (+234, +225, etc.).

Usage inside a Function node:
```js
// copy-paste the contents of n8n/normalize-spam.js into the Function node
```

Place this node immediately after the incoming Webhook node. Later nodes can rely
on normalized strings and benefit from a ready-made spam flag.

> **Tip:** Extend the domain list or prefixes as new spam patterns are observed.

## 2. Webhook URLs & payload structure

| Form                      | Webhook path                         | Example fields                                                   |
|--------------------------|--------------------------------------|------------------------------------------------------------------|
| Contact                  | `/webhook/contact`                   | `fullName`, `email`, `phone`, `serviceWanted`, `message`, etc.   |
| Recruitment              | `/webhook/recrutement`               | `nom`, `email`, `telephone`, `poste`, `motivation`, `cv` binary   |
| Mini quote (devis-rapide) | `/webhook/mini-devis`               | `nom`, `email`, `telephone`, `service`, `surface`, etc.          |
| Full quote calculator     | `/webhook/devis-complet` completely  | flattened data + `estimation_total` + `estimation_detail`        |

The `calculateur-devis-avance.js` script already formats the full quote
payload identically to the mini-devis, with `source: 'calculateur-devis-avance'`.

For file uploads (CVs) the frontend sends a `FormData` object with field named
`cv`. n8n automatically creates a binary attachment when the webhook node
has `Binary Property` set to `cv`.

## 3. Email templates

Email HTML templates are stored under `n8n_email_templates/`. Three primary
files exist:

* `email_client_devis.html` – confirmation email sent to customers after they
  request a quote.
* `email_interne_devis.html` – internal notification for the sales team.
* `email_candidat_recrutement.html` – acknowledgment sent to job applicants.

They have been restyled to use a cleaner, table-based layout and company colors.
Feel free to adjust the colors/text to match current branding.

## 4. Front‑end scripts

JavaScript helpers in `public/js/` handle form validation and submission:

* `forms-manager.js` – reusable logic for contact & recruitment forms
* `devis-rapide.js` – mini quote form used across many pages
* `calculateur-devis-avance.js` – advanced multi-step quote calculator
* `pages/recrutement.js` – custom script for the recruitment page with
  drag‑and‑drop CV upload

These scripts already contain robust error handling, loading indicators and
use the normalized JSON format expected by n8n. When updating payloads, mirror
the structure in both mini and full calculators for consistency.

## 5. Security considerations

* CORS: Webhook endpoints should allow only necessary origins. The front end
  uses the `fetch` API; ensure n8n's CORS settings include the production
  domain(s).
* IP filtering: if n8n is self-hosted, restrict inbound connections to the
  static IPs used by the front-end hosting or use a VPN/Cloudflare Tunnel.
* Rate limiting: consider adding a rate limit node or external firewall rule
  to prevent abuse.

---

Keep this README up to date when adding new workflows or modifying data formats.
## 6. n8n workflows (Brevo API version)

This repository now includes ready-to-import n8n workflow exports using **Brevo API over HTTPS** (no SMTP).
This avoids common VPS blocks on ports 25/465/587.

Location:
- `n8n/workflows/devis-complet.brevo.json`
- `n8n/workflows/mini-devis.brevo.json`
- `n8n/workflows/recrutement.brevo.json`

### What you must set in n8n

1. **Brevo API Key**
   - Recommended: set an environment variable in n8n called `BREVO_API_KEY`.
   - The workflows read it via `{{$env.BREVO_API_KEY}}`.

2. **Airtable credentials & table IDs**
   - The workflow exports include placeholders like `REPLACE_WITH_YOUR_AIRTABLE_CRED_ID`.
   - After import, select your existing Airtable credential in each Airtable node.
   - In the recruitment workflow, replace `REPLACE_WITH_RECRUTEMENT_TABLE_ID` with your real Airtable table id.

3. **Recruitment CV attachment**
   - The recruitment workflow expects the webhook to receive a multipart form upload with field name `cv`.
   - If `cv` exists as binary, it is attached to the internal HR email via Brevo `attachments`.

