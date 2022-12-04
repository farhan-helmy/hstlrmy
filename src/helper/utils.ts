import PhoneNumberUtil from 'google-libphonenumber'

export const checkPhoneNumber = (phoneNumber: string) => {
  // check if phone number empty
  if (phoneNumber === '') {
    return false
  }
  const phoneUtil = PhoneNumberUtil.PhoneNumberUtil.getInstance()
  const number = phoneUtil.parseAndKeepRawInput(phoneNumber, 'MY')
  return phoneUtil.isValidNumber(number)
}
