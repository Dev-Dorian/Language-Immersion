import React, { useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Dimensions,
  Alert,
  StatusBar,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Picker } from '@react-native-picker/picker';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

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
  const [result, setResult] = useState(MOCK_RESULT);
  const cameraRef = useRef(null);


  if (!permission) {
    return <View style={styles.container}></View>
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>Necesitamos acceso a la camara para identificar objetos.</Text>
        <TouchableOpacity>
          <Text>Conceder Permiso</Text>
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
            <Text style={styles.pickerLabel}>Idioma objetivo Dorian</Text>
            <View style={styles.pickerContainer}>
              <Picker style={styles.picker} selectedValue={targetLanguage} onValueChange={(itemValue) => setTargetLanguage(itemValue)} dropdownIconColor="#FFF">
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

          <View>
            <Text>Este es el tercer texto{result.vocabulary}</Text>
            {result.phonetic ? (
              <Text>[{result.phonetic}]</Text>
            ) : null}
          </View>

          <ScrollView showsVerticalScrollIndicator={true}>
            <Text>10 Oraciones de Ejemplo ({result.examples?.length || 0}):</Text>

            {result.examples && result.examples.length > 0 ? (
              result.examples.map((sentence, index) => (
                <View key={index}>
                  <View>
                    <Text>{index + 1}</Text>
                  </View>
                  <Text>{sentence}</Text>
                </View>
              ))
            ) : (
              <Text>No se encontraron oraciones disponibles</Text>
            )}
            <View style={{ height: 20 }}></View>
          </ScrollView>
          <TouchableOpacity style={styles.closeButton}>
            <Text>Capturar Otra Foto</Text>
          </TouchableOpacity>

        </View>
      )

      }
    </View>
  )


}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },

  permissionContainer: {
    flex: 1,
    backgroundColor: '#1E1E2E',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  permissionText: {
    color: '#CDD6F4',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },

  permissionButton: {
    backgroundColor: '#89B4FA',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },

  permissionButtonText: {
    color: '#11111B',
    fontWeight: 'bold',
  },

  // Capa UI sobre la Cámara
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },

  pickerWrapper: {
    alignSelf: 'center',
    backgroundColor: 'rgba(30, 30, 46, 0.85)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: 'center',
    width: '85%',
  },

  pickerLabel: {
    color: '#89B4FA',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 2,
  },

  pickerContainer: {
    width: '100%',
  },
  picker: {
    color: '#FFF',
    width: '100%',
  },

  controlsContainer: {
    alignItems: 'center',
    backgroundColor: 'green'
  },

  captureButton: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 4,
    borderColor: '#FFF',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  captureButtonDisabled: {
    opacity: 0.6,
  },

  captureInnerCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFF',
  },

  cardContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT * 0.8,
    backgroundColor: '#1E1E2E',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },

  dragHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#45475A',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 12,
  },

  header: {
    alignItems: 'center',
    marginBottom: 12,
  },

  badgeText: {
    color: '#89B4FA',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
  },

  objectTitle: {
    fontSize: 20,
  },

  closeButton: {
    backgroundColor: '#89B4FA',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  }




})