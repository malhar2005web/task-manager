import React, { useEffect, useState } from 'react'
import { useTaskStore } from '../store/taskStore'
import { Plus, Search, Trash2, CheckCircle, Clock, AlertCircle, Loader, PlayCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'

const HomePage = () => {
    const { user, logout } = useAuthStore()
    const { tasks, fetchTasks, createTask, updateTask, deleteTask, loading, creating } = useTaskStore()
    const [title, setTitle] = useState('')
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('')

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchTasks({ search, status: statusFilter })
        }, 300)
        return () => clearTimeout(timer)
    }, [search, statusFilter, fetchTasks])

    const handleCreate = async (e) => {
        e.preventDefault()
        if (!title.trim()) {
            toast.error("Please enter a task title")
            return
        }
        if (title.trim().length < 3) {
            toast.error("Task title must be at least 3 characters")
            return
        }
        const success = await createTask({ title })
        if (success) setTitle('')
    }

    const cycleStatus = (task) => {
        let nextStatus = 'TODO'
        if (task.status === 'TODO') nextStatus = 'IN_PROGRESS'
        else if (task.status === 'IN_PROGRESS') nextStatus = 'DONE'
        else nextStatus = 'TODO'

        updateTask(task.id, { status: nextStatus })
    }

    return (
        <div className="min-h-screen bg-premium-light p-4 md:p-8 font-sans">
            <header className="max-w-4xl mx-auto flex justify-between items-center mb-12">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-premium-accent rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-premium-accent/20">T</div>
                    <h1 className="text-2xl font-black tracking-tighter text-premium-dark">FocusTasks</h1>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end">
                        <span className="text-sm font-bold text-premium-dark">@{user?.username}</span>
                        <button onClick={logout} className="text-xs font-semibold text-red-500 hover:text-red-600 transition-colors">Logout</button>
                    </div>
                    <img
                        src={user?.image || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + user?.username}
                        alt=""
                        className="w-10 h-10 rounded-full border-2 border-white shadow-md bg-white"
                    />
                </div>
            </header>

            <main className="max-w-4xl mx-auto space-y-8">
                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search your tasks..."
                            className="w-full pl-12 pr-4 py-4 rounded-[2rem] glass focus:ring-2 focus:ring-premium-accent outline-none transition-all shadow-sm font-medium"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <select
                        className="px-6 py-4 rounded-[2rem] glass outline-none cursor-pointer font-bold text-gray-600 shadow-sm appearance-none min-w-[140px] text-center"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="">All Status</option>
                        <option value="TODO">To Do</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="DONE">Done</option>
                    </select>
                </div>

                {/* Create Task Card */}
                <form onSubmit={handleCreate} className="glass p-2 pl-6 rounded-[2rem] flex gap-3 shadow-xl border-white border-opacity-60 bg-white bg-opacity-40">
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        disabled={creating}
                        placeholder="What's a priority today?"
                        className="flex-1 bg-transparent py-4 outline-none text-lg font-bold placeholder:text-gray-400 text-premium-dark"
                    />
                    <button
                        type="submit"
                        disabled={creating}
                        className="bg-premium-dark text-white w-14 h-14 rounded-[1.5rem] flex items-center justify-center hover:opacity-90 transition-all active:scale-95 shadow-lg disabled:opacity-50"
                    >
                        {creating ? <Loader className="w-6 h-6 animate-spin" /> : <Plus className="w-7 h-7" />}
                    </button>
                </form>

                {/* Tasks List */}
                <div className="space-y-4">
                    {loading && tasks.length === 0 ? (
                        <div className="flex justify-center py-20">
                            <Loader className="w-8 h-8 text-premium-accent animate-spin" />
                        </div>
                    ) : (
                        <AnimatePresence mode='popLayout'>
                            {tasks.map((task) => (
                                <motion.div
                                    layout
                                    key={task.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className={`glass p-6 rounded-[2rem] flex items-center gap-5 transition-all shadow-sm border-white border-opacity-40 ${task.status === 'DONE' ? 'opacity-60 bg-gray-50 bg-opacity-50' :
                                            task.status === 'IN_PROGRESS' ? 'bg-blue-50 bg-opacity-60 border-blue-200' :
                                                'bg-white bg-opacity-60'
                                        }`}
                                >
                                    <button
                                        onClick={() => cycleStatus(task)}
                                        className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${task.status === 'DONE' ? 'bg-green-500 border-green-500 text-white shadow-lg shadow-green-200' :
                                                task.status === 'IN_PROGRESS' ? 'bg-premium-accent border-premium-accent text-white shadow-lg shadow-blue-200' :
                                                    'border-gray-300 hover:border-premium-accent bg-white'
                                            }`}
                                    >
                                        {task.status === 'DONE' && <CheckCircle className="w-5 h-5" />}
                                        {task.status === 'IN_PROGRESS' && <PlayCircle className="w-5 h-5 fill-white" />}
                                        {task.status === 'TODO' && <div className="w-2 h-2 rounded-full bg-transparent" />}
                                    </button>

                                    <div className="flex-1 min-w-0">
                                        <h3 className={`font-black text-lg truncate ${task.status === 'DONE' ? 'line-through text-gray-500 font-bold' :
                                                task.status === 'IN_PROGRESS' ? 'text-premium-accent' : 'text-premium-dark'
                                            }`}>
                                            {task.title}
                                        </h3>
                                        <div className="flex items-center gap-3 mt-1.5 font-bold">
                                            <span className={`text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-lg ${task.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-600' :
                                                    task.status === 'DONE' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                                                }`}>
                                                {task.status.replace('_', ' ')}
                                            </span>
                                            <span className={`text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-lg ${task.priority === 'HIGH' ? 'bg-red-100 text-red-600' :
                                                    task.priority === 'MEDIUM' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                {task.priority || 'MEDIUM'}
                                            </span>
                                            <span className="text-[11px] text-gray-400 flex items-center gap-1.5 ml-auto">
                                                <Clock className="w-3.5 h-3.5" /> {new Date(task.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => deleteTask(task.id)}
                                        className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    )}

                    {!loading && tasks.length === 0 && (
                        <div className="text-center py-20 bg-white bg-opacity-30 rounded-[3rem] border-2 border-dashed border-gray-200">
                            <div className="w-20 h-20 bg-gray-100 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                                <AlertCircle className="w-10 h-10 text-gray-400" />
                            </div>
                            <p className="text-gray-500 font-bold text-xl text-premium-dark">All clear!</p>
                            <p className="text-gray-400 font-medium mt-1">Ready to start a new task?</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}

export default HomePage
