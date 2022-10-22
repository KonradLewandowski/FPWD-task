const { readHelper, writeHelper } = require('../helper/repository.helper')

const memo = () => {}

const makeQuestionRepository = fileName => {
  const getQuestions = async () => {
    const questions = await readHelper(fileName)

    return questions
  }

  const getQuestionById = async questionId => {
    const questions = await readHelper(fileName)

    return questions.filter(({ id }) => id === questionId)
  }

  const addQuestion = async question => {
    const questions = await readHelper(fileName)
    const data = [...questions, question]

    await writeHelper(fileName, data)

    return await readHelper(fileName)
  }

  const getAnswers = async questionId => {
    const questions = await readHelper(fileName)

    return questions.filter(({ id }) => id === questionId)[0].answers
  }

  const getAnswer = async (questionId, answerId) => {
    const questions = await readHelper(fileName)
    return questions
      .filter(({ id }) => id === questionId)[0]
      .answers.filter(({ id }) => id === answerId)
  }

  const addAnswer = async (questionId, answer) => {
    const questions = await readHelper(fileName)
    const question = questions.find(({ id }) => id === questionId)

    question.answers = [...new Set([...question.answers, answer])]

    await writeHelper(fileName, questions)

    return question.answers
  }

  const deleteQuestion = async questionId => {
    const questions = await readHelper(fileName)

    const data = questions.filter(({ id }) => id !== questionId)

    await writeHelper(fileName, data)

    return data
  }

  const deleteAnswer = async (questionId, answerId) => {
    const questions = await readHelper(fileName)
    const question = questions.find(({ id }) => id === questionId)

    question.answers = question.answers.filter(({ id }) => id !== answerId)

    const data = [...new Set([...questions, question])]

    await writeHelper(fileName, data)

    return data
  }

  return {
    getQuestions,
    getQuestionById,
    addQuestion,
    getAnswers,
    getAnswer,
    addAnswer,
    deleteQuestion,
    deleteAnswer
  }
}

module.exports = { makeQuestionRepository }
