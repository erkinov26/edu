import React, { useEffect, useState } from 'react';
import { Text, View, FlatList, Button, TextInput, Modal, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { fetchTasks, fetchGroups, createTask, SUPABASE_URL, SUPABASE_ANON_KEY, uploadFile } from '@/scripts/axios'; // API funksiyalari
import axios from 'axios';

// ...importlar o'zgarmaydi

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
  const [groupId, setGroupId] = useState('');
  const [uploadStatus, setUploadStatus] = useState('');
  const [uploadedFile, setUploadedFile] = useState<any>(null)
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
  }

  // Validation
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateFields = () => {
    const newErrors: { [key: string]: string } = {};
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!description.trim()) newErrors.description = 'Description is required';
    if (!dueDate.trim()) newErrors.dueDate = 'Due date is required';
    if (!groupId) newErrors.groupId = 'Group selection is required';
    return newErrors;
  };

  const handleCreateTask = async () => {
    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await createTask({
        title,
        description,
        due_date: dueDate,
        file_url: uploadedFile,
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
    setUploadedFile(null);
    setGroupId('');
    setErrors({});
    setUploadStatus('');
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
            {item.file_url && <Text style={{ color: 'blue' }}>File: {item.file_url}</Text>}
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
              onChangeText={(text) => {
                setTitle(text);
                setErrors({ ...errors, title: '' });
              }}
              placeholderTextColor={'black'}
            />
            {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}

            <TextInput
              style={styles.input}
              placeholder="Description"
              value={description}
              onChangeText={(text) => {
                setDescription(text);
                setErrors({ ...errors, description: '' });
              }}
              placeholderTextColor={'black'}
            />
            {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}

            <TextInput
              style={styles.input}
              placeholder="Due Date (YYYY-MM-DD)"
              value={dueDate}
              onChangeText={(text) => {
                setDueDate(text);
                setErrors({ ...errors, dueDate: '' });
              }}
              placeholderTextColor={'black'}
            />
            {errors.dueDate && <Text style={styles.errorText}>{errors.dueDate}</Text>}

            <View style={styles.groupPicker}>
              <Text>Select Group:</Text>
              {groups.map((group) => (
                <TouchableOpacity
                  key={group.id}
                  onPress={() => {
                    setGroupId(group.id);
                    setErrors({ ...errors, groupId: '' });
                  }}
                  style={[
                    styles.groupOption,
                    groupId === group.id && styles.selectedGroupOption,
                  ]}
                >
                  <Text>{group.name}</Text>
                </TouchableOpacity>
              ))}
              {errors.groupId && <Text style={styles.errorText}>{errors.groupId}</Text>}
            </View>

            <View style={styles.uploadBox}>
              <Button title="Select and Upload File" onPress={() => uploadFile(setUploadStatus, setUploadedFile)} color="#007BFF" />
              <Text style={styles.uploadStatus}>Upload Status: {uploadStatus}</Text>
            </View>
            <TouchableOpacity style={styles.createButton} onPress={handleCreateTask}>
              <Text style={styles.buttonText}>Create Task</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelButton} onPress={() => {
              clearForm();
              setModalVisible(false);
            }}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
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
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  modalHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
  errorText: {
    color: 'red',
    marginBottom: 8,
    fontSize: 12,
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
    backgroundColor: '#cde2ff',
    borderColor: '#007BFF',
  },
  uploadBox: {
    borderWidth: 1,
    borderColor: '#007BFF',
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  uploadStatus: {
    marginTop: 8,
    color: '#007BFF',
  },
  createButton: {
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  cancelButton: {
    backgroundColor: '#dc3545',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

