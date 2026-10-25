# Contributing to The Gauntlet

Thank you for your interest in contributing to **The Gauntlet**! We welcome Pull Requests for new psychological archetypes, localized objection sets, and performance enhancements.

---

## Adding a New Juror Persona

The architecture is deliberately modular. To propose a new juror (e.g. *"The 100x TAM Silicon Valley VC"*, *"The Enterprise Procurement Specialist"*, or *"The FOSS / GPL License Purist"*):

1. Open `src/config/personas.ts`.
2. Append your new `JurorConfig` object to the `JURORS` array:

```typescript
{
  id: "vc-hypergrowth",
  name: "Kaan Arda",
  roleTitle: "Partner at Tier-1 VC Fund",
  archetype: "The TAM Obsessive",
  motto: "If this isn't a $10B outcome, it's not worth my fund's time.",
  coreObjectionTemplate: "Even if you win your entire domestic niche, your TAM is capped at $50M. How does this return my fund?",
  psychology: "Looks exclusively for power-law outliers and extreme network effects.",
  fatalTrigger: "Discussing linear agency service models or local non-scalable work.",
  persuasionKey: "Unlocking adjacent global enterprise verticals and software margin scalability.",
  initialConviction: 15,
  silhouetteIndex: 4,
}
```

3. Update `src/lib/simulation.ts` with corresponding heuristic evaluation keywords for offline testing.
4. Ensure your tests pass with `npm run build`.

---

## Design and Quality Standards

All UI contributions must adhere to the design guidelines:
- **Zero Emojis:** Use clean vector icons (`lucide-react`, stroke 1.5px).
- **Glare-Free UI:** Colors must be matte, optical, and glare-free with high contrast.
- **Clean Structure:** Headings and cards must be authoritative and readable.

---

## Local Development Workflow

```bash
git clone https://github.com/your-username/shark-tank-gauntlet.git
cd shark-tank-gauntlet
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
