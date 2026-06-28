# Archon

> The sovereign control tower for your lab.  //  La tour de controle souveraine de ton lab.

Archon est la webapp libre et souveraine d'Architect Lab : une tour de controle a
plugins (domotique, station meteo, bras robotique, cameras, serveurs) qui orchestre
tout depuis des dashboards clairs, comprend le langage naturel, et reconfigure son
interface en direct.

**Statut : Phase 1.** L'architecture est posee et un premier squelette runnable existe
deja (voir plus bas). C'est le meilleur moment pour contribuer.

## Principes
- **Libre et auditable** : code source public, licence libre, on garde la main de bout en bout.
- **Securise des la premiere ligne** : concu avec les ingenieurs de Bunkerity (WAF BunkerWeb).
- **Souverain et hybride** : 100 % chez toi, cloud, ou mixte. Tu choisis ou vivent ton IA et tes donnees.
- **Modulaire** : un coeur minimal, tout le reste se branche en plugins.

## Documentation
- **Vision** : `docs/VISION.md`. **Architecture** : `docs/ARCHITECTURE.md`.
- **Contrat de plugin** : `docs/plugin-model.md`. **Donnees** : `docs/data-model.md`.
- **Securite jour 1** : `docs/security-baseline.md`.
- **Design system** : `docs/design-system.md` (skill Claude Code `architect-lab-design`).

## Lancer en local (Phase 1)
Un premier squelette tourne deja (Blazor + .NET 10) : accueil, console d'orchestration, et
un plugin meteo reel branche de bout en bout. Pas besoin d'etre dev : suis
`docs/dev-quickstart.md` (installer .NET 10, ouvrir le dossier dans VS Code, `dotnet run`).

## Licence
Archon est distribue sous **AGPL-3.0-or-later** (voir `LICENSE`).
Des **licences commerciales** sont disponibles pour un usage sans les obligations de
l'AGPL : voir `COMMERCIAL.md`.

## Contribuer
Toute contribution est bienvenue. Lis `CONTRIBUTING.md` et le `CLA.md` (obligatoire pour
permettre la double licence). Les propositions de plugins passent par une issue dediee.

## Securite
Une vulnerabilite ? Ne pas ouvrir d'issue publique : voir `SECURITY.md`.

## Qui
Projet d'**Architect Lab** (association loi 1901, Agen), co-detenu avec
**Morphaius** (intelligence artificielle) et **Bunkerity** (cybersecurite).

Design. Build. Protect.
