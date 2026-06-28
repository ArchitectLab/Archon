# Modele de donnees

Le coeur persiste un petit nombre d'entites stables. **Local-first** : en mode local, rien
ne quitte la machine. Stockage **SQLite par defaut**, **Postgres** pour le cloud ou
l'hybride a l'echelle. Schema versionne (migrations).

## Les entites
- **registry** : plugins / connecteurs / serveurs MCP installes (id, version, source,
  runtime, statut, sante, derniere vue).
- **grants** : permissions accordees par l'utilisateur a chaque plugin ou agent (capacite,
  portee, date, accordeur). Coeur du modele de securite.
- **agent_state** : etat des graphes d'agents et points de reprise (reprise, audit).
- **audit_log** : journal append-only immuable (acteur, action, outil, arguments,
  approbation, resultat, horodatage, hash chaine).
- **models** : configs de modeles (fournisseur, local ou cloud, endpoint, quotas, cout),
  avec le couple pre-mache / avance.
- **deployment** : mode (local / cloud / hybride) et regles de routing par capacite.
- **secrets** : coffre chiffre (jamais en clair) ; plugins et agents referencent par
  handle, ne voient jamais la valeur.
- **routines** : automatisations creees par l'utilisateur ou l'IA (declencheur, conditions,
  actions, statut).
- **ui_state** (optionnel) : etat des surfaces generatives recurrentes.

## Principes
- **Local-first** : SQLite embarque, fichier chez l'utilisateur en mode local.
- **Secrets** : chiffres au repos, jamais logues, references par handle.
- **Audit immuable** : append-only, hash chaine pour detecter toute alteration.
- **Portabilite** : export / import de la config (hors secrets) pour migrer local <-> cloud.
- **Migrations** versionnees ; aucun schema fige en dur ailleurs que dans les migrations.
