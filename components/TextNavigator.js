import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TextNavigator = ({ currentText, onPrevious, onNext, currentIndex, totalTexts }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[styles.navButton, { opacity: currentIndex > 0 ? 1 : 0.5 }]} 
        onPress={onPrevious}
        disabled={currentIndex === 0}
      >
        <Ionicons name="chevron-back" size={24} color="#007AFF" />
      </TouchableOpacity>
      
      <View style={styles.textContainer}>
        <Text style={styles.text}>{currentText}</Text>
        <View style={styles.bottomRow}>
          <Text style={styles.counter}>{`${currentIndex + 1}/${totalTexts}`}</Text>
        </View>
      </View>
      
      <TouchableOpacity 
        style={[styles.navButton, { opacity: currentIndex < totalTexts - 1 ? 1 : 0.5 }]} 
        onPress={onNext}
        disabled={currentIndex === totalTexts - 1}
      >
        <Ionicons name="chevron-forward" size={24} color="#007AFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  navButton: {
    padding: 10,
    backgroundColor: '#FFF',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  textContainer: {
    flex: 1,
    marginHorizontal: 10,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  text: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  counter: {
    fontSize: 12,
    color: '#666',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },
});

export default TextNavigator;