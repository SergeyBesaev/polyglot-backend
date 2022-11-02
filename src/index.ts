import express, { NextFunction, Request, Response } from 'express'
import {Client} from "pg";
import {initDB} from "./db/init";
import {initApi} from "./api/lesson.controller";
import IRepo from "./repo/irepo";
import IService from "./service/iservice";
import {WordsRepo} from "./repo/words.repo";
import {LessonService} from "./service/lesson.service";
import {PartSpeechService} from "./service/part.speech.service";
import {PartSpeechRepo} from "./repo/part.speech.repo";
import {authController} from "./api/auth.controller";
import {UserRepo} from "./repo/userRepo";
import { AuthService } from './service/auth.service';
import {TokenRepo} from "./repo/token.repo";
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { env } from 'process'

export class App {

    async run() {
        const app = express()

        const dbClientDb = initDB()
        const repo = this.initRepo(await dbClientDb)
        const service = this.initService(repo)

        app.use(express.json())
        app.use(cookieParser())
        app.use(cors())

        initApi(app, service)
        authController(app, service)

        function errorHandler() {
            return async (errors: Error, req: Request, res: Response, next: NextFunction) => {

                console.error(errors.stack)
                const body = {
                    success: false,
                    errors: errors.message
                }
                res.status(500).json(body)
            }

        }

        function responseHandler() {
            return async (req: Request, res: Response, next: NextFunction) => {
                if (!req.route) {
                    return res.status(404).end()
                }
                console.log(`Success response to ${req.originalUrl}`)
                const body = {
                    success: true,
                    data: res.locals.body
                }
                return res.status(200).json(body).end()
            }

        }

        app.use(errorHandler())
        app.use(responseHandler())

        const port = env.PORT

        app.listen(port, () => {
            console.log(`Example app listening on port ${port}`)
        })
    }

    private initRepo(dbClient: Client): IRepo {
        return {
            repo: new WordsRepo(dbClient),
            partSpeechRepo: new PartSpeechRepo(dbClient),
            userRepo: new UserRepo(dbClient),
            tokenRepo: new TokenRepo(dbClient),
        }
    }

    private initService(repo: IRepo): IService {
        return {
            service: new LessonService(repo),
            speechService: new PartSpeechService(repo),
            authService: new AuthService(repo, repo),
        }
    }

}

void new App().run()
