import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Plus, 
    Trash2, 
    CheckCircle2, 
    Circle, 
    Edit3, 
    X, 
    Check, 
    ClipboardList,
    Sparkles
} from 'lucide-react';
import axios from 'axios';

export default function TodoWidget({ initialTodos = [] }) {
    const [todos, setTodos] = useState(initialTodos);
    const [newTask, setNewTask] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editValue, setEditValue] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);

    const addTodo = async (e) => {
        e.preventDefault();
        if (!newTask.trim()) return;

        try {
            const response = await axios.post(route('personal-todos.store'), { task: newTask });
            setTodos([response.data, ...todos]);
            setNewTask('');
            setIsAdding(false);
        } catch (error) {
            console.error('Failed to add todo', error);
        }
    };

    const toggleTodo = async (todo) => {
        const newStatus = !todo.is_completed;
        try {
            const response = await axios.patch(route('personal-todos.update', todo.id), { 
                is_completed: newStatus 
            });
            
            const updatedTodos = todos.map(t => t.id === todo.id ? response.data : t);
            setTodos(updatedTodos);

            if (newStatus && updatedTodos.every(t => t.is_completed) && updatedTodos.length > 0) {
                triggerCelebration();
            }
        } catch (error) {
            console.error('Failed to update todo', error);
        }
    };

    const deleteTodo = async (id) => {
        try {
            await axios.delete(route('personal-todos.destroy', id));
            setTodos(todos.filter(t => t.id !== id));
        } catch (error) {
            console.error('Failed to delete todo', error);
        }
    };

    const startEdit = (todo) => {
        setEditingId(todo.id);
        setEditValue(todo.task);
    };

    const saveEdit = async (id) => {
        if (!editValue.trim()) return;
        try {
            const response = await axios.patch(route('personal-todos.update', id), { task: editValue });
            setTodos(todos.map(t => t.id === id ? response.data : t));
            setEditingId(null);
        } catch (error) {
            console.error('Failed to save edit', error);
        }
    };

    const triggerCelebration = () => {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
    };

    return (
        <div className="relative">
            {/* Premium Glass Card */}
            <div className="bg-white/70 dark:bg-gray-900/40 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/20 dark:border-white/5 shadow-2xl shadow-blue-500/5 overflow-hidden group">
                
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-br from-[#1F2BF3] to-[#00D8C0] rounded-2xl text-white shadow-lg shadow-blue-500/20">
                            <ClipboardList className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Personal Tasks</h3>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{todos.filter(t => !t.is_completed).length} items remaining</p>
                        </div>
                    </div>
                    <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsAdding(!isAdding)}
                        className={`p-3 rounded-2xl transition-all ${isAdding ? 'bg-rose-500 text-white rotate-45' : 'bg-blue-50 dark:bg-blue-900/20 text-[#1F2BF3]'} shadow-sm`}
                    >
                        <Plus className="w-6 h-6" />
                    </motion.button>
                </div>

                {/* Add Input */}
                <AnimatePresence>
                    {isAdding && (
                        <motion.form 
                            initial={{ height: 0, opacity: 0, marginBottom: 0 }}
                            animate={{ height: 'auto', opacity: 1, marginBottom: 24 }}
                            exit={{ height: 0, opacity: 0, marginBottom: 0 }}
                            onSubmit={addTodo}
                            className="overflow-hidden"
                        >
                            <div className="relative">
                                <input 
                                    autoFocus
                                    type="text"
                                    value={newTask}
                                    onChange={(e) => setNewTask(e.target.value)}
                                    placeholder="What needs to be done?"
                                    className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl py-4 pl-6 pr-14 text-sm font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-[#1F2BF3] transition-all"
                                />
                                <button type="submit" className="absolute right-2 top-2 p-2 bg-[#1F2BF3] text-white rounded-xl shadow-md">
                                    <Check className="w-5 h-5" />
                                </button>
                            </div>
                        </motion.form>
                    )}
                </AnimatePresence>

                {/* List */}
                <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                    <AnimatePresence mode="popLayout">
                        {todos.length === 0 && !isAdding && (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="py-12 text-center"
                            >
                                <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-3xl flex items-center justify-center mx-auto mb-4 text-gray-300">
                                    <Sparkles className="w-8 h-8" />
                                </div>
                                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">All caught up!</p>
                            </motion.div>
                        )}
                        {todos.map((todo) => (
                            <motion.div 
                                key={todo.id}
                                layout
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95, x: -20 }}
                                className={`flex items-center gap-4 p-4 rounded-3xl transition-all border ${
                                    todo.is_completed 
                                    ? 'bg-gray-50/50 dark:bg-gray-800/30 border-transparent opacity-60' 
                                    : 'bg-white dark:bg-gray-800 border-gray-50 dark:border-gray-700 shadow-sm hover:shadow-md'
                                }`}
                            >
                                <motion.button 
                                    whileTap={{ scale: 0.8 }}
                                    onClick={() => toggleTodo(todo)}
                                    className={`shrink-0 transition-colors ${todo.is_completed ? 'text-emerald-500' : 'text-gray-300 hover:text-[#1F2BF3]'}`}
                                >
                                    {todo.is_completed ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                                </motion.button>

                                <div className="flex-1 min-w-0">
                                    {editingId === todo.id ? (
                                        <div className="flex items-center gap-2">
                                            <input 
                                                autoFocus
                                                type="text"
                                                value={editValue}
                                                onChange={(e) => setEditValue(e.target.value)}
                                                onBlur={() => saveEdit(todo.id)}
                                                onKeyDown={(e) => e.key === 'Enter' && saveEdit(todo.id)}
                                                className="w-full bg-transparent border-none p-0 text-sm font-bold text-gray-900 dark:text-white focus:ring-0"
                                            />
                                        </div>
                                    ) : (
                                        <p className={`text-sm font-bold truncate transition-all ${
                                            todo.is_completed 
                                            ? 'text-gray-400 line-through' 
                                            : 'text-gray-900 dark:text-white'
                                        }`}>
                                            {todo.task}
                                        </p>
                                    )}
                                </div>

                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onClick={() => startEdit(todo)}
                                        className="p-2 text-gray-400 hover:text-[#1F2BF3] hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all"
                                    >
                                        <Edit3 className="w-4 h-4" />
                                    </button>
                                    <button 
                                        onClick={() => deleteTodo(todo.id)}
                                        className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            {/* Celebration Effect Overlay */}
            <AnimatePresence>
                {showConfetti && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 pointer-events-none flex items-center justify-center z-50"
                    >
                        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md px-8 py-4 rounded-full border border-emerald-500/20 shadow-2xl flex items-center gap-3">
                            <div className="p-2 bg-emerald-500 rounded-full text-white">
                                <Sparkles className="w-5 h-5" />
                            </div>
                            <span className="font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest text-xs">All Tasks Completed!</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
