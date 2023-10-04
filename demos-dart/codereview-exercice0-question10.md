# Code review 

Code review de la question 10 de l'exercice 0

## Implémentation 1

~~~dart
//Ok
List<int> numbers = List.generate(10, (_) => Random().nextInt(50) + 1);
List<int> copy = numbers.toList();
///Cette assertion ne va pas passer. Pourquoi ?
assert(numbers == copy);
double moyenne = numbers.reduce((a, b) => a + b) / numbers.length;
///Le calcul de la médiane n'est pas correct, il faut trier les éléments d'abord.
///J'ai peur que la valeur médiane ne soit pas bon dans le cas d'un nombre impair d'éléments
int median =
    ((numbers[numbers.length ~/ 2] + numbers[numbers.length ~/ 2 - 1]) / 2)
        .round();
print("Moyenne : $moyenne");
print("Médiane : $median");
~~~

## Implémentation 2


~~~dart
import 'dart:math';

///Ok
int getMedian(List<int> list) {
  list.sort();
  int length = list.length;
  // If the length of the list is odd, the median is the middle value.
  if (length % 2 == 1) {
    return list[length ~/ 2];
  }
  // If the length of the list is even, the median is the average of the two middle values.
  else {
    int index1 = length ~/ 2 - 1;
    int index2 = length ~/ 2;
    return ((list[index1] + list[index2]) ~/ 2.0);
  }
}

void main() {
  List<int> list = [];

  for (var i = 0; i < 10; i++) {
    list.add(Random().nextInt(50));
  }
  //Est-ce vraiment une copie ?
  var list_copy = list;
  //Est-ce que l'on test bien que les deux listes contiennent les mêmes valeurs ?
  assert(list == list_copy); // Nothing happens if true
  print(list);
  var average = list.reduce((value, element) => value + element) / list.length;
  print(average);
  var median = getMedian(list);
  print(median);
}
~~~

## Implémentation 3

~~~dart
// Créer une liste de nombres contenant 10 nombres aléatoires, entre 1 et 50.
  var randomLib = Random();
  List<int> listNumbers = new List.generate(10, (_) => randomLib.nextInt(50));
  //Ok
  List<int> copyListNumbers = [...listNumbers];
  print(listNumbers);
  /// Un joli hack !!! Mais est ce que les liste ['1',2, 3] et [1, 2, 3] sont identiques ?
  //Faire une copie de la liste. A l'aide d'un assert, vérifier que les deux listes sont identiques (même valeur).
  assert(listNumbers.toString() == copyListNumbers.toString());
  //Calculer la moyenne et la médiane de la série. Conseil: utiliser la classe Rand du paquet dart:math.
  double moyenne = calculerLaMoyenne(listNumbers);
  print('La moyenne est : ${moyenne}');
  //Vos calculs doivent fonctionner même lorsque la série ne contient qu'une valeur.
  int mediane = calculerLaMediane(listNumbers);
  print('Médiane: ${mediane}');


double calculerLaMoyenne(List<int> liste) {
  if (liste.isNotEmpty) {
    double somme = 0;
    for (var number in liste) {
      somme += number;
    }
    return somme / liste.length;
  }
  return 0.0;
}

///OK
int calculerLaMediane(List<int> liste) {
  if (liste.isEmpty) {
    return 0;
  }
  // Trie de la liste
  liste.sort();
  // print(liste);
  //Trouve le milieu ~/ (division entière)
  int milieu = liste.length ~/ 2;
  // print(milieu);

  if (liste.length % 2 == 0) {
    // Si le nombre de valeurs est un nombre pair, la médiane correspondra à la moyenne des valeurs de rang n ÷ 2 et (n ÷ 2) +1.
    return (liste[milieu] + liste[milieu - 1]) ~/ 2;
  } else {
    // Il y a n = 7 valeurs, un nombre impair. La médiane correspondra donc à la valeur de rang (n+1) ÷ 2 = (7 +1) ÷ 2 = 4
    return (liste[milieu]);
  }
}
~~~

## Implémentation 4

~~~dart
import 'dart:math';

void main() {
  List<int> list = [];
  int sum = 0;
  int average = 0;
  int median = 0;

  for (int i = 0; i < 10; i++) {
    list.add(Random().nextInt(50));
  }

  ///Est-ce vraiment une copie ? Si je modifie list2, est ce que je modifie list ?
  List<int> list2 = list;

  assert(list == list2);

  for (int i = 0; i < list.length; i++) {
    sum += list[i];
  }

  average = sum ~/ list.length;

  list.sort();

  if (list.length % 2 == 0) {
    median = (list[list.length ~/ 2] + list[list.length ~/ 2 - 1]) ~/ 2;
  } else {
    median = list[list.length ~/ 2];
  }

  print("Liste 1 : $list");
  print("Liste 2 : $list2");
  print("Moyenne : $average");
  print("Mediane : $median");
}
~~~

## Comparer deux listes

['foo', 'bar', 42] est une valeur, comme une autre.

Pour que deux listes soient égales *en valeur*, il faut :

- même nombre d'éléments
- pour chaque index, chaque élément a la même valeur et même type

Soit le faire manuellement

~~~dart
bool areEquals<T>(List<T> list1, List<T> list2) {
  if (list1.length != list2.length) return false;

  for (var i = 0; i < list1.length; i++) {
    //Compare le type et la valeur
    if (list1[i] != list2[i]) return false;
  }
  return true;
}
~~~

Ou bien avec une librairie `ListEquality`, fournie par [le paquet collection](https://pub.dev/packages/collection)

~~~dart
import 'package:collection/collection.dart';
assert(ListEquality().equals(list1, list2));
~~~