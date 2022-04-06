import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:intl/intl.dart';
import 'package:hive/hive.dart';
import 'package:http/http.dart' as http;

class Dashboard extends StatefulWidget {
  @override
  State<Dashboard> createState() => _DashboardState();
}

class _DashboardState extends State<Dashboard> {
  final iAmInController = TextEditingController();
  final iAmOutController = TextEditingController();
  var transactionType = 'i am In';

  var token;

  late Box box1;

  @override
  void initState() {
    super.initState();
    createBox();
  }

  DateTime? _dateTime;
  bool button = false;

  String getDate() {
    if (_dateTime == null) {
      return 'Select Date';
    } else {
      return DateFormat('dd/MM/yyyy HH:mm').format(_dateTime!);
    }
  }

  void createBox() async {
    box1 = await Hive.openBox('loginData');
    getData();
  }

  void getData() async {
    if (box1.get('token') != null) {
      token = box1.get('token');
    }
  }

  void attendanceDetails(BuildContext context) async {
    var response = await http.post(
        Uri.parse("http://192.168.18.51:3000/api/attendance_transaction"),
        headers: <String, String>{
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: jsonEncode({
          'TransactionType': transactionType,
          'Date':
              _dateTime?.toIso8601String() ?? DateTime.now().toIso8601String()
        }));

    if (transactionType == 'i am Out') {
      showDialog(
          context: context,
          builder: (context) => AlertDialog(
                title: const Text("Are you sure your want to sign out",
                    textAlign: TextAlign.center),
                actions: [
                  Container(
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceAround,
                      children: [
                        RaisedButton(
                          onPressed: () {
                            setState(() {
                              transactionType = 'i am In';
                            });
                            Fluttertoast.showToast(
                              msg: jsonDecode(response.body)["message"],
                              toastLength: Toast.LENGTH_SHORT,
                              gravity: ToastGravity.BOTTOM,
                              timeInSecForIosWeb: 2,
                              backgroundColor: Colors.purple,
                              fontSize: 15
                            );
                            Navigator.pop(context);
                          },
                          child: Text('Yes'),
                          color: Theme.of(context).primaryColor,
                          textColor: Colors.white,
                        ),
                        RaisedButton(
                          onPressed: () {
                            Navigator.pop(context);
                          },
                          child: Text('No'),
                          color: Theme.of(context).primaryColor,
                          textColor: Colors.white,
                        )
                      ],
                    ),
                  )
                ],
              ));
    }
    if (response.statusCode == 200 &&
        jsonDecode(response.body)["status"] == false) {
      Fluttertoast.showToast(
          msg: jsonDecode(response.body)["message"],
          toastLength: Toast.LENGTH_SHORT,
          gravity: ToastGravity.BOTTOM,
          timeInSecForIosWeb: 2,
          backgroundColor: Colors.purple,
          fontSize: 15);
    } 
    else {
      setState(() {
        transactionType = "i am Out";
            // transactionType == 'i am Out' ? "i am In" : 'i am Out';
      });
      
    }
    print(response.body);
  }

  Future pickDateTime(BuildContext context) async {
    final date = await pickDate(context);
    if (date == null) return;

    final time = await pickTime(context);
    if (time == null) return;

    setState(() {
      _dateTime = DateTime(
        date.year,
        date.month,
        date.day,
        time.hour,
        time.minute,
      );
    });
  }

  Future<DateTime> pickDate(BuildContext context) async {
    final initialDate = DateTime.now();
    final newDate = await showDatePicker(
      context: context,
      initialDate: _dateTime ?? initialDate,
      firstDate: DateTime(DateTime.now().year - 5),
      lastDate: DateTime(DateTime.now().year + 5),
    );

    return newDate!;
  }

  Future<TimeOfDay> pickTime(BuildContext context) async {
    final initialTime = TimeOfDay.now();
    final newTime = await showTimePicker(
      context: context,
      initialTime: _dateTime != null
          ? TimeOfDay(hour: _dateTime!.hour, minute: _dateTime!.minute)
          : initialTime,
    );

    return newTime!;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        automaticallyImplyLeading: false,
        title: const Text("Main Screen"),
      ),
      body: Card(
        elevation: 5,
        child: Center(
          child: Container(
            padding: EdgeInsets.all(10),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  _dateTime == null
                      ? '${DateTime.now().day}/${DateTime.now().month}/${DateTime.now().year}, ${DateTime.now().hour}:${DateTime.now().minute}'
                      : getDate(),
                  style: TextStyle(fontSize: 20),
                ),
                FlatButton(
                  onPressed: () {
                    pickDateTime(context);
                  },
                  child: Text('Pick a date', style: TextStyle(fontSize: 15)),
                ),
                SizedBox(
                  height: 10,
                ),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: [
                    RaisedButton(
                      child: Text(transactionType),
                      color: Theme.of(context).primaryColor,
                      textColor: Colors.white,
                      onPressed: () {
                        attendanceDetails(context);
                      },
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
