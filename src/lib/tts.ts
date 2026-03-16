import * as Speech from 'expo-speech';

let currentSpeed = 1.0;

export function speak(text: string, language: string = 'en'): void {
  Speech.stop();
  Speech.speak(text, {
    language,
    rate: currentSpeed,
    onDone: () => {},
    onError: () => {},
  });
}

export function stopSpeaking(): void {
  Speech.stop();
}

export function setSpeed(speed: number): void {
  currentSpeed = speed;
}

export function getSpeed(): number {
  return currentSpeed;
}

export async function isSpeaking(): Promise<boolean> {
  return await Speech.isSpeakingAsync();
}
