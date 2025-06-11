import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Pressable,
} from 'react-native';

type NavBarProps = {
  isLoggedIn: boolean;
  onNavigate: (screen: string) => void;
  onLogout?: () => void;
};

const SCREEN_WIDTH = Dimensions.get('window').width;
const DRAWER_WIDTH = SCREEN_WIDTH * 0.7;

const NavBar = ({ isLoggedIn, onNavigate, onLogout }: NavBarProps) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerAnim] = useState(new Animated.Value(-DRAWER_WIDTH));

  const toggleDrawer = () => {
    if (drawerOpen) {
      // fermer
      Animated.timing(drawerAnim, {
        toValue: -DRAWER_WIDTH,
        duration: 250,
        useNativeDriver: false,
      }).start(() => setDrawerOpen(false));
    } else {
      setDrawerOpen(true);
      Animated.timing(drawerAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: false,
      }).start();
    }
  };

  const handleNavigate = (screen: string) => {
    toggleDrawer();
    onNavigate(screen);
  };

  return (
    <>
      <View style={styles.navbar}>
        <TouchableOpacity onPress={toggleDrawer} style={styles.burgerButton}>
          <Text style={styles.burgerIcon}>☰</Text>
        </TouchableOpacity>
        <Text style={styles.title}>ToDoList</Text>
        {/* Espace vide pour équilibrer la barre */}
        <View style={{ width: 40 }} />
      </View>

      {/* Overlay semi-transparent */}
      {drawerOpen && (
        <Pressable style={styles.overlay} onPress={toggleDrawer} />
      )}

      {/* Drawer / menu latéral */}
      <Animated.View style={[styles.drawer, { left: drawerAnim }]}>
        <Text style={styles.drawerTitle}>Menu</Text>

        <TouchableOpacity onPress={() => handleNavigate('Home')} style={styles.drawerItem}>
          <Text style={styles.drawerItemText}>Accueil</Text>
        </TouchableOpacity>

        {!isLoggedIn ? (
          <>
            <TouchableOpacity onPress={() => handleNavigate('Login')} style={styles.drawerItem}>
              <Text style={styles.drawerItemText}>Connexion</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleNavigate('Register')} style={styles.drawerItem}>
              <Text style={styles.drawerItemText}>Inscription</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity onPress={() => handleNavigate('Information')} style={styles.drawerItem}>
              <Text style={styles.drawerItemText}>Information</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleNavigate('Contact')} style={styles.drawerItem}>
              <Text style={styles.drawerItemText}>Contact</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                toggleDrawer();
                onLogout && onLogout();
              }}
              style={styles.drawerItem}
            >
              <Text style={[styles.drawerItemText, styles.logoutText]}>Déconnexion</Text>
            </TouchableOpacity>
          </>
        )}
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  navbar: {
    height: 60,
    backgroundColor: '#007BFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  burgerButton: {
    padding: 8,
  },
  burgerIcon: {
    fontSize: 28,
    color: 'white',
  },
  title: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  drawer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    backgroundColor: 'white',
    paddingTop: 60,
    paddingHorizontal: 20,
    zIndex: 2000,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 2, height: 0 },
    shadowRadius: 6,
  },
  drawerTitle: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  drawerItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  drawerItemText: {
    fontSize: 18,
    color: '#007BFF',
  },
  logoutText: {
    fontWeight: 'bold',
    color: '#cc0000',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 1500,
  },
});

export default NavBar;
