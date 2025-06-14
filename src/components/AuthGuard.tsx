import { ReactElement } from "react"
import { useAuth } from "../hooks/useAuth"
import {Navigate} from 'react-router-dom'

export interface AuthGuardProps {
    component: () => ReactElement
}

export const AuthGuard = ({component: Component}: AuthGuardProps) => {
    const {isLoggedIn} = useAuth()
    if (!isLoggedIn) {
        return <Navigate to="/login"/>
    }

    return <Component/>
}