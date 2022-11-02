import IRepo from '../repo/irepo'
import { PartSpeechRepo } from '../repo/part.speech.repo'
import { PartOfSpeechEnum } from '../entity/part.of.speech.enum'
import { shuffle } from '../util/util'

export class PartSpeechService {
    private readonly repo: PartSpeechRepo

    constructor(repo: IRepo) {
        this.repo = repo.partSpeechRepo
    }

    public async returnAllPartOfSpeech() {
        return Object.values(PartOfSpeechEnum)
    }

    public async returnAllWords(partsOfSpeech: string) {
        let list = await this.repo.getAllWordsFromDb(partsOfSpeech)
        list = shuffle(list)
        return list
    }

}
