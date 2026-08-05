import React, { useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Alert

} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera'
import { SafeAreaView } from 'react-native-safe-area-context';

const API_URL = 'http://192.168.1.160:8000'

interface ImmersionCard {
  object_detected: string;
  target_language: string;
  vocabulary: string;
  example_sentence: string;
  phonetic: string;
}

export default function HomeScreen() {

  const [permission, requestPermission] = useCameraPermissions();
  const [loading, setLoading] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [result, setResult] = useState<ImmersionCard | null>(null);
  const cameraRef = useRef<CameraView>(null);

  if (!permission) {
    return <View style={styles.container}></View>
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <Text style={styles.text}>Necesitamos permiso para usar la camara</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Conceder Permisos</Text>
        </TouchableOpacity>
      </SafeAreaView>
    )
  }

  const takePicture = async () => {
    if (!cameraRef.current || loading || !isCameraReady) {
      if (!isCameraReady) {
        Alert.alert('Camara', 'Espera un segundo a que la camara termine de cargar.')
      }
      return
    }
    try {
      setLoading(true)
      setResult(null)

      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.5,
        shutterSound: false,
        skipProcessing: true,
      });

      if (!photo?.uri) {
        throw new Error('No se pudo obtener el URI de la imagen.');
      }

      const formData = new FormData();
      formData.append('target_language', 'french');
      formData.append('image', {
        uri: photo.uri,
        name: 'photo.jpg',
        type: 'image/jpeg'
      } as any)

      const response = await fetch(`${API_URL}/analyze-image`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response.ok) {
        throw new Error(`Error en el servidor: ${response.status}`);
      }

      const data: ImmersionCard = await response.json()
      setResult(data)

    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al conectar con el servidor.');
      console.error(error)
    } finally {
      setLoading(false)
    }
  }


  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Language Immersion Dorian 🌍</Text>
      <View style={styles.cameraContainer}>
        <CameraView ref={cameraRef} style={StyleSheet.absoluteFillObject} facing='back' onCameraReady={() => setIsCameraReady(true)}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[
              styles.captureButton,
              (!isCameraReady || loading) && { opacity: 0.5 }
            ]}
              onPress={takePicture}
              disabled={loading || !isCameraReady}>
              <View style={styles.innerButton}></View>
            </TouchableOpacity>
          </View>
        </CameraView>
      </View>


      {loading && <ActivityIndicator size="large" color="#38BDF8" style={{ marginTop: 20 }}></ActivityIndicator>}
      {result && !loading && (
        <View style={styles.card}>
          <Text style={styles.tag}>Detectado: {result.object_detected}</Text>
          <Text style={styles.vocab}>{result.vocabulary}</Text>
          <Text style={styles.phonetic}>/ {result.phonetic} /</Text>
          <Text style={styles.sentence}>{result.example_sentence}</Text>
        </View>
      )}

    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    padding: 16
  },
  centerContainer: {
    flex: 1,
    backgroundColor: '#0f172A',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    marginVertical: 10
  },
  text: {
    color: '#FFF',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20
  },
  cameraContainer: {
    width: '100%',
    height: 380,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#000',

  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 15
  },
  captureButton: {
    width: 65,
    height: 65,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  innerButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFF'
  },
  button: {
    backgroundColor: '#3B82F6',
    padding: 12,
    borderRadius: 8
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold'
  },
  card: {
    backgroundColor: '#1E293B',
    padding: 16,
    borderRadius: 12,
    marginTop: 15
  },
  tag: {
    color: '#38BDF8',
    fontSize: 12,
    fontWeight: 'bold'
  },
  vocab: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold'
  },
  phonetic: {
    color: '#94A3B8',
    fontStyle: 'italic',
    marginBottom: 8
  },
  sentence: {
    color: '#F1F5F9',
    fontSize: 15
  }




})