import axios from 'axios'
import qs from 'qs'
import { TreeData } from "../types/tree";
axios.defaults.baseURL = 'http://localhost:3000';
export const getChildren = (data: TreeData) => {
  return axios.get(`/getChildren?${qs.stringify({ key: data.key, name: data.name })}`).then(res => res.data).catch(error => console.error(error))
}

export const writeLog = (type: string, time: any) => {
  return axios.post(`/write_log?${qs.stringify({ type, time})}`)
}