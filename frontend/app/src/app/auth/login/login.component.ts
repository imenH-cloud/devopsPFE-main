import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import AuthService from '../auth.service';
import { Login } from '../auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: false
})
export class LoginComponent {
  loginForm!: FormGroup;
  showPassword = false;
  isLoading = false;
  error = '';

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly authService: AuthService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  async onSubmit(): Promise<void> {
    console.log("Form value:", this.loginForm.value);
    
    if (this.loginForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.error = '';
    this.isLoading = true;

    try {
      const credentials: Login = this.loginForm.value;
      console.log("Sending credentials:", credentials);
      
      this.authService.loginUser(credentials).subscribe({
        next: (response) => { 
          console.log('✅ Connexion réussie', response);
          
          // Stocker le token et l'ID utilisateur
          if (response.access_token) {
            // Utiliser localStorage pour plus de fiabilité
            localStorage.setItem('token', response.access_token);
            localStorage.setItem('idUser', response.idUser);
            
            // Aussi stocker dans les cookies
            document.cookie = `token=${response.access_token}; path=/; max-age=${24 * 60 * 60}`;
            document.cookie = `idUser=${response.idUser}; path=/; max-age=${24 * 60 * 60}`;
            
            console.log('✅ Token stocké');
            
            // Rediriger vers le dashboard
            this.isLoading = false;
            this.router.navigate(['/dashboard']).catch(err => {
              console.error('Erreur de navigation:', err);
              // Fallback: redirection directe
              window.location.href = '/dashboard';
            });
          } else {
            throw new Error('Pas de token reçu');
          }
        },
        error: (error) => {
          console.error('❌ Erreur de connexion:', error);
          this.isLoading = false;
          
          // Améliorer le message d'erreur
          if (error.status === 401) {
            this.error = 'Email ou mot de passe incorrect';
          } else if (error.status === 0) {
            this.error = 'Impossible de se connecter au serveur. Vérifiez votre connexion.';
          } else if (error.error?.message) {
            this.error = error.error.message;
          } else {
            this.error = 'Erreur de connexion. Veuillez réessayer.';
          }
        }
      });
    } catch (error) {
      this.isLoading = false;
      this.error = error instanceof Error ? error.message : 'Erreur de connexion';
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return `${fieldName} est requis`;
      if (field.errors['email']) return 'Format email invalide';
      if (field.errors['minlength']) return `Minimum ${field.errors['minlength'].requiredLength} caractères`;
    }
    return '';
  }
}
