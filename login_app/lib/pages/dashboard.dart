import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:hive/hive.dart';

class Dashboard extends StatefulWidget {
  @override
  State<Dashboard> createState() => _DashboardState();
}

class _DashboardState extends State<Dashboard> {
  final iAmInController = TextEditingController();
  final iAmOutController = TextEditingController();
  var transactionType = "";

  DateTime? _dateTime;
  String getDate() {
    if (_dateTime == null) {
      return 'Select Date';
    } else {
      return DateFormat('dd/MM/yyyy HH:mm').format(_dateTime!);
    }
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
        title: const Text("Dashboard"),
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
                        onPressed: () {
                          // TransactionType = "In";
                          // () => addAttendance;
                          var box = Hive.box('attendance');
                          box.put('In', 'In');
                        },
                        child: const Text('I am in'),
                        color: Colors.purple,
                        textColor: Colors.white,
                      ),
                      RaisedButton(
                        onPressed: () {
                          // TransactionType = "Out";
                          var box = Hive.box('attendance');
                          String data = box.get('In');
                        },
                        child: const Text('I am out'),
                        color: Colors.purple,
                        textColor: Colors.white,
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
