import 'dart:convert';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:hive/hive.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:http/http.dart' as http;

class LeaveList extends StatefulWidget {
  @override
  State<LeaveList> createState() => _LeaveListState();
}

class _LeaveListState extends State<LeaveList> {
  String selectedValue = 'Single leave';
  DateTime? _dateTime;
  DateTime? date;
  var token;
  late Box box1;
  final reasonController = TextEditingController();
  String? enteredReason;

  @override
  void initState() {
    createBox();
    super.initState();
  }


  Future pickDateTime(BuildContext context) async {
    final date = await pickDate(context);
    if (date == null) return;

    setState(() {
      _dateTime = DateTime(
        date.year,
        date.month,
        date.day,
      );
    });
  }

  Future pickLastDateTime(BuildContext context) async {
    final date = await pickDate(context);
    if (date == null) return;

    setState(() {
      lastDate = DateTime(
        date.year,
        date.month,
        date.day,
      );
    });
  }

  String getDate() {
    if (_dateTime == null) {
      return 'Select Date';
    } else {
      return DateFormat.yMMMEd().format(_dateTime!);
    }
  }
  String getLastDate() {
    if (lastDate == null) {
      return 'Select Date';
    } else {
      return DateFormat.yMMMEd().format(lastDate!);
    }
  }
  void onSubmitData(){
    final enteredReason = reasonController.text;
    if(enteredReason.isEmpty || _dateTime==null){
      return;
    }
    print(enteredReason);
    print(_dateTime);
    leaveRequest();
  }
  void onSubmitDataMultiple(){
    final enteredReason = reasonController.text;
    if(enteredReason.isEmpty || firstDate==null || lastDate==null){
      return;
    }
    leaveRequest();
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

  void createBox() async {
    box1 = await Hive.openBox('loginData');
    box1 = Hive.box('loginData');
    getData();

  }

  Future getData() async {

    if (box1.get('token') != null) {
     token = box1.get('token');
      print(box1);
      print('box');
    }else{
      print('here2');
    }
  }

  void leaveRequest() async {
    print('here');
    print(token);
    var response = await http.post(
        Uri.parse(dotenv.env['API_URL']! + "/api/LeaveReq"),
        headers: <String, String>{
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: jsonEncode({
          'Datestart': firstDate,
          'Reason': enteredReason,
          'Dateend': lastDate,
        }));
    print('here 1');
    if (response.statusCode == 200 &&
        jsonDecode(response.body)["status"] == false) {
      print('Error');
    } else {
      print('success');
    }
  }

  final String singleLeave = 'Single leave';
  final String multipleLeave = 'Multiple leave';
  DateTime? firstDate;
  DateTime? lastDate;

  final items = ['Single leave', 'Multiple leave'];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Leave Request"),
      ),
      body: Column(
        children: [
          Center(
            child: DropdownButton(
                value: selectedValue,
                icon: Icon(Icons.keyboard_arrow_down),
                items: items.map((String items) {
                  return DropdownMenuItem<String>(
                    child: Text(items),
                    value: items,
                  );
                }).toList(),
                hint: Text(
                  "Please choose a langauage",
                  style: TextStyle(
                      color: Colors.black,
                      fontSize: 14,
                      fontWeight: FontWeight.w500),
                ),
                onChanged: (String? newValue) {
                  setState(() {
                    selectedValue = newValue!;
                    print(selectedValue + 'leave Vlaue');
                  });
                }),
          ),
          Container(
            padding: EdgeInsets.all(20),
            child: Column(
              children: [
                (selectedValue == singleLeave)
                    ? Column(
                      children: [
                        RaisedButton(child: Text('Select Date'),onPressed: () => pickDateTime(context)),
                        Text(_dateTime==null ? 'Please Select a Date' : getDate()),
                        TextField(
                          decoration: InputDecoration(labelText: 'Enter Reason'),
                          controller: reasonController,
                          keyboardType: TextInputType.multiline,
                          maxLines: null,
                          onSubmitted: (_) => onSubmitData(),
                        ),
                        RaisedButton(onPressed: () => onSubmitData(), child: Text('Submit'),)
                      ],
                    )
                    : Column(
                      children: [
                        RaisedButton(child: Text('Start Date'),onPressed: () {
                          pickDateTime(context);
                          firstDate = _dateTime;

                        }),
                        Text(firstDate==null ? 'Please Select Start Date' : getDate()),
                        RaisedButton(child: Text('End Date'),onPressed: () {
                          pickLastDateTime(context);
                        }),
                        Text(lastDate==null ? 'Please Select Last Date' : getLastDate()),
                        TextField(
                          decoration: InputDecoration(labelText: 'Enter Reason'),
                          controller: reasonController,
                          keyboardType: TextInputType.multiline,
                          maxLines: null,
                          onSubmitted: (_) => onSubmitDataMultiple(),
                        ),
                        SizedBox(height: 20,),
                        RaisedButton(onPressed: () => onSubmitDataMultiple(), child: Text('Submit', style: TextStyle(fontSize: 16),),)
                      ],
                    ),
                SingleChildScrollView(
                  child: Card(
                    elevation: 5,
                    margin: const EdgeInsets.symmetric(vertical: 8, horizontal: 5),
                    child: ListTile(
                      title: Text('Leave Request'),
                    ),
                  ),
                ),
              ],
            ),
          )
        ],
      ),
    );
  }
}
