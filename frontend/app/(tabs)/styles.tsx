import {
  StyleSheet,
  Dimensions,
} from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export const styles = StyleSheet.create({
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
    fontWeight: '800',
    color: '#CDD6F4',
    marginTop: 2,
    textTransform: 'capitalize',
  },

  vocabularyCard: {
    backgroundColor: '#313244',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#45475A',
  },

  vocabularyText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#A6E3A1',
  },

  scrollArea: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 10,
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#CDB4DB',
    marginBottom: 12,
  },

  sentenceCard: {
    flexDirection: 'row',
    backgroundColor: '#181825',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    alignItems: 'center',
    borderLeftWidth: 3,
    borderLeftColor: '#89B4FA',
  },

  sentenceBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#313244',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  sentenceBadgeNumber: {
    color: '#89B4FA',
    fontWeight: 'bold',
    fontSize: 12,
  },

  sentenceText: {
    flex: 1,
    fontSize: 14,
    color: '#CDD6F4',
    lineHeight: 20,
  },

  noExamplesText: {
    color: '#A6ADC8',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 20,
  },

  closeButton: {
    backgroundColor: '#89B4FA',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },

  closeButtonText: {
    color: '#11111B',
    fontSize: 16,
    fontWeight: '700',
  }

})