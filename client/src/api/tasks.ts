import { Task } from '../components/Dashboard/TaskHistory';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

export const fetchTasks = async (): Promise<Task[]> => {
  try {
    const response = await fetch(`${API_URL}/api/tasks`);
    if (!response.ok) {
      throw new Error('Failed to fetch tasks');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};

export const retryTask = async (taskId: string): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/api/tasks/${taskId}/retry`, {
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error('Failed to retry task');
    }
  } catch (error) {
    console.error('Error retrying task:', error);
    throw error;
  }
};

export const getTaskDetails = async (taskId: string): Promise<Task> => {
  try {
    const response = await fetch(`${API_URL}/api/tasks/${taskId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch task details');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching task details:', error);
    throw error;
  }
};
