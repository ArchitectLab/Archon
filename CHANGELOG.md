# Changelog

Toutes les evolutions notables d'Archon seront documentees ici.
Format inspire de "Keep a Changelog" (https://keepachangelog.com),
versionnage semantique (https://semver.org).

## [Non publie]
### Ajoute
- Initialisation du depot : licence AGPL-3.0, gouvernance, modeles de contribution.
- Docs de cadrage : vision, architecture v0, contrat de plugin, modele de donnees,
  baseline securite ; design system integre comme skill Claude Code.
- Squelette Phase 1 (Blazor + .NET 10) : coeur (contrats de plugin, registre online/offline,
  orchestrateur, securite, audit), plugin Meteo, accueil + console on-brand.
- Cerveau IA agnostique (local Ollama ou cloud) dans l'orchestrateur, avec repli mots-cles.
- Approbation humaine configurable (demander mon accord / laisser l'IA agir) et plugin
  Maison (action domotique simulee).
- Surface generative v1 : schema UI neutre rendu par un renderer Blazor ; reponse libre de l'IA.
- Persistance locale SQLite (journal d'audit et mode d'approbation durables).
- Tests unitaires (xUnit) sur le coeur.

