import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:hive/hive.dart';
import 'package:intl/intl.dart';
import 'package:http/http.dart' as http;

class MonthlyAttendance extends StatefulWidget {
  @override
  State<MonthlyAttendance> createState() => _MonthlyAttendanceState();
}

class _MonthlyAttendanceState extends State<MonthlyAttendance> {
  late Box box2;
  late Box box1;
  var token;
  var url;
  String msg = "";
  var takenIn;

  List<Map> _list = [
    {
      'TakenIn': "2022-05-17 11:14",
      'TakenOut': "2022-05-17 11:14",
      'WorkingHours': "8"
    },
    {
      'TakenIn': "2022-05-17 11:14",
      'TakenOut': "2022-05-17 11:14",
      'WorkingHours': "8"
    },
    {
      'TakenIn': "2022-05-17 11:14",
      'TakenOut': "2022-05-17 11:14",
      'WorkingHours': "8"
    }
  ];

  DataTable _createDataTable() {
    return DataTable(
        columns: _createColumns(), columnSpacing: 0, rows: _createRows());
  }

  List<DataColumn> _createColumns() {
    return [
      DataColumn(
          label: Container(
            child: Text(
              'Sign In',
              style: TextStyle(fontWeight: FontWeight.bold),
            ),
            width: MediaQuery.of(context).size.width * .3,
          ),
          numeric: false),
      DataColumn(
          label: Container(
            child:
                Text('Sign Out', style: TextStyle(fontWeight: FontWeight.bold)),
            width: MediaQuery.of(context).size.width * .3,
          ),
          numeric: false),
      DataColumn(
          label: Container(
            child: Text('Working Hours',
                style: TextStyle(fontWeight: FontWeight.bold)),
            width: MediaQuery.of(context).size.width * .3,
          ),
          numeric: false),
      // DataColumn(label: Text('Sing Out')),
      // DataColumn(label: Text('Working Hours')),
    ];
  }

  List<DataRow> _createRows() {
    return _list
        .map((list) => DataRow(cells: [
              DataCell(Text(list['TakenIn'])),
              DataCell(Text(list['TakenOut'])),
              DataCell(Text(list['WorkingHours'])),
            ]))
        .toList();
  }

  @override
  void initState() {
    super.initState();
    createBox();
  }

  void createBox() async {
    box1 = await Hive.openBox('loginData');
    box2 = await Hive.openBox('attendance');
    box2 = Hive.box('attendance');
    getData();
  }

  void getData() async {
    if (box1.get('token') != null) {
      token = box1.get('token');
      url = box1.get('updateUrl');
      print(takenIn);
      print('takenIn');
      monthlyReport();
    }
  }
  void monthlyReport() async {
    print('token');
    print(box1.get('token'));
    var response = await http.get(
        Uri.parse(url + "/api/GetLastReport"),
        headers: <String, String>{
          'Content-Type': 'application/json',
          'Authorization': token
        });
    if (response.statusCode == 200 &&
        jsonDecode(response.body)["status"] == false) {
      print('Error');
    } else {
      msg = "Monthly Report Fetched Successfully";
      print("Response from monthly");
      print(response.body);
      var snackBar = SnackBar(
        content: Text(msg, style: TextStyle(fontSize: 16.5)),
        backgroundColor: Colors.green,
      );
      ScaffoldMessenger.of(context).showSnackBar(snackBar);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Monthly Attendance'),
      ),
      body: SingleChildScrollView(child: _createDataTable()),
    );
  }
}
