// normalize-spam.js
// Utilities for n8n workflows inserted at the beginning of a flow.
//  - Flatten and stringify all incoming data values
//  - Protect against null/undefined and objects
//  - Add a simple `is_spam` field based on blacklist heuristics
//  - Ensures later nodes can safely access `item.json.xxx` as strings

// node input: items array (n8n standard)
const input = items[0].json || {};
const output = {};

// Convert every property to a string; stringify objects/arrays
for (const key of Object.keys(input)) {
  let value = input[key];
  if (value === null || value === undefined) {
    output[key] = '';
  } else if (typeof value === 'object') {
    try {
      output[key] = JSON.stringify(value);
    } catch (e) {
      output[key] = String(value);
    }
  } else {
    output[key] = String(value);
  }
}

// Spam detection rules ------------------------------------------------------
const email = (output.email || '').toLowerCase();
const phone = (output.telephone || output.phone || '').trim();

// simple domain blacklist (extend as needed)
const blacklistedDomains = [
  '@test.com',
  '@spam.com',
  '@mailinator.com',
  '@yopmail.com',
  '@disposablemail.com',
];

// suspicious phone prefixes (common high‑risk countries, can be expanded)
const suspiciousPrefixes = ['+234', '+225', '+247', '+243', '+257', '+256'];

let isSpam = false;

if (email) {
  for (const d of blacklistedDomains) {
    if (email.includes(d)) {
      isSpam = true;
      break;
    }
  }
}

if (!isSpam && phone) {
  for (const p of suspiciousPrefixes) {
    if (phone.startsWith(p)) {
      isSpam = true;
      break;
    }
  }
}

output.is_spam = isSpam ? 'yes' : 'no';

return [{ json: output }];
