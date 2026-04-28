import React from 'react';
import { ScrollView, View } from 'react-native';
import { Card, Text } from 'react-native-paper';

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
    <ScrollView contentContainerStyle={styles.content} style={styles.screen}>
      <Text variant="headlineSmall" style={styles.heading}>
        Recent Expense Requests
      </Text>

      {expenseItems.map((item) => (
        <Card key={item.id} mode="contained" style={styles.card}>
          <Card.Content>
            <View style={styles.cardBody}>
              <Text variant="titleMedium" style={styles.title}>
                {item.title}
              </Text>
              <Text variant="bodyMedium" style={styles.meta}>
                {item.meta}
              </Text>
              <Text variant="titleLarge" style={styles.amount}>
                {item.amount}
              </Text>
            </View>
          </Card.Content>
        </Card>
      ))}
    </ScrollView>
  );
};

export default ExpensesScreen;
