import React from 'react'
import './css/bottomBar.css'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Home, User } from "lucide-react";



const BottomBar = (props) => {



    return (
        <div className='bottomBar'>
            <ul className="bottomList">
                <li className="bottomListLI">
                    <Link to="/App/Notas"> <Home className='botomBarIcon' /> </Link>
                </li>

                <li className="bottomListLI">
                    <Link to="/App/Profile"> <User className='botomBarIcon' /> </Link>
                </li>
            </ul>
        </div>
    )
}



 
const ConnectedBottomBar = connect((state) => {
    return {
        LoggedUser: state.LoggedUser,
        Usuario: state.Usuarios.find(Usuario => {
            return Usuario.email === state.LoggedUser.email
        })
    }
})(BottomBar)

export default ConnectedBottomBar

