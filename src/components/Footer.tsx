import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Footer = () => {
  return (
    <View style={styles.footer}>
      <Text style={styles.text}>© {new Date().getFullYear()} ToDoList App</Text>
      <Text style={styles.text}>Conçu par Bachiir</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    height: 60,
    backgroundColor: '#007BFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingVertical: 5,
  },
  text: {
    color: 'white',
    fontSize: 14,
  },
});

export default Footer;
