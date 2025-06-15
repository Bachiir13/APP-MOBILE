// Home.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Formik } from 'formik';
import * as Yup from 'yup';

interface TodoItem {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
  dueDate?: string;
}

const convertToISODate = (input: string): string | null => {
  const parts = input.split('-');
  if (parts.length === 3) {
    const [day, month, year] = parts;
    const date = new Date(`${year}-${month}-${day}`);
    return isNaN(date.getTime()) ? null : date.toISOString();
  }
  return null;
};

const Home = ({ isLoggedIn, userId, onNavigate }: any) => {
  const [todos, setTodos] = useState<TodoItem[]>([]);

  const saveTodos = async (newTodos: TodoItem[]) => {
    try {
      await AsyncStorage.setItem(`@todos_${userId}`, JSON.stringify(newTodos));
    } catch (e) {
      Alert.alert('Erreur', 'Impossible de sauvegarder les tâches.');
    }
  };

  const loadTodos = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(`@todos_${userId}`);
      if (jsonValue) {
        setTodos(JSON.parse(jsonValue));
      }
    } catch (e) {
      Alert.alert('Erreur', 'Impossible de charger les tâches.');
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ajouter une tâche</Text>
      <Formik
        initialValues={{ title: '', description: '', dueDate: '' }}
        validationSchema={Yup.object({
          title: Yup.string().required('Titre requis').max(100),
          description: Yup.string().max(300),
          dueDate: Yup.string()
            .matches(/^\d{2}-\d{2}-\d{4}$/, 'Format JJ-MM-AAAA')
            .nullable(),
        })}
        onSubmit={(values, { resetForm }) => {
          const isoDueDateRaw = values.dueDate ? convertToISODate(values.dueDate) : undefined;
          const isoDueDate = isoDueDateRaw === null ? undefined : isoDueDateRaw;
          if (values.dueDate && !isoDueDate) {
            Alert.alert('Erreur', 'Date limite invalide.');
            return;
          }
          const newTodo: TodoItem = {
            id: Date.now().toString(),
            title: values.title.trim(),
            description: values.description.trim(),
            completed: false,
            createdAt: new Date().toISOString(),
            dueDate: isoDueDate,
          };
          const updatedTodos = [newTodo, ...todos];
          setTodos(updatedTodos);
          saveTodos(updatedTodos);
          resetForm();
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <>
            <TextInput
              style={styles.input}
              placeholder="Titre"
              onChangeText={handleChange('title')}
              onBlur={handleBlur('title')}
              value={values.title}
            />
            {touched.title && errors.title && <Text style={styles.error}>{errors.title}</Text>}

            <TextInput
              style={styles.input}
              placeholder="Description"
              onChangeText={handleChange('description')}
              onBlur={handleBlur('description')}
              value={values.description}
            />
            {touched.description && errors.description && <Text style={styles.error}>{errors.description}</Text>}

            <TextInput
              style={styles.input}
              placeholder="Date limite (JJ-MM-AAAA)"
              onChangeText={handleChange('dueDate')}
              onBlur={handleBlur('dueDate')}
              value={values.dueDate}
            />
            {touched.dueDate && errors.dueDate && <Text style={styles.error}>{errors.dueDate}</Text>}

            <Button title="Ajouter" onPress={handleSubmit as any} />
          </>
        )}
      </Formik>

      <Text style={styles.title}>Mes tâches</Text>
      <FlatList
        data={todos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.todoItem}>
            <Text style={styles.todoTitle}>{item.title}</Text>
            {item.description ? <Text>{item.description}</Text> : null}
            {item.dueDate ? <Text>Date limite: {new Date(item.dueDate).toLocaleDateString()}</Text> : null}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginVertical: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 5, borderRadius: 5 },
  error: { color: 'red', marginBottom: 5 },
  todoItem: { backgroundColor: '#f9f9f9', padding: 10, marginVertical: 5, borderRadius: 5 },
  todoTitle: { fontWeight: 'bold' },
});

export default Home;
