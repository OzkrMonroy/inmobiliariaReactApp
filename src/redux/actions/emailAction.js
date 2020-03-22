import axios from 'axios'

export const sendEmailAction = email => {
  return new Promise(async (resolve, reject) => {
    const dataResponse = await axios.post(`${process.env.REACT_APP_SEND_EMAIL_POINT}`, email)

    resolve(dataResponse)
  })
}