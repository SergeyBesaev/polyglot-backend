import {Client} from 'pg'
import {User} from '../entity/users/user'

export class UserRepo {
    constructor(private readonly dbClient: Client) {
    }

    public async saveUserInDB(user: User, password: string, activationLink: string): Promise<void> {
        await this.dbClient.query({
            text: `insert into users (name, password, email, activation_link)
                   values ($1, $2, $3, $4)`,
            values: [user.name, password, user.email, activationLink]
        })
    }

    public async fetchUserById(userId: number): Promise<User> {
        const result = await this.dbClient.query<User>({
            text: `select *
                   from users
                   where id = $1`,
            values: [userId]
        })
        return result.rows[0]
    }

    public async fetchUserByEmail(email: string): Promise<User> {
        const result = await this.dbClient.query<User>({
            text: `select *
                   from users
                   where email = $1`,
            values: [email]
        })
        return result.rows[0]
    }

    public async fetchUserByActivationLink(link: string): Promise<User> {
        const result = await this.dbClient.query<User>({
            text: 'select * from users where activation_link=$1',
            values: [link]
        })

        return result.rows[0]
    }

    public async activateUserInDB(email: string): Promise<void> {
        await this.dbClient.query({
            text: 'update users set is_active=true where email=$1',
            values: [email]
        })
    }

    public async getAllUsersFromDB(): Promise<User[]> {
        const result = await this.dbClient.query<User>({
            text: 'select * from users'
        })
        return result.rows
    }

}
