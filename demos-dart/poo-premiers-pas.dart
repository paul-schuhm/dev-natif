import 'dart:math';

///Quelques notions sur l'héritage en Dart

class Point {
  //Getter implicites
  //Setter implicites quand c'est possible (si non final)
  double x = 0;
  double y = 0;

  //Un getter personnalisé
  double get distance {
    return sqrt(x * x + y * y);
  }

  //Un setter personnalisé
  set translateHorizontal(double x){
    this.x += x;
  }

  //Argument non nommé et sans paramètres : constructeur "implicite"
  // Point(){
  // }

  //Constructeur par défaut (sans nom) : 1 seul par classe
  //Liste d'initialisation (exécutée *avant* le corps)
  Point(double x, double y): x=x, y=y {
    print('Constructeur parent');
  }

  //Ajouter un constructeur nommé qui s'appelle 'origin'
  ///Construit un point à l'origine
  Point.origin() {
    x = 0;
    y = 0;
  }

  //Retourne la distance à un autre point [p]
  double distantTo(Point p) {
    double dx = x - p.x;
    double dy = y - p.y;
    return sqrt(dx * dx + dy * dy);
  }

  @override
  String toString() {
    return '($x, $y)';
  }
}

class Point3d extends Point {

  //Appel du constructeur manuel (car ce n'est plus le constructeur par défaut)
  Point3d(double x, double y) : super(x, y) {
    //Appel du constructeur parent ici
    print("Appel constructeur class enfant");
    //Accéder aux membres (variables de classe et méthodes parentes)
    print(super.x);
    print(super.y);
  }
}

void main() {
  final point = Point.origin();
  final point3d = Point3d(0, 0);
  print(point3d.distance);
  point3d.translateHorizontal= 5;
  print(point3d.distance);
}
