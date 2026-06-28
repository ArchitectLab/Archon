# reference/ : code de production a reutiliser

Ce dossier contient le **vrai code** de la DA Architect Lab (issu du bundle Claude
Design), a copier ou adapter quand on implemente. Pour comprendre l'esprit AVANT de
coder, lis d'abord `../SKILL.md`, puis `../archon.md` (produit) et `../voice.md` (texte).

## Ce qu'il y a ici
- `styles.css` : base + utilitaires d'identite (`.al-blueprint`, `.al-spectrum-text`,
  `.al-tag`, `.al-rule`, `.al-eyebrow`, `.al-cursor`, `.al-card`). S'appuie sur les tokens.
- `interactions.css` : classes des boutons animes et des controles
  (`.al-fx--sweep/glow/draw`, `.al-switch`, `.al-check`, `.al-radio`, `.al-seg`, `.al-iconbtn`).
- `motion/al-scroll.css` + `al-scroll.js` : le moteur de mouvement signature
  ("La Materialisation"), pilote par data-attributs (voir `../components.md`).
- `components/` : implementations React (`.jsx` + `.d.ts`) + une vignette `card.html` par
  composant. Utiles comme patterns meme si Archon n'est pas en React.
- `foundations/` : specimens (marque, couleur, typo) en HTML.
- `Charte_Graphique_Architect_Lab.html` : la charte v2.0 (juin 2026), source canonique.
- `logo-spectre.png` : le logo officiel en raster (le bowtie SVG est dans `../components.md`).

## Comment s'en servir
- **Tokens d'abord** : tout passe par les variables de `../tokens.css` (jamais de hex en dur).
- **Copie le rendu, pas la structure** : ces fichiers viennent du site. Pour Archon, recree
  le meme aspect a partir des tokens et des recettes de `../components.md` et `../archon.md`.
- **Non negociable** : spectre <= 10 % et seulement sur des traits, fond void, zero tiret cadratin.
