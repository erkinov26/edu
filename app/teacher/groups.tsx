import React, { useState } from "react";
import {
  ActivityIndicator,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  Alert,
} from "react-native";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getTeacherGroups, getGroupStudents, deleteStudent, createTeacherGroup } from "@/scripts/axios";
import useStore from "@/store";
import UserModal from "@/components/ui/modal";
import CreateGroupModal from "@/components/ui/create-group-modal";

export default function Groups() {
  const { user } = useStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [groupModalVisible, setGroupModalVisible] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<{
    group_id: string;
    group_name: string;
  }>({ group_id: "", group_name: "" });

  const [showDetails, setShowDetails] = useState(false);


  const {
    data: groups,
    isLoading: isGroupsLoading,
    refetch: refetchGroups,
  } = useQuery({
    queryKey: ["teacherGroups", user?.id],
    queryFn: () => getTeacherGroups(user.id),
    enabled: !!user?.id,
  });

  const {
    data: groupDetails,
    isLoading: isGroupDetailsLoading,
    refetch: refetchGroupDetails,
  } = useQuery({
    queryKey: ["groupDetails", selectedGroup.group_id],
    queryFn: () => getGroupStudents(selectedGroup.group_id),
    enabled: !!selectedGroup.group_id,
  });

  const deleteMutation = useMutation({
    mutationFn: (studentId: string) => deleteStudent(studentId),
    onSuccess: () => {
      Alert.alert("Muvaffaqiyatli", "O'quvchi o'chirildi");
      refetchGroupDetails();
    },
    onError: (error) => {
      Alert.alert("Xatolik", "O'quvchini o'chirishda xatolik yuz berdi");
      console.error(error);
    },
  });


  const createGroupMutation = useMutation({
    mutationFn: (name: string) => createTeacherGroup(user.id, name),
    onSuccess: () => {
      Alert.alert("Muvaffaqiyatli", "Guruh yaratildi");
      refetchGroups();
      setGroupModalVisible(false)
    },
    onError: (error) => {
      Alert.alert("Xatolik", "Guruh yaratishda xatolik yuz berdi");
      console.error(error);
    },
  });

  const handleCreateGroup = (groupName: string) => {
    createGroupMutation.mutate(groupName);
  };
  const handleGroupPress = (groupId: string, name: string) => {
    setSelectedGroup({ group_id: groupId, group_name: name });
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setSelectedGroup({ group_id: "", group_name: "" });
    setShowDetails(false);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    refetchGroupDetails(); // Modal yopilganda ma'lumotni yangilash
  };

  const handleDeleteStudent = (studentId: string) => {
    Alert.alert(
      "Tasdiqlash",
      "Bu o'quvchini o'chirishni xohlaysizmi?",
      [
        { text: "Bekor qilish", style: "cancel" },
        {
          text: "O'chirish",
          style: "destructive",
          onPress: () => deleteMutation.mutate(studentId),
        },
      ],
      { cancelable: true }
    );
  };

  if (isGroupsLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Guruhlar yuklanmoqda...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!showDetails ? (
        <>
          <Text style={styles.title}>Guruhlar</Text>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => setGroupModalVisible(true)}
          >
            <Text style={styles.createButtonText}>Yangi Guruh Qo'shish</Text>
          </TouchableOpacity>
          <CreateGroupModal
            visible={groupModalVisible}
            onClose={() => setGroupModalVisible(false)}
            onCreate={handleCreateGroup}
          />
          <Text style={styles.subtitle}>User ID: {user?.id || "Mavjud emas"}</Text>

          {groups?.length ? (
            <FlatList
              data={groups}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleGroupPress(item.id, item.name)}
                >
                  <View style={styles.groupItem}>
                    <Text style={styles.groupName}>{item.name}</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          ) : (
            <Text style={styles.noGroups}>Hech qanday guruh topilmadi</Text>
          )}
        </>
      ) : (
        <View style={styles.detailsContainer}>
          <Pressable style={styles.backButton} onPress={handleCloseDetails}>
            <Text style={styles.backButtonText}>← Orqaga qaytish</Text>
          </Pressable>

          <View style={{ display: "flex" }}>
            <Text style={styles.detailsTitle}>Guruh Tafsilotlari</Text>
            <TouchableOpacity
              style={{
                paddingHorizontal: 12,
                paddingVertical: 8,
                backgroundColor: "#007bff",
                borderRadius: 6,
              }}
              onPress={() => setModalVisible(true)}
            >
              <Text
                style={{
                  textAlign: "center",
                  color: "#fff",
                  fontWeight: "bold",
                  fontSize: 18,
                }}
              >
                Add Student
              </Text>
            </TouchableOpacity>
            <UserModal
              groupId={selectedGroup.group_id}
              visible={modalVisible}
              onClose={handleModalClose} // Modal yopilganda yangilash
            />
          </View>
          <Text style={styles.detailsText}>
            Guruh nomi: {selectedGroup?.group_name}
          </Text>
          <Text style={styles.detailsText}>O'quvchilar:</Text>

          {isGroupDetailsLoading ? (
            <ActivityIndicator size="large" />
          ) : groupDetails?.length ? (
            <FlatList
              data={groupDetails}
              keyExtractor={(item) => item.users.id}
              renderItem={({ item }) => (
                <View style={styles.studentCard}>
                  <View style={styles.studentInfo}>
                    <Text style={styles.studentName}>{item.users.name}</Text>
                    <Text style={styles.studentEmail}>{item.users.email}</Text>
                  </View>
                  <TouchableOpacity
                    style={{
                      padding: 8,
                      backgroundColor: "#ff4d4f",
                      borderRadius: 6,
                    }}
                    onPress={() => handleDeleteStudent(item.users.id)}
                  >
                    <Text style={{ color: "#fff", fontWeight: "bold" }}>
                      Delete
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          ) : (
            <Text style={styles.noStudents}>Hech qanday o'quvchi topilmadi</Text>
          )}
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "gray",
    marginBottom: 16,
  },
  groupItem: {
    marginTop: 12,
    padding: 16,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  groupName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  noGroups: {
    marginTop: 12,
    color: "gray",
  },
  detailsContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  backButton: {
    alignSelf: "flex-start",
    marginBottom: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: "#0066cc",
    fontWeight: "bold",
  },
  detailsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  detailsText: {
    fontSize: 16,
    marginBottom: 12,
  },
  studentCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
    marginVertical: 6,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  studentEmail: {
    fontSize: 14,
    color: "gray",
  },
  noStudents: {
    color: "gray",
  },
  createButton: {
    marginVertical: 10,
    padding: 12,
    backgroundColor: "#007bff",
    borderRadius: 10,
  },
  createButtonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
  },
});

