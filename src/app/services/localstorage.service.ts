import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  public store(key: string, object: any){
    localStorage.setItem(key, JSON.stringify(object));
  }

  public fetch<TObject>(key: string): TObject {
    return JSON.parse(localStorage.getItem(key)) as TObject
  }

  public remove(key: string){
    localStorage.removeItem(key);
  }
}
