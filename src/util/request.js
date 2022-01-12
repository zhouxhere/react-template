import axios from 'axios'

const defaultConfig = {
  baseURL: process.env.BASE_URL,
  timeout: 5 * 1000,
}

const requestHandler = (config) => {
  return config
}

const responseHandler = (response) => {
  return response
}

const errorHandler = (error) => {
  return Promise.reject(error)
}

const request = axios.create(defaultConfig)

request.interceptors.request.use(requestHandler, errorHandler)
request.interceptors.response.use(responseHandler, errorHandler)

export default request
