import { router } from 'expo-router';
import React from 'react';
import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function GetStartScreen() {
  const handleGetStart = () => {
    router.replace('/select-role');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Welcome to Carely</Text>
      <View style={styles.imageWrapper}>
        <Image
          source={require('@/assets/images/get_strt_img.png')}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
      <Text style={styles.description}>
        Easy to use with clear buttons{"\n"}and big text designed for everyone
      </Text>
      <TouchableOpacity style={styles.button} onPress={handleGetStart}>
        <Text style={styles.buttonText}>Get Start</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7DB6C6',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 24,
    textAlign: 'center',
    fontFamily: 'System',
  },
  imageWrapper: {
    width: '80%',
    maxWidth: 330,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
  },
  description: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    fontWeight: '400',
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#007a99',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 40,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});
