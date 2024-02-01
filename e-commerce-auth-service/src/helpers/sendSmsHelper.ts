import axios from 'axios'

const sendSmsWithBulkSms = async (phoneNumber: string, message: string) => {
  if (phoneNumber && message) {
    const response = await axios.post(
      `http://bulksmsbd.net/api/smsapi?api_key=B6SZG5Q2Ut2dKioeTouL&type=text&number=${phoneNumber}&senderid=8809617611021&message=${message}`
    )
    return response.data
  } else {
    return { response_code: 501 }
  }
}

export default sendSmsWithBulkSms
