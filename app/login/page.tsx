'use client'

import { useState, ChangeEvent, FormEvent } from "react"

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

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError(null)

        try {
            const response = await fetch('/api/v1/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    type: isSignUp ? 'signup' : 'signin',
                    ...formData
                }),
            })

            let data
            try {
                data = await response.json()
            } catch (jsonError) {
                console.error('Failed to parse JSON:', jsonError)
                throw new Error('Invalid response from server')
            }

            if (!response.ok) {
                throw new Error(data.error || 'An error occurred')
            }

            // Handle successful sign up or sign in
            console.log(data.message)
            // Redirect or update UI as needed
        } catch (error) {
            setError((error as Error).message)
        }
    }

    return (
        <div className="flex items-center justify-center w-full h-[90vh] ">
            <div className="flex items-center justify-center sm:w-[50%] ">
                <div className="flex flex-col gap-4 bg-gray-500/10 p-10 rounded-lg border border-white/20 shadow-primary-glow">
                    <h1 className="text-4xl font-normal text-center my-5 ">{isSignUp ? 'Sign up' : 'Sign in'} to Continue </h1>
                    <p className=" text-center text-sm text-gray-400">
                        {isSignUp ? 'Sign up for Vito-x or ' : 'Sign in to your account or '}
                        <button 
                            className="text-blue-500 hover:underline" 
                            onClick={() => setIsSignUp(!isSignUp)}
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
                                    className="py-3 px-2 rounded-md outline-none"
                                    value={formData.firstname}
                                    onChange={handleChange}
                                    required
                                />
                                <input 
                                    type="text" 
                                    name="lastname"
                                    placeholder="Last name"  
                                    className="py-3 px-2 rounded-md outline-none"
                                    value={formData.lastname}
                                    onChange={handleChange}
                                    required
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
                        />
                        <button className="bg-primary dark:bg-outline text-white py-2 rounded-md">
                            {isSignUp ? 'Sign Up' : 'Sign In'}
                        </button>
                    </form>
                    {error && <p className="text-red-500 text-center">{error}</p>}
                </div>
            </div>
            <div className="flex items-center justify-center sm:w-[50%]">
            </div>
        </div>
    )
}

