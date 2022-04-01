import 'package:flutter/material.dart';
import './dashboard.dart';
import 'package:hive/hive.dart';
import 'package:hive_flutter/hive_flutter.dart';

class Login extends StatefulWidget {
  @override
  State<Login> createState() => _LoginState();
}

class _LoginState extends State<Login> {
  TextEditingController email = TextEditingController();
  TextEditingController password = TextEditingController();

  late Box box1;

  @override
  void initState(){
    super.initState();
    createBox();
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
  }

  void login() {
    box1.put('email', email.value.text);
    box1.put('password', password.value.text);

    const snackBar = SnackBar(
      content: Text('Kindly fill both the fields'),
    );

    if (email.text.isEmpty || password.text.isEmpty) {
        ScaffoldMessenger.of(context).showSnackBar(snackBar);
        
    } else{
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
        title: Text('Zaavia'),
        backgroundColor: Colors.purple,
      ),
      body: Card(
        child: Container(
          padding: EdgeInsets.all(10),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              TextField(
                keyboardType: TextInputType.emailAddress,
                decoration: InputDecoration(
                    hintText: 'Email',
                    prefixIcon: Icon(Icons.email),
                    border: OutlineInputBorder()),
                controller: email,
              ),
              SizedBox(
                height: 10,
              ),
              TextField(
                decoration: InputDecoration(
                  hintText: 'Password',
                  prefixIcon: Icon(Icons.lock),
                  border: OutlineInputBorder(),
                ),
                controller: password,
                obscureText: true,
              ),
              SizedBox(
                height: 5,
              ),
              RaisedButton(
                onPressed: () {
                  login();
                },
                child: Text('Log in'),
                color: Colors.purple,
                textColor: Colors.white,
              )
            ],
          ),
        ),
      ),
    );
  }
}
