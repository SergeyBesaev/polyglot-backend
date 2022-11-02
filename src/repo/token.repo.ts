import {Client} from "pg";

export class TokenRepo {
    constructor(private readonly dbClient: Client) {
    }

    public async saveRefreshTokenInDB(userId: number, refreshToken: string): Promise<void> {
        await this.dbClient.query({
            text: `insert into refresh_tokens (id_user, refresh_token)
                   values ($1, $2)`,
            values: [userId, refreshToken]
        })
    }

    public async findRefreshTokenInDB(userId: number): Promise<string> {
        const result = await this.dbClient.query({
            text: 'select refresh_token from refresh_tokens where id_user = $1',
            values: [userId]
        })

        return result.rows[0]
    }

    public async findRefreshTokenInDbByToken(token: string): Promise<string> {
        const result = await this.dbClient.query({
            text: 'select refresh_token from refresh_tokens where refresh_token = $1',
            values: [token]
        })

        return result.rows[0]
    }

    public async updateRefreshTokenInDB(userId: number, token: string): Promise<void> {
        await this.dbClient.query({
            text: 'update refresh_tokens set refresh_token = $1 where id_user = $2',
            values: [token, userId]
        })
    }

    public async removeRefreshTokenFromDB(refreshToken: string): Promise<void> {
        await this.dbClient.query({
            text: 'delete from refresh_tokens where refresh_token = $1',
            values: [refreshToken]
        })
    }
}
