# Démo de différentes fonctionnalités d'Electron

Une application qui illustre l'usage de différentes API offertes par Electron pour construire une application Desktop.

> Démo en cours de construction.

<!-- IPC différents modeles (renderer to main, renderer to main duplex, main to renderer, renderer to renderer, utility process, menus personnalisés, dialog, notification, tray -->

- [Démo de différentes fonctionnalités d'Electron](#démo-de-différentes-fonctionnalités-delectron)
  - [Lancer l'application (dev)](#lancer-lapplication-dev)
  - [IPC et MessagePort](#ipc-et-messageport)
    - [Pattern 1 : Renderer to main (Unidirectionnel)](#pattern-1--renderer-to-main-unidirectionnel)
    - [Pattern 2 : Renderer to main (Bidirectionnel)](#pattern-2--renderer-to-main-bidirectionnel)
    - [Pattern 3 : Main to renderer (Unidirectionnel)](#pattern-3--main-to-renderer-unidirectionnel)
    - [Pattern 4 : Renderer to renderer *via* MessagePort](#pattern-4--renderer-to-renderer-via-messageport)
  - [Menus](#menus)
    - [MenuItem](#menuitem)
    - [Roles : comportement prédéfinis](#roles--comportement-prédéfinis)
  - [Dialog](#dialog)
  - [Notification](#notification)
  - [Tray](#tray)
  - [Utilitary Process](#utilitary-process)


## Lancer l'application (dev)

~~~bash
npm install
npm run start
~~~

## IPC et MessagePort

### Pattern 1 : Renderer to main (Unidirectionnel)

### Pattern 2 : Renderer to main (Bidirectionnel)

### Pattern 3 : Main to renderer (Unidirectionnel)

### Pattern 4 : Renderer to renderer *via* MessagePort

## Menus

Créer a partir d'un template

### MenuItem

### Roles : comportement prédéfinis

Les [roles](https://www.electronjs.org/docs/latest/api/menu-item#roles) offrent des comportements prédéfinis (callback) adaptés à chaque plateforme.

## Dialog

Module pour sélectionner/enregistrer des fichiers, ouvrir des alertes.

## Notification

## Tray

## Utilitary Process