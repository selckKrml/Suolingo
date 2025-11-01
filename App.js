import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Video, Audio } from 'expo-av';
import axios from 'axios';
import { D_ID_API_KEY, ELEVENLABS_API_KEY } from '@env';
import { encode as btoa } from 'base-64';
import { Ionicons } from '@expo/vector-icons';

import AvatarVideoPlayer from './components/AvatarVideoPlayer';

// Predefined sentences and video mapping
const SENTENCES = [
  "My name is Ahmet, and I am a student at a big university in the city.",
  "She has two black cats and one small dog that likes to play in the garden.",
  "Yesterday evening, I went to the supermarket to buy some milk, bread, and eggs for breakfast.",
  "I am learning English because I want to travel to a different country next year with my family.",
  "If you don't finish your homework on time, you probably won't be allowed to go out with your friends this weekend.",
  "I have never been to Japan, but I have always wanted to see the beautiful cherry blossoms in Tokyo.",
  "Although the company invested a significant amount of money in the new project, it failed to meet the expectations of the stakeholders.",
  "The government's new fiscal policy, which was implemented to curb inflation, has unfortunately had several unforeseen consequences for small businesses."
];

// Local video files mapped to sentences (must be static requires for Metro bundler)
const VIDEO_FILES = [
  require('./assets/videos/video1.mp4'),
  require('./assets/videos/video2.mp4'),
  require('./assets/videos/video3.mp4'),
  require('./assets/videos/video4.mp4'),
  require('./assets/videos/video5.mp4'),
  require('./assets/videos/video6.mp4'),
  require('./assets/videos/video7.mp4'),
  require('./assets/videos/video8.mp4'),
];

const AVATAR_IMAGE_URL = 'https://create-images-results.d-id.com/api_docs/assets/noelle.jpeg';
const D_ID_API_BASE_URL = 'https://api.d-id.com';

