# Zetalink Website Transformation Plan

## 1. Strategic Consolidation (7+5 Services -> 4 Core Pillars)

| Legacy Route(s) | Consolidated Pillar Route | Pillar Title |
|---|---|---|
| `solutions/enterprise-ai-transformation.html`, `solutions/agentic-ai.html`, `solutions/intelligent-automation.html` | `services/enterprise-ai-automation.html` | Enterprise AI & Intelligent Automation |
| `solutions/machine-learning-computer-vision.html` | `services/data-intelligence.html` | Data Intelligence & Predictive Analytics |
| `solutions/generative-ai.html`, `solutions/rag-knowledge-intelligence.html` | `services/enterprise-knowledge-ai.html` | Enterprise Knowledge & Generative AI |
| `solutions/ai-integration-mlops.html`, `capabilities/index.html` | `services/ai-engineering.html` | AI Engineering & Enterprise Integration |

All 8 legacy routes (`solutions/*.html` and `capabilities/index.html`) will be converted into lightweight canonical redirect pages (`<meta http-equiv="refresh">`, `<link rel="canonical">`, and `window.location.replace`) pointing to their consolidated `/services/` targets so zero inbound links break.

## 2. Information Architecture & Navigation

**Header Navigation:**
- `Home` (`index.html`)
- `Services` (dropdown with **only the 4 consolidated services**)
- `Industries` (`industries/index.html`)
- `Our Work` (`index.html#selected-work`)
- `Products` (dropdown: `Zetamart Retail`, `Zetamart Boutique`, `ZetaShield 360`)
- `About` (`about/index.html`)
- `Contact` (`contact/index.html`)
- Primary CTA: **Discuss Your Project**

## 3. Homepage Narrative (11-Section Sequence)

1. Sticky Header with `Logo.png`, clean 7-item nav, and `Discuss Your Project` CTA
2. Hero: **"From AI Ideas to Real Business Impact."** + concise description + **Discuss Your AI Initiative** & **Explore Our Services** + interactive architecture/workflow diagram
3. Trust & Credibility: Concise statement of Zetalink's engineering approach (no unverified counters)
4. Four Core Services (2×2 responsive grid)
5. Business Problems We Solve (6 practical problems linked to the 4 services)
6. Industry Expertise (Automotive & Manufacturing, Retail & Commerce, Enterprise Operations)
7. Selected Work (reusable Case Study framework; no fabricated outcomes)
8. How We Work (4-step process: `01 Discover`, `02 Design`, `03 Build`, `04 Deploy & Improve`)
9. Products (clear separation from consulting: Zetamart Retail, Zetamart Boutique, ZetaShield 360)
10. Final CTA: **"Have a Business Challenge Worth Solving with AI?"** -> **Start a Conversation**
11. Footer: Company details, 4 Core Services, Products, Privacy Policy (`privacy.html`), Terms (`terms.html`)

## 4. Design System & Performance Refinements

- Palette aligned to Section 7.2: Primary Navy `#101C35`, Secondary Blue `#1D3557`, Accent Blue `#2775E5`, Light Surface `#F4F7FB`, Primary Ink `#1C2738`, White `#FFFFFF`.
- Typography: `Manrope` (headings), `Inter` (body), `IBM Plex Mono` (technical labels).
- Add `privacy.html` and `terms.html`.
- Update `zetamart - Retail shop/index.html` to remove unsupported hero stats (`10x`, `99.9%`, `24%`), label ROI calculator assumptions clearly, and fix form error handling.
- Update `sitemap.xml` to index the consolidated `/services/` URLs and new legal pages.
- Do **not** push to production without explicit user approval (Guardrail #17).

