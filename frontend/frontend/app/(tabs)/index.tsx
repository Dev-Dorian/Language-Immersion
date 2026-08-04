import { SafeAreaView } from 'react-native-safe-area-context';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,


} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera'
import { useRef, useState } from 'react';

interface ImmersionCard {

}

export default function HomeScreen() {

  const cameraRef = useRef<any>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ImmersionCard | null>(null)

  const takePicture = async () => {
    if (cameraRef.current && !loading) {
      try {
        setLoading(true)
        setResult(null)
      } catch (error) {

      } finally {

      }
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <text style={styles.title}>Language Immersion Dorian 🌍</text>
      <View style={styles.cameraContainer}>
        <CameraView style={styles.camera} ref={cameraRef}>
          <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
            <View>VIEW</View>
          </TouchableOpacity>
        </CameraView>
      </View>


      {/*{result && !loading && (*/}
      <Text style={styles.tag}>Hola Tag</Text>
      <View style={styles.card}>
        <Text style={styles.vocab}>Hola vocab</Text>
        <Text style={styles.phonetic}>Hola phonetic</Text>
        <Text style={styles.sentence}>Hola sentence</Text>
      </View>
      {/*)}*/}

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