import React from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, ActivityIndicator, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SpeechInput = ({ text, onChangeText, isRecording, onMicPress, onSpeakPress, speakLoading = false, editable = true, placeholder }) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#999"
        value={text}
        onChangeText={onChangeText}
        multiline
        editable={editable}
      />

      <View style={styles.rightButtons}>
        <TouchableOpacity style={[styles.speakButton, speakLoading && styles.speakButtonDisabled]} onPress={() => onSpeakPress && onSpeakPress()} disabled={speakLoading}>
          {speakLoading ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <>
              <Ionicons name="volume-high" size={20} color="#FFF" />
              <Text style={styles.speakText}>Konuştur</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.micButton} onPress={onMicPress}>
          {isRecording ? (
            <ActivityIndicator size="small" color="red" />
          ) : (
            <Ionicons name="mic" size={24} color="#007AFF" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    minHeight: 100,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    color: '#333',
    textAlignVertical: 'top',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  micButton: {
    marginLeft: 10,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  rightButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  speakButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginRight: 8,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  speakButtonDisabled: {
    backgroundColor: '#B0B0B0',
    shadowOpacity: 0.1,
  },
  speakText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
});

export default SpeechInput;