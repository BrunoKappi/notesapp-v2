import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { Search, Moon, Sun, X, Menu } from "lucide-react"
import { Sair, GetUserUrlImage, SetSearchRedux, ClearSearchRedux, SetTab } from './utils/Utilidades'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import ManageLabelsDialog from "./ManageLabelsDialog"
import SearchFilterPopover from "./SearchFilterPopover"

const NavBar = (props) => {
    const [searchQuery, setSearchQuery] = useState('')
    const [imageUrl, setImageUrl] = useState('')
    const [isDark, setIsDark] = useState(false)
    const [showLabelsDialog, setShowLabelsDialog] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        if (props.Usuario?.uid) {
            GetUserUrlImage(`images/notesApp/${props.Usuario.uid}`)
                .then(setImageUrl)
                .catch(() => setImageUrl(''))
        }
    }, [props.Usuario?.uid])

    useEffect(() => {
        // Toggle dark mode classes on html/body
        if (isDark) {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }, [isDark])

    const handleSearchChange = (e) => {
        const val = e.target.value
        setSearchQuery(val)
        SetSearchRedux(val)
    }

    const clearSearch = () => {
        setSearchQuery('')
        ClearSearchRedux()
    }

    const handleLogout = () => {
        Sair()
        navigate('/')
    }

    const userName = props.Usuario?.nome ? `${props.Usuario.nome} ${props.Usuario.sobrenome || ''}` : 'Usuário'
    const userInitials = props.Usuario?.nome ? props.Usuario.nome.charAt(0).toUpperCase() : 'U'

    return (
      <>
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center h-16 px-4 gap-4">
            <div className="flex items-center gap-4 min-w-[200px]">
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                </Button>
                <Link to="/App/Notas" className="flex items-center gap-2">
                    <img 
                        src="https://cdn.bkappi.com/ProjectsAssets/BkappiGeneral/bkappiIcon.ico" 
                        alt="Logo" 
                        className="h-8 w-8 rounded-lg"
                    />
                    <span className="hidden sm:inline-block font-semibold text-lg">Bkappi Notes</span>
                </Link>
            </div>

            <div className="flex-1 max-w-2xl mx-auto flex items-center gap-2">
                <div className="relative group flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    </div>
                    <Input
                        type="text"
                        placeholder="Pesquisar..."
                        style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                        className="w-full bg-muted/50 border-transparent focus-visible:bg-background focus-visible:ring-1 transition-all rounded-lg"
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                    {searchQuery && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute inset-y-0 right-0 h-full w-10 hover:bg-transparent"
                            onClick={clearSearch}
                        >
                            <X className="h-4 w-4 text-muted-foreground" />
                        </Button>
                    )}
                </div>
                <SearchFilterPopover />
            </div>

            <div className="flex items-center gap-2 min-w-[200px] justify-end">
                <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setIsDark(!isDark)}
                    className="rounded-full"
                >
                    {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    <span className="sr-only">Toggle theme</span>
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={imageUrl} alt={userName} />
                                <AvatarFallback>{userInitials}</AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">{userName}</p>
                                <p className="text-xs leading-none text-muted-foreground">
                                    {props.LoggedUser?.email}
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => {
                            const newTab = props.LoggedUser.CurrentSidebarTab === 'Arquivadas' ? 'Notas' : 'Arquivadas';
                            SetTab(newTab)
                        }}>
                            {props.LoggedUser.CurrentSidebarTab === 'Arquivadas' ? 'Ver Notas Ativas' : 'Ver Notas Arquivadas'}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setShowLabelsDialog(true)}>
                            Gerenciar Marcadores
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {}}>
                            Trocar Conta
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                            Sair
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
        <ManageLabelsDialog open={showLabelsDialog} onOpenChange={setShowLabelsDialog} />
      </>
    )
}

const ConnectedNavBar = connect((state) => {
    return {
        LoggedUser: state.LoggedUser,
        Usuario: state.Usuarios.find(u => u.email === state.LoggedUser.email) || {}
    }
})(NavBar)

export default ConnectedNavBar

