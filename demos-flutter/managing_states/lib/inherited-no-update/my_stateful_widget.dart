import 'package:flutter/material.dart';

class ExampleStatefulPage extends StatefulWidget {
  const ExampleStatefulPage({super.key});
  @override
  _ExampleStatefulPageState createState() => _ExampleStatefulPageState();
}

class _ExampleStatefulPageState extends State<ExampleStatefulPage> {
  @override
  Widget build(BuildContext context) {
    print('Child Widget Builds');
    return Container();
  }
}
