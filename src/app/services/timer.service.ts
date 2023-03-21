import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TimerService {

  startTime: any = new Date();

  constructor() { }

  public setTimer() {
    this.startTime = new Date().getTime();
  }

  getTimer(): number {
    return new Date().getTime() - this.startTime;
  }
}
