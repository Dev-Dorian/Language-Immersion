import React, { useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
  StatusBar,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Picker } from '@react-native-picker/picker';
import { styles } from './styles'



const API_URL = 'http://192.168.1.160:8000/analyze-image';



export default function HomeScreen() {
  const MOCK_RESULT = {
    object_detected: "Gafas de sol (Prueba UI)",
    target_language: "french",
    vocabulary: "les lunettes de soleil",
    phonetic: "lay loo-net duh soh-lay",
    examples: [
      "1. J'ai besoin de mes lunettes para leer este libro.",
      "2. Où ai-je mis mes lunettes de soleil ?",
      "3. Les lunettes sont sur la table du salon.",
      "4. Il porte des lunettes depuis l'âge de dix ans.",
      "5. Mes lunettes sont très propres aujourd'hui.",
      "6. As-tu vu mes nouvelles lunettes ?",
      "7. Elle a acheté des lunettes très élégantes.",
      "8. N'oublie pas tes lunettes avant de sortir.",
      "9. Ces lunettes me protègent bien de la lumière.",
      "10. Je dois changer les verres de mes lunettes."
    ]
  };

  const [permission, requestPermission] = useCameraPermissions();
  const [targetLanguage, setTargetLanguage] = useState('spanish');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const cameraRef = useRef(null);


  if (!permission) {
    return <View style={styles.container}></View>
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>Necesitamos acceso a la camara para identificar objetos.</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Conceder Permiso</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const takePictureAndAnalyze = async () => {
    if (!cameraRef.current || loading) return;

    try {
      setLoading(true)
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.7,
        base64: false,
      });

      const formData = new FormData();
      formData.append('target_language', targetLanguage);
      formData.append('image', {
        uri: photo.uri,
        name: 'photo.jpg',
        type: 'image/jpeg',
      });

      const response = await fetch(API_URL, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response.ok) {
        throw new Error(`Error en el servidor: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);

    } catch (error) {
      console.error('Error al analizar la imagen:', error);
      Alert.alert(
        'Error de conexión',
        'No se pudo procesar la imagen. Verifica la conexión con el servidor FastAPI.'
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content"></StatusBar>
      <CameraView style={StyleSheet.absoluteFillObject} facing='back' ref={cameraRef}></CameraView>
      {!result && (
        <View style={styles.overlayContainer}>
          <View style={styles.pickerWrapper}>
            <Text style={styles.pickerLabel}>Language</Text>
            <View style={styles.pickerContainer}>
              <Picker style={styles.picker} selectedValue={targetLanguage} onValueChange={(itemValue) => setTargetLanguage(itemValue)} dropdownIconColor="#FFF">
                <Picker.Item label="🇪🇸 Spanish" value="spanish" />
                <Picker.Item label="🇫🇷 Francés" value="french" />
                <Picker.Item label="🇬🇧 Inglés" value="english" />
                <Picker.Item label="🇩🇪 Alemán" value="german" />
                <Picker.Item label="🇮🇹 Italiano" value="italian" />
                <Picker.Item label="🇵🇹 Portugués" value="portuguese" />
              </Picker>
            </View>
          </View>

          <View style={styles.controlsContainer}>
            <TouchableOpacity style={[styles.captureButton, loading && styles.captureButtonDisabled]} onPress={takePictureAndAnalyze} disabled={loading}>
              {loading ? (
                <ActivityIndicator size="large" color="#1E1E2E"></ActivityIndicator>
              ) : (
                <View style={styles.captureInnerCircle}></View>
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}

      {result && (
        <View style={styles.cardContainer}>

          <View style={styles.dragHandle}></View>
          <View style={styles.header}>
            <Text style={styles.badgeText}>{result.target_language.toUpperCase()}</Text>
            <Text style={styles.objectTitle}>{result.object_detected}</Text>
          </View>

          <View style={styles.vocabularyCard}>
            <Text style={styles.vocabularyText}>{result.vocabulary}</Text>
          </View>

          <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={true}>
            <Text style={styles.sectionTitle}>3 Oraciones de Ejemplo ({result.examples?.length || 0}):</Text>

            {result.examples && result.examples.length > 0 ? (
              result.examples.map((sentence, index) => (
                <View key={index} style={styles.sentenceCard}>
                  <View style={styles.sentenceBadge}>
                    <Text style={styles.sentenceBadgeNumber}>{index + 1}</Text>
                  </View>
                  <Text style={styles.sentenceText}>{sentence}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.noExamplesText}>No se encontraron oraciones disponibles.</Text>
            )}
            <View style={{ height: 20 }}></View>
          </ScrollView>
          <TouchableOpacity style={styles.closeButton} onPress={() => setResult(null)}>
            <Text style={styles.closeButtonText}>Capturar Otra Foto</Text>
          </TouchableOpacity>

        </View>
      )

      }
    </View>
  )


}

