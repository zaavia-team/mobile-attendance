import 'package:flutter/material.dart';
class ApprovalList extends StatefulWidget {

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
        child: Padding(
          padding: const EdgeInsets.all(15.0),
          child: SizedBox(
            height: MediaQuery.of(context).size.height,
            child: ListView.builder(
              // itemCount: leaveRequests.length,
              itemBuilder: (BuildContext context, int index) {
                return Card(
                  color: Colors.blueGrey,
                  margin: EdgeInsets.all(5),
                  elevation: 5,
                  child: Column(
                    children: [
                      ListTile(
                        leading: Icon(Icons.person),
                        title: Text(
                          // '${leaveRequests[index]["Status"]} '
                          'User Name'
                          '                     15/7/2022',
                          style: TextStyle(color: Colors.white, fontSize: 17, fontWeight: FontWeight.bold),
                        ),
                        subtitle: Text(
                          'Due to not feeling well. Due to not feeling well. Due to not feeling well. Due to not feeling well.',
                          // '${leaveRequests[index]["Date"]["Day"]}/'
                          //     '${leaveRequests[index]["Date"]["Month"]}/'
                          //     '${leaveRequests[index]["Date"]["Year"]}',
                          style: TextStyle(color: Colors.white, fontSize: 15),
                        ),

                      ),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.end,
                        children: [
                          RaisedButton(
                            onPressed: (){return;},
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
                            onPressed: (){return;},
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
      ),
    );
  }
}
