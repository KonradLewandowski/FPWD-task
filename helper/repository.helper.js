const { readFile, writeFile } = require('fs/promises')

const readHelper = async fileName => {
  const fileContent = await readFile(fileName, { encoding: 'utf-8' })
  const json = JSON.parse(fileContent)

  return json
}

const writeHelper = async (fileName, data) => {
  try {
    await writeFile(fileName, JSON.stringify(data, null, 2), error =>
      error ? 'An error occured' : 'Data written successfully'
    )
  } catch (error) {
    return
  }
}

const findHelper = (elements, key, value) => {
  return elements.find(element => element[key] === value)
}

module.exports = { readHelper, writeHelper, findHelper }
