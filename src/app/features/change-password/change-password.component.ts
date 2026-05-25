import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth/services/auth.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './change-password.component.html',
})
export class ChangePasswordComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  isLoading = false;
  errorMsg = '';
  successMsg = '';

  showOld = false;
  showNew = false;
  showConfirm = false;

  form = this.fb.group(
    {
      oldPassword: ['', [Validators.required]],
      newPassword: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/),
        ],
      ],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: this.passwordMatch }
  );

  passwordMatch(group: AbstractControl) {
    const pass = group.get('newPassword')?.value;
    const confirm = group.get('confirmPassword')?.value;

    if (confirm && pass !== confirm) {
      group.get('confirmPassword')?.setErrors({ mismatch: true });
    } else {
      group.get('confirmPassword')?.setErrors(null);
    }

    return null;
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMsg = '';
    this.successMsg = '';

    const data = {
      oldPassword: this.form.value.oldPassword,
      newPassword: this.form.value.newPassword,
    };

    this.authService.changePassword(data).subscribe({
      next: () => {
        this.successMsg = 'Password changed successfully 🔥';
        this.form.reset();
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMsg = err.error?.message || 'Something went wrong';
        this.isLoading = false;
      },
    });
  }
  showPassword(element: HTMLInputElement): void {
    element.type = element.type === 'password' ? 'text' : 'password';
  }
}