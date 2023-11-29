import 'package:flutter/material.dart';

void main() {
  runApp(const MainApp());
}

class MainApp extends StatelessWidget {
  const MainApp({super.key});

  @override
  Widget build(BuildContext context) {
    return const MaterialApp(
      home: Home(),
      debugShowCheckedModeBanner: false,
    );
  }
}

///Page/Ecran/Route Home
class Home extends StatelessWidget {
  const Home({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Home'),
      ),
      body: Center(
        child: Column(
          children: [
            Text('Home sweet home'),
            ElevatedButton(
                onPressed: () {
                  Navigator.of(context).push(
                      MaterialPageRoute(builder: (context) => const RouteA()));
                },
                child: const Text('Go to Route A'))
          ],
        ),
      ),
    );
  }
}

///Page/Ecran/Route A
class RouteA extends StatelessWidget {
  const RouteA({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Route A'),
      ),
      body: Center(
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.all(8.0),
              child: const Text('Page A!'),
            ),
            Padding(
              padding: const EdgeInsets.all(8.0),
              child: ElevatedButton(
                  onPressed: () {
                    Navigator.of(context).push(
                        MaterialPageRoute(builder: (context) => const RouteB()));
                  },
                  child: const Text('Go to Route B')),
            ),
            Padding(
              padding: const EdgeInsets.all(8.0),
              child: ElevatedButton(
                  onPressed: () {
                    ///Revenir en arrière d'un écran (retire l' écran actuel du haut de la pile)
                    Navigator.of(context).pop();
                  },
                  child: const Text('Go back to Home')),
            )
          ],
        ),
      ),
    );
  }
}

///Page/Ecran/Route B
class RouteB extends StatelessWidget {
  const RouteB({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Route B'),
      ),
      body: Center(
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.all(8.0),
              child: const Text('Page B !'),
            ),
            Padding(
              padding: const EdgeInsets.all(8.0),
              child: ElevatedButton(
                  onPressed: () {
                    ///Revenir en arrière d'un écran (retire l' écran actuel du haut de la pile)
                    Navigator.of(context).pop();
                  },
                  child: const Text('Go back to route A')),
            )
          ],
        ),
      ),
    );
  }
}
