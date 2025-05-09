import React, { useEffect, useState } from 'react';
import { Text, View, FlatList, Button, TextInput, Modal, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { fetchTasks, fetchGroups, createTask, uploadFile } from '@/scripts/axios'; // API funksiyalari

export default function Tasks() {
  interface Task {
    id: string;
    title: string;
    description: string;
    due_date: string;
    file_url?: string;
  }

  const [tasks, setTasks] = useState<Task[]>([]);
  const [groups, setGroups] = useState<{ id: string; name: string }[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [file, setFile] = useState<any>(null);
  const [groupId, setGroupId] = useState('');

  const loadTasks = async () => {
    try {
      const taskList = await fetchTasks();
      setTasks(taskList);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch tasks');
    }
  };

  const loadGroups = async () => {
    try {
      const groupList = await fetchGroups();
      setGroups(groupList);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch groups');
    }
  };

  const handleFilePicker = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ copyToCacheDirectory: true });
      console.log("🚀 ~ handleFilePicker ~ result:", result)
      if (result) {
        setFile(result);
      }

    } catch (error) {
      Alert.alert('Error', 'Failed to pick a file');
    }
  };

  const handleCreateTask = async () => {
    try {
      let fileUrl = undefined;
      if (file?.assets?.[0]?.uri) {
        fileUrl = await uploadFile(file.assets[0].uri);
      }
      console.log();
      
  
      await createTask({
        title,
        description,
        due_date: dueDate,
        file_url: fileUrl,
        group_id: groupId,
      });
  
      Alert.alert('Success', 'Task created successfully');
      setModalVisible(false);
      clearForm();
      loadTasks();
    } catch (error) {
      console.error('Task creation error:', error);
      Alert.alert('Error', 'Failed to create task');
    }
  };
  

  const clearForm = () => {
    setTitle('');
    setDescription('');
    setDueDate('');
    setFile(null);
    setGroupId('');
  };

  useEffect(() => {
    loadTasks();
    loadGroups();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Tasks</Text>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            <Text style={styles.taskTitle}>{item.title}</Text>
            <Text>{item.description}</Text>
            <Text>{item.due_date}</Text>
            {item.file_url && (
              <Text style={{ color: 'blue' }}>File: {item.file_url}</Text>
            )}
          </View>
        )}
      />
      <Button title="Create Task" onPress={() => setModalVisible(true)} />

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeading}>Create Task</Text>
            <TextInput
              style={styles.input}
              placeholder="Title"
              value={title}
              onChangeText={setTitle}
              placeholderTextColor={'black'}
            />
            <TextInput
              style={styles.input}
              placeholder="Description"
              value={description}
              onChangeText={setDescription}
              placeholderTextColor={'black'}
            />
            <TextInput
              style={styles.input}
              placeholder="Due Date (YYYY-MM-DD)"
              value={dueDate}
              onChangeText={setDueDate}
              placeholderTextColor={'black'}
            />
            <View style={styles.groupPicker}>
              <Text>Select Group:</Text>
              {groups.map((group) => (
                <TouchableOpacity
                  key={group.id}
                  onPress={() => setGroupId(group.id)}
                  style={[
                    styles.groupOption,
                    groupId === group.id && styles.selectedGroupOption,
                  ]}
                >
                  <Text>{group.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Button title="Pick File" onPress={handleFilePicker} />
            {file && <Text>Selected File: {file.name}</Text>}
            <Button title="Create Task" onPress={handleCreateTask} />
            <Button title="Cancel" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  heading: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  taskItem: { padding: 8, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  taskTitle: { fontSize: 16, fontWeight: 'bold' },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 16,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
  },
  modalHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
  },
  groupPicker: { marginBottom: 16 },
  groupOption: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedGroupOption: {
    backgroundColor: '#ddd',
  },
});
