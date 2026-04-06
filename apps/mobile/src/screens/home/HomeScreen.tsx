import React from 'react';
import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import styles from './home.styles';
import { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen = ({ navigation }: Props) => {
  return (
    <View style={styles.screen}>
      <Text variant="headlineMedium" style={styles.title}>
        Expense Management
      </Text>
      <Text variant="bodyLarge" style={styles.subtitle}>
        Review team spending, track reimbursement requests, and keep approvals
        moving from one place.
      </Text>

      <Button
        mode="contained"
        contentStyle={styles.buttonContent}
        style={styles.button}
        labelStyle={styles.buttonLabel}
        onPress={() => navigation.navigate('Expenses')}
      >
        View Expenses
      </Button>
    </View>
  );
};

export default HomeScreen;
