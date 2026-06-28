# Baseline securite : le jour 1

Le minimum non negociable, en place des la premiere brique qui execute du code non fiable
ou laisse l'IA agir. Issu de l'analyse des menaces (plugins plus agents). On ne descend
pas en dessous.

## Plugins (frontiere de confiance)
- [ ] Aucun plugin **non signe** n'est charge (signature verifiee, registre de cles de confiance).
- [ ] **Manifeste de capacites** obligatoire : un plugin declare ce qu'il demande (fichiers,
      reseau, camera, domotique...) et ses limites de ressources.
- [ ] Politique **OPA en "tout refuser par defaut"** : seules les capacites accordees par
      l'utilisateur passent.
- [ ] **Isolation WASM/WASI** : memoire et CPU plafonnes, timeout, pas d'acces non declare.
- [ ] **mTLS** entre le coeur et les plugins en process ou VM : authentification mutuelle.
- [ ] **Scan SBOM** a l'installation : une CVE critique bloque le chargement.
- [ ] **Audit** de chaque chargement, octroi de capacite et appel.

## Agents IA (l'IA ne fait pas le mal)
- [ ] **Approbation humaine** sur toute action a consequence ou irreversible (deverrouiller,
      supprimer, depenser, flasher...). Refus par expiration du delai.
- [ ] **Capability gating** : un agent ne peut appeler que les outils declares (defaut deny).
- [ ] **Execution du code auto-genere en conteneur ephemere** : FS en lecture seule, seccomp,
      sans reseau, timeout, detruit apres usage.
- [ ] **Journal d'audit immuable** : chaque decision, appel d'outil, approbation, resultat.
- [ ] **Defense anti-injection** : validation des entrees, assainissement et balisage des
      resultats d'outils (injection indirecte via API, fichiers, flux camera).
- [ ] **Rate limits plus kill-switch** : plafonds de vitesse et de cout, coupure d'urgence et
      disjoncteur automatique (aussi exige par l'EU AI Act pour l'IA a haut risque).
- [ ] **Classification des donnees sensibles** (cameras, secrets, donnees perso) : pas de
      reflexion du secret par le modele, quotas sur l'acces aux donnees externes.

## Principe
Ces controles ne sont pas un module ajoute a la fin : ils font partie de la definition de
"fait" pour toute brique qui touche au code non fiable ou a l'action reelle. La confiance
se verifie.
