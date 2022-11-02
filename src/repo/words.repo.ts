import {Client} from 'pg'
import {Pronoun} from '../entity/pronoun'
import {Verb} from '../entity/verb'

export class WordsRepo {
    constructor(private readonly dbClient: Client) {
    }

    public async removeAllVerbsByUserId(userId: number): Promise<void> {
        await this.dbClient.query({
            text: 'delete from users_words where user_id=$1',
            values: [userId]
        })
    }

    public async checkUnfinishedLessonByUserId(userId: number): Promise<number[]> {
        const result = await this.dbClient.query({
            text: 'select id from users_words where user_id = $1',
            values: [userId]
        })

        return result.rows

    }

    public async makeRecordVerbsOnUserInDB(user_id: number, word_id: number, verbTenses: string, pronounId: number): Promise<void> {
        await this.dbClient.query({
            text: 'insert into users_words (user_id, word_id, verb_form, pronoun_id) values ($1, $2, $3, $4)',
            values: [user_id, word_id, verbTenses, pronounId]
        })
    }

    public async getFirstVerbByUserId(userIdFromAccessToken: number): Promise<Verb> {
        const result = await this.dbClient.query({
            text: `select verbs.id,
                          eng                "engBase",
                          eng_third          "engThird",
                          eng_simple_past    "engSimplePast",
                          rus                "rusBase",
                          rus_present_i      "rusPresentI",
                          rus_present_we     "rusPresentWe",
                          rus_present_you    "rusPresentYou",
                          rus_present_they   "rusPresentThey",
                          rus_present_he_she "rusPresentSheHe",
                          rus_future_i       "rusFutureI",
                          rus_future_we      "rusFutureWe",
                          rus_future_you     "rusFutureYou",
                          rus_future_they    "rusFutureThey",
                          rus_future_he_she  "rusFutureSheHe",
                          rus_past_you_he_i  "rusPastYouHeI",
                          rus_past_we_they   "rusPastWeThey",
                          rus_past_she       "rusPastShe"
                   from verbs
                            left join users_words uw on verbs.id = uw.word_id
                   where user_id = $1`,
            values: [userIdFromAccessToken]
        })
        return result.rows[0]
    }

    public async getFirstPronounByUserId(userId: number): Promise<Pronoun> {
        const result = await this.dbClient.query({
            text: 'select * from pronouns left join users_words uw on pronouns.id = uw.pronoun_id where user_id=$1',
            values: [userId]
        })

        return result.rows[0]
    }

    public async deleteVerbById(verbId: number): Promise<void> {
        await this.dbClient.query({
            text: 'delete from users_words where word_id=$1',
            values: [verbId]
        })
    }

    public async getVerbTenseByUserId(userId: number): Promise<string> {
        const result = await this.dbClient.query({
            text: 'select verb_form from users_words where user_id=$1',
            values: [userId]
        })

        return result.rows[0]
    }

    public async getAllVerbFromDb(): Promise<Verb[]> {
        const result = await this.dbClient.query<Verb>({
            text: `select id,
                          eng                "engBase",
                          eng_third          "engThird",
                          eng_simple_past    "engSimplePast",
                          rus                "rusBase",
                          rus_present_i      "rusPresentI",
                          rus_present_we     "rusPresentWe",
                          rus_present_you    "rusPresentYou",
                          rus_present_they   "rusPresentThey",
                          rus_present_he_she "rusPresentSheHe",
                          rus_future_i       "rusFutureI",
                          rus_future_we      "rusFutureWe",
                          rus_future_you     "rusFutureYou",
                          rus_future_they    "rusFutureThey",
                          rus_future_he_she  "rusFutureSheHe",
                          rus_past_you_he_i  "rusPastYouHeI",
                          rus_past_we_they   "rusPastWeThey",
                          rus_past_she       "rusPastShe"
                   from verbs`
        })
        return result.rows
    }

    public async getAllPronounsFromDb(): Promise<Pronoun[]> {
        const result = await this.dbClient.query<Pronoun>({
            text: 'select id, eng eng, rus rus from pronouns'
        })

        return result.rows
    }


}
