import store from '../store/store'
import { editUsuarioAction, addUsuarioAction } from '../store/actions/UsuariosActions'
import { setNotification } from '../store/actions/NotificationActions';
import { SetSidebarTag, ToggleSideBar, clearLoggedUser, SetSearchProp, ClearSearchProp, SetActiveTagsProp, ClearActiveTagsProp } from '../store/actions/LoggedUserActions'
//import { useNavigate } from 'react-router-dom';
import { logout, signInWithGoogle } from '../firebase/auth'
import { setLoggedUser } from '../store/actions/LoggedUserActions'
import { login, mudarSenha } from '../firebase/auth'
import { ref, uploadBytes, getDownloadURL, listAll, uploadBytesResumable, deleteObject } from "firebase/storage";
import { storage } from '../firebase/index'
import { updateUser, createUsuario, createNota, getNotas, updateNota } from '../firebase/metodos'
import { setUsuarios } from '../store/actions/UsuariosActions';
import { resetarSenha } from "../firebase/auth";
import { setNotas, editNotaAction } from '../store/actions/NotasActions'
import { DefaultLoggedUser } from '../../GlobalVars';

// FIREBASE
export const Login = (Email, Senha) => {
    return login(Email, Senha)
}

export const MudarSenha = (NovaSenha) => {
    return mudarSenha(NovaSenha)
}

export const ResetarSenha = (Email) => {
    return resetarSenha(Email)
}

export const ImageUpload = (ImagePath, ImageToUpload) => {
    const imageRef = ref(storage, ImagePath);
    return uploadBytes(imageRef, ImageToUpload)
}


export const GetCurrentUsuario = () => {
    return store.getState().Usuarios.find(Usuario => {
        return Usuario.email === store.getState().LoggedUser.email
    })
}
export const GetCurrentLoggedUser = () => {
    return store.getState().LoggedUser
}


export const FileUpload = (FilePath, FileToUpload) => {
    const fileRef = ref(storage, FilePath);
    return uploadBytesResumable(fileRef, FileToUpload)
}

export const GetUserUrlImage = (path) => {

    return getDownloadURL(ref(storage, path))


    //return getDownloadURL(item)




}

export const ListarImagens = () => {
    return listAll(ref(storage, "images/"))
}


export const UpdateUser = (EditedUser) => {
    return updateUser(EditedUser)
}

export const UpdateNota = (EditedNota) => {
    return updateNota(EditedNota)
}


export const CreateUsuarioFirebase = (NovoUsuario) => {
    return createUsuario(NovoUsuario)
}

export const LogarComGooglePopup = () => {
    return signInWithGoogle()
}


export const DeleteFile = (path) => {

    const desertRef = ref(storage, path);
    return deleteObject(desertRef)

}






// REDUX STORE 

export const Notificar = (Mensagem) => {
    store.dispatch(setNotification({ descricao: Mensagem, Tipo: 'Evento' }))
}

export const NotificarEvento = (Mensagem) => {
    store.dispatch(setNotification({ descricao: Mensagem, Tipo: 'Evento' }))
}
export const NotificarErro = (Mensagem) => {
    store.dispatch(setNotification({ descricao: Mensagem, tipo: 'Erro' }))
}
export const NotificarInfo = (Mensagem) => {
    store.dispatch(setNotification({ descricao: Mensagem, tipo: 'Info' }))
}

export const EditarUsuario = (docID, usuarioEditado) => {
    store.dispatch(editUsuarioAction(docID, usuarioEditado))
}

export const EditarNota = (ID, NotaEditada) => {
    UpdateNota(NotaEditada)
}

export const EditarNotaWithRedux = (ID, NotaEditada) => {
    UpdateNota(NotaEditada).then(() => {
        store.dispatch(editNotaAction(ID, NotaEditada))
    })
}

export const SetUsuarios = (Usuarios) => {
    store.dispatch(setUsuarios(Usuarios))
}
export const SetNotas = (Notas) => {
    store.dispatch(setNotas(Notas))
}

export const SetTab = (Tab) => {
    store.dispatch(SetSidebarTag(Tab))
}

export const SetSearchRedux = (search) => {
    console.log(search)
    store.dispatch(SetSearchProp(search))
}
export const ClearSearchRedux = () => {
    store.dispatch(ClearSearchProp())
}

export const SetActiveTagsRedux = (tags) => {
    store.dispatch(SetActiveTagsProp(tags))
}

export const ClearActiveTagsRedux = () => {
    store.dispatch(ClearActiveTagsProp())
}

export const ToggleSidebar = (Valor) => {
    store.dispatch(ToggleSideBar(Valor))
}

export const CreateUsuario = (UsuarioNovo) => {
    CreateUsuarioFirebase(UsuarioNovo).then(() => {
        store.dispatch(addUsuarioAction(UsuarioNovo))
    })
}

export const CreateNota = (novaNota) => {
    //store.dispatch(addNotaAction(novaNota))
    createNota(novaNota).then(() => {
        GetNotesFromFirebase(novaNota.email)
    })
}

export const SetLoggedUser = (User) => {
    store.dispatch(setLoggedUser({ ...DefaultLoggedUser, User }))
}

export const ClearLoggedUser = () => {
    store.dispatch(clearLoggedUser())
}


export const GetNotesFromFirebase = (email) => {
    getNotas(email)
}


//Geral 


export const Sair = () => {
    logout()
    SetNotas([])
    //Nav()
}

export const SairUmaPagina = () => {
    logout()
    SetNotas([])
    //useNavigate('../')
}

