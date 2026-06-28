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

## 5. Tester l'app (chat + IHM)
- La **page d'accueil** s'affiche (fond sombre, le spectre, le logo).
- Clique **Ouvrir l'app**. Tu arrives sur `/app` : a gauche un **chat**, a droite l'**IHM**
  (un canvas vide pour l'instant : c'est l'espace que l'IA va remplir).
- Dans le chat, demande par exemple :

      mets sur l'IHM la meteo d'Agen rafraichie toutes les 2 minutes

- Un **widget meteo** apparait a droite, sur l'IHM. Il affiche la temperature, une petite
  courbe (24 h), et **se met a jour tout seul** (toutes les 2 minutes ici).
- Recharge la page (F5) : le widget **est toujours la** (il est persiste). L'IHM garde ce
  que l'IA y a pose.
- Tu peux aussi demander un visuel libre, par exemple :

      mets sur l'IHM un petit encart qui souhaite la bienvenue, en violet

  L'IA compose un fragment HTML/CSS, rendu dans un **bac a sable** (aucun script execute).
- Pour retirer un widget : bouton **retirer** en haut du widget. Pour tout vider :
  demande "vide l'IHM".

> Note : sans cerveau IA branche (voir plus bas), le chat comprend surtout les commandes
> simples (`meteo Agen`, `allume la lumiere du salon`). La pose libre sur l'IHM en langage
> naturel ("mets la meteo sur l'IHM") tire le meilleur d'un modele branche (Ollama ou cloud).

## 5 bis. La console technique
- Le lien **La console** (`/console`) garde l'outil d'origine : une entree, le registre des
  plugins (online/offline), et le journal d'audit. Tape `meteo Agen` pour voir la meteo
  (avec sa courbe), et a droite le plugin **Meteo** **online** dans le registre.

## 6. Une action, avec ton accord
- Tape `allume la lumiere du salon` puis Entree.
- Une carte **"Approbation requise"** apparait : clique **Approuver** -> la lumiere passe
  "allumee" (carte Maison). Clique **Refuser** (ou attends) -> rien ne se passe. C'est la
  regle : l'IA n'agit pas sans ton accord.
- En haut, l'interrupteur **Approbation des actions** te laisse choisir :
  - **Demander mon accord** (par defaut) : chaque action attend ta validation.
  - **Laisser l'IA agir** : les actions s'executent directement (toujours tracees dans le journal).
- Avec Ollama branche, tu peux dire en langage naturel : "eteins la lumiere de la cuisine".

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

La console affiche le cerveau actif (ou "repli mots-cles" si aucun modele n'est branche).

## C'est quoi, sous le capot ?
- `src/Archon.Core` : le coeur (contrats de plugin, registre, orchestrateur, securite, audit,
  schema UI neutre, modele de widget IHM).
- `src/Archon.Data` : la persistance locale (SQLite : reglages, journal, widgets de l'IHM).
- `src/Archon.Plugins.Meteo` / `Archon.Plugins.Maison` : deux vrais plugins (meteo, domotique simulee).
- `src/Archon.Plugins.Ihm` : le plugin qui donne a l'IA la main sur l'IHM (poser un widget,
  composer un visuel libre, vider, memoriser des preferences d'affichage).
- `src/Archon.Web` : l'app Blazor (accueil + console) **et** l'API HTTP/JSON (`/api/...`) qui
  sert la surface React sous `/app`.
- `src/Archon.Surface` : la surface React (chat + IHM). Son build est **deja commite** dans
  `src/Archon.Web/wwwroot/app`, donc tu n'as pas besoin de Node pour lancer Archon.

### Optionnel : retoucher la surface React
Seulement si tu veux modifier le chat ou l'IHM (il faut Node 20+) :

    cd src/Archon.Surface
    npm install
    npm run dev      # dev avec rechargement a chaud (proxy /api -> http://localhost:5240)
    npm run build    # regenere le bundle commite dans ../Archon.Web/wwwroot/app

Le pourquoi de tout ca : `docs/ARCHITECTURE.md` et `docs/plugin-model.md`.
