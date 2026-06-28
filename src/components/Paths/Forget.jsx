import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import { connect } from 'react-redux'
import { ResetarSenha } from '../utils/Utilidades';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Loader2 } from 'lucide-react';

const Forget = (props) => {
    const [Email, setEmail] = useState('');
    const [Erro, setErro] = useState('');
    const [Loading, setLoading] = useState(false);
    const [Sucesso, setSucesso] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (props.LoggedUser?.email && props.LoggedUser.email !== 'Vazio') {
            navigate("/App/Notas")
        }
    }, [props.LoggedUser, navigate]);

    const HandleSubmit = (e) => {
        e.preventDefault()
        if (Email) {
            setLoading(true)
            setErro('')
            setSucesso(false)
            ResetarSenha(Email).then((res) => {
                setSucesso(true)
                setLoading(false)
            }).catch(e => {
                setErro("Este email não existe!")
                setLoading(false)
            })
        }
    }

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
                            Esqueceu sua senha?
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                            Digite seu email e enviaremos um link para redefinir sua senha.
                        </p>
                    </div>
                </div>

                <form onSubmit={HandleSubmit} className="space-y-6 mt-8">
                    {Erro && (
                        <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/30 dark:text-red-400 rounded-md border border-red-200 dark:border-red-800 text-center font-medium">
                            {Erro}
                        </div>
                    )}
                    {Sucesso && (
                        <div className="p-3 text-sm text-green-700 bg-green-50 dark:bg-green-900/30 dark:text-green-400 rounded-md border border-green-200 dark:border-green-800 text-center font-medium">
                            Email de recuperação enviado!
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
                    </div>

                    <Button type="submit" className="w-full" disabled={Loading || !Email}>
                        Enviar Email de Recuperação
                    </Button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
                    Lembrou sua senha?{" "}
                    <Link to="/" className="font-semibold text-primary hover:underline">
                        Entrar
                    </Link>
                </p>
            </div>
        </div>
    )
}

const ConnectedForget = connect((state) => {
    return {
        LoggedUser: state.LoggedUser
    }
})(Forget)

export default ConnectedForget
