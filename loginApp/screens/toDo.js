import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  FlatList,
  Modal,
  TouchableWithoutFeedback,
  Animated,
  PanResponder,
  Dimensions,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import moment from 'moment';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';

const TodoScreen = () => {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [completedTasksVisible, setCompletedTasksVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalHeight] = useState(new Animated.Value(0));
  const { height } = Dimensions.get('window');

  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  const registerForPushNotificationsAsync = async () => {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      return;
    }

    const token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  };

  const scheduleNotification = async (task) => {
    try {
      const trigger = new Date(task.reminderDate);
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Task Reminder',
          body: task.text,
          data: { taskId: task.id },
        },
        trigger,
      });
    } catch (error) {
      console.log('Error scheduling notification:', error);
    }
  };

  const cancelNotification = async (taskId) => {
    try {
      await Notifications.cancelScheduledNotificationAsync(taskId);
    } catch (error) {
      console.log('Error canceling notification:', error);
    }
  };

  const addTask = () => {
    if (task.trim() !== '') {
      const newTask = {
        id: Math.random().toString(),
        text: task,
        completed: false,
        createdAt: new Date(),
        reminderDate: null,
      };
      setTasks((prevTasks) => [...prevTasks, newTask]);
      setTask('');
    }
  };

  const deleteTask = (taskId) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    setCompletedTasks((prevTasks) =>
      prevTasks.filter((task) => task.id !== taskId)
    );
    cancelNotification(taskId);
  };

  const markTaskAsCompleted = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === taskId) {
          return { ...task, completed: true };
        }
        return task;
      })
    );

    const completedTask = tasks.find((task) => task.id === taskId);
    if (completedTask) {
      setCompletedTasks((prevTasks) => [...prevTasks, completedTask]);
    }

    cancelNotification(taskId);
  };

  const uncheckTask = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === taskId) {
          return { ...task, completed: false };
        }
        return task;
      })
    );

    setCompletedTasks((prevTasks) =>
      prevTasks.filter((task) => task.id !== taskId)
    );
  };

  const toggleCompletedTasks = () => {
    setCompletedTasksVisible((prevValue) => !prevValue);
  };

  const renderHeader = (title) => {
    return (
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>{title}</Text>
      </View>
    );
  };

  const renderTaskItem = ({ item }) => {
    const handleCheckBox = () => {
      if (item.completed) {
        uncheckTask(item.id);
      } else {
        markTaskAsCompleted(item.id);
      }
    };

    return (
      <View style={styles.taskItem}>
        <TouchableOpacity onPress={handleCheckBox}>
          <View
            style={[styles.checkbox, item.completed && styles.checkboxCompleted]}
          >
            {item.completed && <MaterialIcons name="check" size={20} color="#fff" />}
          </View>
        </TouchableOpacity>
        <Text
          style={[
            styles.taskText,
            item.completed && styles.completedTaskText,
          ]}
        >
          {item.text}
        </Text>
        <TouchableOpacity onPress={() => deleteTask(item.id)}>
          <MaterialIcons name="delete" size={24} color="red" />
        </TouchableOpacity>
      </View>
    );
  };

  const renderEmptyList = () => {
    return (
      <View style={styles.emptyListContainer}>
        <Text style={styles.emptyListText}>No tasks available</Text>
      </View>
    );
  };

  const renderCompletedTasksModal = () => {
    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => false,
      onPanResponderMove: () => {},
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 0 && gestureState.vy > 0.5) {
          closeCompletedTasksModal();
        }
      },
    });

    const closeCompletedTasksModal = () => {
      Animated.timing(modalHeight, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start(() => {
        setModalVisible(false);
      });
    };

    const openCompletedTasksModal = () => {
      setModalVisible(true);
      Animated.timing(modalHeight, {
        toValue: height * 0.75,
        duration: 300,
        useNativeDriver: false,
      }).start();
    };

    const completedTasksList = completedTasks.length ? (
      <FlatList
        data={completedTasks}
        renderItem={renderTaskItem}
        keyExtractor={(item) => item.id}
      />
    ) : (
      renderEmptyList()
    );

    return (
      <Modal
        visible={modalVisible}
        transparent
        animationType="none"
        onRequestClose={closeCompletedTasksModal}
      >
        <TouchableWithoutFeedback onPress={closeCompletedTasksModal}>
          <View style={styles.modalBackground}>
            <Animated.View
              style={[styles.modalContainer, { height: modalHeight }]}
              {...panResponder.panHandlers}
            >
              <Text style={styles.completedTasksTitle}>Completed Tasks</Text>
              <View style={styles.listContainer}>{completedTasksList}</View>
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  };

  const handleViewCompletedTasks = () => {
    toggleCompletedTasks();
    openCompletedTasksModal();
  };

  const getHeaderTitle = (date) => {
    const today = moment().startOf('day');
    const yesterday = moment().subtract(1, 'days').startOf('day');
    const taskDate = moment(date);
    if (taskDate.isSame(today, 'd')) {
      return 'Today';
    } else if (taskDate.isSame(yesterday, 'd')) {
      return 'Yesterday';
    } else {
      return taskDate.format('MMM DD, YYYY');
    }
  };

  const filteredTasks = tasks.filter((task) => !task.completed);
  const completedTasksCount = completedTasks.length;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TextInput
          style={styles.input}
          placeholder="Add a task"
          value={task}
          onChangeText={setTask}
        />
        <TouchableOpacity style={styles.addButton} onPress={addTask}>
          <Text style={styles.addButtonLabel}>Add</Text>
        </TouchableOpacity>
      </View>

      {completedTasksCount > 0 && (
        <TouchableOpacity
          style={styles.completedTasksButton}
          onPress={handleViewCompletedTasks}
        >
          <Text style={styles.completedTasksButtonText}>
            View Completed Tasks ({completedTasksCount})
          </Text>
        </TouchableOpacity>
      )}

      {filteredTasks.length > 0 ? (
        <FlatList
          data={filteredTasks}
          renderItem={({ item }) => (
            <>
              {renderHeader(getHeaderTitle(item.createdAt))}
              {renderTaskItem({ item })}
            </>
          )}
          keyExtractor={(item) => item.id}
        />
      ) : (
        renderEmptyList()
      )}

      {renderCompletedTasksModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  addButton: {
    marginLeft: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'skyblue',
    borderRadius: 8,
  },
  addButtonLabel: {
    color: '#fff',
    fontWeight: 'bold',
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: 'skyblue',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  checkboxCompleted: {
    backgroundColor: 'skyblue',
  },
  taskText: {
    flex: 1,
    fontSize: 16,
  },
  completedTaskText: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  emptyListContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
  },
  emptyListText: {
    fontSize: 16,
    color: '#888',
  },
  completedTasksButton: {
    alignSelf: 'flex-end',
    marginRight: 16,
    marginBottom: 16,
  },
  completedTasksButtonText: {
    color: 'blue',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingVertical: 16,
  },
  completedTasksTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  listContainer: {
    flex: 1,
  },
  headerContainer: {
    backgroundColor: '#f2f2f2',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default TodoScreen;
