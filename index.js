const express = require('express')
const { urlencoded, json } = require('body-parser')
const { v4: uuidv4 } = require('uuid')

const makeRepositories = require('./middleware/repositories')
const catchAsync = require('./utils/catchAsync')
const AppError = require('./utils/appError')

const STORAGE_FILE_PATH = 'questions.json'
const PORT = 3000

const app = express()

app.use(urlencoded({ extended: true }))
app.use(json())
app.use(makeRepositories(STORAGE_FILE_PATH))

app.get('/', (_, res) => {
  res.json({ message: 'Welcome to responder!' })
})

app.get(
  '/questions',
  catchAsync(async (req, res, next) => {
    const data = await req.repositories.questionRepo.getQuestions()

    !data
      ? next(new AppError('No questions found', 404))
      : res.status(200).json({
          status: 'success',
          data
        })
  })
)

app.get(
  '/questions/:questionId',
  catchAsync(async (req, res, next) => {
    const paramId = req.params.questionId
    const data = await req.repositories.questionRepo.getQuestionById(paramId)

    !data
      ? next(new AppError('No question found with that ID', 404))
      : res.status(200).json({
          status: 'success',
          data
        })
  })
)

app.post(
  '/questions',
  catchAsync(async (req, res, next) => {
    const { author, summary } = req.body
    const body = {
      id: uuidv4(),
      author,
      summary,
      answers: []
    }

    const data = await req.repositories.questionRepo.addQuestion(body)

    !data
      ? next(new AppError('Can not post the question', 404))
      : res.status(201).json({
          status: 'success',
          data
        })
  })
)

app.get(
  '/questions/:questionId/answers',
  catchAsync(async (req, res, next) => {
    const { questionId } = req.params
    const data = await req.repositories.questionRepo.getAnswers(questionId)

    !data || !data.length
      ? next(new AppError('No answers found', 404))
      : res.status(200).json({
          status: 'success',
          data
        })
  })
)

app.get(
  '/questions/:questionId/answers/:answerId',
  catchAsync(async (req, res, next) => {
    const { questionId, answerId } = req.params
    const data = await req.repositories.questionRepo.getAnswer(
      questionId,
      answerId
    )

    !data
      ? next(new AppError('No answer found', 404))
      : res.status(200).json({
          status: 'success',
          data
        })
  })
)

app.post(
  '/questions/:questionId/answers',
  catchAsync(async (req, res, next) => {
    const { questionId } = req.params
    const { author, summary } = req.body

    const body = {
      id: uuidv4(),
      author,
      summary
    }

    const data = await req.repositories.questionRepo.addAnswer(questionId, body)

    !data
      ? next(new AppError('Can not post the answer', 404))
      : res.status(201).json({
          status: 'success',
          data
        })
  })
)

app.delete(
  '/questions/:questionId/',
  catchAsync(async (req, res, next) => {
    const { questionId } = req.params
    const data = await req.repositories.questionRepo.deleteQuestion(questionId)

    !data
      ? next(new AppError('Can not find and delete the question', 404))
      : res.status(200).json({
          status: 'success',
          data
        })
  })
)

app.delete(
  '/questions/:questionId/answers/:answerId',
  catchAsync(async (req, res, next) => {
    const { questionId, answerId } = req.params
    const data = await req.repositories.questionRepo.deleteAnswer(
      questionId,
      answerId
    )

    !data
      ? next(new AppError('Can not find and delete the answer', 404))
      : res.status(200).json({
          status: 'success',
          data
        })
  })
)

app.listen(PORT, () => {
  console.log(`Responder app listening on port ${PORT}`)
})
