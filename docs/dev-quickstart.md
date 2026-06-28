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

## 5. Tester
- La **page d'accueil** s'affiche (fond sombre, le spectre, le logo).
- Clique **Ouvrir la console**.
- Dans le champ, tape par exemple `meteo Agen` puis Entree.
- La meteo s'affiche, et a droite le plugin **Meteo** apparait **online** dans le registre.
  En dessous, le **journal** trace l'action.

## Arreter
- Dans le terminal, appuie sur `Ctrl + C`.

## En cas de souci
- `dotnet` introuvable : reinstalle le SDK .NET 10, puis ferme et rouvre VS Code.
- Pas de meteo : verifie ta connexion internet (le plugin meteo et les polices viennent
  d'internet au stade squelette).
- Port deja pris : change `5240` dans `src/Archon.Web/Properties/launchSettings.json`.

## C'est quoi, sous le capot ?
- `src/Archon.Core` : le coeur (contrats de plugin, registre, orchestrateur, securite, audit).
- `src/Archon.Plugins.Meteo` : un vrai plugin (meteo via open-meteo, sans cle).
- `src/Archon.Web` : l'app Blazor (accueil + console).

Le pourquoi de tout ca : `docs/ARCHITECTURE.md` et `docs/plugin-model.md`.
