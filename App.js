import React, { useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Switch
} from 'react-native';

const STORAGE_KEY = '@todo_tasks';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [inputText, setInputText] = useState('');
  const [filter, setFilter] = useState('all');
  const [darkMode, setDarkMode] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
  if (isLoaded) {
    saveTasks();
  }
}, [tasks, isLoaded]);

  useEffect(() => {
  loadTasks();
}, []);

  const saveTasks = async () => {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(tasks)
    );
  } catch (error) {
    console.log('Error saving tasks:', error);
  }
};

const loadTasks = async () => {
  try {
    const savedTasks = await AsyncStorage.getItem(STORAGE_KEY);

    if (savedTasks !== null) {
      setTasks(JSON.parse(savedTasks));
    }
  } catch (error) {
    console.log('Error loading tasks:', error);
  } finally {
    setIsLoaded(true);
  }
};

  // Add Task
  const addTask = () => {
    if (inputText.trim() === '') return;

    const newTask = {
      id: Date.now().toString(),
      text: inputText,
      completed: false,
    };

    setTasks([...tasks, newTask]);
    setInputText('');
  };

  // Delete Task
  const deleteTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  // Toggle Complete
  const toggleComplete = (taskId) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId
        ? { ...task, completed: !task.completed }
        : task
    );

    setTasks(updatedTasks);
  };

  const getFilteredTasks = () => {
  if (filter === 'active')
    return tasks.filter(task => !task.completed);

  if (filter === 'completed')
    return tasks.filter(task => task.completed);

  return tasks;
};

  // Render each task
  const renderTask = ({ item }) => (
    <View
  style={[
  styles.taskText,
  darkMode && styles.darkTaskText,
  item.completed && styles.completedText,
]}
>
      <TouchableOpacity
        style={{ flex: 1 }}
        onPress={() => toggleComplete(item.id)}
      >
        <Text
          style={[
            styles.taskText,
            item.completed && styles.completedText,
          ]}
        >
          {item.completed ? '✓ ' : ''}
          {item.text}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => deleteTask(item.id)}>
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView
  style={[
    styles.container,
    darkMode && styles.darkContainer
  ]}
>
      <Text
  style={[
    styles.title,
    darkMode && styles.darkTitle
  ]}
>My To-Do List</Text>

      <Text
  style={[
    styles.subtitle,
    darkMode && styles.darkSubtitle
  ]}
>
        Soft Nexis Technology Internship
      </Text>

      <View style={styles.switchRow}>
    <Text
      style={[
        styles.input,
        darkMode && styles.darkInput
      ]}
    >
      Dark Mode
    </Text>

    <Switch
      value={darkMode}
      onValueChange={setDarkMode}
    />
  </View>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Enter a new task..."
          value={inputText}
          onChangeText={setInputText}
        />

        <TouchableOpacity
          style={styles.addButton}
          onPress={addTask}
        >
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

<View style={styles.filterRow}>

  {['all', 'active', 'completed'].map((f) => (

    <TouchableOpacity
      key={f}
      style={[
        styles.filterButton,
        filter === f && styles.filterButtonActive,
      ]}
      onPress={() => setFilter(f)}
    >

      <Text
        style={[
          styles.filterText,
          filter === f && styles.filterTextActive,
        ]}
      >
        {f.charAt(0).toUpperCase() + f.slice(1)}
      </Text>

    </TouchableOpacity>

  ))}

</View>
      <FlatList
        data={getFilteredTasks()}
        renderItem={renderTask}
        keyExtractor={(item) => item.id}
        style={styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No tasks yet. Add one above!
          </Text>
        }
      />
      <View style={styles.footer}>
      <Text
  style={[
    styles.footerText,
    darkMode && styles.darkFooterText
  ]}
>
        {tasks.filter((t) => !t.completed).length} task(s) remaining
      </Text>
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingTop: 50,
    paddingHorizontal: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0B1E3D',
  },

  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },

  inputRow: {
    flexDirection: 'row',
    marginBottom: 15,
  },

  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },

  addButton: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    paddingHorizontal: 20,
    justifyContent: 'center',
    marginLeft: 10,
  },

  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },

  list: {
    flex: 1,
  },

  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },

  taskText: {
    fontSize: 16,
    color: '#222',
  },

  completedText: {
    textDecorationLine: 'line-through',
    color: '#999',
  },

  deleteText: {
    color: '#E53935',
    fontWeight: '600',
    marginLeft: 10,
  },

  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 50,
    fontSize: 15,
  },
  filterRow: {
  flexDirection: 'row',
  justifyContent: 'space-around',
  marginBottom: 15,
},

filterButton: {
  paddingHorizontal: 15,
  paddingVertical: 8,
  borderRadius: 20,
  backgroundColor: '#ddd',
},

filterButtonActive: {
  backgroundColor: '#2196F3',
},

filterText: {
  color: '#333',
  fontWeight: 'bold',
},

filterTextActive: {
  color: '#fff',
},
footer: {
  paddingVertical: 15,
  borderTopWidth: 1,
  borderTopColor: '#ddd',
},

footerText: {
  textAlign: 'center',
  color: '#666',
  fontSize: 13,
},
switchRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 15,
},

switchText: {
  fontSize: 16,
  fontWeight: 'bold',
},

darkContainer: {
  backgroundColor: '#121212',
},

darkTitle: {
  color: '#ffffff',
},

darkSubtitle: {
  color: '#cccccc',
},

darkInput: {
  backgroundColor: '#1E1E1E',
  color: '#ffffff',
  borderColor: '#555',
},

darkTaskItem: {
  backgroundColor: '#1F1F1F',
},

darkTaskText: {
  color: '#ffffff',
},

darkFooterText: {
  color: '#dddddd',
},
});