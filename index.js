const express = require('express')
const { urlencoded, json } = require('body-parser')
const { v4: uuidv4 } = require('uuid')
const makeRepositories = require('./middleware/repositories')

const STORAGE_FILE_PATH = 'questions.json'
const PORT = 3000

const app = express()

app.use(urlencoded({ extended: true }))
app.use(json())
app.use(makeRepositories(STORAGE_FILE_PATH))

app.get('/', (_, res) => {
  res.json({ message: 'Welcome to responder!' })
})

app.get('/questions', async (req, res) => {
  const data = await req.repositories.questionRepo.getQuestions()

  res.status(200).json({
    status: 'success',
    data
  })
})

app.get('/questions/:questionId', async (req, res) => {
  const paramId = req.params.questionId
  const data = await req.repositories.questionRepo.getQuestionById(paramId)

  res.status(200).json({
    status: 'success',
    data
  })
})

app.post('/questions', async (req, res) => {
  const { author, summary } = req.body
  const body = {
    id: uuidv4(),
    author,
    summary,
    answers: []
  }

  const data = await req.repositories.questionRepo.addQuestion(body)

  res.status(201).json({
    status: 'success',
    data
  })
})

app.get('/questions/:questionId/answers', async (req, res) => {
  const { questionId } = req.params
  const data = await req.repositories.questionRepo.getAnswers(questionId)

  res.status(200).json({
    status: 'success',
    data
  })
})

app.get('/questions/:questionId/answers/:answerId', async (req, res) => {
  const { questionId, answerId } = req.params
  const data = await req.repositories.questionRepo.getAnswer(
    questionId,
    answerId
  )

  res.status(200).json({
    status: 'success',
    data
  })
})

app.post('/questions/:questionId/answers', async (req, res) => {
  const { questionId } = req.params
  const { author, summary } = req.body

  const body = {
    id: uuidv4(),
    author,
    summary
  }

  const data = await req.repositories.questionRepo.addAnswer(questionId, body)

  res.status(201).json({
    status: 'success',
    data
  })
})

app.delete('/questions/:questionId/', async (req, res) => {
  const { questionId } = req.params
  const data = await req.repositories.questionRepo.deleteQuestion(questionId)

  res.status(200).json({
    status: 'success',
    data
  })
})

app.delete('/questions/:questionId/answers/:answerId', async (req, res) => {
  const { questionId, answerId } = req.params
  const data = await req.repositories.questionRepo.deleteAnswer(
    questionId,
    answerId
  )

  res.status(200).json({
    status: 'success',
    data
  })
})

app.listen(PORT, () => {
  console.log(`Responder app listening on port ${PORT}`)
})
