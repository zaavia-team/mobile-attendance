import 'dart:convert';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:hive/hive.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:http/http.dart' as http;
import 'package:login_app/pages/dashboard.dart';

class LeaveList extends StatefulWidget {
  @override
  State<LeaveList> createState() => _LeaveListState();
}

class _LeaveListState extends State<LeaveList> {
  final String singleLeave = 'Single leave';
  final String multipleLeave = 'Multiple leave';
  DateTime? firstDate;
  DateTime? lastDate;
  String selectedValue = 'Single leave';
  var token;
  final reasonController = TextEditingController();
  String enteredReason = "";
  String msg = "";
  var leaveRequests = [];

  late Box box1;

  void createBox() async {
    box1 = await Hive.openBox('loginData');
    box1 = Hive.box('loginData');
    getData();
  }

  void getData() async {
    if (box1.get('token') != null) {
      token = box1.get('token');
      getRequests();
    }
  }

  void getRequests() async {
    try {
      var response = await http.post(
        Uri.parse(dotenv.env['API_URL']! + "/api/getUsershowLeave"),
        headers: <String, String>{
          'Content-Type': 'application/json',
          'Authorization': token
        },
      );
      print(response.body);
      setState(() {
        leaveRequests = jsonDecode(response.body)["data"];
      });

      // setState(() {
      //   Users = jsonDecode(response.body)["data"];
      //   print("currentUsedfsghr");
      //
      //   var currentUser =
      //   Users.any((user) => user["UserName"] == box1.get('email'));
      //   print("currentUser");
      //   print(currentUser);
      //   if (currentUser) {
      //     transactionType = "i am Out";
      //   }
      // });
      // print("Users");
      // print(Users);
    } catch (e) {
      print(e);
    }
  }

  @override
  void initState() {
    createBox();
    super.initState();
  }