export default function App() {
  // States from existing implementation
  const [text, setText] = useState('');
  const [analysisText, setAnalysisText] = useState('');
  const [videoSource, setVideoSource] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState(null);

  // New states for sentence navigation and idle mode
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [isIdleMode, setIsIdleMode] = useState(true);
  
  // Analysis result state
  const [analysisResult, setAnalysisResult] = useState(null);

  const videoRef = useRef(null);

  const getAuthHeader = () => {
    if (!D_ID_API_KEY) return null;
    if (D_ID_API_KEY.startsWith('Basic ')) return D_ID_API_KEY;
    return 'Basic ' + btoa(D_ID_API_KEY);
  };

  // Metin analizi algoritması
  const analyzeText = (referenceText, userText) => {
    // Metinleri küçük harfe çevir ve normalize et
    const normalizeText = (txt) => {
      return txt.toLowerCase()
        .replace(/[.,!?;:]/g, '') // Noktalama işaretlerini kaldır
        .replace(/\s+/g, ' ') // Çoklu boşlukları tek boşluğa indir
        .trim();
    };

    const refNormalized = normalizeText(referenceText);
    const userNormalized = normalizeText(userText);

    const refWords = refNormalized.split(' ');
    const userWords = userNormalized.split(' ');

    // 1. Kelime Eşleşme Skoru (40%)
    const refWordSet = new Set(refWords);
    const userWordSet = new Set(userWords);
    
    let matchedWords = 0;
    userWordSet.forEach(word => {
      if (refWordSet.has(word)) matchedWords++;
    });
    
    const wordMatchScore = refWords.length > 0 ? (matchedWords / refWords.length) * 100 : 0;

    // 2. Kelime Sırası Benzerliği (30%)
    let sequenceMatches = 0;
    const minLength = Math.min(refWords.length, userWords.length);
    
    for (let i = 0; i < minLength; i++) {
      if (refWords[i] === userWords[i]) {
        sequenceMatches++;
      }
    }
    
    const sequenceScore = refWords.length > 0 ? (sequenceMatches / refWords.length) * 100 : 0;

    // 3. Uzunluk Benzerliği (30%)
    const lengthDiff = Math.abs(refWords.length - userWords.length);
    const maxLength = Math.max(refWords.length, userWords.length);
    const lengthScore = maxLength > 0 ? ((maxLength - lengthDiff) / maxLength) * 100 : 0;

    // Toplam Skor
    const totalScore = (wordMatchScore * 0.4) + (sequenceScore * 0.3) + (lengthScore * 0.3);

    // Detaylı geri bildirim
    const feedback = {
      totalScore: Math.round(totalScore),
      wordMatchScore: Math.round(wordMatchScore),
      sequenceScore: Math.round(sequenceScore),
      lengthScore: Math.round(lengthScore),
      matchedWordsCount: matchedWords,
      totalRefWords: refWords.length,
      userWordsCount: userWords.length,
      missedWords: [...refWordSet].filter(word => !userWordSet.has(word)),
      extraWords: [...userWordSet].filter(word => !refWordSet.has(word))
    };

    return feedback;
  };

  const createTalk = async () => {
    if (!analysisText.trim()) {
      Alert.alert('Uyarı', 'Lütfen analiz için bir metin girin!');
      return;
    }

    setLoading(true);
    setStatusMessage('Metin analiz ediliyor...');

    try {
      // Referans metni al (şu anki gösterilen cümle)
      const referenceText = SENTENCES[currentSentenceIndex];
      
      // Analiz yap
      const result = analyzeText(referenceText, analysisText);
      
      // Sonucu kaydet
      setAnalysisResult(result);
      
      // Kullanıcıya sonucu göster
      const scoreEmoji = result.totalScore >= 80 ? '🎉' : result.totalScore >= 60 ? '👍' : result.totalScore >= 40 ? '😊' : '💪';
      
      Alert.alert(
        `${scoreEmoji} Analiz Tamamlandı!`,
        `Skorunuz: %${result.totalScore}\n\n` +
        `✓ Kelime Eşleşmesi: %${result.wordMatchScore}\n` +
        `✓ Sıralama: %${result.sequenceScore}\n` +
        `✓ Uzunluk: %${result.lengthScore}\n\n` +
        `${result.matchedWordsCount}/${result.totalRefWords} kelime doğru`,
        [{ text: 'Tamam' }]
      );

    } catch (err) {
      console.error('Analysis Error', err);
      Alert.alert('Hata', 'Analiz sırasında bir hata oluştu.');
    } finally {
      setLoading(false);
      setStatusMessage('');
    }
  };

  const pollTalkStatus = async (id) => {
    return;
  };

  const transcribeAudio = async (uri) => {
    if (!ELEVENLABS_API_KEY) {
      Alert.alert('API Key Eksik', 'ElevenLabs API key .env dosyasına eklenmemiş.');
      return;
    }

    try {
      setStatusMessage('Ses gönderiliyor, yazıya çevriliyor...');
      const form = new FormData();
      form.append('model_id', 'scribe_v1');
      form.append('file', { uri, name: 'audio.m4a', type: 'audio/m4a' });

      const resp = await axios.post('https://api.elevenlabs.io/v1/speech-to-text', form, {
        headers: { 'xi-api-key': ELEVENLABS_API_KEY, 'Content-Type': 'multipart/form-data' },
      });

      const recognized = resp.data?.text || '';
      if (recognized) {
        // İkinci text field'a yaz (analysisText)
        setAnalysisText(recognized);
        // Önceki analiz sonucunu temizle
        setAnalysisResult(null);
      } else {
        Alert.alert('Dönüştürme Hatası', 'Ses metne çevrilemedi.');
      }
    } catch (err) {
      console.error('Transcribe Error', err.response?.data || err.message);
      Alert.alert('Hata', 'Ses metne çevrilirken hata oluştu.');
    } finally {
      setStatusMessage('');
    }
  };

  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== 'granted') {
        Alert.alert('İzin Gerekli', 'Mikrofon izni gerekli.');
        return;
      }
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
      const rec = new Audio.Recording();
      await rec.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      await rec.startAsync();
      setRecording(rec);
      setIsRecording(true);
      setStatusMessage('Dinleniyor...');
    } catch (err) {
      console.error('startRecording', err);
      Alert.alert('Hata', 'Kayıt başlatılamadı.');
    }
  };

  const stopRecording = async () => {
    try {
      if (!recording) return;
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setIsRecording(false);
      setRecording(null);
      if (uri) await transcribeAudio(uri);
    } catch (err) {
      console.error('stopRecording', err);
      Alert.alert('Hata', 'Kayıt durdurulurken hata oluştu.');
    } finally {
      setStatusMessage('');
    }
  };

  const handleMicPress = () => {
    if (isRecording) stopRecording();
    else startRecording();
  };

  const handleVideoEnd = () => {
    setVideoSource(null);
    setIsIdleMode(true);
  };

  const speakMappedText = (inputText) => {
    let idx = SENTENCES.findIndex(s => s === inputText);
    if (idx === -1) idx = currentSentenceIndex;
    if (idx >= 0 && idx < VIDEO_FILES.length) {
      const src = VIDEO_FILES[idx];
      if (src) {
        setVideoSource(src);
        setIsIdleMode(false);
      } else {
        console.warn('Mapped video not found for index', idx);
        Alert.alert('Hata', 'Eşleşen video bulunamadı.');
      }
    } else {
      setVideoSource(require('./assets/videos/idle.mp4'));
      setIsIdleMode(true);
    }
  };

  const handlePrevious = () => {
    if (currentSentenceIndex > 0) {
      const newIndex = currentSentenceIndex - 1;
      setCurrentSentenceIndex(newIndex);
      setText(SENTENCES[newIndex]);
      setAnalysisText('');
      setAnalysisResult(null);
    }
  };

  const handleNext = () => {
    if (currentSentenceIndex < SENTENCES.length - 1) {
      const newIndex = currentSentenceIndex + 1;
      setCurrentSentenceIndex(newIndex);
      setText(SENTENCES[newIndex]);
      setAnalysisText('');
      setAnalysisResult(null);
    }
  };

  // Skor rengini belirle
  const getScoreColor = (score) => {
    if (score >= 80) return '#34C759'; // Yeşil
    if (score >= 60) return '#FF9500'; // Turuncu
    if (score >= 40) return '#FF9500'; // Turuncu
    return '#FF3B30'; // Kırmızı
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>🤖 SUOLINGO</Text>

        <AvatarVideoPlayer
          videoUri={videoSource ? videoSource : require('./assets/videos/idle.mp4')}
          isIdle={isIdleMode}
          onPlaybackStatusUpdate={status => {
            if (status?.didJustFinish) handleVideoEnd();
          }}
        />

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.statusText}>{statusMessage}</Text>
          </View>
        )}

        {/* Navigation Section with Text Display */}
        <View style={styles.navigationSection}>
          <View style={styles.textDisplayRow}>
            <TouchableOpacity 
              style={[styles.navButton, currentSentenceIndex === 0 && styles.navButtonDisabled]} 
              onPress={handlePrevious}
              disabled={currentSentenceIndex === 0}
            >
              <Ionicons name="chevron-back" size={28} color={currentSentenceIndex === 0 ? "#CCC" : "#007AFF"} />
            </TouchableOpacity>

            <ScrollView 
              style={styles.textDisplayContainer}
              contentContainerStyle={styles.textDisplayContent}
              showsVerticalScrollIndicator={true}
              nestedScrollEnabled={true}
              persistentScrollbar={true}
            >
              <Text style={styles.displayedText}>
                {SENTENCES[currentSentenceIndex]}
              </Text>
              <View style={styles.indexContainer}>
                <Text style={styles.indexText}>
                  {currentSentenceIndex + 1} / {SENTENCES.length}
                </Text>
              </View>
            </ScrollView>

            <TouchableOpacity 
              style={[styles.navButton, currentSentenceIndex === SENTENCES.length - 1 && styles.navButtonDisabled]} 
              onPress={handleNext}
              disabled={currentSentenceIndex === SENTENCES.length - 1}
            >
              <Ionicons name="chevron-forward" size={28} color={currentSentenceIndex === SENTENCES.length - 1 ? "#CCC" : "#007AFF"} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={[styles.speakButton, loading && styles.buttonDisabled]} 
            onPress={() => speakMappedText(text)} 
            disabled={loading || !text.trim()}
          >
            <Ionicons name="volume-high" size={22} color="#FFF" style={styles.buttonIcon} />
            <Text style={styles.speakButtonText}>Konuştur</Text>
          </TouchableOpacity>
        </View>

        {statusMessage ? <Text style={styles.smallStatus}>{statusMessage}</Text> : null}

        {/* Analysis Input Section */}
        <View style={styles.analysisSection}>
          <View style={styles.inputWithMicContainer}>
            <TextInput
              style={styles.analysisInput}
              placeholder="Analiz edilecek metni buraya yazın..."
              value={analysisText}
              onChangeText={(text) => {
                setAnalysisText(text);
                setAnalysisResult(null); // Metin değiştiğinde sonucu temizle
              }}
              multiline
              editable={!loading}
              placeholderTextColor="#999"
            />
            <TouchableOpacity 
              style={[styles.micButton, isRecording && styles.micButtonRecording]} 
              onPress={handleMicPress}
              disabled={loading}
            >
              <Ionicons 
                name={isRecording ? "stop-circle" : "mic"} 
                size={28} 
                color={isRecording ? "#FF3B30" : "#007AFF"} 
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={[styles.analyzeButton, loading && styles.buttonDisabled]} 
            onPress={createTalk} 
            disabled={loading || !analysisText.trim()}
          >
            <Ionicons name="analytics" size={22} color="#FFF" style={styles.buttonIcon} />
            <Text style={styles.analyzeButtonText}>{loading ? 'Analiz Ediliyor...' : 'Analiz Et'}</Text>
          </TouchableOpacity>

          {/* Analiz Sonucu Gösterimi */}
          {analysisResult && (
            <View style={styles.resultContainer}>
              <View style={styles.resultHeader}>
                <Ionicons name="checkmark-circle" size={24} color={getScoreColor(analysisResult.totalScore)} />
                <Text style={styles.resultTitle}>Analiz Sonucu</Text>
              </View>
              
              <View style={[styles.scoreCircle, { borderColor: getScoreColor(analysisResult.totalScore) }]}>
                <Text style={[styles.scoreText, { color: getScoreColor(analysisResult.totalScore) }]}>
                  %{analysisResult.totalScore}
                </Text>
              </View>

              <View style={styles.detailsContainer}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Kelime Eşleşmesi:</Text>
                  <Text style={styles.detailValue}>%{analysisResult.wordMatchScore}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Sıralama:</Text>
                  <Text style={styles.detailValue}>%{analysisResult.sequenceScore}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Uzunluk:</Text>
                  <Text style={styles.detailValue}>%{analysisResult.lengthScore}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Doğru Kelimeler:</Text>
                  <Text style={styles.detailValue}>
                    {analysisResult.matchedWordsCount}/{analysisResult.totalRefWords}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>

        {(!D_ID_API_KEY || D_ID_API_KEY === 'YOUR_API_KEY_HERE' || !ELEVENLABS_API_KEY || ELEVENLABS_API_KEY === 'your_elevenlabs_key_here') && (
          <View style={styles.warningContainer}>
            <Ionicons name="warning" size={16} color="#856404" style={styles.warningIcon} />
            <Text style={styles.warningText}>.env dosyasına API key'leri eklemeyi unutmayın!</Text>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F8F9FA' 
  },
  scrollContent: { 
    flexGrow: 1, 
    alignItems: 'center', 
    paddingVertical: 40, 
    paddingHorizontal: 20 
  },
  title: { 
    fontSize: 34, 
    fontWeight: '800', 
    color: '#1A1A1A', 
    marginBottom: 25,
    letterSpacing: 0.5
  },
  loadingContainer: { 
    alignItems: 'center', 
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#FFF',
    borderRadius: 12,
    width: '100%'
  },
  statusText: { 
    marginTop: 10, 
    fontSize: 14, 
    color: '#007AFF', 
    fontWeight: '600' 
  },
  
  // Navigation Section (Top section with arrows and text)
  navigationSection: {
    width: '100%',
    marginBottom: 25,
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3
  },
  textDisplayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  navButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F0F7FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#007AFF'
  },
  navButtonDisabled: {
    backgroundColor: '#F5F5F5',
    borderColor: '#E5E5E5'
  },
  textDisplayContainer: {
    flex: 1,
    marginHorizontal: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    minHeight: 140,
    maxHeight: 200,
    borderWidth: 1,
    borderColor: '#E5E5E5'
  },
  textDisplayContent: {
    padding: 18,
    flexGrow: 1
  },
  displayedText: {
    fontSize: 17,
    color: '#1A1A1A',
    lineHeight: 26,
    marginBottom: 10
  },
  indexContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5'
  },
  indexText: {
    fontSize: 12,
    color: '#999',
    fontWeight: '600',
    textAlign: 'right'
  },
  speakButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4
  },
  speakButtonText: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '700'
  },
  
  // Analysis Section (Bottom section)
  analysisSection: {
    width: '100%',
    marginBottom: 20,
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3
  },
  inputWithMicContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16
  },
  analysisInput: {
    flex: 1,
    minHeight: 120,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: '#1A1A1A',
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#E5E5E5'
  },
  micButton: { 
    marginLeft: 12,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F0F7FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#007AFF'
  },
  micButtonRecording: {
    backgroundColor: '#FFE5E5',
    borderColor: '#FF3B30'
  },
  analyzeButton: {
    backgroundColor: '#34C759',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#34C759',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4
  },
  analyzeButtonText: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '700'
  },
  
  // Result Display Styles
  resultContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5'
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginLeft: 8
  },
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 8,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    backgroundColor: '#FFF'
  },
  scoreText: {
    fontSize: 36,
    fontWeight: '800'
  },
  detailsContainer: {
    gap: 12
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#FFF',
    borderRadius: 8
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500'
  },
  detailValue: {
    fontSize: 16,
    color: '#1A1A1A',
    fontWeight: '700'
  },
  
  smallStatus: { 
    color: '#007AFF', 
    marginBottom: 12,
    fontSize: 13,
    fontWeight: '500'
  },
  
  buttonDisabled: { 
    backgroundColor: '#B0B0B0',
    shadowOpacity: 0.1
  },
  buttonIcon: {
    marginRight: 8
  },
  
  warningContainer: { 
    marginTop: 15,
    padding: 16,
    backgroundColor: '#FFF9E6',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFE69C',
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2
  },
  warningIcon: {
    marginRight: 10
  },
  warningText: { 
    color: '#856404',
    fontSize: 13,
    flex: 1,
    fontWeight: '500'
  },
})