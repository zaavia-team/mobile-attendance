import 'dart:convert';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:hive/hive.dart';
import 'package:http/http.dart' as http;
import 'package:login_app/pages/approval_List.dart';
import 'package:login_app/pages/change_Password.dart';
import './leavelist.dart';
import 'package:login_app/data/menu_items.dart';
import 'package:login_app/model/menu_item.dart';
import 'package:login_app/pages/leavelist.dart';
import 'package:login_app/pages/login.dart';

class Dashboard extends StatefulWidget {
  @override
  State<Dashboard> createState() => _DashboardState();
}

class _DashboardState extends State<Dashboard> {
  final iAmInController = TextEditingController();
  final iAmOutController = TextEditingController();
  TextEditingController earlyReason = TextEditingController();
  var transactionType = 'i am In';

  var token;
  var Users = [];
  String msg = "";
  var rightsTitle = "";
  var diff_hr;
  DateTime signIn = DateTime.now();

  // final

  late Box box1;
  late Box box2;

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
    box2 = await Hive.openBox('attendance');
    getData();
  }

  void getData() async {
    if (box1.get('token') != null) {
      token = box1.get('token');
      rightsTitle = box1.get('LeaveAccess') ?? "";
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

        var currentUser =
            Users.any((user) => user["UserName"] == box1.get('email'));
        if (currentUser) {
          transactionType = "i am Out";
        }
      });
      print("Users");
      print(Users);
    } catch (e) {
      print(e);
    }
  }

  void attendanceDetails() async {
    var obj = {};
    if (transactionType == "i am Out" && diff_hr < 8) {
      obj = {
        'TransactionType': transactionType,
        'EarlyReason': earlyReason.text,
        'Date':
            _dateTime?.toIso8601String() ?? DateTime.now().toIso8601String(),
        'ManualEntry': _dateTime?.toIso8601String() != null ? true : false
      };
    } else {
      obj = {
        'TransactionType': transactionType,
        'Date':
            _dateTime?.toIso8601String() ?? DateTime.now().toIso8601String(),
        'ManualEntry': _dateTime?.toIso8601String() != null ? true : false
      };
    }
    var response = await http.post(
        Uri.parse(dotenv.env['API_URL']! + "/api/attendance_transaction"),
        headers: <String, String>{
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: jsonEncode(obj));
    print(response.body);
    print(Users);

    if (response.statusCode == 200 &&
        jsonDecode(response.body)["status"] == false) {
      msg = jsonDecode(response.body)["message"];

      var snackBar = SnackBar(
        content: Text(msg, style: TextStyle(fontSize: 16.5)),
        backgroundColor: Color.fromARGB(255, 185, 175, 40),
      );

      ScaffoldMessenger.of(context).showSnackBar(snackBar);
    } else {
      setState(() {
        var data = jsonDecode(response.body)["Data"];
        if (data != null) {
          box2.put('TakenIn', data["TakenIn"]);
        }
        transactionType =
            transactionType == 'i am Out' ? "i am In" : 'i am Out';
      });
      getData();
      msg = jsonDecode(response.body)["message"];
      var snackBar = SnackBar(
        content: Text(msg, style: TextStyle(fontSize: 16.5)),
        backgroundColor: Colors.green,
      );

      ScaffoldMessenger.of(context).showSnackBar(snackBar);
    }
  }

  String durationToString(int minutes) {
    var d = Duration(minutes: minutes);
    List<String> parts = d.toString().split(':');
    return '${parts[0].padLeft(2, '0')}:${parts[1].padLeft(2, '0')}';
  }

  void hoursAlertDialog(BuildContext context) {
    showDialog(
        context: context,
        builder: (context) => AlertDialog(
              title: const Text("Your 8 Hours of work is not completed yet",
                  textAlign: TextAlign.center),
              actions: [
                TextField(
                  keyboardType: TextInputType.multiline,
                  maxLines: null,
                  decoration: const InputDecoration(
                      hintText: 'Enter Reason',
                      prefixIcon: Icon(Icons.email),
                      border: OutlineInputBorder(
                          borderSide: BorderSide(width: 2),
                          borderRadius:
                              BorderRadius.all(Radius.circular(27.0)))),
                  controller: earlyReason,
                ),
                SizedBox(
                  height: 10,
                ),
                ButtonTheme(
                  minWidth: 400,
                  height: 50,
                  child: RaisedButton(
                    elevation: 5,
                    onPressed: () {
                      print(earlyReason.text);
                      attendanceDetails();
                      //Navigator.pop(context, true);
                      Navigator.of(context, rootNavigator: true).pop();
                    },
                    child: const Text(
                      'Submit',
                      style: TextStyle(fontSize: 17),
                    ),
                    color: Colors.purple,
                    textColor: Colors.white,
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(24.0)),
                  ),
                ),
              ],
            ));
  }

  void reasonController() {
    if (diff_hr < 8) {
      hoursAlertDialog(context);
    
    } else {
      attendanceDetails();
      Navigator.pop(context);
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
                          print('datetime for signout');
                          DateTime signOut = DateTime.now();
                          print(box2.get("TakenIn"));
                          DateTime signin = DateTime.parse(box2.get("TakenIn"));
                          print(signin);
                          print('signin');
                          diff_hr = signOut.difference(signin).inMinutes;
                          print(signOut);
                          print('Signout from work');
                          print(diff_hr);
                          print('time difference for signin ');
                          var diff = diff_hr / 60;
                          print(diff);
                          print('time in hours');
                          print(durationToString(100));
                          print('duration of 100');
                          print(durationToString(diff_hr));
                          print('difference in minutes and hours');
                          print(earlyReason.text);
                          print('reson for early sign out');
                          //earlyReasonController();

                          attendanceDetails();
                          Navigator.pop(context, true);
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
          PopupMenuButton<MenuItem>(
              onSelected: (item) => onSelected(context, item),
              itemBuilder: (context) => rightsTitle == "Approved Leave"
                  ? MenuItems.itemsFirst.map(buildItem).toList()
                  : MenuItems.itemsSecond.map(buildItem).toList()),
        ],
      ),
      body: Container(
        padding: EdgeInsets.all(20),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.start,
          children: [
            Flexible(
              child: ListView.builder(
                itemCount: Users.length,
                itemBuilder: (BuildContext context, int index) {
                  return Card(
                    color: Color.fromARGB(255, 1, 183, 156),
                    elevation: 5,
                    child: ListTile(
                      leading: Icon(Icons.person),
                      title: Text('${Users[index]["UserName"]}',
                          style: TextStyle(color: Colors.white, fontSize: 18)),
                      subtitle: Text(
                          '${DateFormat('dd-MM-yyyy HH:mm').format(DateTime.parse(Users[index]["TakenIn"]).toLocal())}',
                          style: TextStyle(color: Colors.white, fontSize: 17)),
                    ),
                  );
                },
                shrinkWrap: true,
              ),
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
                    if (transactionType == "i am In") {
                      signIn = DateTime.now();
                      print(signIn);
                      print('sign in for work');
                      attendanceDetails();
                    } else {
                      DateTime signOut = DateTime.now();
                      print(box2.get("TakenIn"));
                      DateTime signin = DateTime.parse(box2.get("TakenIn"));
                      print(signin);
                      print('signin');
                      diff_hr = signOut.difference(signin).inMinutes;
                      print(signOut);
                      print('Signout from work');
                      print(diff_hr);
                      print('time difference for signin ');
                      var diff = diff_hr / 60;
                      print(diff);
                      print('time in hours');
                      print(durationToString(100));
                      print('duration of 100');
                      print(durationToString(diff_hr));
                      print('difference in minutes and hours');
                      print(earlyReason.text);
                      print('reson for early sign out');
                      if (diff_hr < 8) {
                        hoursAlertDialog(context);
                       
                      } else {
                        attendanceDetails();
                        Navigator.pop(context);
                      }
                    }   
                  },
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  PopupMenuItem<MenuItem> buildItem(MenuItem item) => PopupMenuItem<MenuItem>(
        value: item,
        child: Row(
          children: [
            Icon(
              item.icon,
              color: Colors.black,
            ),
            SizedBox(
              width: 12,
            ),
            Text(item.text),
          ],
        ),
      );

  void onSelected(BuildContext context, MenuItem item) {
    switch (item) {
      case MenuItems.itemLeave:
        Navigator.push(
          context,
          MaterialPageRoute(builder: (context) => LeaveList()),
        );
        break;

      case MenuItems.itemPending:
        Navigator.push(
            context, MaterialPageRoute(builder: (context) => ApprovalList()));
        // }
        break;

      case MenuItems.changePassword:
        Navigator.push(
          context,
          MaterialPageRoute(builder: (context) => ChangePassword()),
        );
        break;

      case MenuItems.itemLogout:
        box1.delete('token');
        box1.delete('email');
        box1.delete('Name');
        box1.delete('_id');
        box1.delete('LeaveAccess');

        Navigator.of(context).pushAndRemoveUntil(
          MaterialPageRoute(builder: (context) => Login()),
          (Route<dynamic> route) => false,
        );
        break;
    }
  }
}
