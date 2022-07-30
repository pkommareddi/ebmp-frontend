import { useState, useEffect } from "react"
import axios from "axios"

export default function useAuth(code) {
    const [accessToken, setAccessToken] = useState()
    const [refreshToken, setRefreshToken] = useState()
    const [expiresIn, setExpiresIn] = useState()

    useEffect(() => {
        axios
            .post("http://localhost:8000/login", { code, })
            .then(res => {
                setAccessToken(res.data.access_token)
                setRefreshToken(res.data.refresh_token)
                setExpiresIn(res.data.expires_in)
                window.history.pushState({}, null, '/')
            })
            .catch((err) => {
                console.log(err)
                // window.location = "/"
            })
    }, [code])

    // useEffect(() => {
    //     if (!refreshToken || !expiresIn) return
    //     const interval = setInterval(() => {
    //         axios
    //             .post("http://localhost:8000/refresh", {
    //                 refreshToken,
    //             })
    //             .then(res => {
    //                 setAccessToken(res.data.accessToken)
    //                 setExpiresIn(res.data.expiresIn)
    //             })
    //             .catch(() => {
    //                 window.location = "/"
    //             })
    //     }, (expiresIn - 60) * 1000)

    //     return () => clearInterval(interval)
    // }, [refreshToken, expiresIn])

    return accessToken
}