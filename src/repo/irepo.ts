import { WordsRepo } from './words.repo'
import { PartSpeechRepo } from './part.speech.repo'
import { UserRepo } from './userRepo'
import {TokenRepo} from "./token.repo";

export default interface IRepo {
    repo: WordsRepo
    partSpeechRepo: PartSpeechRepo
    userRepo: UserRepo
    tokenRepo: TokenRepo
}
