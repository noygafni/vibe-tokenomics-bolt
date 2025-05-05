import { useEffect, useState } from "react"
import { User } from "@supabase/supabase-js"
import { useSupabase } from "./useSupabase"

export const useAuth = () => {
    const supabase = useSupabase()
    const [authState, setAuthState] = useState<{ user: User | null; isLoggedIn: boolean }>({
        user: null,
        isLoggedIn: false
    })

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setAuthState({
                user: session?.user ?? null,
                isLoggedIn: !!session?.user
            })
        })

        // Subscribe to auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setAuthState({
                user: session?.user ?? null,
                isLoggedIn: !!session?.user
            })
        })

        // Cleanup subscription
        return () => {
            subscription.unsubscribe()
        }
    }, [supabase])

    const signOut = async () => {
        await supabase.auth.signOut()
        setAuthState({ user: null, isLoggedIn: false })
    }

    return {
        userDetails: authState.user,
        isLoggedIn: authState.isLoggedIn,
        signOut
    }
}