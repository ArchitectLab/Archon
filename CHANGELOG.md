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
- Chat + IHM (surface React sous `/app`) : a gauche un chat, a droite l'IHM, un canvas vivant
  que l'IA pilote. L'IA y pose des widgets persistants et auto-rafraichis (plugin Ihm :
  `ihm.place`, `ihm.html`, `ihm.clear`, `ihm.set_preferences`), via une API HTTP/JSON du coeur.
  Widgets "capacite" (ex. meteo rafraichie toutes les 2 min, avec sparkline) et widgets "html"
  libres rendus en bac a sable. Preferences d'affichage persistees et injectees dans le prompt.
  Le build React est commite (lancement sans Node).
- Cockpit Archon (Phase 2, increment 1) : la surface devient le produit, servie a la racine `/`
  (Accueil sobre facon Jarvis avec un "coeur" reactif, Archon = chat + IHM, Connecteurs,
  Reglages ; navigation par hash ; renommage "App" -> "Archon"). Page **Connecteurs** : gestion
  des plugins et de leurs permissions (deny par defaut, reglables), declaration de serveurs MCP
  ou de connecteurs HTTP (persistes ; secrets par reference de variable d'env). **Reglages** :
  mode d'approbation, cerveau IA, theme (accent/densite), preferences, editeur du **skill Archon**
  (prompt systeme injecte). IHM pilotable en direct par l'IA : `ihm.theme`, `ihm.remove`. La
  console technique reste sous `/console`.

