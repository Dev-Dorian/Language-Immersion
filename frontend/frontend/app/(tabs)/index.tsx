import { useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert

} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera'

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
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ImmersionCard | null>(null)
  const cameraRef = useRef<any>(null)

  if (!permission) {
    return <View style={styles.container}></View>
  }

  if (!permission.granted) {
    return (
      <SafeAreaView>
        <Text>Concender Permisos</Text>
      </SafeAreaView>
    )
  }

  const takePicture = async () => {
    if (cameraRef.current && !loading) {
      try {
        setLoading(true)
        setResult(null)

        const photo = await cameraRef.current.takePictureAsync({ quality: 0.7 })

        const formData = new FormData();
        formData.append('target_language', 'french')
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
        })

        if (!response.ok) {
          throw new Error('Error al analizar la imagen')
        }

        const data: ImmersionCard = await response.json()
        setResult(data)

      } catch (error) {
        Alert.alert('Error', 'No se pudo conectar con el servidor.')
        console.log(error)
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <text style={styles.title}>Language Immersion Dorian 🌍</text>
      <View style={styles.cameraContainer}>
        <CameraView style={styles.camera} ref={cameraRef}>
          <TouchableOpacity style={styles.captureButton} onPress={takePicture} disabled={loading}>
            <View style={styles.innerButton}>VIEW</View>
          </TouchableOpacity>
        </CameraView>
      </View>


      {result && !loading && (
        <View style={styles.card}>
          <Text style={styles.tag}>Detectado: {result.object_detected}</Text>
          <Text style={styles.vocab}>{result.vocabulary}</Text>
          <Text style={styles.phonetic}>{result.phonetic}</Text>
          <Text style={styles.sentence}>{result.example_sentence}</Text>
        </View>
      )}

    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  container: {
    color: '#fff',
    flex: 1,
    backgroundColor: '#0F172A',
    padding: 16
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    marginVertical: 10
  },
  cameraContainer: {
    height: 350,
    borderRadius: 16,
    overflow: 'hidden'
  },
  camera: {
    flex: 1,
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