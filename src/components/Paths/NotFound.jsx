import React from 'react'
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';

const NotFound = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 text-center">
            <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                Página não encontrada
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md">
                A página que você está procurando não existe ou foi movida.
            </p>
            <Button asChild>
                <Link to="/">
                    Voltar para o Início
                </Link>
            </Button>
        </div>
    )
}

export default NotFound
