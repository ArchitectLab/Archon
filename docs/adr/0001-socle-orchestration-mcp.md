# ADR 0001 : Socle d'orchestration et de protocole d'outils (MCP)

- Statut : Propose (a valider)
- Date : 2026-06-28
- Porte : le "cerveau" d'Archon (orchestrateur, appel d'outils, MCP, multi-agents) et la stack.

## Contexte
Archon est une tour de controle a IA centrale : elle comprend le langage naturel, branche des
plugins / MCP / connecteurs, agit dans le monde reel avec approbation, et compose une IHM
(canvas) en direct. Socle decide en Phase 1 : Blazor + .NET 10, polyglotte par contrats,
securite des le jour 1, souverain (local / cloud / hybride), double licence AGPL + commerciale
(CLA).

En voulant aller plus loin (MCP reellement branche, modeles locaux installables, IHM libre), la
question s'est posee : repartir d'un projet open source mur plutot que tout coder. La recherche
a clarifie le paysage :

- OpenClaw (MIT, TypeScript / Node) : tres mur (orchestrateur, MCP via mcporter, canvas A2UI,
  skills SKILL.md, voix, multi-canal). Mais : insecure par defaut (shell libre, sans
  approbation), projet passe sous une fondation sponsorisee OpenAI, stack non-.NET.
- Cote .NET : Microsoft Agent Framework 1.0 (MIT, .NET et Python : multi-agents, MCP,
  human-in-the-loop, pause / reprise), Semantic Kernel (MCP first-class, Filters pour valider
  chaque appel d'outil), et le SDK MCP officiel C# (modelcontextprotocol/csharp-sdk, MIT, NuGet
  ModelContextProtocol).

## Options considerees
1. Fork OpenClaw (bascule TypeScript). Pour : features mures (voix, canvas, multi-canal).
   Contre : abandonne .NET (expertise interne), insecure par defaut a durcir, dependance a une
   fondation sponsorisee OpenAI (tension avec "souverain et neutre"), gros code amont a suivre.
2. Garder .NET + Microsoft Agent Framework + SDK MCP C# (retenue). Moteur mur, MCP natif,
   approbation humaine, le tout en MIT. Reutilise notre socle et notre surface React.
3. Interface de chat (LibreChat / Open WebUI). Ce sont des UI de chat, pas des orchestrateurs ;
   elles ne couvrent pas notre coeur (permissions, IHM generative, gouvernance).
4. 100% maison .NET (statu quo). Controle total mais on reinvente orchestrateur, MCP, multi-agents.

## Decision
Conserver le socle Archon (Blazor + .NET 10) et adopter, derriere nos contrats existants, le
**Microsoft Agent Framework** (orchestration, multi-agents, human-in-the-loop) et le **SDK MCP
officiel C#** (client / serveur MCP). L'inference reste compatible OpenAI (Ollama local ou
cloud). Notre **enveloppe de securite reste la valeur** : permission deny-by-default
(`GrantStore`), approbation humaine (`IApprovalGate`), journal d'audit, et a terme le
durcissement avec Bunkerity. On s'inspire conceptuellement d'OpenClaw (canvas A2UI vers notre
IHM ; skills SKILL.md) sans heriter de sa stack ni de ses defauts de securite, ni d'une
dependance OpenAI.

Raisons : preserve l'expertise .NET, garde la souverainete et la neutralite (local ou cloud au
choix, aucun fournisseur impose), conforte la securite comme differenciateur (la recherche
montre qu'OpenClaw est insecure par defaut : notre posture a de la valeur), et evite de
reinventer l'orchestrateur et le MCP (le SDK officiel et le framework sont murs et MIT).

## Consequences
Reutilise tel quel :
- `src/Archon.Surface` (React) : la surface reste.
- Contrats `Archon.Core` : `IPlugin` / `Capability` / `UiView`, `IOrchestrator` /
  `InvokeCapabilityAsync`, `PluginRegistry`, `GrantStore` / `IPermissionPolicy`, `IApprovalGate`,
  `IAuditLog`, `IIhmStore`, `IConnectorStore`, `ISettingsStore`. Le plugin `Ihm`, le design
  system, la gouvernance.

Evolue :
- Le "cerveau" : `LlmIntentResolver` est double par un agent (Agent Framework /
  Microsoft.Extensions.AI) qui planifie et appelle des outils ; le repli mots-cles reste comme
  securite hors-ligne.
- Les capacites de nos plugins peuvent etre exposees comme outils de l'agent ; chaque appel
  passe par notre approbation et notre audit (deny-by-default conserve, non negociable).
- Les connecteurs MCP deviennent reels via le SDK C# (initialize / tools/list / tools/call),
  enregistres comme capacites dans le registre.

Nouvelles dependances (toutes MIT) : `Microsoft.Agents.AI` (Agent Framework), `ModelContextProtocol`
(SDK MCP C#), `Microsoft.Extensions.AI`.

Risques : frameworks recents (1.0), versions a epingler ; s'assurer que TOUT appel d'outil de
l'agent traverse notre garde (permission + approbation), jamais en direct ; compatibilite net10.

## Plan de migration (par etapes, chacune testable)
1. MCP reel : brancher le SDK MCP C# ; un connecteur MCP active expose ses outils comme
   capacites (deny par defaut, approbation). Remplace le MCP fait-main prevu.
2. Moteur d'agent : introduire Agent Framework comme backend de l'orchestrateur (chat client
   compatible OpenAI vers Ollama / cloud), planification et appels d'outils encadres par notre
   garde ; repli mots-cles conserve.
3. Puissance : page Modeles (installer / activer un modele Ollama en direct), IHM libre
   (placement, canvas, viz), reglages pousses (approbation par impact, journal, theme), sur le
   nouveau moteur.
4. Plus tard : voix, multi-canal, multi-agents (patrons d'orchestration d'Agent Framework),
   plugins tiers WASM.

## Licence et souverainete
Agent Framework et SDK MCP C# sont MIT : compatibles avec la double licence d'Archon (AGPL-3.0
+ commerciale via CLA). Aucune dependance a un fournisseur impose : modeles locaux (Ollama) ou
cloud au choix de l'utilisateur. Secrets uniquement par variable d'environnement.

## Revision
A revoir si Agent Framework change de licence ou de gouvernance, si un socle .NET souverain plus
adapte emerge, ou si la voix et le multi-canal justifient de reevaluer un moteur dedie.
