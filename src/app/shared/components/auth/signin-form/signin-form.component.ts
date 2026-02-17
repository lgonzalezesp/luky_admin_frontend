
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LabelComponent } from '../../form/label/label.component';
import { CheckboxComponent } from '../../form/input/checkbox.component';
import { ButtonComponent } from '../../ui/button/button.component';
import { InputFieldComponent } from '../../form/input/input-field.component';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-signin-form',
  standalone: true,
  imports: [
    LabelComponent,
    CheckboxComponent,
    ButtonComponent,
    InputFieldComponent,
    RouterModule,
    ReactiveFormsModule
  ],
  templateUrl: './signin-form.component.html',
  styles: ``
})
export class SigninFormComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  showPassword = signal(false);
  isChecked = signal(false);
  errorMessage = signal<string | null>(null);

  togglePasswordVisibility() {
    this.showPassword.update((val) => !val);
  }

  onSignIn() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.errorMessage.set(null);
    this.authService.login(this.form.value).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Login error', err);
        this.errorMessage.set('Credenciales inválidas o error en el servidor');
      }
    });
  }
}
