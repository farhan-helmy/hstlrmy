import PhoneNumberUtil from 'google-libphonenumber'
import CryptoJS from 'crypto-js'
import { env } from '../env/client.mjs'

interface CustomerData{
  email: string,
  name: string,
  phone_no: string,
  product_description: string,
  transaction_amount: number,
  order_number: string
}
export const checkPhoneNumber = (phoneNumber: string) => {
  // check if phone number empty
  if (phoneNumber === '') {
    return false
  }
  const phoneUtil = PhoneNumberUtil.PhoneNumberUtil.getInstance()
  const number = phoneUtil.parseAndKeepRawInput(phoneNumber, 'MY')
  return phoneUtil.isValidNumber(number)
}

export const securepaySign = (customerData: CustomerData) => {

  const signData = customerData.email + '|' + customerData.name + '|' + customerData.phone_no + '|' + '' + '|' + customerData.order_number + '|' + customerData.product_description + '|' + '' + '|' + customerData.transaction_amount + '|' + env.NEXT_PUBLIC_SECUREPAY_UID
  alert(signData)
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return CryptoJS.HmacSHA256(signData, env.NEXT_PUBLIC_SECUREPAY_CHECKSUM_TOKEN!).toString(CryptoJS.enc.Hex);
  
}
