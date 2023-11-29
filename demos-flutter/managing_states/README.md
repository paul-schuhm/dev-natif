# managing_states

- [managing\_states](#managing_states)
  - [Démos gestion des états avec `setState`](#démos-gestion-des-états-avec-setstate)
  - [Démo gestion des états avec Inherited widget](#démo-gestion-des-états-avec-inherited-widget)
    - [Lancer la démo Inherited widget *sans update*](#lancer-la-démo-inherited-widget-sans-update)
    - [Lancer la démo Inherited widget avec update](#lancer-la-démo-inherited-widget-avec-update)
  - [Démo gestion des états avec provider](#démo-gestion-des-états-avec-provider)
  - [Référence](#référence)


Une démo sur la gestion des états dans une application Flutter. Un compteur est maintenu entre plusieurs Routes de l'application. Pour cela, on démontre plusieurs stratégies possibles, des plus bas niveau (setState) au plus haut niveau (provider etc)

3 démos :

- Gestion des états sur une navigation avec `setState` et `Navigator pop/push`
- Gestion des états sur une navigation avec `setState` et `Navigator` + une closure
- Gestion des états avec le widget inherited. La page `Home` est *wrappée* dans un inherited widget.

## Démos gestion des états avec `setState`

~~~bash
#Lancer la démo avec la méthode closure
flutter run -t lib/set-state/closure/main.dart
#Lancer la démo avec la méthode push/pop
flutter run -t lib/set-state/push_pop/main.dart
~~~

## Démo gestion des états avec Inherited widget

### Lancer la démo Inherited widget *sans update*

~~~bash
flutter run -t lib/inherited-no-update/main.dart
~~~

Essayer d'implémenter setState depuis la page A. Pourquoi ce n'est pas possible en l'état ?

### Lancer la démo Inherited widget avec update

> Nécessite davantage de *boiler plate* code

~~~bash
flutter run -t lib/inherited-with-update/main.dart
~~~

## Démo gestion des états avec provider

> Wrapper autour des Inherited widget. Le code respire

Installer le paquet provider

~~~bash
#Ajouter la dépendance provider au projet (pubspec.yaml)
flutter pub add provider
#Télécharger et install les dépendances
flutter pub get
#Liste les dépendances du projet
flutter pub deps
~~~

Lancer la démo

~~~bash

flutter run -t lib/provider/main.dart
~~~

## Référence

- [Managing State Flutter Pragmatically](https://www.packtpub.com/product/managing-state-in-flutter-pragmatically/9781801070775), de Waleed Arshad, publié chez Packt, 2021. Chapitre 2
- [Managing State in Flutter Pragmatically - Repository](https://github.com/PacktPublishing/Managing-State-in-Flutter-Pragmatically), le code source des exemples du livre éponyme