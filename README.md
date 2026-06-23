# MamaCare CAD
### Offline-first Maternal Health Computer-Aided Diagnosis Tool

A lightweight Progressive Web App (PWA) for midwives and general practitioners at rural clinics in Sub-Saharan Africa and other low-resource settings. Works fully offline after first load. Installs to Android/iOS home screen like a native app.

---

## What it does

| Module | Offline | AI-enhanced (online) |
|---|---|---|
| Fetal biometry analysis (BPD, HC, AC, FL Z-scores) | ✅ | ✅ |
| Risk triage (FHR, AFI, BP, presentation, placenta) | ✅ | ✅ |
| WHO danger signs checklist (14 signs) | ✅ | — |
| Session log — 100 patients, local storage only | ✅ | — |
| Biometry reference tables (Hadlock/WHO) | ✅ | — |
| AI clinical narrative (Claude Sonnet) | — | ✅ |

---

## Deploy to Netlify (2 minutes)

### Option A — Drag and drop
1. Go to [app.netlify.com](https://app.netlify.com)
2. Drag this entire folder onto the deploy zone
3. Done — live in ~30 seconds

### Option B — CLI
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod --dir .
```

### Option C — GitHub
1. Push this folder to a GitHub repository
2. In Netlify: New site → Import from Git → select repo
3. Build command: *(leave blank)* · Publish directory: `.`

---

## Using the AI features

The app calls the **Google Gemini API** (`gemini-1.5-flash`) for AI clinical summaries. 

Because this is an offline-first, client-only application, the API key is handled directly in the browser to maintain the user's privacy and avoid server round-trips:
1. Go to the **Reference** tab in the app.
2. Enter your **Google Gemini API Key** in the "About & Settings" section.
3. The key is securely saved in your browser's local storage and is only transmitted directly to Google's API when generating a clinical summary.

No backend proxy or serverless function is required.

---

## Offline behaviour

After the first visit, the service worker caches:
- `index.html`
- `offline.html`  
- `manifest.json`
- Icons

All clinical logic (biometry Z-scores, AFI/FHR/BP thresholds, danger signs) runs locally with no network required. Only the AI narrative requires a connection.

---

## Clinical references

- Fetal biometry: Hadlock FP et al. (1984), ISUOG guidelines
- AFI thresholds: Moore & Cayle (1990) normative data
- Danger signs: WHO antenatal care guidelines (2016)
- BP thresholds: ISSHP classification (2018)
- SSA context: FIGO maternal mortality guidelines

**Disclaimer:** This tool provides clinical decision support only. It does not replace clinical judgment. All triage outputs must be verified by a qualified healthcare professional.

---

## Roadmap

- [ ] Chest X-ray TB screening module (offline CNN via TensorFlow.js)
- [ ] Paediatric growth chart (WHO child growth standards)
- [ ] FHIR R4 export for national HIS integration
- [ ] Sickle cell risk counselling module
- [ ] Swahili / Hausa / French / Yoruba UI localisation
- [ ] Background sync for session upload to clinic server

---

## Licence

MIT — free to use, modify, and deploy for non-commercial health purposes.
