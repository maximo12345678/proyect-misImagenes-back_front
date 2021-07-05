import {createContext, useContext, useReducer} from 'react'

export const StateContext = createContext()//aca creamos la capa CONTEXT API. linea roja esquema. para poder pasar las variables de un componente a otro

//este provee la herramienta para pasar los datos de un componetne a otro 
export const StateProvider = ({ reducer, initialState, children}) => ( 
    <StateContext.Provider value={useReducer(reducer, initialState)}>
        {children}
    </StateContext.Provider>
)

//y  este permite que se pueda consumir desde cualquier componetne los cambios de estado de initialState
export const useStateValue = () => useContext(StateContext)
