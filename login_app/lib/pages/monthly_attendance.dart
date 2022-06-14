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
  DateTime? startDate;
  DateTime? endDate;

  List _list = [

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

              DataCell(Text('${DateFormat('dd-MM-yyyy h:mma').format(DateTime.parse(list['TakenIn'].toString()).toLocal())}')),
              DataCell(Text(
                  (list['TakenOut'] != null) ?
                  '${DateFormat('dd-MM-yyyy h:mma').format(DateTime.parse(list['TakenOut'].toString()).toLocal())}' : "--"
              )),
              DataCell(Text(list['TotalHours'].toString())),
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
    }
  }
  void monthlyReport() async {
    _list = [];
    print('token');
    print(box1.get('token'));
    var response = await http.post(
        Uri.parse(url + "/api/GetLastReport"),
        headers: <String, String>{
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: jsonEncode({
          'StartDate': startDate?.toString(),
          'EndDate': endDate?.toString(),
        }));
    print(response.body);
    if (response.statusCode == 200 &&
        jsonDecode(response.body)["Status"] == false) {
      print('Error');
    } else {
      msg = "Monthly Report Fetched Successfully";
      print("Response from monthly");
      print(response.body);
      List data =  jsonDecode(response.body)['data'];
      print(data);
      setState(() {
        _list.addAll(data);
      });

      print("YA string ha");
      print(_list);
      var snackBar = SnackBar(
        content: Text(msg, style: TextStyle(fontSize: 16.5)),
        backgroundColor: Colors.green,
      );
      ScaffoldMessenger.of(context).showSnackBar(snackBar);
    }
  }
  Future<DateTime> pickDate(BuildContext context) async {
    final initialDate = DateTime.now();
    final newDate = await showDatePicker(
      context: context,
      initialDate: startDate ?? initialDate,
      firstDate: DateTime(DateTime.now().year - 5),
      lastDate: DateTime(DateTime.now().year + 5),
    );
    return newDate!;
  }

  Future startDateTime(BuildContext context) async {
    final date = await pickDate(context);
    if (date == null) return;

    setState(() {
      startDate = DateTime(
        date.year,
        date.month,
        date.day,
      );
    });
  }

  Future endDateTime(BuildContext context) async {
    final date = await pickDate(context);
    if (date == null) return;

    setState(() {
      endDate = DateTime(
        date.year,
        date.month,
        date.day,
      );
    });
  }

  String selectStartDate() {
    if (startDate == null) {
      return 'Select First Date';
    } else {
      return DateFormat.yMMMEd().format(startDate!);
    }
  }

  String selectEndDate() {
    if (endDate == null) {
      return 'Select Last Date';
    } else {
      return DateFormat.yMMMEd().format(endDate!);
    }
  }

  void onSubmitDataMultiple() {
    if (startDate == null || endDate == null) {
      return;
    }
    monthlyReport();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Monthly Attendance'),
      ),
      body: SingleChildScrollView(child: Column(
        children: [
          SizedBox(height: 15,),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    primary: Theme.of(context).primaryColor,
                    onPrimary: Colors.white,
                    shape: RoundedRectangleBorder(
                        borderRadius:
                        BorderRadius.circular(20.0)),
                  ),
                  child: Text('Start Date'),
                  onPressed: () {
                    startDateTime(context);
                  }),
              ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    primary: Theme.of(context).primaryColor,
                    onPrimary: Colors.white,
                    shape: RoundedRectangleBorder(
                        borderRadius:
                        BorderRadius.circular(20.0)),
                  ),
                  child: Text('End Date'),
                  onPressed: () {
                    endDateTime(context);
                  }),
            ],
          ),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              Text(startDate == null
                  ? 'Select Start Date'
                  : selectStartDate()),
              Text(endDate == null
                  ? 'Select Last Date'
                  : selectEndDate()),
            ],
          ),
          SizedBox(
            height: 15,
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              primary: Theme.of(context).primaryColor,
              onPrimary: Colors.white,
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(20.0)),
            ),
            onPressed: () => onSubmitDataMultiple(),
            child: Text(
              'Search',
              style: TextStyle(fontSize: 16),
            ),
          ),
          _createDataTable()
        ],
      )),
    );
  }
}
