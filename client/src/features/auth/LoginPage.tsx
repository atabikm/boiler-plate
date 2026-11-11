import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosInstance';

export default function LoginPage(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await api.post('/auth/login', { email, password });

            // Format response server: { success, message, data: { user, token } }
            if (res.data?.data?.token) {
                localStorage.setItem('token', res.data.data.token);
            }
            navigate('/accounts');
        }catch (err: any) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally{
            setLoading(false);
        }
    }   
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Login</h2>

                {error && (
                    <div className="mb-4.p-3.bg-red-100.bowarehouserder.border-red-400.text-red-400.text-red-700.rounded.text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="">
                        <label htmlFor="" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                        required placeholder="@mail.com"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div className="">
                        <label htmlFor="" className="block text-sm font-medium text-gray-700">Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                               required
                               placeholder="********"
                               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"/>
                    </div>

                    <button type="submit"
                        disabled={loading}
                        className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 disabled:opacity-50">
                        {loading ? 'Memproses...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    )
}