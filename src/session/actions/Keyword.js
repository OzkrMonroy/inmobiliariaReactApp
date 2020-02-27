export const createKeywords = text => {
  const keywordArray = []

  const wordArray = text.match(/("[^"]+"|[^"\s]+)/g)

  wordArray.forEach(word => {
    let shortWord = ""

    word.split("").forEach(letter => {
      shortWord += letter

      keywordArray.push(shortWord.toLowerCase())
    })
  })

  let uniqueWord = ""
  text.split("").forEach(letter => {
    uniqueWord += letter
    keywordArray.push(uniqueWord.toLowerCase())
  })

  return keywordArray
}