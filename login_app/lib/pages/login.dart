import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import './dashboard.dart';
import 'package:hive/hive.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:http/http.dart' as http;

class Login extends StatefulWidget {
  @override
  State<Login> createState() => _LoginState();
}

class _LoginState extends State<Login> {
  TextEditingController email = TextEditingController();
  TextEditingController password = TextEditingController();
  var token;
  String msg = "";
  late Box box1;

  @override
  void initState() {
    super.initState();
    createBox();
  }

  void login() async {
    if (email.text.isEmpty || password.text.isEmpty) {
      const snackBar = SnackBar(
        content: Text(
          'Kindly fill both the fields',
          style: TextStyle(fontSize: 16.5),
        ),
      );

      ScaffoldMessenger.of(context).showSnackBar(snackBar);
    } else {
      try {
        var response = await http.post(
            Uri.parse(dotenv.env['API_URL']! + "/api/login"),
            headers: <String, String>{
              'Content-Type': 'application/json',
            },
            body: jsonEncode(
                {"Login_ID": email.text, "Password": password.text}));

        if (response.statusCode == 200 &&
            jsonDecode(response.body)["status"] == false) {
          msg = jsonDecode(response.body)["message"];
          var snackBar = SnackBar(
            content: Text(
              msg,
              style: TextStyle(fontSize: 16.5),
            ),
            backgroundColor: Colors.red,
          );

          ScaffoldMessenger.of(context).showSnackBar(snackBar);
        } else {
          var data = jsonDecode(response.body);
          box1.put('email', data["data"]["Login_ID"]);
          box1.put('Name',
              data["data"]["FirstName"] + " " + data["data"]["LastName"]);
          box1.put('token', data["token"]);
          print(box1.get("email"));
          Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => Dashboard()),
          );
        }
      } catch (e) {
        print(e);
        msg = dotenv.env['API_URL'] ?? "Url null catch";
        var snackBar = SnackBar(
          content: Text(msg),
        );

        ScaffoldMessenger.of(context).showSnackBar(snackBar);
      }
    }
  }

  void createBox() async {
    box1 = await Hive.openBox('loginData');
    getData();
  }

  void getData() async {
    if (box1.get('email') != null) {
      email.text = box1.get('email');
    }
    if (box1.get('token') != null) {
      token = box1.get('token');
      Navigator.push(
        context,
        MaterialPageRoute(builder: (context) => Dashboard()),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        automaticallyImplyLeading: false,
        title: const Text('Attendance App'),
        backgroundColor: Colors.purple,
      ),
      body: Container(
        padding: const EdgeInsets.all(10),
        child: SingleChildScrollView(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Image.asset(
                'assets/images/ZaaviaLogo.png',
                width: 120,
                height: 100,
              ),
              SizedBox(
                height: 110,
              ),
              TextField(
                keyboardType: TextInputType.emailAddress,
                decoration: const InputDecoration(
                    hintText: 'Email',
                    prefixIcon: Icon(Icons.email),
                    border: OutlineInputBorder(
                        borderSide: BorderSide(width: 2),
                        borderRadius: BorderRadius.all(Radius.circular(27.0)))),
                controller: email,
              ),
              const SizedBox(
                height: 10,
              ),
              TextField(
                decoration: const InputDecoration(
                    hintText: 'Password',
                    prefixIcon: Icon(Icons.lock),
                    border: OutlineInputBorder(
                        borderSide: BorderSide(width: 2),
                        borderRadius: BorderRadius.all(Radius.circular(27.0)))),
                controller: password,
                obscureText: true,
              ),
              const SizedBox(
                height: 8,
              ),
              ButtonTheme(
                minWidth: 400,
                height: 50,
                child: RaisedButton(
                  elevation: 5,
                  onPressed: () {
                    login();
                  },
                  child: const Text(
                    'Log in',
                    style: TextStyle(fontSize: 17),
                  ),
                  color: Colors.purple,
                  textColor: Colors.white,
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(24.0)),
                ),
              ),
              const SizedBox(
                height: 120,
              ),
              Text('Copyrights by Zaavia! © 2022'),
            ],
          ),
        ),
      ),
    );
  }
}
