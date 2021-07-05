export const initialState = {//para que se pueda consumir en index.js
    modalVerOBorrar: false, 
    arrayImagenes: []

}



export const actionTypes = {
    SET_MODAL_VER_O_BORRAR: "SET_MODAL_VER_O_BORRAR",
    SET_ARRAY_IMAGENES: "SET_ARRAY_IMAGENES",


}



const reducer = (state, action) => {
    console.log(action)
    switch (action.type) {
        case "SET_MODAL_VER_O_BORRAR":
            return {
                ...state,
                modalVerOBorrar: action.modalVerOBorrar
            }

        case "SET_ARRAY_IMAGENES":
            return{
                ...state,
                arrayImagenes: action.arrayImagenes
            }

        default: return state; //en caso de default solo retornamos el state
    }

}

export default reducer;

