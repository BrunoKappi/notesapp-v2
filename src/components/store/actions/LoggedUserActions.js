

export const clearLoggedUser = () => {
    return ({
        type: 'CLEAR_LOGGED'
    })
}

export const setLoggedUser = (user) => {
    return ({
        type: 'SET_LOGGED',
        user
    })
}



export const ToggleSideBar = () => {
    return ({
        type: 'TOGGLE_SIDEBAR'
    })
}


export const SetSidebarTag = (tab) => {
    return ({
        type: 'SET_SIDEBAR_TAB',
        tab
    })
}


export const SetSearchProp = (search) => {
    return ({
        type: 'SET_SEARCH',
        search
    })
}

export const ClearSearchProp = () => {
    return ({
        type: 'SET_SEARCH'
    })
}

export const SetActiveTagsProp = (tags) => {
    return ({
        type: 'SET_ACTIVE_TAGS',
        tags
    })
}

export const ClearActiveTagsProp = () => {
    return ({
        type: 'CLEAR_ACTIVE_TAGS'
    })
}




