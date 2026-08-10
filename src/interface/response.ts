export interface ResponseIF<T> {
    statuscode: number
    success: boolean
    message: string
    data: T;
}

