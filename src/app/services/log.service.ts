import { Injectable } from '@angular/core';
import { LogFunctions } from 'electron-log';

@Injectable({
  providedIn: 'root'
})
export class LogService {
  log: LogFunctions;

  constructor() { 
    this.log = window.require('electron-log');
  }

  silly(...params: any[]){
    this.log.silly(params);
  }

  debug(...params: any[]){
    this.log.debug(params);
  }

  verbose(...params: any[]){
    this.log.verbose(params);
  }

  info(...params: any[]){
    this.log.info(params);
  }

  warn(...params: any[]){
    this.log.warn(params);
  }

  error(...params: any[]){
    this.log.error(params);
  }
}
