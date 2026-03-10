import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateEmployeeRequestDto, EmployeeListDto, EmployeeTableView } from '../models/data-view.models';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = 'http://localhost:5022';

  getEmployeeTableView(): Observable<EmployeeTableView[]> {
    return this.getEmployeesDto();
  }

  createEmployee(request: CreateEmployeeRequestDto): Observable<void> {
    return this.http.post<void>(`${this.apiBaseUrl}/Employee`, request);
  }

  private getEmployeesDto(): Observable<EmployeeListDto[]> {
    return this.http.get<EmployeeListDto[]>(`${this.apiBaseUrl}/EmployeeDataView`);
  }
}
