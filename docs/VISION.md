# Vision d'Archon

> Design. Build. Protect.  //  Concevoir. Construire. Proteger.

Archon est la tour de controle souveraine d'Architect Lab : une ou plusieurs IA centrales
qui comprennent ton intention, orchestrent tes systemes, branchent ce qu'il faut, et
agissent dans le monde reel. Tu parles (voix ou texte), l'interface se reconfigure en direct.

Ce document fixe le cap. Il se lit en cinq minutes. Statut : Phase 1, conception.

## Le probleme
Piloter sa maison, son homelab ou ses machines, c'est aujourd'hui jongler entre dix
applications qui ne se parlent pas, et confier ses donnees a des clouds fermes. Les
alternatives open source existent, mais l'IA y reste peripherique : elle conseille, elle
n'orchestre pas. Et quand une IA agit vraiment, c'est presque toujours ailleurs, chez un
tiers, sans que tu gardes la main.

## La reponse
Une **tour de controle a IA centrale**, souveraine et multi-surfaces. Tu exprimes une
intention ; l'IA comprend, orchestre l'ensemble (tous protocoles confondus), branche les
bons connecteurs, et ne montre que l'essentiel. L'interface n'est pas figee : l'IA la
**materialise** en direct selon ce que tu fais.

Le cadre, en une image : **"a la Palantir, mais inversee"**. Connecter beaucoup de donnees
et de systemes, et **agir**, oui. Mais open source, souverain, auditable, et ethique. Le
pouvoir va a l'utilisateur, pas a une plateforme fermee.

> Ajouter une capacite (un modele, un plugin, un connecteur) doit etre **trivial par
> defaut** : pre-mache, un clic, des reglages surs deja remplis. Un **mode avance** existe
> pour l'expert qui veut aller plus loin. Simple par defaut, puissant quand il faut.

## Les surfaces (la tour, plusieurs fenetres)
Archon n'est pas une fenetre unique, mais un poste de pilotage a plusieurs surfaces :

- **Console d'orchestration** : l'inventaire vivant de tout ce que tu branches (plugins,
  serveurs MCP, connecteurs), avec leur statut **online / offline** et leur sante. C'est
  d'ici que tu pilotes l'IA et que tu vois l'ensemble respirer.
- **Surface generative** : l'IA montre, explique, et fait evoluer des dashboards et des
  graphes **en direct**. L'interface se construit a la demande, a l'instant t.
- **Pilotage multimodal** : voix et texte d'abord ; puis vision et cameras, pour percevoir
  et interagir avec l'environnement physique.

## Les deux fondations (non negociables)
1. **Securite par conception.** Non hackable des le premier pas. C'est l'ADN Bunkerity :
   cloisonnement, moindre privilege, tout est verifiable.
2. **Surete de l'IA.** L'IA ne doit pas faire le mal. Humain dans la boucle sur les
   actions a consequence ou irreversibles. Le pouvoir d'agir va avec des garde-fous.

> La confiance ne se decrete pas, elle se verifie.

## Souverainete et deploiement
Tu choisis ou vivent ton IA et tes donnees, **des l'onboarding**, parmi trois modes :

- **Local** : tout chez toi (souverainete et confidentialite maximales).
- **Cloud** : tout heberge (capacite et simplicite maximales).
- **Hybride** : le meilleur des deux. Chaque fonction tourne en local **ou** en cloud
  selon le compute disponible, la latence, la sensibilite des donnees et les dependances.

Le mode reste modifiable. Tout est co-concu pour fonctionner dans les trois cas.

## Modulaire : coeur minimal + plugins
Un coeur minimal, tout le reste se branche. Les capacites arrivent sous trois formes :
codees a la main, librairies tierces integrees, ou **plugins proprietaires** (pour qui
veut du cloud et des briques fermees). C'est la double licence du projet (AGPL libre plus
licence commerciale) qui rend ce modele possible.

## Non-objectifs (pour rester focalise)
- Pas un enieme dashboard statique qu'on configure a la main.
- Pas un assistant de chat qui conseille mais n'agit pas.
- Pas un cloud ferme de plus : la souverainete n'est pas une option.
- Jamais d'IA qui agit sans garde-fous ni tracabilite.

## Personas
- **L'amateur de homelab** (notre premier public) : veut tout piloter de chez lui, sans fuite.
- **La PME** : veut de l'automatisation utile, auditable, sans dependance a un geant.
- **La collectivite, l'etablissement scolaire** : veulent du libre, du souverain, du verifiable.

## Principe directeur
**La confiance ne se decrete pas, elle se verifie.** Tout ce qu'Archon fait doit etre
visible, tracable, et sous ton controle.
