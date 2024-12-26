'use client'

import { useState, ChangeEvent, FormEvent } from "react"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

interface FormData {
    firstname: string
    lastname: string
    email: string
    password: string
}

export default function Auth() {
    const [isSignUp, setIsSignUp] = useState(true)
    const [formData, setFormData] = useState<FormData>({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
    })
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
        // Clear error when user starts typing
        if (error) setError(null)
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError(null)
        setIsLoading(true)

        try {
            // Validate required fields
            if (isSignUp && (!formData.firstname || !formData.lastname)) {
                throw new Error('First name and last name are required')
            }

            if (!formData.email || !formData.password) {
                throw new Error('Email and password are required')
            }

            // Basic email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!emailRegex.test(formData.email)) {
                throw new Error('Please enter a valid email address')
            }

            // Password validation for signup
            if (isSignUp && formData.password.length < 8) {
                throw new Error('Password must be at least 8 characters long')
            }

            const response = await fetch('/api/auth', {  // Updated endpoint to match Next.js API route
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    type: isSignUp ? 'signup' : 'signin',
                    ...formData
                }),
            })

            // First check if response exists
            if (!response) {
                throw new Error('No response from server')
            }

            // Try to parse JSON response
            const data = await response.json()

            // Check for server errors
            if (!response.ok) {
                throw new Error(data.error || 'An error occurred')
            }

            // Handle successful response
            console.log(data.message)

            // Show success toast
            if (isSignUp) {
                toast.success('Signed up successfully! You can now sign in.', {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                })
                setFormData({
                    firstname: "",
                    lastname: "",
                    email: "",
                    password: "",
                })
            } else {
                toast.success('Signed in successfully!', {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                })
            }

            // TODO: Add your success handling here (e.g., redirect, show success message)
            
        } catch (error) {
            console.error('Auth error:', error)
            setError(error instanceof Error ? error.message : 'An unexpected error occurred')

            // Show error toast
            toast.error(error instanceof Error ? error.message : 'An unexpected error occurred', {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            {/* Toast Container for showing notifications */}
            <ToastContainer />
            <div className="flex items-center justify-center w-full h-[90vh]">
                <div className="flex items-center justify-center sm:w-[50%]">
                    <div className="flex flex-col gap-4 bg-gray-500/10 p-10 rounded-lg border border-white/20 shadow-primary-glow">
                        <h1 className="text-4xl font-normal text-center my-5">
                            {isSignUp ? 'Sign up' : 'Sign in'} to Continue
                        </h1>
                        <p className="text-center text-sm text-gray-400">
                            {isSignUp ? 'Sign up for Vito-x or ' : 'Sign in to your account or '}
                            <button 
                                type="button"
                                className="text-blue-500 hover:underline" 
                                onClick={() => {
                                    setIsSignUp(!isSignUp)
                                    setError(null)
                                    setFormData({
                                        firstname: "",
                                        lastname: "",
                                        email: "",
                                        password: "",
                                    })
                                }}
                            >
                                {isSignUp ? 'log in to your existing account' : 'create a new one'}
                            </button>
                        </p>
                        <form className="flex flex-col gap-4 mt-4 mb-10 px-10" onSubmit={handleSubmit}>
                            {isSignUp && (
                                <div className="flex gap-4">
                                    <input 
                                        type="text" 
                                        name="firstname"
                                        placeholder="First name" 
                                        className="py-3 px-2 rounded-md outline-none w-full"
                                        value={formData.firstname}
                                        onChange={handleChange}
                                        required
                                        minLength={2}
                                        maxLength={50}
                                    />
                                    <input 
                                        type="text" 
                                        name="lastname"
                                        placeholder="Last name"  
                                        className="py-3 px-2 rounded-md outline-none w-full"
                                        value={formData.lastname}
                                        onChange={handleChange}
                                        required
                                        minLength={2}
                                        maxLength={50}
                                    />
                                </div>
                            )}
                            <input 
                                type="email" 
                                name="email"
                                placeholder="Email" 
                                className="border-b-2 py-3 rounded-sm px-2 outline-none"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                            <input 
                                type="password" 
                                name="password"
                                placeholder="Password" 
                                className="border-b-2 py-3 rounded-md px-2 outline-none"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                minLength={8}
                                maxLength={100}
                            />
                            <button 
                                type="submit" 
                                className="bg-primary dark:bg-outline text-white py-2 rounded-md"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Sign In')}
                            </button>
                        </form>
                        {error && (
                            <p className="text-red-500 text-center text-sm px-4">
                                {error}
                            </p>
                        )}
                    </div>
                </div>
                <div className="flex items-center justify-center sm:w-[50%]">
                </div>
            </div>
        </>
    )
}
