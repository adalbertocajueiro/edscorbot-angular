import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class PythonService {

  constructor(private httpClient: HttpClient) { }

  loadFile(formData: FormData) {
    return this.httpClient.post(environment.pythonApi.PYTHON_API_URL + '/python/load', formData)
  }

  convertFile(formData: FormData) {
    return this.httpClient.post(environment.pythonApi.PYTHON_API_URL + '/python/convert', formData)
  }
}
