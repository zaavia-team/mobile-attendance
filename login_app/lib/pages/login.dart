import 'dart:convert';
import 'package:flutter/material.dart';
import './dashboard.dart';
import 'package:hive/hive.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:http/http.dart' as http;
import 'package:fluttertoast/fluttertoast.dart';

class Login extends StatefulWidget {
  @override
  State<Login> createState() => _LoginState();
}

class _LoginState extends State<Login> {
  TextEditingController email = TextEditingController();
  TextEditingController password = TextEditingController();
  var token;

  late Box box1;

  @override
  void initState(){
    super.initState();
    createBox();
  }

  void login() async {

    if (email.text.isEmpty || password.text.isEmpty) {
        Fluttertoast.showToast(
      msg: "Kindly fill both the fields",
      toastLength: Toast.LENGTH_SHORT,
      gravity: ToastGravity.BOTTOM,
      timeInSecForIosWeb: 2,
      backgroundColor: Colors.purple,
      fontSize: 15
    );
    } 
    else{
    try {
    var response = await http.post(Uri.parse("http://192.168.18.51:3000/api/login"),
    headers: <String, String>{
    'Content-Type':
        'application/json',
  },
    body: jsonEncode({
      "Login_ID": email.text,
      "Password": password.text }
    ));

    if(response.statusCode == 200 && jsonDecode(response.body)["status"] == false){
    Fluttertoast.showToast(
      msg: "User ID or Password does not match",
      toastLength: Toast.LENGTH_SHORT,
      gravity: ToastGravity.BOTTOM,
      timeInSecForIosWeb: 2,
      backgroundColor: Colors.purple,
      fontSize: 15
    );
    } else{
      var data = jsonDecode(response.body);
      box1.put('email', email.value.text);
      box1.put('password', password.value.text);
      box1.put('token', data["token"]);
      Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => Dashboard()),
      );
    }

    print(response.body);
    } catch (e) {
      print(e);
    }

  }

  }

  void createBox() async {
    box1 = await Hive.openBox('loginData');
    getData();
  }

  void getData() async {
    if(box1.get('email')!=null){
      email.text = box1.get('email');
    }
    if(box1.get('password')!=null){
      password.text = box1.get('password');
    }
    if(box1.get('token')!=null){
      token = box1.get('token');
    }

  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Attendance App'),
        backgroundColor: Colors.purple,
      ),
      body: Card(
        child: Container(
          padding: const EdgeInsets.all(10),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              TextField(
                keyboardType: TextInputType.emailAddress,
                decoration: const InputDecoration(
                    hintText: 'Email',
                    prefixIcon: Icon(Icons.email),
                    border: OutlineInputBorder(
                      borderSide: BorderSide(width: 2),
                      borderRadius: BorderRadius.all(
                        Radius.circular(20.0)
                      )
                    )
                  ),
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
                      borderRadius: BorderRadius.all(
                        Radius.circular(20.0)
                      )
                    )
                ),
                controller: password,
                obscureText: true,
              ),
              const SizedBox(
                height: 8,
              ),
              Container(
                child: RaisedButton(
                  elevation: 5,
                  onPressed: () {
                    login();
                  },
                  child: const Text('Log in',
                    style: TextStyle(
                      fontSize: 15
                    ),
                  ),
                  color: Colors.purple,
                  textColor: Colors.white,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20.0)),
                ),
              )
            ],
          ),
        ),
      ),
    );
  }
}
