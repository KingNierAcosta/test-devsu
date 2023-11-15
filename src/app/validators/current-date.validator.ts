import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function currentDateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const selectedDate = new Date(control.value);
    const currentDate = new Date();
    selectedDate.setUTCHours(0, 0, 0, 0);
    currentDate.setUTCHours(0, 0, 0, 0);

    return selectedDate < currentDate ? { currentDate: true } : null
  };
}
