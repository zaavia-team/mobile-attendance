import 'package:flutter/material.dart';
import 'package:hive/hive.dart';
import 'package:hive_flutter/hive_flutter.dart';
import './dashboard.dart';
import './login.dart';

class SplashScreen extends StatefulWidget {
  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  late Box box1;

  void createBox() async {
    box1 = await Hive.openBox('loginData');
    box1 = Hive.box('loginData');
    getData();
  }

    void getData() async {
    if (box1.get('token') != null) {
      Navigator.push(
        context,
        MaterialPageRoute(builder: (context) => Dashboard()),
      );
    }
    else {
      Navigator.push(
        context,
        MaterialPageRoute(builder: (context) => Login()),
      );
    }
  }

  @override
  void initState() {
    createBox();
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        body: Container(
            padding: EdgeInsets.all(10),
            child: Row(children: [
              Expanded(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Image.asset(
                      'assets/images/ZaaviaLogo.png',
                      width: 120,
                      height: 100,
                    ),
                    SizedBox(
                      height: 15,
                    ),
                    CircularProgressIndicator(
                      color: Theme.of(context).primaryColor,
                    ),
                  ],
                ),
              ),
            ])));
  }
}
