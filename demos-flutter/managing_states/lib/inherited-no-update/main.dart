import 'package:flutter/material.dart';
import './my_stateful_widget.dart';
import './page_two_inherited_widget.dart';

void main() {
  runApp(const MyApp());
}

///InheritedWidget
class MyInheritedWidget extends InheritedWidget {
  ///l’état a mettre à disposition à tous ces enfants.
  final int counter;

  ///Child: enfant (subtree) auquel on met à disposition les états. A passer à InheritedWidget
  const MyInheritedWidget(
      {super.key, required super.child, required this.counter});

  ///Joue le role de setState : si l'état est modifié, rebuild le subtree
  @override
  bool updateShouldNotify(covariant MyInheritedWidget oldWidget) {
    return counter != oldWidget.counter;
  }

  static MyInheritedWidget? of(BuildContext context) {
    ///dependOnInheritedWidgetOfExactType : Retourne l'objet de type paramétré MyInheritedWidget sur le contexte. Cela va retourner l'instance de MyInheritedWidget le plus proche de contexte (~ l’élément associé au widget appelant). Remarque : Il pourrait y avoir un autre InheritedWidget ailleurs sur l'arbre.
    final MyInheritedWidget? result =
        context.dependOnInheritedWidgetOfExactType<MyInheritedWidget>();
    assert(result != null, 'No counter found in context');
    return result;
  }
}


class MyApp extends StatelessWidget {
  const MyApp({super.key});

  ///On wrap directement MaterialApp dans l'InheritedWidget
  ///car sinon lorsque l'on navigue vers Page2,
  ///Page2 n'est pas un descendant de HomePage et n'a donc pas accès
  ///a MyInheritedWidget et à l'état du compter. C'est un descendant
  ///de Navigator.
  @override
  Widget build(BuildContext context) {
    return MyInheritedWidget(
        counter: 42,
        child: MaterialApp(
          title: 'Flutter Demo',
          theme: ThemeData(
            colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
            useMaterial3: true,
          ),
          home: const MyHomePage(title: 'Flutter Demo Home Page'),

          ///Home "wrapé" dans MyInheritedWidget pour mettre à disposition l'état
          ///dans tout le subtree
          // home: const MyInheritedWidget(
          //   counter: 1,
          //   child: MyHomePage(title: 'Flutter Demo Inherited Widget'),
          // ));
        ));
  }
}


class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key, required this.title});
  final String title;
  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  void _navigate() {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => PageTwo(),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        title: Text(widget.title),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            const Text(
              'You have pushed the button this many times:',
            ),
            Text(
              '${MyInheritedWidget.of(context)?.counter}',

              ///Retourne l'instance MyInheritedWidget la plus proche et récupère la propriété counter dessus.
              style: Theme.of(context).textTheme.headlineMedium,
            ),
            const ExampleStatefulPage()
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _navigate,
        tooltip: 'Navigate to page 2 to increment the counter',
        child: const Icon(Icons.add),
      ), // This trailing comma makes auto-formatting nicer for build methods.
    );
  }
}
