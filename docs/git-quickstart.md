# Passer du ZIP a git (recommande)

Telecharger un ZIP a chaque fois, c'est lourd. Avec **git**, tu recuperes les nouveautes
en une commande. Pas besoin d'etre dev : trois commandes, c'est tout.

## 1. Installer Git (une fois)
- Va sur https://git-scm.com/download/win et installe **Git pour Windows** (laisse les
  options par defaut).
- Verifie : ouvre un terminal et tape `git --version` (un numero doit s'afficher).

## 2. Recuperer le projet (une fois)
Dans un dossier ou tu veux ranger le projet, terminal :

    git clone https://github.com/ArchitectLab/Archon.git

Un dossier `Archon` apparait, avec tout le code. Ouvre-le dans VS Code.

## 3. Au quotidien
- **Recuperer les dernieres nouveautes** (depuis `main`) :

      git pull

- **Essayer une branche** (ex. une fonctionnalite en cours) :

      git fetch
      git checkout feat/nom-de-la-branche
      git pull

- **Revenir a la version stable** :

      git checkout main
      git pull

Puis comme d'habitude : `dotnet run --project src/Archon.Web`.

## En cas de souci
- "git n'est pas reconnu" : ferme et rouvre VS Code apres l'installation (ou redemarre).
- Un message parle de "modifications locales" : tu as edite des fichiers. Si tu veux jeter
  tes changements locaux, `git checkout .` (attention, ca efface tes modifs non sauvees).
- Bloque ? Copie-moi le message, je te debloque.
