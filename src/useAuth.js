import { useState, useEffect } from "react"
import axios from "axios"

export default function useAuth(code) {
    const [accessToken, setAccessToken] = useState()

    useEffect(() => {
        axios
            .post("http://localhost:8000/login", { code, })
            .then(res => {
                setAccessToken(res.data.access_token)
                window.history.pushState({}, null, '/')
            })
            .catch((err) => {
                console.log(err)
            })
    }, [code])
    return accessToken;
}