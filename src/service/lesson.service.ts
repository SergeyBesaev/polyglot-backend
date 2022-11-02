import { WordsRepo } from '../repo/words.repo'
import IRepo from '../repo/irepo'
import { Verb } from '../entity/verb'
import { VerbTensesEnum } from '../entity/verb.tensens.enum'
import { Pronoun } from '../entity/pronoun'
import {shuffle, validateAccessToken} from '../util/util'

export class LessonService {
    private readonly repo: WordsRepo

    constructor(repo: IRepo) {
        this.repo = repo.repo
    }

    public async checkUnfinishedLesson(token: string): Promise<boolean> {

        const dataFromAccessToken = validateAccessToken(token)

        const userIdFromAccessToken: number = dataFromAccessToken.userId

        const verbs: number[] =  await this.repo.checkUnfinishedLessonByUserId(userIdFromAccessToken)

        return verbs.length !== 0

    }

    public async makeRecordVerbsOnUser(token: string) {
        const dataFromAccessToken = validateAccessToken(token)

        const userIdFromAccessToken: number = dataFromAccessToken.userId

        await this.repo.removeAllVerbsByUserId(userIdFromAccessToken)

        const verbs = await this.repo.getAllVerbFromDb()
        shuffle(verbs)

        for (const verb of verbs) {
            const verbTenses: string = await this.fetchRandomVerbTenses()
            const pronoun: Pronoun = await this.fetchRandomNoun()
            await this.repo.makeRecordVerbsOnUserInDB(userIdFromAccessToken, verb.id, verbTenses, pronoun.id)
        }
    }

    public async getFirstVerbForController(token: string) {
        const phrase = await this.getFirstVerb(token)
        return phrase.rus

    }

    public async checkInputVerb(token: string, engForm: string) {

        const dataFromAccessToken = validateAccessToken(token)

        const userIdFromAccessToken: number = dataFromAccessToken.userId

        const phrase = await this.getFirstVerb(token)

        const verb: Verb = await this.repo.getFirstVerbByUserId(userIdFromAccessToken)

        const engRight: string = phrase.eng as string

        if (engRight === engForm) {
            console.log(engRight === engForm)
            await this.repo.deleteVerbById(verb.id)
            return await this.getFirstVerbForController(token)
        } else {
            console.log(typeof engForm)
            throw Error('Неверно')
        }
    }

    private async getFirstVerb(token: string) {
        const dataFromAccessToken = validateAccessToken(token)

        const userIdFromAccessToken: number = dataFromAccessToken.userId

        const verb: Verb = await this.repo.getFirstVerbByUserId(userIdFromAccessToken)

        const verbTense: string = await this.repo.getVerbTenseByUserId(userIdFromAccessToken)

        const pronoun: Pronoun = await this.repo.getFirstPronounByUserId(userIdFromAccessToken)

        return await this.makeDtoOutVerb(verb, verbTense, pronoun)
    }

