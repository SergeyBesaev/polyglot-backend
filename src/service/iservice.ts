import { LessonService } from './lesson.service'
import { PartSpeechService } from './part.speech.service'
import { AuthService } from './auth.service'

export default interface IService {
    service: LessonService
    speechService: PartSpeechService
    authService: AuthService
}
