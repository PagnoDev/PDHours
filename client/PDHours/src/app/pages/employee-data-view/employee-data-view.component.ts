import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { catchError, finalize, forkJoin, of } from 'rxjs';
import { EmployeeTableView } from '../../core/models/data-view.models';
import { DataViewService } from '../../core/services/data-view.service';

@Component({
  selector: 'app-employee-data-view',
  imports: [CommonModule],
  templateUrl: './employee-data-view.component.html',
  styleUrl: './employee-data-view.component.scss'
})
export class EmployeeDataViewComponent implements OnInit {
  private readonly dataViewService = inject(DataViewService);

  private static readonly SQUAD_NOT_FOUND_MESSAGE = 'nao existe squad com este id';
  private static readonly CREATE_EMPLOYEE_ERROR = 'Nao foi possivel criar o usuario.';
  private static readonly CREATE_SQUAD_ERROR = 'Nao foi possivel criar a squad.';

  protected readonly loading = signal(true);
  protected readonly employees = signal<EmployeeTableView[]>([]);
  protected readonly hasError = signal(false);
  protected readonly hasNoSquads = signal(false);

  protected readonly createModalOpen = signal(false);
  protected readonly createSubmitting = signal(false);
  protected readonly createTouched = signal(false);
  protected readonly createUserName = signal('');
  protected readonly createEstimatedHours = signal('');
  protected readonly createSquadId = signal('');
  protected readonly createErrorMessage = signal('');
  protected readonly squadValidationMessage = signal('');

  protected readonly createSquadModalOpen = signal(false);
  protected readonly createSquadSubmitting = signal(false);
  protected readonly createSquadTouched = signal(false);
  protected readonly createSquadName = signal('');
  protected readonly createSquadErrorMessage = signal('');

  protected readonly userNameInvalid = signal(false);
  protected readonly estimatedHoursInvalid = signal(false);
  protected readonly createSquadNameInvalid = signal(false);

  ngOnInit(): void {
    this.loadEmployees();
  }

  protected openCreateModal(): void {
    this.createModalOpen.set(true);
    this.resetCreateEmployeeFormState();
  }

  protected closeCreateModal(): void {
    if (this.createSubmitting()) {
      return;
    }

    this.createModalOpen.set(false);
  }

  protected openCreateSquadModal(): void {
    this.createSquadModalOpen.set(true);
    this.resetCreateSquadFormState();
  }

  protected closeCreateSquadModal(): void {
    if (this.createSquadSubmitting()) {
      return;
    }

    this.createSquadModalOpen.set(false);
  }

  protected closeCreateErrorBanner(): void {
    this.createErrorMessage.set('');
  }

