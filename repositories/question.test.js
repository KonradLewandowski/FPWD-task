const { writeFile, rm } = require('fs/promises')
const { makeQuestionRepository } = require('./question')

describe('question repository', () => {
  const TEST_QUESTIONS_FILE_PATH = 'test-questions.json'
  let questionRepo

  beforeAll(async () => {
    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify([]))

    questionRepo = makeQuestionRepository(TEST_QUESTIONS_FILE_PATH)
  })

  afterAll(async () => {
    await rm(TEST_QUESTIONS_FILE_PATH)
  })

  test('should return a list of 0 questions', async () => {
    expect(await questionRepo.getQuestions()).toHaveLength(0)
  })

  test('should return a list of 2 questions', async () => {
    const testQuestions = [
      {
        id: 1,
        summary: 'What is my name?',
        author: 'Jack London',
        answers: []
      },
      {
        id: 2,
        summary: 'Who are you?',
        author: 'Tim Doods',
        answers: []
      }
    ]

    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))

    expect(await questionRepo.getQuestions()).toHaveLength(2)
  })

  test('should return a list of 1 questions filtered by ID', async () => {
    const testQuestions = [
      {
        id: 1,
        summary: 'What is my name?',
        author: 'Jack London',
        answers: []
      },
      {
        id: 2,
        summary: 'Who are you?',
        author: 'Tim Doods',
        answers: []
      }
    ]

    const testQuestionToEqual = {
      id: 2,
      summary: 'Who are you?',
      author: 'Tim Doods',
      answers: []
    }

    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))

    console.log(await questionRepo.getQuestionById(2))

    expect(await questionRepo.getQuestionById(2)).toEqual(testQuestionToEqual)
  })

  test('should return a list of 3 questions', async () => {
    const testQuestions = [
      {
        id: 1,
        summary: 'What is my name?',
        author: 'Jack London',
        answers: []
      },
      {
        id: 2,
        summary: 'Who are you?',
        author: 'Tim Doods',
        answers: []
      }
    ]

    const testAddQuestion = {
      id: 3,
      summary: 'What are you doing?',
      author: 'Konrad Lewandowski',
      answers: []
    }

    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))
    await questionRepo.addQuestion(testAddQuestion)

    expect(await questionRepo.getQuestions()).toHaveLength(3)
  })

  test('should return a list of 2 answers', async () => {
    const testAnswers = [
      {
        id: 1,
        summary: 'What is my name?',
        author: 'Jack London',
        answers: [
          {
            id: 1,
            author: 'Brian McKenzie',
            summary: 'The Earth is flat.'
          },
          {
            id: 2,
            author: 'Dr Strange',
            summary: 'It is egg-shaped.'
          }
        ]
      }
    ]

    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testAnswers))

    expect(await questionRepo.getAnswers(1)).toHaveLength(2)
  })

  test('should return a list of 1 answer filtered by ID ', async () => {
    const testAnswers = [
      {
        id: 1,
        summary: 'What is my name?',
        author: 'Jack London',
        answers: [
          {
            id: 1,
            author: 'Brian McKenzie',
            summary: 'The Earth is flat.'
          },
          {
            id: 2,
            author: 'Dr Strange',
            summary: 'It is egg-shaped.'
          }
        ]
      }
    ]

    const testAnswerToEqual = {
      id: 2,
      author: 'Dr Strange',
      summary: 'It is egg-shaped.'
    }

    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testAnswers))

    // expect(await questionRepo.getAnswer(1, 2)).toHaveLength(1)
    expect(await questionRepo.getAnswer(1, 2)).toEqual(testAnswerToEqual)
  })

  test('should return a list of 3 answers', async () => {
    const testAnswers = [
      {
        id: 1,
        summary: 'What is my name?',
        author: 'Jack London',
        answers: [
          {
            id: 1,
            author: 'Brian McKenzie',
            summary: 'The Earth is flat.'
          },
          {
            id: 2,
            author: 'Dr Strange',
            summary: 'It is egg-shaped.'
          }
        ]
      }
    ]

    const testAddAnswer = {
      id: 3,
      author: 'Konrad Lewandowski',
      summary: 'It is working!'
    }

    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testAnswers))
    await questionRepo.addAnswer(1, testAddAnswer)

    expect(await questionRepo.getAnswers(1)).toHaveLength(3)
  })

  test('should return a list of 1 question deleted by ID ', async () => {
    const testQuestions = [
      {
        id: 1,
        summary: 'What is my name?',
        author: 'Jack London',
        answers: []
      },
      {
        id: 2,
        summary: 'Who are you?',
        author: 'Tim Doods',
        answers: []
      }
    ]

    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))

    await questionRepo.deleteQuestion(2)

    expect(await questionRepo.getQuestions()).toHaveLength(1)
  })

  test('should return a list of 1 answer deleted by ID ', async () => {
    const testAnswers = [
      {
        id: 1,
        summary: 'What is my name?',
        author: 'Jack London',
        answers: [
          {
            id: 1,
            author: 'Brian McKenzie',
            summary: 'The Earth is flat.'
          },
          {
            id: 2,
            author: 'Dr Strange',
            summary: 'It is egg-shaped.'
          }
        ]
      }
    ]

    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testAnswers))

    await questionRepo.deleteAnswer(1, 2)

    expect(await questionRepo.getAnswers(1)).toHaveLength(1)
  })
})
