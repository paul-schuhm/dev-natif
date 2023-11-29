import 'package:flutter/material.dart';
import 'inherited_counter.dart';
import 'page_two_inherited_widget.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MyCounterInheritedWidget(
        child: MaterialApp(
          title: 'Flutter Demo',
          theme: ThemeData(
            colorScheme: ColorScheme.fromSeed(seedColor: const Color.fromARGB(255, 184, 172, 203)),
            useMaterial3: true,
          ),
          home: const MyHomePage(title: 'Flutter Demo Home Page'),
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
              '${MyCounterInheritedWidget.of(context)?.counterValue.toString()}',
              ///Retourne l'instance MyInheritedWidget la plus proche et récupère la propriété counter dessus. On passe ici le contexte
              ///pour partir de cette instance de widget dans l'arbre et remonter
              ///jusqu'a l'inherited widget
              style: Theme.of(context).textTheme.headlineMedium,
            ),
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
