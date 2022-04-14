import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
// import 'package:login_app/pages/login.dart';
import 'package:hive_flutter/hive_flutter.dart';
import './pages/splashScreen.dart';

Future <void> main() async {
  await dotenv.load();
  await Hive.initFlutter();
  
  runApp(MyApp());
}

class MyApp extends StatelessWidget {

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      theme: ThemeData(primarySwatch: Colors.purple),
      debugShowCheckedModeBanner: false,
      home: SplashScreen(),
    );
  }
}
