import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:hive/hive.dart';
class ApprovalList extends StatefulWidget {


  @override
  State<ApprovalList> createState() => _ApprovalListState();
}

class _ApprovalListState extends State<ApprovalList> {

  late Box box1;
  var token;
  var url;
  var approvalList = [];
  var _isLoading = true;
  String msg = "";
  void createBox() async {
    box1 = await Hive.openBox('loginData');
    box1 = Hive.box('loginData');
    getData();
  }

  void getData() async {
    if (box1.get('token') != null) {
      token = box1.get('token');
      url = box1.get('updateUrl');
      getApprovals();
    }
  }

  @override
  void initState() {
    createBox();
    super.initState();

  }

  Future getApprovals() async {
    try {
      var response = await http.post(
        Uri.parse(url + "/api/getlisPendLeave"),
        headers: <String, String>{
          'Content-Type': 'application/json',
          'Authorization': token
        },
      );
      print(response.body);
      setState(() {
        approvalList = jsonDecode(response.body)["data"];
        _isLoading = false;
      });

    } catch (e) {
      print(e);
    }
  }
  void rejectRequest(index) async {
    print(Uri.parse(url + "/api/approvalLeave/" + '${approvalList[index]["_id"]}'));
    var response = await http.put(
        Uri.parse(url + "/api/rejectedLeave/" + '${approvalList[index]["_id"]}'),
        headers: <String, String>{
          'Content-Type': 'application/json',
          'Authorization': token
        });
    if (response.statusCode == 200 &&
        jsonDecode(response.body)["Status"] == false) {
      print('Error');
    } else {
      var data = jsonDecode(response.body)["data"];
      print(data);
      msg = "Rejected Successfully";
      var snackBar = SnackBar(
        content: Text(
            msg,
            style: TextStyle(fontSize: 16.5)
        ),
        backgroundColor: Colors.green,
      );
      ScaffoldMessenger.of(context).showSnackBar(snackBar);
      getApprovals();
    }
  }

  void approveRequest(index) async {
    print(Uri.parse(url + "/api/approvalLeave/" + '${approvalList[index]["_id"]}'));
    var response = await http.put(
        Uri.parse(url + "/api/approvalLeave/" + '${approvalList[index]["_id"]}'),
        headers: <String, String>{
          'Content-Type': 'application/json',
          'Authorization': token
        });
    if (response.statusCode == 200 &&
        jsonDecode(response.body)["Status"] == false) {
      print('Error');
    } else {
      var data = jsonDecode(response.body)["data"];
      print(data);
      msg = "Approved Successfully";
      var snackBar = SnackBar(
        content: Text(
            msg,
            style: TextStyle(fontSize: 16.5)
        ),
        backgroundColor: Colors.green,
      );
      ScaffoldMessenger.of(context).showSnackBar(snackBar);
      getApprovals();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Approvals List"),
      ),
      body: !_isLoading ?
      SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(10.0),
          child: SizedBox(
            height: MediaQuery.of(context).size.height * .8,
              child: approvalList.isEmpty ?
              LayoutBuilder(builder: (ctx, constraints) {
                return Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      'No Approval Requests added yet!',
                      style: Theme.of(context).textTheme.headline6,
                    ),
                    const SizedBox(
                      height: 20,
                    ),
                  ],
                );
              })
              : ListView.builder(
                itemCount: approvalList.length,
                itemBuilder: (BuildContext context, int index) {
                  return Card(
                    color: Colors.blueGrey,
                    margin: EdgeInsets.all(5),
                    elevation: 5,
                    child: Column(
                      children: [
                        ListTile(
                          //leading: Icon(Icons.person),
                          title: Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                // '${leaveRequests[index]["Status"]} '
                                '${approvalList[index]["ActionDetails"]["ActionTakenByName"]}',
                                style: TextStyle(color: Colors.white, fontSize: 17, fontWeight: FontWeight.bold),
                              ),
                              Text('${approvalList[index]["Date"]["Day"]}/'
                                  '${approvalList[index]["Date"]["Month"] + 1}/'
                                  '${approvalList[index]["Date"]["Year"]}',
                                style: TextStyle(color: Colors.white, fontSize: 17, fontWeight: FontWeight.normal),)

                            ],
                          ),
                          subtitle: Text(
                              '${approvalList[index]["Reason"]}',
                            style: TextStyle(color: Colors.white, fontSize: 15),
                          ),

                        ),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.end,
                          children: [
                            RaisedButton(
                              onPressed: (){
                                approveRequest(index);
                                },
                              child: Text('Approve', style: TextStyle(fontSize: 16),),
                              color: Colors.green,
                              textColor: Colors.white,
                              shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(5.0)),
                            ),
                            SizedBox(
                              width: 10,
                            ),
                            RaisedButton(
                              onPressed: (){rejectRequest(index);},
                              child: Text('Reject', style: TextStyle(fontSize: 16),),
                              color: Colors.red,
                              textColor: Colors.white,
                              shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(5.0)),
                            ),
                            SizedBox(
                              width: 20,
                            ),
                          ],
                        )
                      ],
                    ),
                  );
                },
                shrinkWrap: true,
              ),
            ),
          ),
        )
          : Center(

        child: CircularProgressIndicator(),
      ),
    );
  }
}
