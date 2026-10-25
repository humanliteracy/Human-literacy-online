# Human Literacy: Existing Platforms and What We Should Learn
**Initial landscape review · 25 October 2026 · Scope: Human Literacy / TEAL ecosystem**

> This is a research baseline, not a claim that Human Literacy is the first or only project of its kind. Product capabilities are from providers' own websites where noted; marketing statements do not establish independent effectiveness. Pricing, contracts, licensing, privacy terms, API availability and integrations need fresh verification before any purchase.

## The product we are trying to create
A free, optional-anonymous, accessible learning environment across the human lifespan. Visitors can **Explore → Understand → Express → Simulate → Reflect → Practice in real life → Find help**, through lessons, practical tools, videos, scenarios, and guides.

### The user test that changed our direction
In the prototype *The Missed Deadline*, the learner found speaking whatever they truly wanted to say to the simulated manager more engaging than a standalone meter reporting duration and detected pauses. This is **one user's usability finding**, not evidence of clinical benefit or population-wide preference.

**Product implication:** Separate (a) unscored expression and exploration from (b) scored or rubric-guided communication rehearsal. Let the learner select whether to receive coaching. Never assume that measured loudness, wording, accents, or facial movements reveal internal emotion. Rehearsal should help users discover constructive ways to communicate without punishing justified boundaries.

**Evidence caveat:** A 2024 meta-analysis of 154 studies (10,189 participants) found that arousal-decreasing activities reduced anger and aggression, while arousal-increasing activities were ineffective overall. A 2025 meta-analysis found anger associated differently with acceptance/reappraisal versus rumination/avoidance/suppression. These do not establish that an AI venting simulator provides psychotherapy or reliably treats anger. We can offer a place to practice expression without claiming therapeutic efficacy.
- https://pubmed.ncbi.nlm.nih.gov/38518585/
- https://www.nature.com/articles/s41598-025-91646-0

## Benchmark matrix: research-backed starting shortlist

| Human Literacy workstream | Existing platform | Verified capability / relevant strength | Learn / evaluate / avoid |
| --- | --- | --- | --- |
| Live conversation Life Simulator | **Yoodli** | Voice, chat and avatar roleplays; skills coaching on custom rubrics; enterprise learning focus | Study realistic dialogue, repetition and clear feedback. Verify availability, cost and permitted integrations before choosing any vendor. |
| Realistic consequences | **Mursion** | AI- and human-led simulations with characters that push back, and reflection after practice | Characters should be civil yet respond realistically to choices. Practice should cause reflection, not rubber-stamp agreement. |
| Immersive roleplay | **Bodyswaps** | AI soft-skills roleplay via web, mobile, desktop and VR, with tailored feedback | Study their Act → Experience → Reflect → Feedback structure; VR is optional, not required for valuable learning. |
| Voice/VR practice | **VirtualSpeech** | Avatar roleplay, speaking practice, skills labs and coach feedback | Compare clarity of speaking feedback with our crude volume meter; measure actual skill outcomes rather than acoustic statistics alone. |
| Conversational characters | **Character.AI** | Two-way voice character calls and transcripts | Discover engagement and natural spoken interaction, while recognizing it is not a validated education/therapy system. |
| Real-time video characters | **Tavus** | API-oriented video agents designed to see, hear, respond and retain configured character/memory | Candidate for future live-action pilot only after budget, privacy, moderation and secure backend design. |
| Developer voice stack | **Inworld AI** | Real-time voice, STT, TTS and conversational API; supports voice cues and NPC interactions | Candidate for AI conversation engine; validate latency, accent performance, costs, consent and false inference before integration. |
| Expression and self-help | **Wysa** | Conversational emotional-wellbeing tools; explicitly not a replacement for clinical care | Useful boundary between nonclinical reflection and a professionally governed mental-health product. No therapy claims for Human Literacy. |
| Self-guided instructional library | **GCFGlobal** | Large public library of practical tech, work, reading, math and life skills | Learn topic organization, short explanations and accessible self-paced navigation. |
| Peer-reviewed learning resources | **OpenStax** | Free, peer-reviewed textbooks and open educational resources | Borrow *standards*, not proprietary pages: source evidence, review cycles, clear licenses, reusable curricula. |
| AI-guided learning | **Khan Academy / Khanmigo** | Guided tutoring rather than simply giving answers, linked to educational content | Ask learners to think, rehearse, justify and remember; be cautious about model hallucinations and incorrect guidance. |
| Social and emotional standards | **CASEL** | Five competencies across ages and contexts | Map scenarios to self-awareness, self-management, social awareness, relationships and responsible decisions. Respect licensing and attribution. |
| Gamified motivation | **Duolingo** | XP, lessons, streaks, challenges and review loops | Borrow low-friction progress and replay. Avoid compulsive pressure and rewards for compliance or emotional masking. |
| Branching videos and decision games | **H5P Branching Scenario** | Multimedia branching paths with optional scoring and multiple endings; interactive video authoring | Evaluate whether H5P can speed lesson authoring or embed without vendor lock-in. Confirm hosting/accessibility. |
| Nonlinear interactive stories | **Twine** | Free, open-source story authoring; exports HTML | Consider authoring story prototypes that can live on GitHub Pages. Retain our native UI where advantageous. |
| Complex or disturbing topics / Human Shadow | **Common Sense Education** | Digital-citizenship and misinformation lessons, including interactive activities and media analysis | Use curiosity without deceptive bait; teach critical thinking and digital ethics. Licensing varies; do not assume reuse permission. |
| Community service directory | **United Way 211** | National network connecting people with real local assistance | Prefer referring to verified existing services rather than maintaining a duplicative, stale list of providers. |
| Worldwide / low-bandwidth access | **Learning Equality Kolibri** | Free, offline-first education platform with multilingual learning resources | Longer-term inspiration for offline, low-bandwidth access; don't burden the current prototype prematurely. |

