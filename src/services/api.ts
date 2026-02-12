import axios from 'axios';
import { Task, TaskCreate, TaskUpdate, AnswerResult } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Get session token
export const getSessionToken = async (): Promise<string> => {
  const storedToken = sessionStorage.getItem('sessionToken');
  if (storedToken) {
    return storedToken;
  }

  const response = await api.get<{ token: string }>('/session/token');
  const token = response.data.token;
  sessionStorage.setItem('sessionToken', token);
  return token;
};

// Get worksheet tasks
export const getTasks = async (): Promise<Task[]> => {
  const response = await api.get<Task[]>('/tasks');
  return response.data;
};

// Submit task answer
export const submitAnswer = async (
  taskId: number,
  optionId: number,
  token: string
): Promise<AnswerResult> => {
  const response = await api.post<AnswerResult>(
    `/tasks/${taskId}/answer`,
    { optionId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const adminGetTask = async (): Promise<Task[]> => {
  const response = await api.get<Task[]>('/admin/tasks');
  return response.data;
};
export const adminCreateTask = async (task: TaskCreate): Promise<Task> => {
  const response = await api.post<Task>('/admin/tasks', task);
  return response.data;
};
export const adminUpdateTask = async (task: TaskUpdate): Promise<Task> => {
  const response = await api.put<Task>(`/admin/tasks/${task.id}`, task);
  return response.data;
};
export const adminDeleteTask = async (taskId: number): Promise<void> => {
  await api.delete(`/admin/tasks/${taskId}`);
};


export default api;
