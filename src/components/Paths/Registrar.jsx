import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom';
import { CreateUsuario, LogarComGooglePopup, SetLoggedUser } from '../utils/Utilidades';
import { DefaultLoggedUser } from '../../GlobalVars';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Loader2 } from 'lucide-react';

const Registrar = (props) => {
    const [Email, setEmail] = useState('');
    const [Senha, setSenha] = useState(''); 
    const [Erro, setErro] = useState('');
    const [Loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const HandleSubmitSigin = (e) => {
        e.preventDefault()
        setErro('')
        if (Email && Senha) {
            setLoading(true)
            if (Senha.length > 5) {
                CreateUsuario({
                    nome: '', sobrenome: '', email: Email.toLocaleLowerCase(),
                    senha: Senha
                }).then(() => {
                    const user = { ...DefaultLoggedUser, email: Email.toLocaleLowerCase() }
                    SetLoggedUser(user)
                    setLoading(false)
                    navigate('/App/Notas')
                }).catch((error) => {
                    setErro("Este E-mail já está Cadastrado")
                    setLoading(false)
                })
            } else {
                setErro('Sua Senha deve ter pelo menos 6 caracteres')
                setLoading(false)
            }
        } else {
            setErro("Preencha todos os campos")
        }
    }

    const handleGoogleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await LogarComGooglePopup();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
            {Loading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-sm font-medium text-primary">Carregando...</p>
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
                            Criar uma conta
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                            Preencha os dados abaixo para começar
                        </p>
                    </div>
                </div>

                <form onSubmit={HandleSubmitSigin} className="space-y-6 mt-8">
                    {Erro && (
                        <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/30 dark:text-red-400 rounded-md border border-red-200 dark:border-red-800 text-center font-medium">
                            {Erro}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input 
                                id="email"
                                type="email" 
                                placeholder="seu@email.com" 
                                value={Email}
                                onChange={e => setEmail(e.target.value)}
                                disabled={Loading}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Senha</Label>
                            <Input 
                                id="password"
                                type="password" 
                                placeholder="Mínimo 6 caracteres" 
                                value={Senha}
                                onChange={e => setSenha(e.target.value)}
                                disabled={Loading}
                                required
                            />
                        </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={Loading || !Email || !Senha}>
                        Cadastrar
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
                    disabled={Loading}
                >
                    <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                        <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                    </svg>
                    Google
                </Button>

                <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
                    Já tem uma conta?{" "}
                    <Link to="/" className="font-semibold text-primary hover:underline">
                        Entrar
                    </Link>
                </p>
            </div>
        </div>
    )
}

const ConnectedRegistrar = connect((state) => {
    return {
        LoggedUser: state.LoggedUser
    }
})(Registrar)

export default ConnectedRegistrar
