import React, { useEffect, useState, useRef } from 'react';
import { Alert } from 'react-native';

import { NavigationContainer, NavigationContainerRef, ParamListBase } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { getAuth, onAuthStateChanged, signOut } from '@react-native-firebase/auth';
import { getApp } from '@react-native-firebase/app';

import Home from './src/screens/Home';
import Login from './src/screens/Login';
import Register from './src/screens/Register';
import NavBar from './src/components/NavBar';
import Contact from './src/screens/Contact';
import Information from './src/screens/information';

const Stack = createNativeStackNavigator();

const navigationRef = React.createRef<NavigationContainerRef<ParamListBase>>();

const App = () => {
  const [user, setUser] = useState<any | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const auth = getAuth(getApp());
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      setUser(currentUser);
      if (initializing) setInitializing(false);
    });
    return unsubscribe;
  }, [initializing]);

  if (initializing) return null;

  return (
    <NavigationContainer ref={navigationRef}>
      <MainNavigator user={user} />
    </NavigationContainer>
  );
};

type MainNavigatorProps = {
  user: any | null;
};

const MainNavigator = ({ user }: MainNavigatorProps) => {
  
  const handleNavigate = (screen: string) => {
    if (navigationRef.current) {
      navigationRef.current.navigate(screen as never);
    }
  };

  const handleLogout = async () => {
    try {
      const auth = getAuth(getApp());
      await signOut(auth);
      Alert.alert('Déconnexion', 'Vous avez été déconnecté.');
    } catch (e) {
      Alert.alert('Erreur', 'Impossible de se déconnecter.');
    }
  };

  return (
    <>
      <NavBar isLoggedIn={!!user} onNavigate={handleNavigate} onLogout={handleLogout} />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
  <Stack.Screen
    name="Home"
    children={({ navigation }) => (
      <Home
        isLoggedIn={!!user}
        userId={user?.uid || ''}
        onNavigate={(screen: string) => navigation.navigate(screen as never)}
      />
    )}
  />
  {!user && (
    <>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
    </>
  )}
  <Stack.Screen name="Contact" component={Contact} />
  <Stack.Screen name="Information" component={Information} />
</Stack.Navigator>


    </>
  );
};

export default App;
