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


}
