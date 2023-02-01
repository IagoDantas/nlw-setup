import './src/lib/dayjs';

import { StatusBar, Button } from 'react-native';
import * as Notifications from 'expo-notifications';
import {
  useFonts,
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold
} from '@expo-google-fonts/inter'

import { Loading } from './src/components/Loading';
import { Routes } from './src/routes';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  })
})

export default function App() {

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold
  });

  async function scheduleNotification() {
    const trigger = new Date(Date.now());
    trigger.setMinutes(trigger.getMinutes() + 1);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Olá Iago 😎',
        body: "Você praticou seus hábitos hoje?",
      },
      trigger,
    });
  }



  if (!fontsLoaded) {
    return
    {
      <Loading />
    };
  }

  return (
    <>
      <Routes />
      <StatusBar backgroundColor='transparent' barStyle="light-content" translucent />
    </>
  );
}

