import {Client} from 'pg'

export class PartSpeechRepo {

    constructor(private readonly dbClient: Client) {
    }

    public async getAllWordsFromDb(partsOfSpeech: string) {
        const result = await this.dbClient.query({
            text: `select eng, rus, section from ${partsOfSpeech}`
        })
        return result.rows
    }

    public async getSelectedCategoryOfNouns(part: string) {
        const result = await this.dbClient.query({
            text: `select eng, rus, transcription from nouns where section = $1`,
            values: [part]
        })
        return result.rows
    }

}
