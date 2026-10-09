# INSEE : retrouver le périmètre d’un chiffre

**Vérifie valeur, unité, période, territoire et définition statistique.**

[![Tests](https://github.com/gbesse/jev-insee-chiffre-preuve/actions/workflows/ci.yml/badge.svg)](https://github.com/gbesse/jev-insee-chiffre-preuve/actions/workflows/ci.yml) · MIT · Node.js 22/24 · Version expérimentale

Ce chiffre représente-t-il une moyenne, une médiane ou une autre population ?

## Essayer en une minute

```sh
git clone https://github.com/gbesse/jev-insee-chiffre-preuve.git
cd jev-insee-chiffre-preuve
npm ci
npm run demo
npm run demo:import
npm run demo:limite
npm run demo:revue
npm run serve
```

Ouvrir http://127.0.0.1:8807 : choisir un exemple, modifier le JSON, analyser et télécharger le rapport. Aucun compte requis pour les modes hors ligne. Les exemples sont synthétiques et identifiés comme tels. [Parcours de démonstration](docs/demo/index.html).

## Ce qui est développé

Le module métier contient les contrôles propres à ce sujet. Le rapport JSON et HTML conserve chaque résultat, ses pièces et leurs empreintes SHA-256. Les passages sémantiques doivent être présents dans les pièces citées. Les nombres, dates et identifiants sont traités en code ; Jev évalue les rapprochements de sens avec abstention selon la confiance et la marge.

Le mode `regles` laisse les rapprochements sémantiques à revoir. Le mode `extraction` est une baseline lexicale simple, sans OCR ni compréhension fiable des négations. Un statut `etaye` signifie uniquement que les contrôles exécutés sont satisfaits. 

```js
import {readFile} from 'node:fs/promises';
import {analyze,toHtml} from './src/index.mjs';
const dossier=JSON.parse(await readFile('./examples/dossier.json','utf8'));
const rapport=await analyze(dossier,{mode:'regles'});
console.log(rapport.status,rapport.outputs);
const html=toHtml(rapport);
```

```sh
node bin/jev-insee-chiffre-preuve.mjs examples/dossier.json --mode regles --out rapport.json --html rapport.html
```

La CLI renvoie 0 pour `etaye`, 2 pour `ecart`, 3 pour `a_revoir`, 1 pour une erreur. Les scripts de démonstration n’échouent pas lorsqu’ils montrent un dossier à revoir. Les [types du contrat métier](src/index.d.mts) et le [dossier complet](examples/dossier.json) décrivent les champs. [Importer TXT et PDF textuels](docs/imports.md).

`npm run demo:graphique` exporte un SVG déterministe comparant affirmation et observation, avec unité, période et source.

Le connecteur Melodi est fourni : `node examples/melodi.mjs --live`. Il conserve données, dimensions, source et indicateur de pagination complète. La sélection de l’observation et la définition statistique doivent être validées avant normalisation. [Usage officiel Melodi](https://inseefrlab.github.io/melodi/reference/get_data.html).

## Appeler Jev

Créer une `.env` ignorée par Git, permissions 600, avec `TYPESAFE_API_KEY`. Les appels sont payants et transmettent les passages à `api.typesafe.ai`. Le serveur local n’autorise Jev qu’avec le démarrage explicite ci-dessous ; aucune clé n’est envoyée au navigateur.

```sh
node --env-file=.env examples/demo.mjs --live
npm run serve:live
npm run bench:live
```

Modèle fixé `jev-1.13.0`, délai d’expiration, annulation, validation des distributions et réessais bornés. Seuils initiaux configurables, non calibrés. [API TypeSafe](https://docs.typesafe.ai/api) et [limites du modèle](https://docs.typesafe.ai/model-jaggedness/jev-1.13). Le paquet est installable depuis GitHub, sans publication npm : `npm install github:gbesse/jev-insee-chiffre-preuve#v0.1.0`.

## Validation et limites

```sh
npm run typecheck
npm test
npm run bench
```

Les tests locaux passent sous Node 22 et 24. Jev retrouve 6/6 statuts globaux attendus dans le test synthétique initial, avec 0 erreur(s) de fournisseur ; la couverture sémantique est de 83.3 %. Les résultats complets et leurs limites sont conservés. La CI exécute les contrôles sous Node 22 et 24. Voir [évaluation et résultats](docs/evaluation.md), [sources](docs/sources.md), [acquisition](docs/acquisition.md) et [les douze projets](docs/serie-fr.md).

Une observation sélectionnée ne garantit pas que toutes les séries pertinentes ont été examinées. Source, révision et définition restent visibles.

Version initiale : corpus synthétique, sans supériorité SOTA ni trafic démontrés. Les champs normalisés doivent être contrôlés contre les originaux. Code MIT ; exemples CC0. Projet indépendant, sans affiliation aux organismes ou à TypeSafe AI.

## Contrôle d’adoption · Adoption check · Comprobación de adopción

[Français : essayer un cas concret](examples/adoption-check.md) · [English: try a concrete case](examples/adoption-check.md) · [Español: pruebe un caso concreto](examples/adoption-check.md).
