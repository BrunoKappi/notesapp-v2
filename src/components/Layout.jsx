import React from 'react'
import { Outlet } from "react-router-dom"
import { connect } from 'react-redux'
import NavBar from './NavBar'
import Notification from './Notification'
import SyncIndicator from './ui/SyncIndicator'

const Layout = (props) => {

    if (props.LoggedUser.email !== 'Vazio' && props.LoggedUser.email) {
        return (
            <div className='flex flex-col h-screen overflow-hidden bg-background'>
                <NavBar />
                <main className='flex-1 overflow-auto bg-background'>
                    <Outlet />
                </main>
                <Notification />
                <SyncIndicator />
            </div>
        )
    } else {
        return (
            <div className='flex items-center justify-center h-screen bg-background text-muted-foreground'>
                Redirecionando...
            </div>
        )
    }
}

const ConnectedLayout = connect((state) => {
    return {
        LoggedUser: state.LoggedUser
    }
})(Layout)

export default ConnectedLayout