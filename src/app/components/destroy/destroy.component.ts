import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-destroy',
  standalone: true,
  imports: [CommonModule],
  template: '',
})
export class DestroyComponent implements OnDestroy {

  destroy$ = new Subject<boolean>();

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

}
