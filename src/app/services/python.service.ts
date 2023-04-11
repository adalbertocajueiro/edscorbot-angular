import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PYTHON_API_URL } from '../util/constants';

@Injectable({
  providedIn: 'root'
})
export class PythonService {

  constructor(private httpClient:HttpClient) { }

  convertFile(formData:FormData){
    return this.httpClient.post(PYTHON_API_URL + '/python/convert',formData)
  }
}
