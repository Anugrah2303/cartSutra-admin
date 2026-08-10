import axios from "axios"

export const API = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL,
    withCredentials: true
})

export const APIMultipart = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "multipart/form-data"
    }
})