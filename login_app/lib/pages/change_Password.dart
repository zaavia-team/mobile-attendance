import 'package:flutter/material.dart';
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
        backgroundColor: Colors.purple,
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
                        msg = "Password changed Successfully";
                        var snackBar = SnackBar(
                          content: Text(
                              msg,
                              style: TextStyle(fontSize: 16.5)
                          ),
                          backgroundColor: Colors.green,
                        );
                        ScaffoldMessenger.of(context).showSnackBar(snackBar);
                      }
                    }

                  },
                  child: const Text(
                    'Change Password',
                    style: TextStyle(fontSize: 17),
                  ),
                  color: Colors.purple,
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
