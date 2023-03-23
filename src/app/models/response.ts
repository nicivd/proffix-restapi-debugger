import { Guid } from "guid-typescript";

export interface Response {
  id: string,
  color: number,
  httpMethod: string,
  request: string,
  duration: number,
  statuscode: number,
  type: any,
  requestBody?: any
  responseBody?: any,
}
