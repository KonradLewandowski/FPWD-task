const {
  readHelper,
  writeHelper,
  findHelper
} = require('../helper/repository.helper')

const makeQuestionRepository = fileName => {
  const getQuestions = async () => {
    const questions = await readHelper(fileName)
    if (!questions) return

    return questions
  }

  const getQuestionById = async questionId => {
    const questions = await readHelper(fileName)
    const question = findHelper(questions, 'id', questionId)

    if (!question) return

    return { ...question }
  }

  const addQuestion = async question => {
    if (!question.author || !question.summary) return

    const questions = await readHelper(fileName)

    if (!questions) return

    const newQuestionsArray = [...questions, question]

    await writeHelper(fileName, newQuestionsArray)

    return await readHelper(fileName)
  }

  const getAnswers = async questionId => {
    const questions = await readHelper(fileName)
    const question = findHelper(questions, 'id', questionId)

    if (!question) return

    return question.answers
  }

  const getAnswer = async (questionId, answerId) => {
    const questions = await readHelper(fileName)
    const question = findHelper(questions, 'id', questionId)

    if (!question) return
    if (!question.answers.find(({ id }) => id === answerId)) return

    return question.answers.find(({ id }) => id === answerId)
  }

  const addAnswer = async (questionId, answer) => {
    if (!answer.author || !answer.summary) return

    const questions = await readHelper(fileName)
    const question = findHelper(questions, 'id', questionId)

    question.answers = [...new Set([...question.answers, answer])]

    await writeHelper(fileName, questions)

    return question.answers
  }

  const deleteQuestion = async questionId => {
    const questions = await readHelper(fileName)
    const question = findHelper(questions, 'id', questionId)

    if (!question) return

    const newQuestionsArray = questions.filter(({ id }) => id !== questionId)

    await writeHelper(fileName, newQuestionsArray)

    return newQuestionsArray
  }

  const deleteAnswer = async (questionId, answerId) => {
    const questions = await readHelper(fileName)
    const question = findHelper(questions, 'id', questionId)

    if (!question) return
    if (!question.answers.find(({ id }) => id === answerId)) return

    question.answers = question.answers.filter(({ id }) => id !== answerId)

    const newQuestionsArray = [...new Set([...questions, question])]

    await writeHelper(fileName, newQuestionsArray)

    return newQuestionsArray
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
