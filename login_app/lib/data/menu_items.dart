import 'package:flutter/material.dart';
import '../model/menu_item.dart' as menu;

class MenuItems {
  static const  List<menu.MenuItem> itemsFirst = [
    itemPending,
    itemLeave,
    changePassword,
    monthlyAttendance,
    itemLogout

  ];

  static const  List<menu.MenuItem> itemsSecond = [
    itemLeave,
    changePassword,
    monthlyAttendance,
    itemLogout

  ];

  static const itemLeave = menu.MenuItem(
    text: 'Leave',
    icon: Icons.holiday_village_outlined
  );

  static const itemPending = menu.MenuItem(
    text: 'Pending',
    icon: Icons.pending_actions,
  );

  static const itemLogout = menu.MenuItem(
    text: 'Logout',
    icon: Icons.logout,
  );
  static const changePassword = menu.MenuItem(
    text: 'Change Password',
    icon: Icons.lock_open,
  );
  static const monthlyAttendance = menu.MenuItem(
    text: 'Monthly Attendance',
    icon: Icons.report_gmailerrorred_outlined,
  );
}