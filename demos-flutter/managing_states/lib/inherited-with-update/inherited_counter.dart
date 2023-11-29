import 'package:flutter/material.dart';

///Boiler plate code pour faire de la gestion d'état (access et update) via InheritedWidget
///3 classes : MyInheritedWidget (etend InheritedWidget),  MyCounterInheritedWidget (etend StatefulWidget) et MyCounterInheritedWidgetState (etend State, classe compagnon)

///Classe d'état qui maintient l'état.
class MyCounterInheritedWidget extends StatefulWidget {
  final Widget child;

  const MyCounterInheritedWidget({Key? key, required this.child})
      : super(key: key);

  ///Retourne la propriété data (valeur du compteur) porté par l'InheritedWidget
  ///le plus proche du widget appelant la méthode (son contexte est passé ici, ce n'est pas le contexte de MyCounterInheritedWidget)
  static MyCounterInheritedWidgetState of(BuildContext context) {
    final MyCounterInheritedWidgetState? result =
        context.dependOnInheritedWidgetOfExactType<MyInheritedWidget>()!.data;
    assert(result != null, 'No counter found in context');
    return result!;
  }

  @override
  State<StatefulWidget> createState() {
    return MyCounterInheritedWidgetState();
  }
}

///Classe compagnon d'état : contient les états à partager (compteur)
class MyCounterInheritedWidgetState extends State<MyCounterInheritedWidget> {
  int _counterValue = 0;

  int get counterValue => _counterValue;

  void incrementCounter() {
    setState(() {
      _counterValue++;
    });
  }

  ///On build le InheritedWidget, c'est lui qui est monté sur l'arbre.
  ///On lui passe le subtree en enfant.
  @override
  Widget build(BuildContext context) {
    return MyInheritedWidget(
      data: this,
      ///On passe le child (subtree de Inherited Widget)
      child: widget.child,
    );
  }
}

class MyInheritedWidget extends InheritedWidget {
  ///Une référence vers le Widget qui contient l'état à partager/mettre à jour
  final MyCounterInheritedWidgetState data;
  const MyInheritedWidget({
    Key? key,
    required this.data,
    required Widget child,
  }) : super(key: key, child: child);

  //Changement si child est mis à jour
  @override
  bool updateShouldNotify(InheritedWidget oldWidget) => child != oldWidget;
}
