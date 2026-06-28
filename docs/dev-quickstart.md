# Lancer Archon dans VS Code (pas a pas)

Pas besoin d'etre developpeur. Tu installes un outil (.NET), tu ouvres le dossier dans
VS Code, et tu lances une commande. C'est tout.

## 1. Installer .NET 10
- Va sur https://dotnet.microsoft.com/download/dotnet/10.0
- Telecharge le **SDK .NET 10** pour ton systeme (Windows, macOS ou Linux) et installe-le.
- Verifie : ouvre un terminal et tape `dotnet --version`. Tu dois voir un numero qui
  commence par `10`.

## 2. VS Code + extension
- Installe VS Code (https://code.visualstudio.com).
- Dans VS Code, onglet **Extensions**, installe **C# Dev Kit** (editeur : Microsoft).

## 3. Ouvrir le projet
- VS Code : **Fichier > Ouvrir le dossier** et choisis le dossier `Archon`.

## 4. Lancer
- Ouvre un terminal dans VS Code (menu **Terminal > Nouveau terminal**).
- Tape :

      dotnet run --project src/Archon.Web

- La premiere fois, .NET telecharge des dependances : c'est normal, patiente une minute.
- Quand tu vois `Now listening on: http://localhost:5240`, ouvre cette adresse dans ton
  navigateur.

## 5. Archon : l'accueil, le chat et l'IHM
- A l'adresse `http://localhost:5240` s'ouvre **Archon** : l'**Accueil** sobre (le "coeur"
  reactif, une phrase, des actions, l'etat). En haut, la navigation : **Accueil / Archon /
  Connecteurs / Reglages**.
- Clique **Entrer dans Archon** (ou l'onglet **Archon**) : a gauche un **chat**, a droite
  l'**IHM**, le canvas que l'IA pilote.
- Dans le chat, demande par exemple :

      mets sur l'IHM la meteo d'Agen rafraichie toutes les 2 minutes

- Un **widget meteo** apparait a droite. Il affiche la temperature, une petite courbe (24 h),
  et **se met a jour tout seul**. Recharge la page (F5) : il **reste** (il est persiste).
- L'IA peut aussi personnaliser l'IHM en direct :

      passe l'IHM en violet
      retire le widget meteo
      mets sur l'IHM un petit encart de bienvenue, soigne

  Le theme change tout de suite ; les visuels libres sont composes en HTML/CSS et rendus en
  **bac a sable** (aucun script execute).

> Note : sans cerveau IA branche (voir plus bas), le chat comprend les commandes courantes
> (`meteo Agen`, `allume la lumiere du salon`, "mets la meteo sur l'IHM", "vide l'IHM"). Le
> langage naturel libre et les visuels originaux tirent le meilleur d'un modele branche.

## 6. Connecteurs et Reglages
- Onglet **Connecteurs** : la liste des **plugins** avec leurs **capacites** et un interrupteur
  de **permission** par capacite (tout est **refuse par defaut** : tu vois et tu regles). En
  dessous, tu peux **declarer** un serveur **MCP** (par URL) ou un connecteur **HTTP**, le
  tester, l'activer/desactiver. Un secret se reference par le **nom d'une variable d'env**,
  jamais en clair.
- Onglet **Reglages** : le **mode d'approbation** (demander mon accord / laisser l'IA agir),
  le cerveau IA actif, le **theme** (accent, densite), les **preferences d'affichage**, et le
  **skill Archon** (le prompt systeme qui dit a l'IA comment se servir de l'IHM : tu peux le
  reecrire).

## 7. Une action, avec ton accord
- Dans le chat d'Archon, tape `allume la lumiere du salon` puis Entree.
- En mode "Demander mon accord" (par defaut, reglable dans **Reglages**), une carte
  **"Approbation requise"** apparait : **Approuver** -> la lumiere passe "allumee" ;
  **Refuser** (ou attendre) -> rien. C'est la regle : l'IA n'agit pas sans ton accord.
- La **console technique** reste disponible sous `/console` (une entree, le registre, le
  journal d'audit) : pratique pour tester `meteo Agen` rapidement.

## Arreter
- Dans le terminal, appuie sur `Ctrl + C`.

## En cas de souci
- `dotnet` introuvable : reinstalle le SDK .NET 10, puis ferme et rouvre VS Code.
- Pas de meteo : verifie ta connexion internet (le plugin meteo et les polices viennent
  d'internet au stade squelette).
- Port deja pris : change `5240` dans `src/Archon.Web/Properties/launchSettings.json`.

## Optionnel : brancher un cerveau IA
Sans modele, l'orchestrateur comprend les commandes simples (ex : `meteo Agen`). Avec un
modele, il comprend le langage naturel (ex : "quel temps a Paris ?"). C'est optionnel :
l'app tourne dans les deux cas.

Archon parle l'API "chat completions" compatible OpenAI (Ollama en local, ou un service
cloud). Tu renseignes des variables d'environnement avant de lancer.

En local avec Ollama (https://ollama.com), gratuit et souverain :

1. Installe Ollama, puis dans un terminal : `ollama pull llama3.1`
2. Lance Archon avec ces variables (exemple macOS / Linux) :

       export ARCHON_MODEL_BASEURL=http://localhost:11434/v1
       export ARCHON_MODEL_NAME=llama3.1
       dotnet run --project src/Archon.Web

   Sous Windows (PowerShell) :

       $env:ARCHON_MODEL_BASEURL = "http://localhost:11434/v1"
       $env:ARCHON_MODEL_NAME = "llama3.1"
       dotnet run --project src/Archon.Web

En cloud : renseigne aussi `ARCHON_MODEL_APIKEY` (fourni par ton service). La cle se met
en variable d'environnement, **jamais dans un fichier** du depot.

Les Reglages d'Archon affichent le cerveau actif (ou "repli mots-cles" si aucun modele branche).

## C'est quoi, sous le capot ?
- `src/Archon.Core` : le coeur (contrats de plugin, registre, orchestrateur, securite, audit,
  schema UI neutre, modele de widget IHM, modele de connecteur, skill Archon).
- `src/Archon.Data` : la persistance locale (SQLite : reglages, journal, widgets, connecteurs).
- `src/Archon.Plugins.Meteo` / `Archon.Plugins.Maison` : deux vrais plugins (meteo, domotique simulee).
- `src/Archon.Plugins.Ihm` : le plugin qui donne a l'IA la main sur l'IHM (poser un widget,
  composer un visuel libre, changer le theme, retirer, vider, memoriser des preferences).
- `src/Archon.Web` : le coeur web : l'API HTTP/JSON (`/api/...`) qui sert la surface **Archon**
  a la racine `/`, plus la console technique sous `/console`.
- `src/Archon.Surface` : la surface React (Accueil + Archon + Connecteurs + Reglages). Son build
  est **deja commite** dans `src/Archon.Web/wwwroot/archon`, donc pas besoin de Node pour lancer.

### Optionnel : retoucher la surface React
Seulement si tu veux modifier l'interface (il faut Node 20+) :

    cd src/Archon.Surface
    npm install
    npm run dev      # dev avec rechargement a chaud (proxy /api -> http://localhost:5240)
    npm run build    # regenere le bundle commite dans ../Archon.Web/wwwroot/archon

Le pourquoi de tout ca : `docs/ARCHITECTURE.md` et `docs/plugin-model.md`.
