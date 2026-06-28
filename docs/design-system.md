# Design system Architect Lab

Le design system complet (le « bundle Claude Design ») vit dans ce dépôt comme
**Agent Skill Claude Code**, ici :

    .claude/skills/architect-lab-design/

## L'utiliser pendant qu'on code

- Dans Claude Code, le skill est invocable : `/architect-lab-design`.
- Point d'entrée à lire en premier : `.claude/skills/architect-lab-design/readme.md`
  (identité, voix, fondamentaux), puis `SKILL.md`.

## Ce qu'il contient

- `tokens/` : couleurs, typographie, layout, polices (variables `--al-...`).
- `components/` : Button, Card, Input, Logo, Tag, GradientRule, Eyebrow, controls
  (Switch, Checkbox, Radio, SegmentedControl). Sources `.jsx` + `.d.ts` + vignettes.
- `foundations/` : marque, couleur, typographie (specimens).
- `motion/` : l'animation signature « La Matérialisation » (`al-scroll`).
- `ui_kits/website/` : recomposition du site marketing à partir des primitives.
- `assets/logo-spectre.png` : le logo officiel (le spectre Morphaius).

## L'identité en trois traits

- Le **plan d'architecte** : grille sombre 48 px sur fond Deep Void `#0B1220`, coins nets.
- Le **spectre** vert `#2ECC9A` puis bleu `#2A6BF2` puis violet `#8A2BE2` puis
  magenta `#E612D9` : sur les traits, les titres et le logo, jamais en grand aplat
  (règle d'or : moins de 10 % de la composition).
- Polices : Space Grotesk (titres), Inter (texte), JetBrains Mono (code et étiquettes).
  Le curseur magenta `_` qui clignote est la signature.

> Source canonique de la marque : la charte graphique v2.0 (juin 2026), copiée dans
> `.claude/skills/architect-lab-design/uploads/Charte_Graphique_Architect_Lab.html`.
