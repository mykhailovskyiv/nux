import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import axios from 'axios';

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  [key: string]: any;
}

interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

export const useAuthStore = defineStore('auth', () => {
  const user: ref<User | null> = ref(null);
  const error: ref<string | null> = ref(null);
  const todos: ref<Todo[]> = ref([]);
  const isAuthenticated: ref<boolean> = ref(false);

  const loadUserFromLocalStorage = (): void => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      user.value = JSON.parse(storedUser) as User;
    }
  };

  const fetchUsers = async (): Promise<User[]> => {
    try {
      const response = await axios.get<User[]>('https://jsonplaceholder.typicode.com/users');
      return response.data;
    } catch (err) {
      error.value = 'Failed to fetch users';
      console.error(err);
      return [];
    }
  };

  const login = async (username: string, phoneNumber: string): Promise<boolean> => {
    console.log(username, phoneNumber);
    error.value = null;
    const users = await fetchUsers();

    const userLogin = users.find(
        (user) =>
            user.username.toLowerCase() === username.toLowerCase() &&
            user.phone === phoneNumber
    );

    if (userLogin) {
      user.value = userLogin;
      error.value = null;
      localStorage.setItem('user', JSON.stringify(userLogin));
      return true;
    } else {
      user.value = null;
      error.value = 'Login error';
      return false;
    }
  };

  const logout = (): void => {
    user.value = null;
    localStorage.removeItem('user');
  };

  const fetchTodos = async (): Promise<Todo[]> => {
    try {
      const response = await axios.get<Todo[]>('https://jsonplaceholder.typicode.com/todos');
      todos.value = response.data;
      return todos.value;
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  loadUserFromLocalStorage();

  return {
    user,
    error,
    todos,
    login,
    fetchUsers,
    fetchTodos,
    logout,
  };
});
