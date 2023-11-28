import 'package:flutter/material.dart';
import 'dart:math';

void main() {
  runApp(const MainApp());
}

Color randomColor() {
  final random = Random();
  return Color.fromRGBO(
    random.nextInt(256), // Red (0-255)
    random.nextInt(256), // Green (0-255)
    random.nextInt(256), // Blue (0-255)
    1.0, // Alpha (1.0 for fully opaque)
  );
}

class PositionedTiles extends StatefulWidget {
  @override
  State<StatefulWidget> createState() => PositionedTilesState();
}

///Tuile
class StateFulColorFul extends StatefulWidget {

  const StateFulColorFul({super.key});

  @override
  State<StateFulColorFul> createState() {
    return StateFulColorFulState();
  }
}

///Classe compagnon (état)
class StateFulColorFulState extends State<StateFulColorFul> {

///La couleur est maintenue par la classe état à présent
  late Color color;

  @override
  void initState() {
    super.initState();
    color = randomColor();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 200,
      height: 200,
      color: color,
    );
  }
}

class PositionedTilesState extends State<PositionedTiles> {
  late final List<Widget> tiles;

  @override
  void initState() {
    super.initState();
    tiles = [const StateFulColorFul(), const StateFulColorFul()];
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(child: Row(children: tiles)),
      floatingActionButton: FloatingActionButton(
          child: Icon(Icons.auto_fix_normal), onPressed: swapTiles),
    );
  }

  swapTiles() {
    setState(() {
      tiles.insert(1, tiles.removeAt(0)); 
    });
    print('Swap !');
  }
}

class MainApp extends StatelessWidget {
  const MainApp();

  @override
  Widget build(BuildContext context) {
    return MaterialApp(home: PositionedTiles());
  }
}
