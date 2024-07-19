import axios from 'axios'

const baseURL = './json/GameConfig.json'

export const instance = axios.create({
  baseURL,
  timeout: 100000
})
