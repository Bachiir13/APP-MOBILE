import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

const Information = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Tutoriel d'utilisation</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. Ajouter une tâche</Text>
        <Text style={styles.text}>
          Pour créer une tâche, saisissez un titre dans le champ "Titre". Vous pouvez aussi ajouter une description optionnelle et une date limite au format JJ-MM-AAAA.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>2. Modifier ou supprimer une tâche</Text>
        <Text style={styles.text}>
          Pour modifier une tâche, restez appuyé(e) sur son titre dans la liste. Vous pourrez alors changer le titre et la description. Pour supprimer une tâche, utilisez l'icône 🗑️ à côté de la tâche.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>3. Marquer une tâche comme terminée</Text>
        <Text style={styles.text}>
          Appuyez simplement sur le titre d'une tâche pour la marquer comme complétée ou non.
        </Text>
      </View>

      <View style={styles.separator} />

      <Text style={styles.header}>Présentation de l'entreprise</Text>

      <View style={styles.section}>
        <Text style={styles.text}>
          Bienvenue chez ToDoMaster, votre solution de gestion de tâches simple, intuitive et efficace. Nous sommes dédiés à vous aider à organiser votre quotidien et booster votre productivité.
        </Text>
        <Text style={styles.text}>
          Notre équipe passionnée travaille constamment à améliorer votre expérience utilisateur avec des fonctionnalités adaptées à vos besoins.
        </Text>
        <Text style={styles.text}>
          Merci de nous faire confiance !
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fdfdfd',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#007BFF',
    textAlign: 'center',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
    color: '#555',
  },
  separator: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 30,
  },
});

export default Information;
