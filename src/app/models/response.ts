export interface Response {
  color: number,
  httpMethod: string,
  request: string,
  duration: number,
  statuscode: number,
  type: string,
  responseBody?: any,
  requestBody?: any
}
