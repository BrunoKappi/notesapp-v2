

const Notas = (state = [], action) => {
    switch (action.type) {
        case 'ADD_NOTA':
            return state.concat(action.novaNota)
        case 'CLEAR_ALL':
            return []
        case 'SET_NOTAS':
            return action.Notas
        case 'EDIT_NOTA':
            return state.map(nota => {
                return nota.docID === action.docID ? action.editedNota : nota
            })
        default:
            return state
    }
}


export default Notas
