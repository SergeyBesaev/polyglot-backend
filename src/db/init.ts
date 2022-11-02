import { Client } from 'pg'
require('dotenv').config()

export async function initDB() {
    const client = new Client({
        user: process.env.userDB as string,
        host: process.env.hostDB as string,
        database: process.env.database as string,
        password: process.env.passwordDB as string,
        port: process.env.portDB as unknown as number,
    })

    await client.connect()
    return client
}
