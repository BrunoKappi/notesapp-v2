import React, { useState, useEffect } from 'react'
import './css/Notification.css'
import { connect } from 'react-redux'
import { X } from "lucide-react";
import { Notificar } from './utils/Utilidades';

const Notification = (props) => {

    const [Visible, setVisible] = useState(false);
    const [Tipo, setTipo] = useState('');
    const [NotificationDesc, setNotificationDesc] = useState('false');

    useEffect(() => {
        if (props.Notification.descricao) {
            setVisible(true)
            setNotificationDesc(props.Notification.descricao)
            setTipo(props.Notification.tipo)
            setTimeout(() => {
                setVisible(false)
                setNotificationDesc('')
                setTipo('')
                Notificar('')
            }, 4000);
        } else {
            setVisible(false)
            setNotificationDesc('')
            setTipo('') 
        }
    }, [props.Notification]);



    const DismissNotification = () => {
        setVisible(false)
        Notificar('')
        setNotificationDesc('')
    }


    const GetBackgroundColor = () => {
        console.log("TIPO",Tipo)
        if (Tipo === 'Erro')
            return 'NotificationErro'
        else if (Tipo === 'Info')
            return 'NotificationInfo'
        else if (Tipo === 'Evento')
            return 'NotificationEvent'
        else
            return 'NotificationEvent'
    }

    return (
        <div className={`Notification  ${Visible ? 'NotificationHidden NotificationOpen' : 'NotificationHidden'}`}>
            {Visible &&
                <div className={'NotificationBody ' + GetBackgroundColor()}>
                    <span>{NotificationDesc}</span>
                    <X onClick={DismissNotification} style={{ cursor: 'pointer' }} />
                </div>
            }
        </div>
    )
}


const ConnectedNotification = connect((state) => {
    return {
        LoggedUser: state.LoggedUser,
        Notification: state.Notification
    }
})(Notification)

export default ConnectedNotification 