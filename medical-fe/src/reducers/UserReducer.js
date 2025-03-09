const UserReducer =(user, action)=>{
    // eslint-disable-next-line default-case
    switch(action.type){
        case "login":
            return action.payload
        case "logout":
            return null
    }
    return user
}

export default UserReducer