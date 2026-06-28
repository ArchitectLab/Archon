# Architecture d'Archon (v0)

> Esquisse de reference. Elle fixe les grands choix actes en Phase 1. Les points encore
> ouverts sont listes en fin de document.

## 1. Stack : polyglotte par conception, autour d'un coeur .NET

Le coeur applicatif et le shell sont en **Blazor + .NET 10 (C#)** : c'est l'expertise de
l'equipe, du temps reel solide, du code open source (MIT).

Mais **rien ne depend d'une seule stack**. Chaque sous-projet (plugin, serveur MCP,
connecteur, agent) choisit la meilleure stack pour son besoin, et communique via des
**contrats stables et neutres en langage** :

| Sous-projet | Contrat | Stack libre |
| --- | --- | --- |
| Connecteurs / outils | **MCP** (Model Context Protocol) | n'importe laquelle |
| Plugins (code non fiable) | **WASM/WASI Component Model (WIT)** ou **gRPC** | Rust, Go, TS, C, Python... |
| Agents IA | **HTTP/JSON ou MCP** | souvent Python (ecosysteme mur), remplacable |
| Frontend | shell + surface generative (schema UI neutre) | Blazor (shell) ; TS/React (renderer de la surface generative) |

Le **bac a sable des plugins** (WASM/WASI, executeur Rust via Wasmtime ou Extism) est la
**frontiere de confiance** : c'est la que tourne le code non fiable, donc la que la
securite se concentre. Le langage du coeur compte moins que l'etancheite de cette frontiere.

Le **transport temps reel** : **WebSocket par defaut** (standard, polyglotte), derriere
une abstraction `IRealtimeTransport`. SignalR reste un adaptateur optionnel pour les
deploiements .NET ; SSE pour les flux unidirectionnels simples.

Principe directeur : **la securite se met la ou s'execute le code non fiable, pas dans le
langage du coeur.**

## 2. Les sept piliers

1. **Noyau orchestrateur a etats.** Un moteur d'agents (modele type graphe : noeuds,
   transitions, etat type, points de reprise durables), **agnostique du modele**. Il
   planifie, delegue, et peut auto-coder. C'est le cerveau de la tour.
2. **Registre de connecteurs.** Decouverte et **sante online / offline** des plugins,
   serveurs MCP et connecteurs (heartbeat, statut, metriques). C'est la console d'orchestration.
3. **Bac a sable des plugins (frontiere de confiance).** WASM/WASI ; **manifeste de
   capacites** par plugin ; politique **OPA** en "tout refuser par defaut" ; **signature
   plus SBOM** pour la chaine d'approvisionnement. Modeles de reference : Figma (bascule
   WASM) et Home Assistant (manifeste de capacites).
4. **Garde-fous IA.** Approbation humaine sur les actions a consequence ou irreversibles ;
   capability gating ; execution du code auto-genere en conteneur ephemere ; journal
   d'audit immuable ; defense anti-injection (directe et indirecte, via les resultats
   d'outils et les flux camera) ; rate limits et kill-switch.
5. **Surface UI generative.** L'orchestrateur et les agents ont une **capacite de premiere
   classe : rendre une UI a l'utilisateur**. Ils emettent un **schema declaratif neutre**
   (type A2UI / AG-UI), jamais du HTML brut dans le contexte de confiance. Un **renderer
   TS/React** le transforme en composants surs, mis a jour en direct via le transport temps
   reel. Pour les rendus vraiment originaux, un **mode libre** affiche du markup custom dans
   un **iframe bac a sable** (CSP stricte, assaini, isole du reste de l'app).
6. **Multimodal.** Pipeline voix (reconnaissance, detection d'activite vocale, synthese ;
   cible sous 700 ms) ; puis vision et cameras. Pilotage voix et texte, puis perception.
7. **Deploiement et routing.** Trois modes a l'onboarding : local, cloud, ou hybride. En
   hybride, un **routeur** place chaque charge (modeles, plugins, fonctions) en local ou
   cloud selon le compute, la latence, la sensibilite des donnees et les dependances.
   Modeles locaux (Ollama, vLLM) ou cloud, enfichables.

Transversal : **observabilite** (latence, cout, erreurs par outil et par agent) et
**experience d'ajout a deux niveaux** (assistant pre-mache plus mode avance) pour modeles,
plugins, MCP et connecteurs.

## 3. Modele de securite
Le coeur peut tourner sur un runtime gere par GC (.NET) tant que la **frontiere ou
s'execute le code non fiable** est isolee : WASM/WASI, capacites declarees, approbation
humaine. La securite n'est pas un vernis applique a la fin, c'est la forme du systeme.
Le detail operationnel vit dans `security-baseline.md` (la baseline du jour 1).

## 4. Modele de plugin
Deux types d'execution supportes **des le depart** : **WASM** (bac a sable, recommande) et
**process** (gRPC, pour le lourd ou le legacy). Chaque plugin porte un **manifeste**
(capacites, limites de ressources, signature) et une interface versionnee via un **ABI
stable** : WIT / Component Model pour WASM, gRPC / protobuf pour les plugins en process.
Cycle de vie : decouverte, validation (signature, SBOM, politique), chargement isole,
supervision, arret. Detail complet : `plugin-model.md`.

## 5. Roadmap phasee (a affiner, ne fige pas la vision)
- **Phase 1 (le squelette).** Noyau orchestrateur minimal plus registre de connecteurs
  (online / offline) plus un plugin reel de bout en bout, derriere la baseline securite du
  jour 1 et l'approbation humaine. But : prouver l'architecture sur un cas complet.
- **Phase 2.** Surface UI generative (schemas declaratifs streames).
- **Phase 3.** Multimodal (voix d'abord).
- **Phase 4.** Vision et cameras, auto-code elargi, couche data (integration de sources,
  type Airbyte / Dashjoin), plugins proprietaires cloud.

Chaque phase garde la securite et la surete comme conditions de passage, pas comme option.

## 6. Points cadres et restes ouverts
Cadres dans cette iteration : modele de donnees (`data-model.md`) ; frontiere coeur vs
plugins (ci-dessous) ; manifeste et ABI (`plugin-model.md`) ; transport temps reel
(WebSocket) ; surface generative (schema neutre plus renderer TS/React).

**Frontiere coeur vs plugins** : le **coeur** porte la machinerie et la frontiere de
confiance (orchestrateur, registre, hote plus sandbox, permissions, audit, routeur de
modeles, shell, transport, secrets) ; **tout le domaine est en plugins**, y compris les
capacites livrees d'office (on mange notre propre nourriture).

Restent a affiner a l'implementation : vocabulaire precis du schema UI neutre ; details
SQLite vs Postgres et migrations ; regles OPA concretes ; politique de mise a jour des plugins.

> Principe directeur : la confiance ne se decrete pas, elle se verifie.
