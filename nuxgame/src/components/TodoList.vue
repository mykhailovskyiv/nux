<script setup lang="ts">
import {computed, onMounted, ref, unref} from 'vue';
import { useAuthStore } from '../stores/authStore';
import type { Todo } from '../types';

const authStore = useAuthStore();

const todos = computed(() => authStore.todos);

const selectedStatus = ref<'All' | 'Completed' | 'Uncompleted' | 'Favorite'>('All');
const selectedUserId = ref<number | 'All Users'>('All Users');
const searchQuery = ref<string>('');
const newUserId = ref<string>('');
const newTitle = ref<string>('');
const errorMessage = ref<string>('');

const uniqueUserIds = computed((): Array<number | 'All Users'> => {
  const userIds = todos.value.map((todo) => todo.userId);
  const uniqueIds = userIds.filter((id, index, self) => self.indexOf(id) === index);
  return ['All Users', ...uniqueIds];
});

const filteredTodos = computed((): Todo[] => {
  let filtered = todos.value;

  if (selectedStatus.value === 'Completed') {
    filtered = filtered.filter((todo) => todo.completed);
  } else if (selectedStatus.value === 'Uncompleted') {
    filtered = filtered.filter((todo) => !todo.completed);
  }

  if (selectedStatus.value === 'Favorite') {
    filtered = filtered.filter((todo) => favorite.value.some((item) => item.id === todo.id));
  }
  if (selectedUserId.value !== 'All Users') {
    filtered = filtered.filter((todo) => todo.userId === Number(selectedUserId.value));
  }
  if (searchQuery.value.trim() !== '') {
    const searchLower = searchQuery.value.toLowerCase();
    filtered = filtered.filter((todo) => todo.title.toLowerCase().includes(searchLower));
  }

  return filtered;
});

const favorite = ref<Todo[]>([]);

onMounted(() => {
  loadWishlistFromLocalStorage();
});

const loadWishlistFromLocalStorage = (): void => {
  const storedWishlist = localStorage.getItem('favorite');
  if (storedWishlist) {
    favorite.value = JSON.parse(storedWishlist) as Todo[];
  }
};

const saveWishlistToLocalStorage = (): void => {
  localStorage.setItem('favorite', JSON.stringify(favorite.value));
};

const addToWishlist = (todo: Todo): void => {
  if (!favorite.value.some((item) => item.id === todo.id)) {
    favorite.value.push(todo);
    saveWishlistToLocalStorage();
  }
};

const removeFromWishlist = (todo: Todo): void => {
  favorite.value = favorite.value.filter((item) => item.id !== todo.id);
  saveWishlistToLocalStorage();
};

const addTodo = (): void => {
  errorMessage.value = '';

  if (newUserId.value.trim() !== '' && newTitle.value.trim() !== '') {
    const newTodo: Todo = {
      userId: Number(unref(newUserId)),
      id: todos.value.length + 1,
      title: unref(newTitle),
      completed: false
    };
    authStore.todos.unshift(newTodo);
    newUserId.value = '';
    newTitle.value = '';
  } else {
    errorMessage.value = 'Please fill in both fields.';
  }
};
</script>

<template>
  <div class="todo-list">
    <h1>Todo List</h1>
    <div class="todo-menu">
      <div class="create-todo">
        <input v-model="newUserId" placeholder="User ID" />
        <input v-model="newTitle" placeholder="Title" />
        <button @click="addTodo" class="create-todo__button">Add</button>
        <p class="error-message" v-if="errorMessage">{{ errorMessage }}</p>
      </div>
      <div class="todo-menu-select">
        <select v-model="selectedStatus">
          <option value="All">All</option>
          <option value="Completed">Completed</option>
          <option value="Uncompleted">Uncompleted</option>
          <option value="Favorite">Favorite</option>
        </select>
        <select v-model="selectedUserId">
          <option v-for="userId in uniqueUserIds" :key="userId" :value="userId">{{ userId }}</option>
        </select>
        <input
            v-model="searchQuery"
            placeholder="Search by title..."
            class="search-input"
        />
      </div>
    </div>

    <ul>
      <li v-for="todo in filteredTodos" :key="todo.id" :class="{ completed: todo.completed }">
        <div class="todo-title">{{ todo.title }}</div>
        <div class="todo-status" :class="{ completed: todo.completed }">
          <span v-if="todo.completed">Completed</span>
          <span v-else>Not Completed</span>
        </div>
        <button
            v-if="!favorite.some(item => item.id === todo.id)"
            @click="addToWishlist(todo)"
            class="favorite-btn"
        >
          <i class="far fa-star"></i>
        </button>
        <button
            v-else
            @click="removeFromWishlist(todo)"
            class="favorite-btn"
        >
          <i class="fas fa-star"></i>
        </button>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
  .todo-list {
    width: 80%;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background-color: #f9f9f9;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    h1 {
      text-align: center;
      margin-bottom: 20px;
      font-size: 24px;
      color: #333;
    }

    ul {
      list-style: none;
      padding: 0;
    }

    li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px;
      margin-bottom: 10px;
      border: 1px solid #ddd;
      border-radius: 5px;
      background-color: #fff;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

      &.completed {
        background-color: #e0f7fa;
      }

      &:hover {
        background-color: #f0f0f0;
      }

      .todo-title {
        font-size: 16px;
        font-weight: 500;
        color: #333;
        width: 60%;
      }

      .todo-status {
        padding: 5px 10px;
        border-radius: 12px;
        font-size: 14px;
        color: black;
        background-color: crimson;
        font-weight: bold;

        &.completed {
          background-color: #519945;
          color: white;
        }
      }
      .favorite-btn {
        background: none;
        border: none;
        cursor: pointer;
        font-size: 18px;
        color: gold;
      }
      .favorite-btn:hover {
        color: darkorange;
      }
    }
  }
  .todo-menu {
    display: flex;
    justify-content: space-between;
    .create-todo {
      width: 45%;
      display: flex;
      align-items: center;
      height: 25px;
      &__button {
        width: 60px;
        border-radius: 5px;
        border: 1px solid;
        color: white;
        font-weight: bold;
        background-color: #519945;
        height: -webkit-fill-available;
      }
      input {
        margin-right: 5px;
      }
    }
    &-select {
      width: 45%;
      height: 25px;
      display: flex;
      justify-content: end;
      align-items: center;
      input, select {
        margin-left: 5px;
      }
    }
    input, select {
      border-radius: 5px;
      border: 1px solid;
      padding-block: 0;
      padding-inline: 0;
      padding: 5px;
      height: -webkit-fill-available;
    }
  }
  @media (max-width: 1020px) {
    .todo-list {
      width: 100%;
      padding: 20px 0;
    }
    .todo-menu {
      flex-direction: column;
      .create-todo {
        width: 100%;
        justify-content: center;
      }
      &-select {
        width: 100%;
        justify-content: center;
        margin-top: 10px;
      }
    }
  }
</style>
