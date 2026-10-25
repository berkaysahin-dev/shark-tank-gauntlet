# The Gauntlet

Adversarial founder boardroom simulation. Test your startup pitch against five ruthless psychological buyer archetypes who actively try to reject you.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fberkaysahin-dev%2Fshark-tank-gauntlet)
[![License: MIT](https://img.shields.io/badge/License-MIT-black.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-black.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-black.svg)](https://tailwindcss.com/)

---

## Overview

Most founders get polite, uncritical feedback from friends and colleagues. The Gauntlet replaces superficial praise with five hyper-critical psychological buyer archetypes designed to expose weak value propositions, vague ROI, and compliance risks before you launch to real customers.

### The Five Archetypes

1. **The Penny-Pincher (SMB Owner):** Focuses strictly on immediate payroll payback. Will threaten to have an intern build a free spreadsheet instead of paying for your subscription.
2. **The Paranoid CISO (Security Director):** Risk-averse enterprise gatekeeper. Assumes multi-tenant cloud software will leak proprietary data. Demands zero-retention policies and client-side encryption.
3. **The Friction-Phobic Operator (Busy End-User):** Cognitively exhausted by dozens of open browser tabs. Vetoes any tool requiring webinars or lengthy onboarding. Demands silent, background execution.
4. **The Incumbent Loyalist (Senior Architect):** Invested in the established market leader. Fears startup insolvency. Demands a 10x wedge feature and zero-friction data migration.
5. **The Hype Tourist (Fickle Early Adopter):** Enjoys testing new software for three days, then forgets it exists. Requires passive ambient value delivery rather than spam notifications.

---

## Architecture and Game Loop

1. **Pitch Definition:** Enter your product name, a plain-English one-liner, your target customer profile, and your pricing model.
2. **Sequential Interrogation:** Each judge formulates a customized, adversarial objection targeting your specific product premise.
3. **Counter-Defense:** Submit your defense using concrete data, payroll ROI calculations, or specific architectural wedges.
4. **Real-Time Evaluation:** The evaluation engine analyzes your response, updates the judge's conviction score (0% to 100%), and returns an unfiltered reaction.
5. **Verdict Dossier:** Receive a breakdown of surviving judges, term sheet status, your most fatal vulnerability, and strategic remedies.

---

## Security and Privacy Model

The Gauntlet was engineered with zero-retention principles to protect confidential, unreleased startup premises:

- **Client-Side BYOK (Bring Your Own Key):** Users can enter their personal Google Gemini or OpenAI API key. Keys are held exclusively in the browser tab's temporary `sessionStorage`. Closing the tab purges the key permanently.
- **Zero Server Persistence:** Client keys and user pitch inputs are never written to any database, file system, or external analytics service.
- **Prompt Injection Quarantine:** User inputs are quarantined using boundary delimiters before evaluation, neutralizing prompt override or jailbreak attempts.
- **Strict Security Headers:** Enforces Content Security Policy (CSP), `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, and restricted permissions policies.
- **Zero-Setup Offline Fallback:** If no API key is provided, the application automatically runs on a deterministic offline heuristic simulator, ensuring complete functionality without external network calls.

---

## Quick Start

### Prerequisites
- Node.js 18+ or 20+
- npm, pnpm, or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/berkaysahin-dev/shark-tank-gauntlet.git
cd shark-tank-gauntlet

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Adding New Personas

To contribute a new archetype:

1. Open `src/config/personas.ts`.
2. Add a new `JurorConfig` entry with psychological triggers and objection templates.
3. Add corresponding keywords in `src/lib/simulation.ts` for offline testing.
4. Verify with `npm run build` and submit a Pull Request.

---

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
