import React from 'react';
import { Text, View } from 'react-native';

import styles from './expenses.styles';

const expenseItems = [
  {
    id: '1',
    title: 'Client Meeting Lunch',
    meta: 'Submitted by Priya Sharma',
    amount: '$128.40',
  },
  {
    id: '2',
    title: 'Taxi Reimbursement',
    meta: 'Submitted by Arjun Patel',
    amount: '$42.00',
  },
];

const ExpensesScreen = () => {
  return (
    <View style={styles.screen}>
      <Text style={styles.heading}>Recent Expense Requests</Text>

      {expenseItems.map((item) => (
        <View key={item.id} style={styles.card}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.meta}>{item.meta}</Text>
          <Text style={styles.amount}>{item.amount}</Text>
        </View>
      ))}
    </View>
  );
};

export default ExpensesScreen;
