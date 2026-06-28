# Modele de plugin et contrat (manifeste + ABI)

Le plugin est le **contrat central** d'Archon : tout ce qui n'est pas le coeur passe par
lui, y compris les capacites livrees d'office (plugins de premiere partie). Deux types
d'execution sont supportes **des le depart** : **WASM** (bac a sable, recommande) et
**process** (gRPC, pour le lourd ou le legacy).

## Le manifeste : archon.plugin.json
Chaque plugin porte un manifeste declaratif. Exemple :

```json
{
  "id": "plugin-meteo",
  "name": "Meteo",
  "version": "1.0.0",
  "author": "Architect Lab",
  "source": "https://github.com/architectlab/archon-plugin-meteo",
  "runtime": "wasm",
  "abi": "wit:0.1.0",
  "extension_points": ["connector", "dashboard-widget"],
  "capabilities": {
    "http": { "allowed_hosts": ["api.open-meteo.com"], "methods": ["GET"] },
    "filesystem": { "paths": ["/var/archon/meteo"], "mode": "read-write" },
    "secrets": ["openmeteo_key"]
  },
  "resources": { "memory_mb": 128, "cpu_cores": 1, "timeout_seconds": 30, "egress_mbps": 5 },
  "signature": "ed25519:...",
  "sbom": "sbom.spdx.json"
}
```

Champs notables :
- **runtime** : `wasm` ou `process`.
- **abi** : `wit:x` (wasm) ou `grpc:x` (process). Le coeur refuse un ABI incompatible.
- **capabilities** : portee fine, **tout refuser par defaut**. L'utilisateur accorde, OPA verifie.
- **resources** : plafonds memoire / CPU / timeout / egress.
- **signature** : Ed25519 obligatoire. **sbom** : scanne, une CVE critique = refus.
- **version** : semver ; rupture seulement en version majeure.

## L'ABI (interface stable)
- **WASM** : interface decrite en **WIT** (WebAssembly Interface Types, Component Model).
  Typee et polyglotte (Rust, Go, TS, C... compilent vers WASM).
- **Process** : **gRPC / protobuf**. Pour les binaires lourds, le legacy, ou un runtime
  specifique. Isolation par process plus seccomp plus cgroups plus mTLS.
- Les deux exposent les memes notions (evenements, appels, config, widgets) via deux
  transports. Versionnees en semver.

## Points d'extension (ce qu'un plugin peut etre)
- **connector** : relie un systeme ou protocole (HTTP, MQTT, serie, MCP...).
- **tool** : une capacite appelable par l'orchestrateur (lecture ou action).
- **dashboard-widget** : un bloc d'UI pour la surface generative (via le schema neutre).
- **mcp-server** : expose des outils et ressources via MCP.

Un plugin peut en implementer plusieurs.

## Cycle de vie
decouverte -> validation (signature, SBOM, politique) -> octroi de capacites par
l'utilisateur -> chargement isole -> supervision (sante, ressources, audit) -> arret ou
mise a jour (manifeste reverifie).

## Securite
Voir `security-baseline.md`. En resume : signe, manifeste, OPA deny-par-defaut, isolation
(WASM, ou process plus seccomp), mTLS, audit de tout.
