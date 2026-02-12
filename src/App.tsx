import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import TaskCard from './components/TaskCard';
import AdminApp from './components/AdminApp';
import { Task } from './types';
import { getTasks, getSessionToken } from './services/api';
import { useEffect, useState } from 'react';

const HomePage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await getSessionToken();
        const fetchedTasks = await getTasks();
        setTasks(fetchedTasks);
      } catch (err) {
        console.error('Error initializing app:', err);
        setError('Failed to load tasks. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading tasks...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
          <p className="text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Worksheet Tasks
      </h1>
      {tasks.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-6">
          <p className="text-gray-600">No tasks available.</p>
        </div>
      ) : (
        tasks.map((task) => <TaskCard key={task.id} task={task as Task} />)
      )}
    </main>
  );
};

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminApp />} />
      </Routes>
    </div>
  );
};

export default App;