// import {
//   ActivityIndicator,
//   Text,
//   View,
//   FlatList,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
// } from "react-native";
// import { useQuery, useMutation } from "@tanstack/react-query";
// import { createTeacherGroup, getTeacherGroups } from "@/scripts/axios";
// import useStore from "@/store";
// import { useNavigation } from "@react-navigation/native"; // Import navigatsiya
// import CreateGroupModal from "@/components/ui/create-group-modal";

// export default function Groups() {
//   const { user } = useStore();
//   const navigation = useNavigation(); // Navigatsiya uchun hook
//   const [modalVisible, setModalVisible] = useState(false);

//   const {
//     data: groups,
//     isLoading: isGroupsLoading,
//     refetch: refetchGroups,
//   } = useQuery({
//     queryKey: ["teacherGroups", user?.id],
//     queryFn: () => getTeacherGroups(user.id),
//     enabled: !!user?.id,
//   });

//   const createGroupMutation = useMutation({
//     mutationFn: (name: string) => createTeacherGroup(user.id, name),
//     onSuccess: () => {
//       Alert.alert("Muvaffaqiyatli", "Guruh yaratildi");
//       setModalVisible(false);
//       refetchGroups();
//     },
//     onError: (error) => {
//       Alert.alert("Xatolik", "Guruh yaratishda xatolik yuz berdi");
//       console.error(error);
//     },
//   });

//   const handleCreateGroup = (groupName: string) => {
//     createGroupMutation.mutate(groupName);
//   };

//   const handleGroupPress = (groupId: string, groupName: string) => {
//     // Guruh tafsilotlari ekranga o'tish
//     navigation.navigate("GroupDetails", { groupId, groupName });
//   };

//   if (isGroupsLoading) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator size="large" />
//         <Text>Guruhlar yuklanmoqda...</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Guruhlar</Text>
//       <Text style={styles.subtitle}>User ID: {user?.id || "Mavjud emas"}</Text>



//       {groups?.length ? (
//         <FlatList
//           data={groups}
//           keyExtractor={(item) => item.id}
//           renderItem={({ item }) => (
//             <TouchableOpacity
//               onPress={() => handleGroupPress(item.id, item.name)} // Guruhni bosganda
//             >
//               <View style={styles.groupItem}>
//                 <Text style={styles.groupName}>{item.name}</Text>
//               </View>
//             </TouchableOpacity>
//           )}
//         />
//       ) : (
//         <Text style={styles.noGroups}>Hech qanday guruh topilmadi</Text>
//       )}

//       <CreateGroupModal
//         visible={modalVisible}
//         onClose={() => setModalVisible(false)}
//         onCreate={handleCreateGroup}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     backgroundColor: "#fff",
//   },
//   center: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: "bold",
//     marginBottom: 8,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: "gray",
//     marginBottom: 16,
//   },

//   groupItem: {
//     marginTop: 12,
//     padding: 16,
//     backgroundColor: "#f0f0f0",
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: "#ddd",
//   },
//   groupName: {
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   noGroups: {
//     marginTop: 12,
//     color: "gray",
//   },
// });