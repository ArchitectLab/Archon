# Architect Lab : composants

Recettes des composants de la DA. Les noms de classes sont ceux du site (CSS dans
`assets/css/`). Pour Archon (autre stack possible), reconstruis le meme rendu a partir
des tokens : l'important est l'aspect, pas la classe. Toujours : spectre sur les traits,
fond void, beaucoup d'air, zero tiret cadratin.

## Logo : le noeud papillon (bowtie)
Un trait au degrade spectre, en diagonale. SVG inline (le gradient `al-spec` doit exister
quelque part dans le document) :

```html
<svg class="al-bowtie" viewBox="0 0 120 80" width="45" height="30" aria-hidden="true">
  <path d="M14 14 L60 40 L106 14 L106 66 L60 40 L14 66 Z"
        stroke="url(#al-spec)" stroke-width="9" stroke-linejoin="round"
        stroke-linecap="round" fill="none"/>
</svg>
```
Definition du gradient (a inclure une fois) :
```html
<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
  <linearGradient id="al-spec" x1="0" y1="1" x2="1" y2="0">
    <stop offset="0%" stop-color="#2ECC9A"/><stop offset="38%" stop-color="#2A6BF2"/>
    <stop offset="70%" stop-color="#8A2BE2"/><stop offset="100%" stop-color="#E612D9"/>
  </linearGradient>
</defs></svg>
```
Le wordmark s'ecrit `Architect Lab` suivi d'un underscore magenta : `Lab<span style="color:var(--al-magenta)">_</span>`.

## Boutons
- `al-btn al-btn--spectrum` : primaire, fond/contour au spectre. Action principale (1 par vue).
- `al-btn al-btn--secondary` : contour discret sur void. Action secondaire.
- Tailles : `al-btn--sm`, `al-btn--lg`. Effets : `al-fx--sweep` (balayage spectre au hover, sur le primaire), `al-fx--draw` (trait qui se dessine, sur le secondaire), `al-fx--glow`.
- Icone a droite pour "avancer", a gauche pour une categorie. Taille d'icone 15 a 17px.

```html
<a href="#x" class="al-btn al-btn--spectrum al-btn--lg al-fx--sweep">
  Rejoindre le Lab <svg class="al-icon" style="width:17px;height:17px"><use href="#i-arrow-right"/></svg>
</a>
```
Recette agnostique : radius `--al-radius-md`, poids 600, font body ; primaire = bordure
spectre + fond void qui se remplit au hover ; transitions courtes (.1 a .15s).

## Bouton-icone
`al-iconbtn` (`--sm`, `--lg`, `--ghost`) : carre/rond, une icone centree. Pour les barres
d'outils, fermer une modale, etc. (tres utile pour Archon).

## Eyebrow (sur-titre)
Petit label au-dessus d'un titre : mono ou body, MAJUSCULES douces, couleur d'accent
selon la section (vert/bleu/violet/magenta). Donne le "chapitre".
```html
<span class="al-eyebrow" style="color:var(--al-green)">Notre premier projet</span>
```

## Lead (chapeau)
Paragraphe d'intro plus grand et plus clair. `als-lead`. Largeur de lecture ~60 a 66ch.
Mets en avant 2 ou 3 mots forts en `font-weight:600;color:var(--al-paper)`.

## En-tete de section
`als-section` (conteneur), `als-section__head` (eyebrow + h2 + lead). Separation entre
sections : `border-top:1px solid var(--al-line)`. Les sections "fond grille" ajoutent `al-blueprint`.

## Carte
`al-card als-card` : surface panel, bordure line, radius lg, ombre md. Variante
`als-card--accent` : un filet spectre en bord (jamais un aplat). Sous-parties :
`als-card__icon` (pastille d'icone), `als-card__num` (numero 01/02/03), `als-card__top`.
```html
<article class="al-card als-card als-card--accent">
  <div class="als-card__top">
    <span class="als-card__icon"><svg class="al-icon"><use href="#i-git-branch"/></svg></span>
    <span class="als-card__num">01</span>
  </div>
  <h3>Construire en open source</h3>
  <p>Des projets reels, documentes, maintenus, sous licence libre.</p>
</article>
```

## Chips et tags
- `als-chips` > `als-chip` : petites pastilles (technologies, mots cles). Bordure line, radius pill.
- `al-tag` : etiquette mono MAJUSCULES avec icone et couleur d'accent (ex. "Track 01", "En cours").

## Stat / chiffre cle
`als-stat` : grand nombre en display (souvent `al-spectrum-text`) + libelle muted.
Chiffres toujours en `font-variant-numeric: tabular-nums`.

## Champs et formulaires
- `als-field` (label + input), `als-input` (boite avec prefixe `als-input__prefix` `>`),
  `als-form`. Inputs : fond panel, bordure line-2, radius sm/md, focus bordure bleu + glow.
```html
<div class="als-input">
  <span class="als-input__prefix">&gt;</span>
  <input type="email" placeholder="toi@@domaine.org" required>
</div>
```
> Note Razor/Blazor : un `@` litteral s'echappe en `@@`.

## Controles (parfaits pour Archon)
Le CSS du site fournit deja : `al-switch` (interrupteur), `al-seg` / `al-seg--spectrum`
(segments / onglets), `al-radio`, `al-check`. Etat actif = trait/teinte spectre, jamais aplat.

## Navigation
- `als-nav` (barre haute) + `als-nav__links` + bouton primaire + `als-burger` (mobile).
- `als-drawer` : tiroir mobile. Pour les pages secondaires : `legalnav` (logo + retour).

## Pied de page
`als-footer` > `als-foot` (marque + colonnes `als-foot__h`/`als-foot__col`) puis
`als-foot__legal` (copyright, liens legaux, "Protege par BunkerWeb", baseline DESIGN · BUILD · PROTECT).

## Terminal
`als-term` : prompt `$`, commande en mono, curseur `▌` clignotant (`al-cursor`). Sortie
`als-term__out`. Esthetique hacker assumee. Bon candidat pour une console / command palette dans Archon.

## Rail de progression
`al-rail` (+ `__fill`, `__bead`) : un fil vertical au spectre qui se remplit au scroll.
Symbolise la materialisation.

## Mouvement (moteur al-scroll)
- `data-al="rise"` : apparition douce (translation + fondu).
- `data-al="materialize"` : l'element demarre en fil de fer (gris + pointilles) puis devient reel.
- `data-al-stagger="110"` sur un parent : cascade les enfants (valeur = ms).
- `data-al-motion="materialize|scan|draft|calm"` sur `<html>` : style global du moteur.
- Le moteur ajoute la classe `is-in` quand l'element entre dans le viewport, et `al-ready` sur `<html>`.
- Toujours encadre par `prefers-reduced-motion`.

## Icones
Sprite SVG inline (Lucide + GitHub), symboles `#i-...` (arrow-right, cpu, shield, lock,
sparkles, puzzle, bot, git-branch, users, mail, etc.). Classe `al-icon`. Trait courant
(`currentColor`), pas de remplissage massif.
