import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../App.css';
import './signup.css';

function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate(); 

    const handleSignup = async (e) => {
        e.preventDefault();
        setMessage('');  // Clear previous messages
    
        try {
            // Make the signup request to FastAPI backend
            const response = await axios.post('http://127.0.0.1:8000/api/signup', {
                email: email,
                password: password,
                first_name: firstName,
                last_name: lastName
            }, { withCredentials: true });
    
            // If signup is successful, redirect
            setMessage('Signup successful! Please verify your email.');
            navigate('/project');  // Redirect to the dashboard or another page
    
        } catch (error) {
            console.error('Error during signup:', error);  // Log the error for debugging
            setMessage('Error signing up: ' + (error.response?.data?.detail || error.message));
        }
    };

    return (
        <div>
            <h2>Signup</h2>
            <form onSubmit={handleSignup}>
                <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First Name"
                    required
                />
                <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last Name"
                    required
                />
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                />
                <button type="submit">Signup</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}

export default Signup;