    private async makeDtoOutVerb(verb: Verb, verbTense: string, pronoun: Pronoun) {
        if (verbTense === VerbTensesEnum.FutureQuestion) {
            switch (pronoun.eng) {
                case 'I':
                    return { eng: `Will I ${verb.engBase}?`, rus: `Я ${verb.rusFutureI}?` }
                case 'You':
                    return { eng: `Will you ${verb.engBase}?`, rus: `Ты ${verb.rusFutureYou}?` }
                case 'We':
                    return { eng: `Will we ${verb.engBase}?`, rus: `Мы ${verb.rusFutureWe}?` }
                case 'They':
                    return { eng: `Will they ${verb.engBase}?`, rus: `Они ${verb.rusFutureThey}?` }
                case 'He':
                    return { eng: `Will he ${verb.engBase}?`, rus: `Он ${verb.rusFutureSheHe}?` }
                default:
                    return { eng: `Will she ${verb.engBase}?`, rus: `Она ${verb.rusFutureSheHe}?` }
            }

        }
        if (verbTense === VerbTensesEnum.FutureStatement) {
            switch (pronoun.eng) {
                case 'I':
                    return { eng: `I will ${verb.engBase}`, rus: `Я ${verb.rusFutureI}` }
                case 'You':
                    return { eng: `You will ${verb.engBase}`, rus: `Ты ${verb.rusFutureYou}` }
                case 'We':
                    return { eng: `We will ${verb.engBase}`, rus: `Мы ${verb.rusFutureWe}` }
                case 'They':
                    return { eng: `They will ${verb.engBase}`, rus: `Они ${verb.rusFutureThey}` }
                case 'He':
                    return { eng: `He will ${verb.engBase}`, rus: `Он ${verb.rusFutureSheHe}` }
                default:
                    return { eng: `She will ${verb.engBase}`, rus: `Она ${verb.rusFutureSheHe}` }
            }

        }
        if (verbTense === VerbTensesEnum.FutureNegative) {
            switch (pronoun.eng) {
                case 'I':
                    return { eng: `I will not ${verb.engBase}`, rus: `Я не ${verb.rusFutureI}` }
                case 'You':
                    return { eng: `You will not ${verb.engBase}`, rus: `Ты не ${verb.rusFutureYou}` }
                case 'We':
                    return { eng: `We will not ${verb.engBase}`, rus: `Мы не ${verb.rusFutureWe}` }
                case 'They':
                    return { eng: `They will not ${verb.engBase}`, rus: `Они не ${verb.rusFutureThey}` }
                case 'He':
                    return { eng: `He will not ${verb.engBase}`, rus: `Он не ${verb.rusFutureSheHe}` }
                default:
                    return { eng: `She will not ${verb.engBase}`, rus: `Она не ${verb.rusFutureSheHe}` }
            }

        }
        if (verbTense === VerbTensesEnum.PresentQuestion) {
            switch (pronoun.eng) {
                case 'I':
                    return { eng: `Do I ${verb.engBase}?`, rus: `Я ${verb.rusPresentI}?` }
                case 'You':
                    return { eng: `Do you ${verb.engBase}?`, rus: `Ты ${verb.rusPresentYou}?` }
                case 'We':
                    return { eng: `Do we ${verb.engBase}?`, rus: `Мы ${verb.rusPresentWe}?` }
                case 'They':
                    return { eng: `Do they ${verb.engBase}?`, rus: `Они ${verb.rusPresentThey}?` }
                case 'He':
                    return { eng: `Does he ${verb.engBase}?`, rus: `Он ${verb.rusPresentSheHe}?` }
                default:
                    return { eng: `Does she ${verb.engBase}?`, rus: `Она ${verb.rusPresentSheHe}?` }
            }

        }
        if (verbTense === VerbTensesEnum.PresentStatement) {
            switch (pronoun.eng) {
                case 'I':
                    return { eng: `I ${verb.engBase}`, rus: `Я ${verb.rusPresentI}` }
                case 'You':
                    return { eng: `You ${verb.engBase}`, rus: `Ты ${verb.rusPresentYou}` }
                case 'We':
                    return { eng: `We ${verb.engBase}`, rus: `Мы ${verb.rusPresentWe}` }
                case 'They':
                    return { eng: `They ${verb.engBase}`, rus: `Они ${verb.rusPresentThey}` }
                case 'He':
                    return { eng: `He ${verb.engThird}`, rus: `Он ${verb.rusPresentSheHe}` }
                default:
                    return { eng: `She ${verb.engThird}`, rus: `Она ${verb.rusPresentSheHe}` }
            }

        }
        if (verbTense === VerbTensesEnum.PresentNegative) {
            switch (pronoun.eng) {
                case 'I':
                    return { eng: `I don't ${verb.engBase}`, rus: `Я не ${verb.rusPresentI}` }
                case 'You':
                    return { eng: `You don't ${verb.engBase}`, rus: `Ты не ${verb.rusPresentYou}` }
                case 'We':
                    return { eng: `We don't ${verb.engBase}`, rus: `Мы не ${verb.rusPresentWe}` }
                case 'They':
                    return { eng: `They don't ${verb.engBase}`, rus: `Они не ${verb.rusPresentThey}` }
                case 'He':
                    return { eng: `He doesn't ${verb.engBase}`, rus: `Он не ${verb.rusPresentSheHe}` }
                default:
                    return { eng: `She doesn't ${verb.engBase}`, rus: `Она не ${verb.rusPresentSheHe}` }
            }

        }
        if (verbTense === VerbTensesEnum.PastQuestion) {
            switch (pronoun.eng) {
                case 'I':
                    return { eng: `Did I ${verb.engBase}?`, rus: `Я ${verb.rusPastYouHeI}?` }
                case 'You':
                    return { eng: `Did you ${verb.engBase}?`, rus: `Ты ${verb.rusPastYouHeI}?` }
                case 'We':
                    return { eng: `Did we ${verb.engBase}?`, rus: `Мы ${verb.rusPastWeThey}?` }
                case 'They':
                    return { eng: `Did they ${verb.engBase}?`, rus: `Они ${verb.rusPastWeThey}?` }
                case 'He':
                    return { eng: `Did he ${verb.engBase}?`, rus: `Он ${verb.rusPastYouHeI}?` }
                default:
                    return { eng: `Did she ${verb.engBase}?`, rus: `Она ${verb.rusPastShe}?` }
            }

        }
        if (verbTense === VerbTensesEnum.PastStatement) {
            switch (pronoun.eng) {
                case 'I':
                    return { eng: `I ${verb.engSimplePast}`, rus: `Я ${verb.rusPastYouHeI}` }
                case 'You':
                    return { eng: `You ${verb.engSimplePast}`, rus: `Ты ${verb.rusPastYouHeI}` }
                case 'We':
                    return { eng: `We ${verb.engSimplePast}`, rus: `Мы ${verb.rusPastWeThey}` }
                case 'They':
                    return { eng: `They ${verb.engSimplePast}`, rus: `Они ${verb.rusPastWeThey}` }
                case 'He':
                    return { eng: `He ${verb.engSimplePast}`, rus: `Он ${verb.rusPastYouHeI}` }
                default:
                    return { eng: `She ${verb.engSimplePast}`, rus: `Она ${verb.rusPastShe}` }
            }

        } else {
            switch (pronoun.eng) {
                case 'I':
                    return { eng: `I didn't ${verb.engBase}`, rus: `Я не ${verb.rusPastYouHeI}` }
                case 'You':
                    return { eng: `You didn't ${verb.engBase}`, rus: `Ты не ${verb.rusPastYouHeI}` }
                case 'We':
                    return { eng: `We didn't ${verb.engBase}`, rus: `Мы не ${verb.rusPastWeThey}` }
                case 'They':
                    return { eng: `They didn't ${verb.engBase}`, rus: `Они не ${verb.rusPastWeThey}` }
                case 'He':
                    return { eng: `He didn't ${verb.engBase}`, rus: `Он не ${verb.rusPastYouHeI}` }
                default:
                    return { eng: `She didn't ${verb.engBase}`, rus: `Она не ${verb.rusPastShe}` }
            }
        }

    }

    private async fetchRandomNoun(): Promise<Pronoun> {
        const allNoun: Array<Pronoun> = await this.repo.getAllPronounsFromDb()
        const randomIndex: number = Math.random() * allNoun.length
        const pronoun = allNoun.at(randomIndex)
        if (!pronoun) {
            throw new Error('Impossible')
        }
        return pronoun
    }

    private async fetchRandomVerbTenses(): Promise<VerbTensesEnum> {
        const verbTenses: VerbTensesEnum[] = Object.values(VerbTensesEnum)

        const randomIndex: number = Math.random() * verbTenses.length

        const randomVerbTense = verbTenses.at(randomIndex)
        if (!randomVerbTense) {
            throw new Error('Error')
        }

        return randomVerbTense
    }

}
