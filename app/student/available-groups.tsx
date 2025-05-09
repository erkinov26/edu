import React, { useState, useEffect } from "react";
import { ActivityIndicator, Text, View, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { getUnjoinedGroups } from "@/scripts/axios";
import useStore from "@/store";
import { Button } from "react-native-paper";

export default function StudentAvailableGroups() {
  const { user, loadUser } = useStore();
  const [showDetails, setShowDetails] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<{ group_id: string; group_name: string }>({ group_id: "", group_name: "" });

  useEffect(() => {
    loadUser();
  }, []);

  const {
    data: groups,
    isLoading: isGroupsLoading,
    isError,
    error,
    refetch: refetchGroups,
  } = useQuery({
    queryKey: ["groups", user?.id],
    queryFn: () => getUnjoinedGroups(user?.id),
    enabled: !!user?.id,
  });

  const handleGroupPress = (groupId: string, groupName: string) => {
    setSelectedGroup({ group_id: groupId, group_name: groupName });
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setSelectedGroup({ group_id: "", group_name: "" });
    setShowDetails(false);
  };

  if (isGroupsLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Guruhlar yuklanmoqda...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{(error as Error).message}</Text>
        <Button mode="contained" onPress={() => refetchGroups()}>
          Qayta yuklash
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!showDetails ? (
        <>
          <Text style={styles.title}>Mening Guruhlarim:</Text>
          {groups?.length ? (
            <FlatList
              data={groups}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleGroupPress(item.id, item.name)}>
                  <View style={styles.groupItem}>
                    <Text style={styles.groupName}>{item.name}</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          ) : (
            <Text>Hozircha guruh yo‘q.</Text>
          )}
        </>
      ) : (
        <View style={styles.detailsContainer}>
          <TouchableOpacity onPress={handleCloseDetails}>
            <Text style={styles.backButton}>← Orqaga qaytish</Text>
          </TouchableOpacity>
          <Text style={styles.detailsTitle}>Guruh Tafsilotlari</Text>
          <Text style={styles.detailsText}>Guruh nomi: {selectedGroup.group_name}</Text>
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
  errorText: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
  detailsContainer: {
    padding: 16,
    backgroundColor: "#fff",
  },
  backButton: {
    fontSize: 16,
    color: "#0066cc",
    fontWeight: "bold",
    marginBottom: 12,
  },
  detailsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  detailsText: {
    fontSize: 16,
  },
});