  Future pickDateTime(BuildContext context) async {
    final date = await pickDate(context);
    if (date == null) return;

    setState(() {
      firstDate = DateTime(
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
    if (firstDate == null) {
      return 'Select First Date';
    } else {
      return DateFormat.yMMMEd().format(firstDate!);
    }
  }
  String getLastDate() {
    if (lastDate == null) {
      return 'Select Last Date';
    } else {
      return DateFormat.yMMMEd().format(lastDate!);
    }
  }
  void onSubmitData(){
    enteredReason = reasonController.text;
    if(enteredReason.isEmpty || firstDate==null){
      return;
    }
    print(enteredReason);
    print(firstDate);
    leaveRequest();
    getRequests();
  }
  void onSubmitDataMultiple(){
    enteredReason = reasonController.text;
    if(enteredReason.isEmpty || firstDate==null || lastDate==null){
      return;
    }
    leaveRequest();
    getRequests();
  }

  Future<DateTime> pickDate(BuildContext context) async {
    final initialDate = DateTime.now();
    final newDate = await showDatePicker(
      context: context,
      initialDate: firstDate ?? initialDate,
      firstDate: DateTime(DateTime.now().year - 5),
      lastDate: DateTime(DateTime.now().year + 5),
    );
    return newDate!;
  }


  // void getData () async {

  //   if (box1.get('token') != null) {
  //    token = box1.get('token');
  //     print(box1);
  //     print('box');
  //   }else{
  //     print('here2');
  //   }
  // }

  void leaveRequest() async {
    print(firstDate);
    print(box1.get('token'));
    var response = await http.post(
        Uri.parse(dotenv.env['API_URL']! + "/api/LeaveReq"),
        headers: <String, String>{
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: jsonEncode({
          'Datestart': firstDate?.toIso8601String(),
          'Reason': enteredReason,
          'Dateend': lastDate?.toIso8601String(),
        }));
    if (response.statusCode == 200 &&
        jsonDecode(response.body)["status"] == false) {
      print('Error');
    } else {
      msg = "Leave Applied Successfully";
      var snackBar = SnackBar(
        content: Text(
            msg,
            style: TextStyle(fontSize: 16.5)
        ),
        backgroundColor: Colors.green,
      );
      ScaffoldMessenger.of(context).showSnackBar(snackBar);
      Navigator.of(context).pushAndRemoveUntil(
          MaterialPageRoute(builder: (context) => Dashboard()),
      (Route<dynamic> route) => false);
    }
  }
  final items = ['Single leave', 'Multiple leave'];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Leave Request"),
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.only(top: 15.0),
              child: Center(
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
                      "Please choose leave",
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
            ),
            Container(
              padding: EdgeInsets.all(10),
              child: Column(
                children: [
                  (selectedValue == singleLeave)
                      ? Padding(
                        padding: const EdgeInsets.only(left: 15.0, right: 15.0),
                        child: Column(
                          children: [
                            RaisedButton(
                                color: Theme.of(context).primaryColor,
                                textColor: Colors.white,
                                shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(20.0)),
                                child: Text('Select Date'),onPressed: () => pickDateTime(context)),
                            Text(firstDate==null ? 'Select a Date' : getDate()),
                            TextField(
                              decoration: InputDecoration(labelText: 'Enter Reason'),
                              controller: reasonController,
                              keyboardType: TextInputType.multiline,
                              maxLines: null,
                              onSubmitted: (_) => onSubmitData(),
                            ),
                            SizedBox(height: 30,),
                            RaisedButton(
                              color: Theme.of(context).primaryColor,
                              textColor: Colors.white,
                              shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(20.0)),
                              onPressed: () => onSubmitData(), child: Text('Submit'),)
                          ],
                        ),
                      )
                      : Column(
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceAround,
                            children: [
                              RaisedButton(
                                  color: Theme.of(context).primaryColor,
                                  textColor: Colors.white,
                                  shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(20.0)),
                                  child: Text('Start Date'),onPressed: () {
                                pickDateTime(context);
                              }),
                              RaisedButton(
                                  color: Theme.of(context).primaryColor,
                                  textColor: Colors.white,
                                  shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(20.0)),
                                  child: Text('End Date'),onPressed: () {
                                pickLastDateTime(context);
                              }),

                            ],
                          ),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceAround,
                            children: [

                              Text(firstDate==null ? 'Select Start Date' : getDate()),
                              Text(lastDate==null ? 'Select Last Date' : getLastDate()),
                            ],
                          ),


                          Padding(
                            padding: const EdgeInsets.only(left: 15.0, right: 15.0),
                            child: TextField(
                              decoration: InputDecoration(labelText: 'Enter Reason'),
                              controller: reasonController,
                              keyboardType: TextInputType.multiline,
                              maxLines: null,
                              onSubmitted: (_) => onSubmitDataMultiple(),
                            ),
                          ),
                          SizedBox(height: 30,),
                          RaisedButton(
                            color: Theme.of(context).primaryColor,
                            textColor: Colors.white,
                            shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(20.0)),
                            onPressed: () => onSubmitDataMultiple(), child: Text('Submit', style: TextStyle(fontSize: 16),),)
                        ],
                      ),
                  SizedBox(height: 20),
                  SingleChildScrollView(
                    child: SizedBox(
                      height: MediaQuery.of(context).size.height * .5,
                      child: ListView.builder(
                       itemCount: leaveRequests.length,
                        itemBuilder: (BuildContext context, int index) {
                          return Card(
                            color: Colors.blueGrey,
                            elevation: 5,
                            child: ListTile(
                              leading: Icon(Icons.person),
                              title: Text(
                                '${leaveRequests[index]["Status"]}',
                                style: TextStyle(color: Colors.white, fontSize: 17, fontWeight: FontWeight.bold),
                              ),
                              subtitle: Text(
                                  '${leaveRequests[index]["Date"]["Day"]}/'
                                      '${leaveRequests[index]["Date"]["Month"]}/'
                                      '${leaveRequests[index]["Date"]["Year"]}',
                                  style: TextStyle(color: Colors.white, fontSize: 15),
                              ),
                            ),
                          );
                        },
                        shrinkWrap: true,
                      ),
                    ),
                    //  SizedBox(
                    //
                    //   child: ListView.builder(
                    //     // itemCount: Users.length,
                    //     itemBuilder: (BuildContext context, int index) {
                    //       return Card(
                    //         color: Colors.purple,
                    //         elevation: 5,
                    //         child: ListTile(
                    //           leading: Icon(Icons.person),
                    //           title: Text(
                    //             '${Users[index]["UserName"]}',
                    //             style: TextStyle(color: Colors.white, fontSize: 17),
                    //           ),
                    //         ),
                    //       );
                    //     },
                    //     shrinkWrap: true,
                    //   // ),
                    //   ),
                    // ),
                  )],
              ),
            )
          ],
        ),
      ),
    );
  }
}
