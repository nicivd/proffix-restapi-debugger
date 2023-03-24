import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TimerService {

  startTime: any = new Date();

  showSpinner: boolean = false;

  constructor() { }

  public setTimer() {
    this.startTime = new Date().getTime();
    this.showSpinner = true;
  }

  getTimer(): number {
    this.showSpinner = false;
    return new Date().getTime() - this.startTime;
  }
}
