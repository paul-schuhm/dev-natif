# Démo use_of_key

Un mini projet qui montre l'usage de la propriété `Key` pour avoir une bonne réconciliation dans le cas de collections de widgets stateful.

> Most of the time you don't need keys, but if you find yourself manipulating collections of stateful widgets of the same type, "it's key time!" 

## Version stateless

~~~bash
#Démo avec widget stateless
flutter run lib/main_stateless.dart
#Démo avec widget stateful sans clef
flutter run lib/main_stateful_no_key.dart
#Démo avec widget stateful avec clef
flutter run lib/main_stateful.dart
~~~

## Références

- [When to Use Keys - Flutter Widgets 101 Ep. 4 ](https://www.youtube.com/watch?v=kn0EOS-ZiIc&t=2s), vidéo officielle de l'équipe de Flutter sur l'usage de Key
- [Keys In Flutter](https://medium.flutterdevs.com/keys-in-flutter-104fc01db48f), un article qui discute de la vidéo précédente