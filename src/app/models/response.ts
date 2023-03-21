export interface Response {
  color: number,
  httpMethod: string,
  request: string,
  duration: number,
  statuscode: number,
  type: any,
  requestBody?: any
  responseBody?: any,
}
