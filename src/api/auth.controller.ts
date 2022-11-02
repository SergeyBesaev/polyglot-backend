import express from 'express'
import asyncHandler from 'express-async-handler'
import IService from '../service/iservice'
import {UserData} from "../entity/users/user.data";
import {env} from 'process'

export function authController(
    app: express.Express,
    { authService }: IService,
) {

    app.route('/register')
        .post(asyncHandler(async (req, res, next) => {
            const user: UserData = await authService.registration(req.body)
            res.locals.body = {user}
            res.cookie('refreshToken', user.refreshToken, {maxAge: 259200000, httpOnly: true})
            next()
        }))

    app.route('/login')
        .post(asyncHandler(async (req, res, next) => {
            const user: UserData = await authService.authorization(req.body)
            res.locals.body = {user}
            res.cookie('refreshToken', user.refreshToken, {maxAge: 259200000, httpOnly: true})
            next()
        }))

    app.route('/logout')
        .post(asyncHandler(async (req, res, next) => {
            const {refreshToken} = req.cookies
            res.locals.body = await authService.logout(refreshToken)
            res.clearCookie('refreshToken')
            next()
        }))

    app.route('/refresh')
        .get(asyncHandler(async (req, res, next) => {
            const {refreshToken} = req.cookies
            const user: UserData = await authService.refresh(refreshToken)
            res.locals.body = {user}
            res.cookie('refreshToken', user.refreshToken, {maxAge: 259200000, httpOnly: true})
            next()
    }))

    app.route('/activate/:link')
        .get(asyncHandler(async (req, res, next) => {
            const link: string = req.params.link
            await authService.activate(link)
            res.redirect(env.CLIENT_IRL as string)
        }))

}
