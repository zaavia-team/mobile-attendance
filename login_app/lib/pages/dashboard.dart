import 'dart:convert';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter/material.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:intl/intl.dart';
import 'package:hive/hive.dart';
import 'package:http/http.dart' as http;
import 'package:login_app/pages/login.dart';

class Dashboard extends StatefulWidget {
  @override
  State<Dashboard> createState() => _DashboardState();
}

class _DashboardState extends State<Dashboard> {
  final iAmInController = TextEditingController();
  final iAmOutController = TextEditingController();
  var transactionType = 'i am In';

  var token;
  var Users = [];

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
      getUsers();
    }
  }

  void getUsers() async {
    try {
      var response = await http.get(
        Uri.parse(dotenv.env['API_URL']! + "/api/gettodayattendance"),
        headers: <String, String>{
          'Content-Type': 'application/json',
          'Authorization': token
        },
      );
      print(response.body);
      setState(() {
        Users = jsonDecode(response.body)["data"];
      });
    } catch (e) {
      print(e);
    }
  }

  void attendanceDetails() async {
    var response = await http.post(
        Uri.parse(dotenv.env['API_URL']! + "/api/attendance_transaction"),
        headers: <String, String>{
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: jsonEncode({
          'TransactionType': transactionType,
          'Date':
              _dateTime?.toIso8601String() ?? DateTime.now().toIso8601String()
        }));

    if (response.statusCode == 200 &&
        jsonDecode(response.body)["status"] == false) {
      Fluttertoast.showToast(
          msg: jsonDecode(response.body)["message"],
          toastLength: Toast.LENGTH_SHORT,
          gravity: ToastGravity.BOTTOM,
          timeInSecForIosWeb: 2,
          backgroundColor: Colors.purple,
          fontSize: 15);
    } else {
      setState(() {
        transactionType = transactionType == 'i am Out' ? "i am In" : 'i am Out';
      });
      print(transactionType);
      getData();
      Fluttertoast.showToast(
          msg: jsonDecode(response.body)["message"],
          toastLength: Toast.LENGTH_SHORT,
          gravity: ToastGravity.BOTTOM,
          timeInSecForIosWeb: 2,
          backgroundColor: Colors.purple,
          fontSize: 15);
    }
  }

  void alertDialog(BuildContext context) {
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
                          attendanceDetails();
                          Navigator.pop(context);
                        },
                        child: Text('Yes'),
                        elevation: 5,
                        shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(20.0)),
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
                        elevation: 5,
                        shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(20.0)),
                      )
                    ],
                  ),
                )
              ],
            ));
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
        actions: [
          IconButton(
            icon: Icon(Icons.logout),
            onPressed: () {
              box1.delete("token");
              box1.delete("email");
              box1.delete("Name");
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => Login()),
              );
            },
          )
        ],
      ),
      body: Container(
        padding: EdgeInsets.all(10),
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(12),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.start,
            children: [
              ListView.builder(
                itemCount:  Users.length,
                itemBuilder: (BuildContext context, int index) {
                  return Card(
                    color: Colors.purple,
                    elevation: 5,
                    child: ListTile(
                      leading: Icon(Icons.person),
                      title: Text(
                        '${Users[index]["UserName"]}',
                        style: TextStyle(color: Colors.white, fontSize: 17),
                      ),
                    ),
                  );
                },
                shrinkWrap: true,
              ),
              SizedBox(
                height: 10,
              ),
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
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  RaisedButton(
                    elevation: 5,
                    child: Text(
                      transactionType,
                      style: TextStyle(fontSize: 15),
                    ),
                    color: Theme.of(context).primaryColor,
                    textColor: Colors.white,
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(20.0)),
                    onPressed: () {
                      transactionType == "i am In"
                          ? attendanceDetails()
                          : alertDialog(context);
                    },
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
