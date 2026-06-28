import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import { connect } from 'react-redux'
import { LogarComGooglePopup, Login as LoginFirebase, SetLoggedUser } from '../utils/Utilidades';
import { DefaultLoggedUser } from '../../GlobalVars';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Loader2 } from 'lucide-react';

const Login = (props) => {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (props.LoggedUser.email !== 'Vazio' && props.LoggedUser.email)
            navigate("/App/Notas")
    }, [props.LoggedUser.email, navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        if (email && senha) {
            setIsLoading(true);
            setErro('');
            try {
                const message = await LoginFirebase(email.toLocaleLowerCase(), senha);
                const user = {
                    ...DefaultLoggedUser,
                    email: message.user.email,
                    Id: message.user.uid,
                    Search: ''
                };
                SetLoggedUser(user);
                navigate('/App/Notas');
            } catch (error) {
                setErro('Email ou Senha incorretos');
                setTimeout(() => setErro(''), 3000);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleGoogleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await LogarComGooglePopup();
            // Google login usually sets user or navigates elsewhere, or we might need to handle the promise
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
            {isLoading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-sm font-medium text-primary">Autenticando...</p>
                    </div>
                </div>
            )}
            
            <div className="w-full max-w-md space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
                <div className="flex flex-col items-center gap-4">
                    <img 
                        src="https://cdn.bkappi.com/ProjectsAssets/BkappiGeneral/bkappiIcon.ico" 
                        alt="Bkappi Notes" 
                        className="w-16 h-16 rounded-2xl shadow-sm"
                    />
                    <div className="text-center">
                        <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                            Bem-vindo de volta
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                            Faça login para acessar suas notas
                        </p>
                    </div>
                </div>

                <form onSubmit={handleLogin} className="space-y-6 mt-8">
                    {erro && (
                        <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/30 dark:text-red-400 rounded-md border border-red-200 dark:border-red-800 text-center font-medium">
                            {erro}
                        </div>
                    )}
                    
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input 
                                id="email"
                                type="email" 
                                placeholder="seu@email.com" 
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                disabled={isLoading}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Senha</Label>
                                <Link to="/Forget" className="text-sm font-medium text-primary hover:underline">
                                    Esqueci minha senha
                                </Link>
                            </div>
                            <Input 
                                id="password"
                                type="password" 
                                placeholder="••••••••" 
                                value={senha}
                                onChange={e => setSenha(e.target.value)}
                                disabled={isLoading}
                                required
                            />
                        </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading || !email || !senha}>
                        Entrar
                    </Button>
                </form>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t dark:border-gray-700" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white dark:bg-gray-800 px-2 text-gray-500">
                            Ou continue com
                        </span>
                    </div>
                </div>

                <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full" 
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                >
                    <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                        <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                    </svg>
                    Google
                </Button>

                <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
                    Não tem uma conta?{" "}
                    <Link to="/Registrar" className="font-semibold text-primary hover:underline">
                        Cadastre-se
                    </Link>
                </p>
            </div>
        </div>
    )
}

const ConnectedLogin = connect((state) => {
    return {
        LoggedUser: state.LoggedUser
    }
})(Login)

export default ConnectedLogin


