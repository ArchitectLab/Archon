# Contribuer a Archon

Merci de vouloir construire Archon. Un seul prerequis d'etat d'esprit : l'envie.

## Avant de commencer
- Ouvre ou commente une **issue** pour discuter de ton idee avant de coder.
- Pour un nouveau plugin : utilise le modele d'issue **"Proposition de plugin"**.

## Le flux
1. Forke le depot et cree une branche claire (voir **Nommage des branches** ci-dessous).
2. Fais des commits clairs (Conventional Commits recommande : `feat:`, `fix:`, `docs:`...).
3. Ouvre une **Pull Request** en remplissant le modele.
4. Une relecture par un mainteneur, et un coup d'oeil securite cote Bunkerity sur les
   parties sensibles, precedent la fusion.

## Nommage des branches
Une convention simple et lisible, alignee sur les Conventional Commits. Format :

    <type>/<resume-court>

- **type** : la nature du travail (liste ci-dessous).
- **resume** : 2 a 5 mots en minuscules, separes par des tirets (kebab-case),
  sans accents ni espaces.
- **numero d'issue** (optionnel) : en prefixe du resume, ex. `feat/142-plugin-meteo`.

| Prefixe     | Pour quoi                                            |
| ----------- | ---------------------------------------------------- |
| `feat/`     | nouvelle fonctionnalite                              |
| `fix/`      | correction de bug                                    |
| `plugin/`   | nouveau plugin (ou evolution majeure d'un plugin)    |
| `docs/`     | documentation seule                                  |
| `refactor/` | reorganisation du code sans changer le comportement  |
| `test/`     | ajout ou correction de tests                         |
| `chore/`    | outillage, config, dependances, CI                   |

Exemples : `feat/plugin-meteo`, `fix/reconnexion-mqtt`, `plugin/camera-rtsp`,
`docs/vision-personas`, `chore/ci-lint`.

> Regle d'or : en lisant le nom d'une branche, on doit comprendre *ce qui* change
> et *de quelle nature*, sans ouvrir le code.

## CLA (obligatoire)
Archon utilise un modele de **double licence** (open source + commerciale). Pour que les
co-detenteurs puissent relicencier le code, chaque contributeur doit accepter le **CLA**
(`CLA.md`). Un bot (CLA Assistant) le demandera a ta premiere PR. Sans CLA accepte, une
PR ne peut pas etre fusionnee.

## Style
- Lisible avant tout : documente ce qui n'est pas evident.
- **Securite par defaut** : aucun secret en clair, valide les entrees, moindre privilege.
- Conventions detaillees (langage, formatage, tests) a venir quand la stack sera figee.

## Code de conduite
Ce projet suit un `CODE_OF_CONDUCT.md`. En participant, tu t'engages a le respecter.
