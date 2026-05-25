import { Component, inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/auth/services/auth.service';
import { HttpErrorResponse, httpResource } from '@angular/common/http';
import { subscribeOn, Subscription } from 'rxjs';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule,RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  registerForm: FormGroup = new FormGroup({
    
    name: new FormControl("", [Validators.required, Validators.minLength(3)]),
    username: new FormControl("", [Validators.required, Validators.minLength(3)]),
    email: new FormControl("", [Validators.required, Validators.email]),
    dateOfBirth: new FormControl("", [Validators.required,]),
    gender: new FormControl("", [Validators.required,]),
    password: new FormControl("", [
      Validators.required,
      Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/),
    ]),
    rePassword: new FormControl("", Validators.required),
  }, { validators: [this.confirmPassword] }
  // { updateOn: "submit" }
  
  );
  


  msgError: string = "";
  loading: boolean = false;

  registerSubscribe: Subscription = new Subscription()

  confirmPassword(group:AbstractControl) {
    const password = group.get('password')?.value;
    const rePassword = group.get('rePassword')?.value;

    if (rePassword !== password && rePassword!==" ") {
      // set errors control
      group.get('rePassword')?.setErrors({ mismatch: true });
      return{mismatch : true}
    }
    else {
      return null 
    }
}

  showPassword(element:HTMLInputElement): void{
    if (element.type==="password") {
      element.type ='text'
    }
    else {
      element.type='password'
    }
  }

  submitForm(): void{
    if (this.registerForm.valid) {
      this.loading = true;

      this.registerSubscribe.unsubscribe()
        this.registerSubscribe = this.authService.signUp(this.registerForm.value).subscribe({
        next: (res) => {
          // navigate login
          if (res.success) {
            
            console.log(res);
            this.router.navigate(['/login']); 
          }
        },
        error: (err: HttpErrorResponse) => {
          this.msgError = err.error.message;
          this.loading = false;
          
          // show error
        },
        complete: () => {
          this.loading = false;
        }
      })
    }
    else {
      this.registerForm.markAllAsTouched();
    }
  }
}  