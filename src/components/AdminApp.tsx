import React, { useEffect, useState } from 'react';
import { Task, OptionForm } from '../types';
import {
  adminGetTask,
  adminCreateTask,
  adminUpdateTask,
  adminDeleteTask,
} from '../services/api';

const emptyTask = (): { instruction: string; options: OptionForm[] } => ({
  instruction: '',
  options: [{ text: '', isCorrect: false }],
});

const AdminApp: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [form, setForm] = useState(emptyTask());
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const loadTasks = async () => {
    try {
      setError(null);
      const data = await adminGetTask();
      setTasks(data);
    } catch (err) {
      console.error(err);
      setError('Не удалось загрузить список заданий.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const openCreate = () => {
    setEditingTask(null);
    setForm(emptyTask());
    setFormOpen(true);
  };

  const openEdit = (task: Task) => {
    setEditingTask(task);
    setForm({
      instruction: task.instruction,
      options:
        task.options && task.options.length > 0
          ? task.options.map((o) => ({
              id: o.id,
              text: o.text,
              isCorrect: !!o.isCorrect,
            }))
          : [{ text: '', isCorrect: false }],
    });
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditingTask(null);
    setForm(emptyTask());
  };

  const addOption = () => {
    setForm((f) => ({
      ...f,
      options: [...f.options, { text: '', isCorrect: false }],
    }));
  };

  const updateOption = (index: number, field: 'text' | 'isCorrect', value: string | boolean) => {
    setForm((f) => ({
      ...f,
      options: f.options.map((o, i) =>
        i === index ? { ...o, [field]: value } : o
      ),
    }));
  };

  const removeOption = (index: number) => {
    setForm((f) => ({
      ...f,
      options: f.options.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const options = form.options.filter((o) => o.text.trim() !== '');
    if (!form.instruction.trim()) return;
    setSubmitting(true);
    try {
      if (editingTask && editingTask.id != null) {
        await adminUpdateTask({
          id: editingTask.id,
          instruction: form.instruction.trim(),
          options: options.map((o) => ({ text: o.text, isCorrect: o.isCorrect, id: o.id })),
        });
      } else {
        await adminCreateTask({
          instruction: form.instruction.trim(),
          options: options.map((o) => ({ text: o.text, isCorrect: o.isCorrect })),
        });
      }
      await loadTasks();
      closeForm();
    } catch (err) {
      console.error(err);
      setError('Ошибка сохранения.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (taskId: number) => {
    try {
      await adminDeleteTask(taskId);
      setDeleteConfirmId(null);
      await loadTasks();
    } catch (err) {
      console.error(err);
      setError('Не удалось удалить задание.');
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Админка: задания</h1>
        <button
          type="button"
          onClick={openCreate}
          className="px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 shadow-sm"
        >
          + Добавить задание
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {tasks.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center text-gray-500">
            Нет заданий. Добавьте первое.
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className="bg-white rounded-xl shadow-md p-6 flex justify-between items-start gap-4"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-800 break-words">
                  {task.instruction}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Вариантов ответа: {task.options?.length ?? 0}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => openEdit(task)}
                  className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Изменить
                </button>
                {deleteConfirmId === task.id ? (
                  <>
                    <span className="text-sm text-gray-600">Удалить?</span>
                    <button
                      type="button"
                      onClick={() => handleDelete(task.id)}
                      className="px-3 py-1.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
                    >
                      Да
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(null)}
                      className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                    >
                      Нет
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setDeleteConfirmId(task.id)}
                    className="px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100"
                  >
                    Удалить
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleSubmit} className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                {editingTask ? 'Редактировать задание' : 'Новое задание'}
              </h2>

              <label className="block text-sm font-medium text-gray-700 mb-1">
                Вопрос / задание
              </label>
              <textarea
                value={form.instruction}
                onChange={(e) =>
                  setForm((f) => ({ ...f, instruction: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary mb-4"
                rows={3}
                required
              />

              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Варианты ответа (отметьте верный)
                </label>
                <button
                  type="button"
                  onClick={addOption}
                  className="text-sm text-primary font-medium hover:underline"
                >
                  + Вариант
                </button>
              </div>

              <div className="space-y-3 mb-6">
                {form.options.map((opt, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <input
                      type="checkbox"
                      checked={opt.isCorrect}
                      onChange={(e) =>
                        updateOption(i, 'isCorrect', e.target.checked)
                      }
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                      title="Верный ответ"
                    />
                    <input
                      type="text"
                      value={opt.text}
                      onChange={(e) => updateOption(i, 'text', e.target.value)}
                      placeholder="Текст варианта"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                    <button
                      type="button"
                      onClick={() => removeOption(i)}
                      className="p-2 text-gray-400 hover:text-red-600 shrink-0"
                      title="Удалить вариант"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeForm}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50"
                >
                  {submitting ? 'Сохранение…' : 'Сохранить'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminApp;
