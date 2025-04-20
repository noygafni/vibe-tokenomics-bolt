import { useEffect, useMemo, useState } from "react"
import { User } from "@supabase/supabase-js"
import { useSupabase } from "./useSupabase"

export const useAuth = () => {
    const supabase = useSupabase()
    const [userDetails, setUserDetails] = useState<User>({} as User)
    const isLoggedIn = useMemo(()=>!!userDetails?.id,[userDetails])

    useEffect(()=>{
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUserDetails(session?.user!);
          });
    },[])

    const signOut = async () => {
        await supabase.auth.signOut()
        console.log('signout')
        setUserDetails({} as User)
        // window.location.reload()
    }

    console.log(userDetails)

    return {
        userDetails, isLoggedIn, signOut, setUserDetails
    }
}