### Official source pages checked
- Yoodli: https://yoodli.ai/platform/roleplays
- Mursion: https://www.mursion.com/platform/simulations/
- Bodyswaps: https://bodyswaps.co/what-is-bodyswaps
- VirtualSpeech: https://support.virtualspeech.com/Main%20Menu%20and%20Content%20Navigation-f94de67a-f502-4da2-834f-8cd8f1b8103a
- Character.AI: https://support.character.ai/hc/en-us/articles/23957274129691-Character-Calls-Voice-FAQ
- Tavus: https://www.tavus.io/
- Inworld AI: https://inworld.ai/gaming-media
- Wysa: https://www.wysa.com/faq
- GCFGlobal: https://gcfglobal.org/en
- OpenStax: https://openstax.org/about
- Khanmigo: https://www.khanacademy.org/khan-labs
- CASEL: https://casel.org/what-is-sel/
- Duolingo: https://blog.duolingo.com/duolingo-101-how-to-learn-a-language-on-duolingo/
- H5P: https://h5p.org/branching-scenario
- Twine: https://twinery.org/
- Common Sense Education: https://www.commonsense.org/education/digital-literacy/about
- 211: https://www.211.org/about-us
- Kolibri: https://learningequality.org/kolibri/about-kolibri/

## Comparative conclusions

### What already exists
1. **Natural AI dialogue and real-time avatars:** possible today; limited chiefly by expense, integration, reliability, data handling and quality controls.
2. **Decision-based simulation with multimedia:** established in H5P and other systems. We need not reinvent every content authoring technique.
3. **Large, free educational libraries:** already done well by GCFGlobal and OpenStax.
4. **Practical resources and referrals:** 211 and specialized providers already solve parts of the directory problem.
5. **Gamification and engagement:** mainstream education platforms offer proven UX patterns; effectiveness for our content still needs measuring.

### What Human Literacy could usefully connect
A learner can discover a personally relevant need; understand it in plain language; try a risk-free, optionally unscored expression of their first reaction; replay a realistic conversation or practice a skill; receive specific, nonjudgmental feedback if wanted; try one safe real-world action; and locate verified help if needed. This is a **product hypothesis**, not a proven exclusive competitive advantage.

### What NOT to build first
- Our own video-generation model or speech-recognition engine.
- A generic encyclopedia repeating well-maintained sources.
- A worldwide provider directory without dependable source checks and updates.
- A face-reading emotion score presented as fact.
- An emotion/therapy product making unverified medical claims.
- A rewards system that favors deference to authority over honest, respectful boundaries.

## Build / adapt / link decisions
- **Build natively on GitHub now:** experience UX, consent and privacy controls, script/branching prototype, life-skill transfer challenges, source annotations, automatic tests.
- **Evaluate for optional embedding or authoring:** H5P (branching and interactive video), Twine (nonlinear interactive stories).
- **Evaluate as paid/API service only with approval and secure backend:** Yoodli (if programmatic use supported), Inworld and Tavus.
- **Use as verified reference and link out:** CASEL, GCFGlobal, OpenStax, 211, Common Sense, Kolibri and domain specialists. Attribution and licensing review required before copying/adapting content.

## Development priority: first meaningful iteration
**Replace the prominent Voice Delivery Lab with an “Express → Rehearse” experience.**
- Step A: *Say what you really feel* — voluntary, unscored, no pressure to be polite and no implication that this is therapy.
- Step B: *See what might happen* — a respectful AI character realistically responds to what was said (our current prototype uses rules, not true open-ended AI).
- Step C: *Try another approach* — optional replay to practice a way of expressing needs, facts, and boundaries.
- Step D: *Bring it into life* — one concrete, safe action or reflection.
- Keep an advanced microphone visualizer available only if learners specifically ask for delivery metrics.
- Use existing browser speech recognition only with clear warning that the browser may process audio externally; do not claim complete local privacy for speech-to-text.
- Add a no-score option, avoid forced ratings for emotional expression, preserve replay.
- Test on mobile, keyboard, screen reader, voice permission rejection, user speech including anger and resignation, and correctness of branch outcomes.

## Next workstreams to benchmark (not yet thoroughly audited)
1. Video generation, captioning and assembly: actual cost per approved 60–120s teaching video versus simpler templates.
2. Universal Life Mentor: taxonomy of daily-living procedures, source/accuracy checks and safe real-world demonstrations.
3. Rewards/charitable support: nonprofit vs commercial compliance, financial transparency, donor/referral integrity and accessibility.
4. Civic research: public-data sources, local jurisdictions, nonpartisan evidence standards and reproducible research packets.
5. Age-specific life stages and accessibility: children, older adults, disabilities, multilingual and offline use.
These deserve their own comparisons; this report is a **cross-project first pass**, not an exhaustive competitor audit.

## What to measure
- Learners who voluntarily replay a scenario.
- Whether they perceive the space as enjoyable and safe.
- Whether constructive rehearsal changes the clarity and practicality of their next response.
- Whether they complete the one-step real-life application.
- Drop-off, screen-reader usability, response latency, false interpretations, monetary cost, and privacy complaints.
- Do **not** measure success purely by time spent venting, clicks, simulated score, or a character agreeing with a user.

## Governance
Official vendor feature pages describe what providers claim to offer, not independently tested performance. Verify terms, licenses, API availability, age suitability, healthcare claims, and data handling before adoption. Review this landscape quarterly during active platform selection.
