import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import styles from './home.styles';
import { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen = ({ navigation }: Props) => {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Expense Management</Text>
      <Text style={styles.subtitle}>
        Review team spending, track reimbursement requests, and keep approvals
        moving from one place.
      </Text>

      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate('Expenses')}
      >
        <Text style={styles.buttonText}>View Expenses</Text>
      </Pressable>
    </View>
  );
};

export default HomeScreen;
