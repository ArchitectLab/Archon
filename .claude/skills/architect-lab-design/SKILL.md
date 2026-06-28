---
name: architect-lab-design
description: >
  Systeme de design Architect Lab (l'identite "spectre sur void blueprint").
  A utiliser des qu'on construit, style, theme ou relit une UI, un composant, une
  page, des couleurs, une typographie, une mise en page, du mouvement, des icones ou
  de la microcopie, pour le site Architect Lab OU pour le projet Archon. Garantit que
  les deux restent visuellement coherents et fideles a la DA. Contient les tokens
  (couleurs, typo, espacement, rayons, ombres), les composants, le mouvement, la voix
  et l'adaptation au produit Archon (dashboards). Regle absolue : jamais de tiret cadratin.
---

# Architect Lab : systeme de design

La DA en une phrase : **le spectre de Morphaius (vert, bleu, violet, magenta) qui
materialise des structures sur un void architectural profond.** Du bleu d'architecte,
une grille blueprint, et une etincelle magenta. Sobre, technique, souverain.

## Quand utiliser ce skill
- Creer ou restyler une page, un ecran, un composant (site **ou** Archon).
- Choisir couleurs, typo, espacement, etats, icones, mouvement.
- Ecrire de la microcopie de marque (boutons, titres, vides, erreurs).
- Relire une UI pour verifier la coherence avec la DA.

## Les 5 principes
1. **Design. Build. Protect.** Le plan avant le code, la securite en fondation.
2. **Souverain, auditable, libre.** L'esthetique dit : tu gardes la main, c'est verifiable.
3. **Blueprint qui se materialise.** On passe du fil de fer (wireframe) au reel : c'est la metaphore centrale (etats de chargement, reveals, skeletons).
4. **Le void d'abord.** Fond sombre profond (`--al-void`), tout respire dessus.
5. **Precision technique.** Mono pour le code/les tags, chiffres tabulaires, lignes nettes.

## REGLE D'OR DU SPECTRE (a ne jamais enfreindre)
Le spectre vit sur les **traits** : contours, barres, filets, soulignements, logo,
etats actifs, courbes de graphes. **Jamais en aplat massif.** Cible : le spectre couvre
**<= 10 %** d'une vue. Sinon, ca crie et la DA s'effondre.

## REGLE D'ECRITURE ABSOLUE
**Aucun tiret cadratin nulle part.** Jamais. (Le long tiret horizontal est banni, meme en exemple.) Remplace par `:` `,` `(` `)` ou `·`.
Cette regle vaut pour tout texte produit (site, Archon, doc, commit, UI).

## Tokens (la source de verite)
Tout est dans **`tokens.css`** (a importer tel quel dans n'importe quel projet, y compris Archon). L'essentiel :

- **Spectre** : vert `#2ECC9A` · bleu `#2A6BF2` · violet `#8A2BE2` · magenta `#E612D9`.
  - Gradient canonique : `linear-gradient(90deg,#2ECC9A 0%,#2A6BF2 38%,#8A2BE2 70%,#E612D9 100%)`.
  - Sens du logo : diagonale 45deg (bas-gauche vers haut-droite).
- **Neutres (blueprint)** : void `#0B1220` · panel `#111A2C` · line `#1E2A40` · line-2 `#3A4A66` · slate `#8B97A8` · paper `#F5F7FA`.
- **Roles** : lien = bleu, hover = violet, accent/etincelle = magenta, succes/online = vert, alerte = magenta.
- **Typo** : display = **Space Grotesk** (titres, tracking serre -0.02em), body = **Inter**, mono = **JetBrains Mono** (tags MAJ tracking 0.2em, code, chiffres).
- **Espacement** : echelle 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96.
- **Rayons** : sm 6 · md 12 · lg 16 · pill 999.
- **Grille blueprint** : 48px.
- **Ombres** : sm/md/lg (voir tokens). **Glows** : bleu (focus) et magenta (etincelle).

## Motifs signature (l'ADN visuel)
- **Le noeud papillon (bowtie)** : le logo, un trait spectre. Voir `components.md`.
- **L'underscore `_`** : accent magenta apres un mot cle (`Archon_`, `architecte_`). Curseur de terminal.
- **La grille blueprint** : fond `--al-void` + lignes 48px, sur les sections `.al-blueprint`.
- **Le terminal** : prompt `$`, mono, curseur clignotant. Esthetique hacker assumee.
- **Materialisation** : elements qui passent de fil de fer (gris + pointilles) a reel.

## Composants
Inventaire + recettes (HTML et agnostique du framework) dans **`components.md`** :
boutons (`al-btn--spectrum/--secondary`, tailles, fx `--sweep/--draw`), boutons-icones,
cartes (`als-card`, `--accent`), eyebrow, lead, en-tetes de section, chips, tags,
champs/formulaires, **interrupteurs / segments / radios / cases** (utiles pour Archon),
nav, footer, stats, FAQ, le logo bowtie, le filet spectre, le rail de progression.

## Mouvement
Moteur `al-scroll` : `data-al="rise"` (apparition douce) et `data-al="materialize"`
(fil de fer vers reel), `data-al-stagger` pour cascader, `data-al-motion` sur `<html>`
pour le style global. Toujours respecter `prefers-reduced-motion`. Detail dans `components.md`.
Dans une app (Archon) : mouvement **sobre et utile** (chargement, etats vides), pas de
grands reveals au scroll.

## Voix et microcopie
Ton, vocabulaire, exemples bons/mauvais dans **`voice.md`**. En bref : confiant, bati,
souverain, une pointe hacker/Matrix, jamais corporate creux. Francais d'abord, accroche
anglaise possible. Et **jamais de tiret cadratin**.

## Adapter la DA a Archon (produit / dashboards)
Le site est une vitrine ; Archon est une app dense. Comment traduire la DA (densite,
statuts de plugins, data viz au spectre, controles, console) : voir **`archon.md`**.

## Barre qualite (checklist)
- [ ] Spectre <= 10 %, uniquement sur des traits / etats, jamais en aplat.
- [ ] Fond void, hierarchie claire, beaucoup d'air.
- [ ] Space Grotesk (titres) / Inter (texte) / JetBrains Mono (tags, code, chiffres).
- [ ] Tokens utilises (pas de hex en dur hors tokens.css).
- [ ] Contraste suffisant sur fond sombre ; focus visible (glow bleu).
- [ ] `prefers-reduced-motion` respecte.
- [ ] Microcopie de marque, **zero tiret cadratin**.
- [ ] Un accent magenta maximum par zone (l'etincelle reste rare).

## Fichiers de ce skill
- `tokens.css` : tous les tokens + base, a importer dans tout projet (site, Archon).
- `components.md` : recettes de composants (HTML + agnostique framework).
- `voice.md` : voix, ton, regles de microcopie.
- `archon.md` : application de la DA au produit Archon (dashboards, plugins, data viz).
- `reference/` : le vrai code de prod a copier ou adapter (CSS, moteur de mouvement,
  composants React, fondations, charte, logo). Pour implementer vite, pars de la (voir
  `reference/README.md`).
