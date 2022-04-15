import 'package:flutter/material.dart';
import '../model/menu_item.dart';

class MenuItems {
  static const  List<MenuItem> itemsFirst = [
    itemLeave,
    itemPending
  ];

  static const  List<MenuItem> itemsSecond = [
    itemLogout
  ];

  static const itemLeave = MenuItem(
    text: 'Leave',
    icon: Icons.holiday_village_outlined
  );

  static const itemPending = MenuItem(
    text: 'Pending',
    icon: Icons.pending_actions,
  );

  static const itemLogout = MenuItem(
    text: 'Logout',
    icon: Icons.logout,
  );
}