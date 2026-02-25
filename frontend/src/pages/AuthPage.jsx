import React, { useState } from 'react'
import { useAuthStore } from '../store/authStore'
import { motion } from 'framer-motion'
import { LogIn, UserPlus } from 'lucide-react'

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true)
    const { login, signup, isLoggingIn, isSigningUp } = useAuthStore()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [username, setUsername] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        if (isLogin) {
            login({ email, password })
        } else {
            signup({ email, password, username })
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-premium-light">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md glass p-8 rounded-[2rem] shadow-2xl"
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold tracking-tight">FocusTasks</h1>
                    <p className="text-gray-500 mt-2 font-medium">
                        {isLogin ? "Welcome back to your flow" : "Start your productivity journey"}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <div>
                            <label className="block text-sm font-semibold ml-4 mb-2">Username</label>
                            <input
                                type="text"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-6 py-4 rounded-2xl bg-white border-2 border-transparent focus:border-premium-accent outline-none transition-all"
                                placeholder="malhar_dev"
                            />
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-semibold ml-4 mb-2">Email Address</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-6 py-4 rounded-2xl bg-white border-2 border-transparent focus:border-premium-accent outline-none transition-all"
                            placeholder="hello@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold ml-4 mb-2">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-6 py-4 rounded-2xl bg-white border-2 border-transparent focus:border-premium-accent outline-none transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoggingIn || isSigningUp}
                        className="w-full bg-premium-dark text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all shadow-xl disabled:opacity-50"
                    >
                        {isLogin ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                        {isLogin ? (isLoggingIn ? "Logging in..." : "Continue") : (isSigningUp ? "Creating Account..." : "Join Now")}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-sm font-semibold text-gray-500 hover:text-premium-dark transition-colors"
                    >
                        {isLogin ? "New here? Create an account" : "Already have an account? Log in"}
                    </button>
                </div>
            </motion.div>
        </div>
    )
}

export default AuthPage
