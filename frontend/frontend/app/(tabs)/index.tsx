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
          <View>
            <View>
              <Text>{result.target_language.toUpperCase()}</Text>
              <Text>{result.object_detected}</Text>
            </View>

            <View>
              <Text>Este es el tercer texto{result.vocabulary}</Text>
              {result.phonetic ? (
                <Text>[{result.phonetic}]</Text>
              ) : null}
            </View>

            <ScrollView>
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
  },

  closeButton: {
    backgroundColor: '#89B4FA',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  }




})