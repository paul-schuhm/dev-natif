# Guess my number

Le jeu *Guess my number* dans une application [Electron](https://www.electronjs.org/). La logique du jeu est maintenue par le processus principal et le renderer se content d'être une interface utilisateur chargée de récupérer les inputs de l'utilisateur et de mettre à jour l'interface (message) pour indiquer l'état du jeu. Les deux processus échangent [via le module ipc renderer vers main bidirectionnel](https://www.electronjs.org/docs/latest/tutorial/ipc#pattern-2-renderer-to-main-two-way).

## Lancer l'application (dev)

~~~bash
npm i
npm run start
~~~

## Références utiles

- [Pattern 2: Renderer to main (two-way)](https://www.electronjs.org/docs/latest/tutorial/ipc#pattern-2-renderer-to-main-two-way)