import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { currentDateValidator } from '../../validators/current-date.validator';
import { DestroyComponent } from '../../components/destroy/destroy.component';
import { finalize, takeUntil } from 'rxjs';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.scss'
})
export class AddProductComponent extends DestroyComponent implements OnInit {

  form!: FormGroup;
  loading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService
  ) {
    super();
  }


  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: new FormControl('', {
        validators: [Validators.required, Validators.minLength(3), Validators.max(10)],
        asyncValidators: [this.productService.uniqueProductId()],
        updateOn: 'blur'
      }),
      name: new FormControl('', [Validators.required, Validators.minLength(5), Validators.max(100)]),
      description: new FormControl('', [Validators.required, Validators.minLength(10), Validators.max(200)]),
      logo: new FormControl('', Validators.required),
      date_release: new FormControl('', [Validators.required, currentDateValidator()]),
      date_revision: new FormControl({ value: '', disabled: true }, Validators.required),
    })


    this.dateRelease?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        this.dateRevision?.setValue(this.calculateNextYear(value));
      })
  }

  onSaveForm() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }


    this.loading = true;
    this.productService.addProduct(this.form.getRawValue())
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.loading = false)
      )
      .subscribe(() => this.form.reset());
  }

  get id() {
    return this.form.get('id');
  }

  get name() {
    return this.form.get('name');
  }

  get description() {
    return this.form.get('description');
  }

  get logo() {
    return this.form.get('logo');
  }

  get dateRelease() {
    return this.form.get('date_release');
  }

  get dateRevision() {
    return this.form.get('date_revision');
  }

  private calculateNextYear(currentDate: string) {
    const initialDate = new Date(currentDate);
    const nextYear = new Date(currentDate);
    nextYear.setFullYear(initialDate.getFullYear() + 1);
    return nextYear.toISOString().substring(0, 10);
  }

}
