# Architect Lab : voix et microcopie

La DA visuelle a une voix qui va avec. Elle s'applique au site comme a Archon (libelles
de boutons, titres, etats vides, messages d'erreur, logs, notifications).

## REGLE ABSOLUE
**Jamais de tiret cadratin.** Partout, tout le temps. (Le long tiret horizontal est banni, meme cite en exemple.) Remplace par `:` `,` `(` `)` ou `·`.
C'est non negociable.

## Le ton
- **Confiant et bati.** On affirme, on construit. Pas de superlatifs creux, pas de jargon corporate.
- **Souverain.** On rappelle qu'on garde la main : libre, auditable, chez soi.
- **Une pointe hacker / Matrix.** Terminal, "architecte", clins d'oeil discrets. Jamais lourd.
- **Direct et humain.** Tutoiement cote membres/produit ("rejoins", "tu gardes la main").
  Vouvoiement possible cote entreprises/mecenat. Reste coherent par contexte.
- **Concret.** Des verbes d'action : concevoir, construire, proteger, brancher, orchestrer.

## Le vocabulaire maison
- Signature : **Design. Build. Protect.**
- Mots pivots : **architecte**, **souverain**, **auditable**, **libre**, **open source**,
  **on garde la main de bout en bout**, **le plan sur la grille**, **la confiance se verifie**.
- Marques : **Morphaius** (IA), **Bunkerity** (cyber), **BunkerWeb** (WAF), **Archon** (le produit).
- L'accent typographique : un underscore apres un mot cle (`Archon_`, `architecte_`).

## Langue
- **Francais d'abord** (marque ancree a Agen). Une **accroche anglaise** courte est ok
  (ex. tagline produit), surtout pour un public open source international.
- Pour un repo open source : README bilingue possible, mais garder la voix FR comme racine.

## Style d'ecriture
- Phrases courtes, rythme. Une idee par phrase.
- Mets en gras 2 a 3 mots forts, pas des paragraphes entiers.
- Titres : ambitieux mais nets (Space Grotesk serre). Sous-titres : utiles, pas decoratifs.
- Chiffres et faits plutot que promesses vagues.

## CTA (appels a l'action)
Verbe + objet, energie. Exemples : "Rejoindre le Lab", "Decouvrir Archon", "Parlons de
votre projet", "Devenir mecene", "Construire avec nous". Eviter "En savoir plus" seul.

## Microcopie produit (Archon)
- **Etats vides** : invitation a agir, pas une impasse. Ex : "Aucun plugin branche. Ajoute
  ta premiere capacite." (et la metaphore blueprint : "le plan est pret, construis dessus").
- **Erreurs** : claires, sans blamer, avec la sortie. Ex : "Connexion au plugin perdue.
  Reessaie ou verifie ses acces."
- **Succes** : sobre. Ex : "Plugin arme. Tout est operationnel."
- **Confirmations sensibles** : honnetes sur l'effet ("Cette action redemarre le coeur.").
- **Logs / console** : ton terminal, minuscules, mono ("[ ok ] coeur en ligne").

## Bon vs a eviter
- Bon : "Tu gardes la main : c'est toi qui choisis ou vivent ton IA et tes donnees."
- A eviter : "Notre solution innovante revolutionne votre experience" (creux, corporate).
- Bon : "La confiance ne se decrete pas, elle se verifie."
- A eviter : toute phrase avec un tiret cadratin.

## Accessibilite du texte
- Libelles explicites (pas "cliquez ici"). `aria-label` sur les boutons-icones.
- Contraste suffisant ; ne jamais coder une info uniquement par la couleur (ajoute un mot/une icone).
