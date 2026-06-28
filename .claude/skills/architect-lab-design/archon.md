# Appliquer la DA a Archon (produit / dashboards)

Le site est une **vitrine** (sections aerees, grands titres, reveals au scroll). Archon est
une **app dense** (tour de controle a plugins, dashboards, temps reel). Meme ADN, mais
traduit pour la densite et l'usage prolonge. Reutilise `tokens.css` tel quel ; ajuste les
proportions, pas les couleurs.

## Principes de traduction
1. **Dark-first.** Fond `--al-void`, surfaces `--al-panel`. Grille blueprint **tres
   subtile** en fond de zone (pas envahissante).
2. **Le spectre = signal, pas decor.** Il marque l'**actif / selectionne / en cours / lien /
   courbe de graphe / etat**. Toujours <= 10 %, sur des traits. Une vue d'app pleine
   d'aplats spectre serait un echec.
3. **Densite maitrisee.** On descend l'echelle d'espacement (souvent 8/12/16 plutot que
   32/48), mais on garde de l'air entre groupes. Lisibilite avant remplissage.
4. **Chiffres techniques.** `font-variant-numeric: tabular-nums`, mono pour les valeurs,
   IDs, logs, code.

## Couleurs de statut (mapping plugins / systeme)
- **Vert** `--al-green` : online, sain, succes, depart.
- **Bleu** `--al-blue` : primaire, lien, info, element actif.
- **Violet** `--al-violet` : hover, second accent, etat "en cours / transition".
- **Magenta** `--al-magenta` : l'etincelle = alerte/critique, ou highlight rare. A garder rare.
- **Slate** `--al-slate` : inactif / desactive / secondaire.
Ne jamais coder un statut **uniquement** par la couleur : ajoute une icone ou un mot
(daltonisme, accessibilite).

## Patterns d'app
- **Carte de plugin** : base `als-card` + `als-card__icon` (icone du plugin) + un filet
  spectre `--accent` quand le plugin est actif/selectionne. Titre display, meta en mono muted.
- **Dashboard / widgets** : grille de cartes sur panel, bordures `--al-line`, radius md/lg.
  En-tete de widget discret (eyebrow + titre court).
- **Tour de controle (vue d'ensemble)** : statuts en pastilles (vert/bleu/violet/magenta),
  un rail/filet spectre pour la "charge" globale.
- **Console / command palette** : reutilise l'esthetique terminal (`als-term`), prompt `$`,
  mono, curseur. Colle parfaitement a Archon (langage naturel, commandes).
- **Controles de config** : `al-switch`, `al-seg` (onglets/segments), `al-radio`, `al-check`.
  Actif = trait/teinte spectre.
- **Data viz** : courbes/barres au **degrade spectre sur le trait** (stroke), fond transparent
  ou tres legere teinte. Jamais d'aires pleines au spectre. Axes/grilles en `--al-line`.
- **Tables** : lignes fines `--al-line`, en-tete mono MAJUSCULES tracking 0.2em, zebrures
  tres legeres, nombres tabulaires alignes a droite.

## Etats et chargement (la metaphore blueprint)
- **Skeletons** : montre le **fil de fer** (barres `--al-line`, pointilles) puis "materialise"
  vers le reel. C'est la signature : le plan qui devient produit.
- **Etat vide** : un plan/wireframe + une invite a construire ("branche ton premier plugin").
- **Mouvement** : **sobre et utile**. Micro-transitions (.1 a .2s), apparition douce des
  donnees. Pas de grands reveals au scroll comme sur le site. Respecte `prefers-reduced-motion`.

## Accessibilite (app utilisee longtemps)
- Contraste AA minimum sur fond sombre (texte `--al-paper`/`--al-slate` selon l'importance).
- Focus visible partout (`--al-glow-blue`), navigation clavier complete.
- Cibles tactiles >= 40px, libelles explicites, `aria-*` sur les controles et boutons-icones.
- Option de **reduire le mouvement** et (a terme) un mode contraste eleve.

## Coherence avec le site
- Memes tokens, meme logo bowtie, meme underscore `_`, meme baseline DESIGN · BUILD · PROTECT.
- Un utilisateur qui passe du site a Archon doit sentir **la meme maison**, en version "outil".
- Et toujours : **aucun tiret cadratin**, spectre sur les traits, fond void.