  protected onCreateUserNameInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.createUserName.set(input.value);
    this.userNameInvalid.set(false);
  }

  protected onCreateEstimatedHoursInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.createEstimatedHours.set(input.value);
    this.estimatedHoursInvalid.set(false);
  }

  protected onCreateSquadIdInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.createSquadId.set(input.value);
    this.squadValidationMessage.set('');
    this.clearCreateEmployeeErrorMessage();
  }

  protected onCreateSquadNameInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.createSquadName.set(input.value);
    this.createSquadNameInvalid.set(false);
    if (this.createSquadErrorMessage()) {
      this.createSquadErrorMessage.set('');
    }
  }

  protected submitCreateEmployee(): void {
    this.createTouched.set(true);

    const name = this.createUserName().trim();
    const estimateHours = Number(this.createEstimatedHours());
    const squadIdRaw = this.createSquadId().trim();
    const squadId = Number(squadIdRaw);

    const hasInvalidName = name.length === 0;
    const hasInvalidHours = !Number.isFinite(estimateHours) || estimateHours <= 0;
    const hasMissingSquadId = squadIdRaw.length === 0;
    const hasInvalidSquadId = !hasMissingSquadId && (!Number.isFinite(squadId) || squadId <= 0);

    this.userNameInvalid.set(hasInvalidName);
    this.estimatedHoursInvalid.set(hasInvalidHours);
    this.squadValidationMessage.set('');
    if (hasMissingSquadId) {
      this.squadValidationMessage.set('O id da squad e obrigatorio.');
    } else if (hasInvalidSquadId) {
      this.squadValidationMessage.set('O id da squad deve ser maior que 0.');
    }

    if (hasInvalidName || hasInvalidHours || hasMissingSquadId || hasInvalidSquadId) {
      return;
    }

    this.createSubmitting.set(true);
    this.createErrorMessage.set('');

    this.dataViewService
      .createEmployee({ name, estimateHours, squadId })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.handleCreateEmployeeError(error);
          return of(void 0);
        }),
        finalize(() => {
          this.createSubmitting.set(false);
        })
      )
      .subscribe(() => {
        if (!this.createErrorMessage()) {
          this.createModalOpen.set(false);
          this.loadEmployees();
        }
      });
  }

  protected submitCreateSquad(): void {
    this.createSquadTouched.set(true);

    const name = this.createSquadName().trim();
    const hasInvalidName = name.length === 0;
    this.createSquadNameInvalid.set(hasInvalidName);

    if (hasInvalidName) {
      return;
    }

    this.createSquadSubmitting.set(true);
    this.createSquadErrorMessage.set('');

    this.dataViewService
      .createSquad({ name })
      .pipe(
        catchError(() => {
          this.createSquadErrorMessage.set(EmployeeDataViewComponent.CREATE_SQUAD_ERROR);
          return of(void 0);
        }),
        finalize(() => {
          this.createSquadSubmitting.set(false);
        })
      )
      .subscribe(() => {
        if (!this.createSquadErrorMessage()) {
          this.createSquadModalOpen.set(false);
          this.loadEmployees();
        }
      });
  }

  private loadEmployees(): void {
    this.loading.set(true);
    this.hasError.set(false);
    this.hasNoSquads.set(false);

    forkJoin({
      squads: this.dataViewService.getSquadsList().pipe(catchError(() => of([]))),
      employees: this.dataViewService.getEmployeeTableView().pipe(catchError(() => of([])))
    })
      .pipe(
        finalize(() => {
          this.loading.set(false);
        })
      )
      .subscribe(({ squads, employees }) => {
        this.hasNoSquads.set(squads.length === 0);
        this.hasError.set(squads.length === 0 && employees.length === 0);
        this.employees.set(employees);
      });
  }

  private resetCreateEmployeeFormState(): void {
    this.createSubmitting.set(false);
    this.createTouched.set(false);
    this.createUserName.set('');
    this.createEstimatedHours.set('');
    this.createSquadId.set('');
    this.createErrorMessage.set('');
    this.squadValidationMessage.set('');
    this.userNameInvalid.set(false);
    this.estimatedHoursInvalid.set(false);
  }

  private resetCreateSquadFormState(): void {
    this.createSquadSubmitting.set(false);
    this.createSquadTouched.set(false);
    this.createSquadName.set('');
    this.createSquadErrorMessage.set('');
    this.createSquadNameInvalid.set(false);
  }

  private clearCreateEmployeeErrorMessage(): void {
    if (this.createErrorMessage()) {
      this.createErrorMessage.set('');
    }
  }

  private handleCreateEmployeeError(error: HttpErrorResponse): void {
    const errorMessage = this.readApiErrorMessage(error);
    const squadNotFoundError =
      this.isSquadNotFoundError(errorMessage) || error.status === 404 || error.status === 400;

    if (squadNotFoundError) {
      this.createErrorMessage.set(EmployeeDataViewComponent.SQUAD_NOT_FOUND_MESSAGE);
      this.squadValidationMessage.set('Nao existe squad com este id.');
      return;
    }

    this.createErrorMessage.set(errorMessage || EmployeeDataViewComponent.CREATE_EMPLOYEE_ERROR);
  }

  private readApiErrorMessage(error: HttpErrorResponse): string {
    if (typeof error.error === 'string') {
      return error.error;
    }

    if (error.error && typeof error.error.message === 'string') {
      return error.error.message;
    }

    if (error.error && typeof error.error.title === 'string') {
      return error.error.title;
    }

    return '';
  }

  private isSquadNotFoundError(message: string): boolean {
    const normalizedMessage = message.toLowerCase();
    return (
      normalizedMessage.includes('squad') &&
      (normalizedMessage.includes('nao existe') ||
        normalizedMessage.includes('not found') ||
        normalizedMessage.includes('does not exist'))
    );
  }
}
