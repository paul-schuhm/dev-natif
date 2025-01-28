# Démo child processes avec l'API utilityProcess

Une démo pour lancer un nouveau processus dédié à un traitement intensif (calcul intensif, manipulation d'image, batch processing, etc.) via l'api utilityProcess d'Electron.

> Une alternative est d'utiliser directement [l'API Child Process de Node.js](https://nodejs.org/api/child_process.html). `utilityProcess` utilise [l'API de chromium](https://chromium.googlesource.com/chromium/src/+/main/docs/mojo_and_services.md) pour démarrer le processus.

## Lancer la démo

~~~bash
npm install
npm run start
~~~

Cliquer sur le bouton `Démarrer traitement long`.

> Le traitement long est simulé ici avec un simple `setTimeout`.

## Références

- [utilityProcess](https://www.electronjs.org/docs/latest/api/utility-process), documentation officielle (Reference)