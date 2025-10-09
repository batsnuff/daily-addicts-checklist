import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, CheckCircle2, Circle, Edit3, Save, X } from 'lucide-react';

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = () => {
    const saved = localStorage.getItem('daily_todos');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setTodos(parsed.map((todo: any) => ({
          ...todo,
          createdAt: new Date(todo.createdAt)
        })));
      } catch (error) {
        console.error('Error loading todos:', error);
      }
    }
  };

  const saveTodos = (todosToSave: TodoItem[]) => {
    localStorage.setItem('daily_todos', JSON.stringify(todosToSave));
  };

  const addTodo = () => {
    if (newTodo.trim()) {
      const todo: TodoItem = {
        id: Date.now().toString(),
        text: newTodo.trim(),
        completed: false,
        createdAt: new Date()
      };
      const newTodos = [...todos, todo];
      setTodos(newTodos);
      saveTodos(newTodos);
      setNewTodo('');
    }
  };

  const toggleTodo = (id: string) => {
    const newTodos = todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(newTodos);
    saveTodos(newTodos);
  };

  const deleteTodo = (id: string) => {
    const newTodos = todos.filter(todo => todo.id !== id);
    setTodos(newTodos);
    saveTodos(newTodos);
  };

  const startEditing = (id: string, text: string) => {
    setEditingId(id);
    setEditingText(text);
  };

  const saveEdit = () => {
    if (editingText.trim()) {
      const newTodos = todos.map(todo =>
        todo.id === editingId ? { ...todo, text: editingText.trim() } : todo
      );
      setTodos(newTodos);
      saveTodos(newTodos);
    }
    setEditingId(null);
    setEditingText('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingText('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (editingId) {
        saveEdit();
      } else {
        addTodo();
      }
    }
  };

  const completedCount = todos.filter(todo => todo.completed).length;
  const totalCount = todos.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-white mb-4 flex items-center justify-center gap-3">
          <CheckCircle2 className="text-green-400" size={24} />
          DAILY TODO LIST
        </h3>
        <div className="text-sm text-gray-300 mb-4">
          {completedCount}/{totalCount} ukończone
        </div>
      </div>

      {/* Add Todo Input */}
      <div className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Dodaj nowe zadanie..."
            className="flex-1 px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={addTodo}
            className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-bold hover:from-green-600 hover:to-green-700 transition-all"
          >
            <Plus size={20} />
          </motion.button>
        </div>
      </div>

      {/* Todo List */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        <AnimatePresence>
          {todos.map((todo) => (
            <motion.div
              key={todo.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                todo.completed
                  ? 'bg-gray-800/50 border-gray-600'
                  : 'bg-gray-800/30 border-gray-700 hover:border-gray-600'
              }`}
            >
              {/* Toggle Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => toggleTodo(todo.id)}
                className={`p-1 rounded-full transition-all ${
                  todo.completed
                    ? 'text-green-400 hover:text-green-300'
                    : 'text-gray-400 hover:text-green-400'
                }`}
              >
                {todo.completed ? <CheckCircle2 size={20} /> : <Circle size={20} />}
              </motion.button>

              {/* Todo Text */}
              <div className="flex-1">
                {editingId === todo.id ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="flex-1 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-cyan-400"
                      autoFocus
                    />
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={saveEdit}
                      className="p-1 text-green-400 hover:text-green-300"
                    >
                      <Save size={16} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={cancelEdit}
                      className="p-1 text-red-400 hover:text-red-300"
                    >
                      <X size={16} />
                    </motion.button>
                  </div>
                ) : (
                  <span
                    className={`transition-all ${
                      todo.completed
                        ? 'line-through text-gray-400'
                        : 'text-white'
                    }`}
                  >
                    {todo.text}
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              {!todo.completed && editingId !== todo.id && (
                <div className="flex gap-1">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => startEditing(todo.id, todo.text)}
                    className="p-1 text-blue-400 hover:text-blue-300"
                  >
                    <Edit3 size={16} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => deleteTodo(todo.id)}
                    className="p-1 text-red-400 hover:text-red-300"
                  >
                    <Trash2 size={16} />
                  </motion.button>
                </div>
              )}

              {/* Delete button for completed todos */}
              {todo.completed && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => deleteTodo(todo.id)}
                  className="p-1 text-red-400 hover:text-red-300"
                >
                  <Trash2 size={16} />
                </motion.button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {todos.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <CheckCircle2 size={48} className="mx-auto mb-4 opacity-50" />
            <p>Brak zadań do wykonania</p>
            <p className="text-sm">Dodaj pierwsze zadanie powyżej</p>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      {totalCount > 0 && (
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-300 mb-2">
            <span>Postęp</span>
            <span>{Math.round((completedCount / totalCount) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(completedCount / totalCount) * 100}%` }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-r from-green-500 to-green-400 h-2 rounded-full"
            />
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default TodoList;
