# Archon : contexte pour qui code ici (humain ou IA)

> Design. Build. Protect.  //  Concevoir. Construire. Proteger.

Ce fichier se charge au debut de chaque session. Il donne l'essentiel pour coder
"dans l'esprit" d'Archon sans avoir tout lu. Collaboration **AI-native** : on ecrit le
code ET son contexte, pour que le prochain (dev ou IA) reparte vite et juste.

## Le projet en bref
Archon est la webapp libre et souveraine d'Architect Lab : une **tour de controle a
plugins** (domotique, meteo, robotique, cameras, serveurs) avec une **IA centrale** qui
comprend le langage naturel, orchestre l'ensemble, et reconfigure ses dashboards en direct.
Souveraine (100 % local, cloud, ou hybride : l'utilisateur choisit), modulaire (coeur
minimal + plugins), auditable, securisee des la premiere ligne.

**Statut : Phase 1, conception.** Vision et architecture v0 actees (voir plus bas et
`docs/`). On affine les details, puis on code.

## Stack & architecture (decide)
Choix actes en Phase 1 (detail dans `docs/ARCHITECTURE.md`) :
- **Polyglotte par conception** autour d'un coeur **Blazor + .NET 10 (C#)**. Rien ne
  depend d'une seule stack : chaque sous-projet (plugin, MCP, connecteur, agent) choisit
  la sienne derriere des contrats stables (MCP ; WASM Component Model/WIT ; gRPC ; HTTP).
- **Securite a la frontiere de confiance** : le code non fiable tourne en bac a sable
  **WASM/WASI**. Baseline du jour 1 dans `docs/security-baseline.md`.
- **Deploiement** : 3 modes a l'onboarding (local / cloud / hybride). En hybride, routage
  par capacite (compute, latence, sensibilite des donnees, dependances).
- **Modeles IA** agnostiques, local plus cloud routes (Ollama/vLLM ou cloud).
- **Ajout pre-mache par defaut plus mode avance** (modeles, plugins, MCP, connecteurs).
- Transport temps reel non fige (abstraction : WebSocket / SSE / SignalR / autre).

## Qui
Projet d'**Architect Lab** (association loi 1901, Agen), co-detenu avec **Morphaius** (IA)
et **Bunkerity** (cybersecurite, editeurs du WAF open source BunkerWeb).

## Regles non negociables
- **Licence** : AGPL-3.0-or-later (`LICENSE`). Double licence : chaque contribution est
  couverte par le **CLA** (`CLA.md`) pour permettre une licence commerciale (`COMMERCIAL.md`).
- **Securite par defaut** : aucun secret en clair, entrees validees, moindre privilege,
  permissions de plugin explicites. Une faille se signale en prive (`SECURITY.md`), jamais
  en issue publique.
- **Design** : suis le skill `architect-lab-design`. Le spectre (vert, bleu, violet,
  magenta) vit uniquement sur des traits, <= 10 % d'une vue, jamais en aplat. Fond void
  sombre. Type : Space Grotesk (titres), Inter (texte), JetBrains Mono (tags, code).
- **Ecriture** : francais d'abord, voix "ingenieur-batisseur" (voir `voice.md` du skill).
  **Jamais de tiret cadratin** (remplace par `:` `,` `(` `)` ou `·`). Style maison ASCII :
  les docs existantes evitent les accents, reste coherent au sein d'un meme fichier.

## Ou trouver quoi
- `README.md` : presentation publique.
- `docs/VISION.md` : le cap. `docs/ARCHITECTURE.md` : l'architecture v0.
- `docs/security-baseline.md` : la baseline securite du jour 1.
- `docs/design-system.md` : pointeur vers la DA.
- `.claude/skills/architect-lab-design/` : le **skill design** (invocable `/architect-lab-design`).
  Guidance dans `SKILL.md`, `archon.md` (produit), `voice.md` (texte), `tokens.css` ;
  `reference/` = le vrai code a copier ou adapter.
- `.github/` : templates d'issue (dont "Proposition de plugin"), template de PR, workflow CLA.

## Comment contribuer (resume de CONTRIBUTING.md)
- Pars d'une **issue**. Pour un plugin : modele "Proposition de plugin".
- **Branches** : `<type>/<resume-court>` en kebab-case. Types : `feat`, `fix`, `plugin`,
  `docs`, `refactor`, `test`, `chore`. Ex : `feat/plugin-meteo`, `docs/vision-personas`.
- **Commits** : Conventional Commits (`feat:`, `fix:`, `docs:`...), messages clairs.
- **CLA** obligatoire avant fusion. Relecture mainteneur + oeil securite Bunkerity sur le sensible.

## A trancher ensemble (ne pas figer seul)
- Modele de donnees detaille.
- Frontiere exacte coeur minimal vs plugins ; format precis du manifeste et de l'ABI.
- Transport temps reel (derriere une abstraction).
- Stack de la surface generative (Blazor vs TS).

Principe directeur : **la confiance ne se decrete pas, elle se verifie.**
