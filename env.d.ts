declare global {
    namespace NodeJS {
        interface ProcessEnv {
            PORT: number
            DB_HOST: string
            DB_PORT: number
            DB_USER: string
            DB_PASS: string
            DB_NAME: string
            JWT_KEY: string
        }
    }
}

export { }