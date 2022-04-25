import 'package:flutter/material.dart';
import 'package:hive/hive.dart';
import 'dart:convert';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:http/http.dart' as http;
import 'package:login_app/pages/login.dart';
class ChangePassword extends StatefulWidget {
  const ChangePassword({Key? key}) : super(key: key);

  @override
  State<ChangePassword> createState() => _ChangePasswordState();
}

class _ChangePasswordState extends State<ChangePassword> {
  TextEditingController password = TextEditingController();
  TextEditingController newPassword = TextEditingController();
  TextEditingController configrNewPassword = TextEditingController();
  double _strength = 0;
  late String _password;
  String _displayText = 'Please enter a password';
  String msg = "";

  RegExp numReg = RegExp(r".*[0-9].*");
  RegExp letterReg = RegExp(r".*[A-Za-z].*");
  RegExp specialReg = RegExp(r'[!@#$%^&*(),.?":{}|<>]');

  bool _isHiddenOld = true;
  bool _isHiddenNew = true;
  bool _isHiddenConfirm = true;

  var token;
  late Box box1;
  var _id;

  @override
  void initState() {
    super.initState();
    createBox();
  }
  void createBox() async {
    box1 = await Hive.openBox('loginData');
    getData();
  }
  void getData() async {
    if (box1.get('token') != null) {
      token = box1.get('token');
      _id = box1.get('_id');
    }
  }
  void getChangePassword() async {
    print(password.text);
    try {
      var response = await http.post(
        Uri.parse(dotenv.env['API_URL']! + "/api/ChangePassword"),
        headers: <String, String>{
          'Content-Type': 'application/json',
          'Authorization': token
        },
          body: jsonEncode({
            '_id': _id,
            'oldPassword': password.text,
            'newPassword': newPassword.text,
          }),
      );
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
        msg = jsonDecode(response.body)["message"];
        var snackBar = SnackBar(
          content: Text(
            msg,
            style: TextStyle(fontSize: 16.5),
          ),
          backgroundColor: Colors.green,
        );
        box1.delete('token');
        box1.delete('email');
        box1.delete('Name');
        box1.delete('_id');
        Navigator.of(context).pushAndRemoveUntil(
          MaterialPageRoute(builder: (context) => Login()),
              (Route<dynamic> route) => false,
        );
        ScaffoldMessenger.of(context).showSnackBar(snackBar);
      }

    } catch (e) {
      print(e);
    }
  }


  void _toggleOldPasswordView() {
    setState(() {
      _isHiddenOld = !_isHiddenOld;
    });
  }void _toggleNewPasswordView() {
    setState(() {
      _isHiddenNew = !_isHiddenNew;
    });
  }void _toggleConfirmPasswordView() {
    setState(() {
      _isHiddenConfirm = !_isHiddenConfirm;
    });
  }

  void _checkPassword(String value) {
    _password = value.trim();

    if (_password.isEmpty) {
      setState(() {
        _strength = 0;
        _displayText = 'Please enter you password';
      });
    } else if (_password.length < 8) {
      setState(() {
        _strength = 1 / 4;
        _displayText = 'Your password is too short';
      });
    } else if (!letterReg.hasMatch(_password) || !numReg.hasMatch(_password)) {
      setState(() {
        _strength = 2 / 4;
        _displayText = 'Your password is weak';
      });
    } else {
      if (!specialReg.hasMatch(_password)) {
        setState(() {
          // Password length >= 8
          // But doesn't contain both letter and digit characters
          _strength = 3 / 4;
          _displayText = 'Your password is medium';
        });
      } else {
        // Password length >= 8
        // Password contains both letter and digit characters
        setState(() {
          _strength = 1;
          _displayText = 'Your password is strong';
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Change Password'),
        backgroundColor: Theme.of(context).primaryColor,
      ),
      body: Container(
        padding: const EdgeInsets.all(10),
        child: SingleChildScrollView(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const SizedBox(
                height: 10,
              ),
              TextField(
                obscureText: _isHiddenOld,
                decoration: InputDecoration(
                    hintText: 'Old Password',
                    prefixIcon: Icon(Icons.lock),
                    suffix: InkWell(
                      onTap: _toggleOldPasswordView,
                      child: Icon(
                        _isHiddenOld
                            ? Icons.visibility
                            : Icons.visibility_off,
                      ),
                    ),
                    border: const OutlineInputBorder(
                        borderSide: BorderSide(width: 2),
                        borderRadius: BorderRadius.all(Radius.circular(27.0)))),
                controller: password,

              ),
              const SizedBox(
                height: 10,
              ),
              TextField(
                obscureText: _isHiddenNew,
                onChanged: (value) => _checkPassword(value),
                decoration: InputDecoration(
                    hintText: 'New Password',
                    prefixIcon: Icon(Icons.lock),
                    suffix: InkWell(
                      onTap: _toggleNewPasswordView,
                      child: Icon(
                        _isHiddenNew
                            ? Icons.visibility
                            : Icons.visibility_off,
                      ),
                    ),
                    border: const OutlineInputBorder(
                        borderSide: BorderSide(width: 2),
                        borderRadius: BorderRadius.all(Radius.circular(27.0)))),
                controller: newPassword,

              ),
              const SizedBox(
                height: 10,
              ),
              LinearProgressIndicator(
                value: _strength,
                backgroundColor: Colors.grey[300],
                color: _strength <= 1 / 4
                    ? Colors.red
                    : _strength == 2 / 4
                    ? Colors.yellow
                    : _strength == 3 / 4
                    ? Colors.blue
                    : Colors.green,
                minHeight: 15,
              ),
              const SizedBox(
                height: 20,
              ),
              Text(
                _displayText,
                style: const TextStyle(fontSize: 18),
              ),
              const SizedBox(
                height: 10,
              ),
              TextField(
                obscureText: _isHiddenConfirm,
                decoration: InputDecoration(
                    hintText: 'Confirm New Password',
                    prefixIcon: Icon(Icons.lock),
                    suffix: InkWell(
                      onTap: _toggleConfirmPasswordView,
                      child: Icon(
                        _isHiddenConfirm
                            ? Icons.visibility
                            : Icons.visibility_off,
                      ),
                    ),
                    border: const OutlineInputBorder(
                        borderSide: BorderSide(width: 2),
                        borderRadius: BorderRadius.all(Radius.circular(27.0)))),
                controller: configrNewPassword,

              ),
              const SizedBox(
                height: 10,
              ),
              const Text('Password must contain atleast 8 characters, alpha numeric and 1 special character'),
              const SizedBox(
                height: 10,
              ),
              ButtonTheme(
                minWidth: 400,
                height: 50,
                child: RaisedButton(
                  elevation: 5,
                  onPressed: () {
                    if (_strength < 1){
                      msg = "Password is not Strong";
                      var snackBar = SnackBar(
                        content: Text(
                            msg,
                            style: TextStyle(fontSize: 16.5)
                        ),
                        backgroundColor: Colors.red,
                      );
                      ScaffoldMessenger.of(context).showSnackBar(snackBar);
                    } else{
                      if(newPassword.text != configrNewPassword.text){
                        msg = "Password Does not Match";
                        var snackBar = SnackBar(
                          content: Text(
                              msg,
                              style: TextStyle(fontSize: 16.5)
                          ),
                          action: SnackBarAction(
                            label: 'Dismiss',
                            onPressed: (){},
                          ),
                          backgroundColor: Colors.red,
                        );
                        ScaffoldMessenger.of(context).showSnackBar(snackBar);
                      }
                      else{
                        getChangePassword();
                      }
                    }
                  },
                  child: const Text(
                    'Change Password',
                    style: TextStyle(fontSize: 17),
                  ),
                  color: Theme.of(context).primaryColor,
                  textColor: Colors.white,
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(24.0)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
