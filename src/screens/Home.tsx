import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, Button, FlatList, StyleSheet,
  KeyboardAvoidingView, Platform, TouchableOpacity, Alert
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

interface TodoItem {
  id: string;
  title: string;
  description: string;
  completed?: boolean;
  createdAt: string;
  dueDate?: string;
}

type HomeProps = {
  isLoggedIn: boolean;
  userId: string;
  onNavigate: (screen: string) => void;
};

const Home = ({ isLoggedIn, userId, onNavigate }: HomeProps) => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [editingDescription, setEditingDescription] = useState('');

  const STORAGE_KEY = `@todos_${userId}`;

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
        if (jsonValue != null) {
          setTodos(JSON.parse(jsonValue));
        }
      } catch (e) {
        console.error('Erreur chargement todos:', e);
      }
    };
    loadTodos();
  }, [userId]);

  const saveTodos = async (newTodos: TodoItem[]) => {
    try {
      const jsonValue = JSON.stringify(newTodos);
      await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
    } catch (e) {
      console.error('Erreur sauvegarde todos:', e);
    }
  };

  const convertToISODate = (dateStr: string): string | null => {
    const parts = dateStr.split('-');
    if (parts.length !== 3) return null;
    const [day, month, year] = parts;
    if (
      day.length !== 2 || month.length !== 2 || year.length !== 4 ||
      Number(day) < 1 || Number(day) > 31 ||
      Number(month) < 1 || Number(month) > 12
    ) return null;

    return `${year}-${month}-${day}`;
  };

  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const addTodo = () => {
    if (!title.trim()) return;

    const isoDueDate = dueDate ? convertToISODate(dueDate) : undefined;
    if (dueDate && !isoDueDate) {
      Alert.alert('Erreur', 'La date limite doit être au format JJ-MM-AAAA');
      return;
    }

    const newTodo: TodoItem = {
      id: Date.now().toString(),
      title: title.trim(),
      description: description.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
      dueDate: isoDueDate || undefined,
    };

    const newTodos = [newTodo, ...todos];
    setTodos(newTodos);
    saveTodos(newTodos);

    setTitle('');
    setDescription('');
    setDueDate('');
  };

  const toggleComplete = (id: string) => {
    if (editingId === id) return;
    const newTodos = todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(newTodos);
    saveTodos(newTodos);
  };

  const deleteTodo = (id: string) => {
    const newTodos = todos.filter(todo => todo.id !== id);
    setTodos(newTodos);
    saveTodos(newTodos);
  };

  const startEdit = (id: string, currentTitle: string, currentDescription: string) => {
    setEditingId(id);
    setEditingTitle(currentTitle);
    setEditingDescription(currentDescription);
  };

  const saveEdit = () => {
    if (!editingTitle.trim()) return;
    const newTodos = todos.map(todo =>
      todo.id === editingId
        ? { ...todo, title: editingTitle.trim(), description: editingDescription.trim() }
        : todo
    );
    setTodos(newTodos);
    saveTodos(newTodos);
    setEditingId(null);
    setEditingTitle('');
    setEditingDescription('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingTitle('');
    setEditingDescription('');
  };

  const sortedTodos = [...todos].sort((a, b) => {
    const dateA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
    const dateB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
    return dateA - dateB;
  });

  const renderItem = ({ item }: { item: TodoItem }) => (
    <View
      style={[styles.todoItem, item.completed && styles.todoCompleted, styles.todoRow]}
    >
      {editingId === item.id ? (
        <View style={styles.editContainer}>
          <TextInput
            style={[styles.input, styles.editInput]}
            value={editingTitle}
            onChangeText={setEditingTitle}
            placeholder="Titre"
          />
          <TextInput
            style={[styles.input, styles.editInput]}
            value={editingDescription}
            onChangeText={setEditingDescription}
            placeholder="Description"
          />
          <Button title="OK" onPress={saveEdit} />
          <Button title="Annuler" onPress={cancelEdit} color="#888" />
        </View>
      ) : (
        <>
          <TouchableOpacity
            style={styles.todoContent}
            onPress={() => toggleComplete(item.id)}
            onLongPress={() => startEdit(item.id, item.title, item.description)}
            activeOpacity={0.8}
          >
            <Text style={[styles.todoText, item.completed && styles.todoTextCompleted]}>
              {item.title}
            </Text>
            {item.description ? (
              <Text style={styles.todoDescription}>{item.description}</Text>
            ) : null}
            <Text style={styles.todoDate}>Créé le : {formatDate(item.createdAt)}</Text>
            {item.dueDate && (
              <Text style={styles.todoDate}>Échéance : {formatDate(item.dueDate)}</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => deleteTodo(item.id)} style={styles.deleteButton}>
            <Text style={styles.deleteText}>🗑️</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );

  if (!isLoggedIn) {
    return (
      <View style={[styles.container, styles.center, { padding: 30 }]}>
        <View style={styles.welcomeBox}>
          <Text style={styles.welcomeEmoji}>📝</Text>
          <Text style={styles.bannerText}>Bienvenue sur ToDoList</Text>
          <Text style={styles.welcomeSubtitle}>
            Organisez vos tâches facilement et boostez votre productivité !
          </Text>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => onNavigate('Login')}
            activeOpacity={0.7}
          >
            <Text style={styles.loginButtonText}>Se connecter</Text>
          </TouchableOpacity>
          <View style={styles.features}>
            <Text style={styles.featureItem}>• Ajoutez et gérez vos tâches</Text>
            <Text style={styles.featureItem}>• Fixez des dates limites</Text>
            <Text style={styles.featureItem}>• Modifiez et supprimez à tout moment</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Ma To-Do List</Text>

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Titre"
            value={title}
            onChangeText={setTitle}
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Description (optionnelle)"
            value={description}
            onChangeText={setDescription}
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Date limite (JJ-MM-AAAA)"
            value={dueDate}
            onChangeText={setDueDate}
            placeholderTextColor="#999"
          />
        </View>

        <Button title="Ajouter" onPress={addTodo} />

        <FlatList
          data={sortedTodos}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          ListEmptyComponent={<Text style={styles.emptyText}>Aucune tâche pour le moment</Text>}
          contentContainerStyle={todos.length === 0 && styles.emptyContainer}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  todoDate: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 5,
  },
  inputRow: {
    marginBottom: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
  content: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  loginButton: {
    backgroundColor: '#007bff',
    borderRadius: 5,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    paddingVertical: 10,
  },
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  todoCompleted: {
    opacity: 0.5,
  },
  todoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  editContainer: {
    flex: 1,
    flexDirection: 'column',
    gap: 8,
  },
  editInput: {
    marginBottom: 8,
    backgroundColor: '#eef',
  },
  todoContent: {
    flex: 1,
    flexDirection: 'column',
    paddingRight: 10,
  },
  todoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  todoTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#aaa',
  },
  todoDescription: {
    fontSize: 14,
    color: '#555',
  },
  deleteButton: {
    paddingHorizontal: 8,
  },
  deleteText: {
    fontSize: 20,
    color: '#cc0000',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  welcomeBox: {
    backgroundColor: '#007bff',
    borderRadius: 12,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 8,
  },
  welcomeEmoji: {
    fontSize: 50,
    marginBottom: 10,
    color: '#fff',
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#e0e0e0',
    textAlign: 'center',
    marginVertical: 12,
  },
  features: {
    marginTop: 20,
    alignItems: 'flex-start',
    width: '100%',
    paddingHorizontal: 20,
  },
  featureItem: {
    fontSize: 14,
    color: '#dbe9ff',
    marginBottom: 6,
  },
});
