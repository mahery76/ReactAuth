import {useState, createContext} from 'react'

const AuthContext = createContext({});
// eslint-disable-next-line react/prop-types
function AuthProvider({children}) {
    const [auth, setAuth] = useState({});
  return (
    <div>
        <AuthContext.Provider value={{auth, setAuth}}>
            {children}
        </AuthContext.Provider>
    </div>
  )
}
export { AuthContext as default, AuthProvider }
