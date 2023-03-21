import CryptoJS from 'crypto-js'
const fs = window.require('fs')
const DATA_FILE_NAME = 'data.json'
const SECRET_KEY = 'yamonus'

const isContain = (data, characters, exceptions = []) => {
  if (exceptions.some((character) => data.toLowerCase().includes(character.toLowerCase())))
    return false
  return characters.some((character) => data.toLowerCase().includes(character.toLowerCase()))
}

const normalize = (data) => {
  return data
    .replace(/[áàảãạ]/g, 'a')
    .replace(/[ắằẳẵặ]/g, 'ă')
    .replace(/[ấầẩẫậ]/g, 'â')
    .replace(/[éèẻẽẹ]/g, 'e')
    .replace(/[ếềểễệ]/g, 'ê')
    .replace(/[íìỉĩị]/g, 'i')
    .replace(/[óòỏõọ]/g, 'o')
    .replace(/[ốồổỗộ]/g, 'ô')
    .replace(/[ớờởỡợ]/g, 'ơ')
    .replace(/[úùủũụ]/g, 'u')
    .replace(/[ứừửữự]/g, 'ư')
    .replace(/[ýỳỷỹỵ]/g, 'y')
}

const superNormalize = (data) => {
  return data
    .replace(/[áàảãạăắằẳẵặâấầẩẫậ]/g, 'a')
    .replace(/[éèẻẽẹêếềểễệ]/g, 'e')
    .replace(/[íìỉĩị]/g, 'i')
    .replace(/[óòỏõọôốồổỗộơớờởỡợ]/g, 'o')
    .replace(/[úùủũụưứừửữự]/g, 'u')
    .replace(/[ýỳỷỹỵ]/g, 'y')
    .replace(/[đ]/g, 'd')
}

const isMatch = (data, string) => {
  data = data.toLowerCase()
  string = string.toLowerCase()
  const regex1 = /.*[áàảãạắằẳẵặấầẩẫậéèẻẽẹếềểễệíìỉĩịóòỏõọốồổỗộớờởỡợúùủũụứừửữựýỳỷỹỵ]+.*/g
  const regex2 = /.*[âăêôơưđ]+.*/g
  return regex1.test(string)
    ? data.includes(string)
    : regex2.test(string)
    ? normalize(data).includes(string)
    : superNormalize(data).includes(string)
}

const handleEncode = (data) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString()
}

const handleDecode = (data) => {
  return JSON.parse(CryptoJS.AES.decrypt(data.toString(), SECRET_KEY).toString(CryptoJS.enc.Utf8))
}

const saveData = (data) => {
  fs.writeFileSync(DATA_FILE_NAME, handleEncode(data))
}

const readData = async () => {
  try {
    const rawData = await fs.readFileSync(DATA_FILE_NAME)
    const data = handleDecode(rawData)
    return data
  } catch (error) {
    saveData({ isShowHelp: true, isHideCommands: false, tasks: [] })
    return { isShowHelp: true, isHideCommands: false, tasks: [] }
  }
}

export { isContain, isMatch, saveData, readData }
