import 'package:flutter/material.dart';
class ApprovalList extends StatefulWidget {
  const ApprovalList({Key? key}) : super(key: key);

  @override
  State<ApprovalList> createState() => _ApprovalListState();
}

class _ApprovalListState extends State<ApprovalList> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Approvals List"),
      ),
      body: SingleChildScrollView(
        child: SizedBox(

          child: ListView.builder(
            // itemCount: leaveRequests.length,
            itemBuilder: (BuildContext context, int index) {
              return Card(
                color: Colors.orangeAccent,
                elevation: 5,
                child: ListTile(
                  leading: Icon(Icons.person),
                  title: Text(
                    // '${leaveRequests[index]["Status"]} '
                    'User Name'
                    '                     15/7/22',
                    style: TextStyle(color: Colors.white, fontSize: 17, fontWeight: FontWeight.bold),
                  ),
                  subtitle: Text(
                    'Due to not feeling well',
                    // '${leaveRequests[index]["Date"]["Day"]}/'
                    //     '${leaveRequests[index]["Date"]["Month"]}/'
                    //     '${leaveRequests[index]["Date"]["Year"]}',
                    style: TextStyle(color: Colors.white, fontSize: 15),
                  ),

                ),
              );
            },
            shrinkWrap: true,
          ),
        ),
      ),
    );
  }
}
