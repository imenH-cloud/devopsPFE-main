import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { User } from '../user';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-update',
  templateUrl: './user-update.component.html',
  styleUrl: './user-update.component.css',
  standalone: false  // AJOUTEZ CETTE LIGNE
})
export class UserUpdateComponent implements OnInit {
  onImageError($event: ErrorEvent) {
    throw new Error('Method not implemented.');
  }
  
  currentStep: number = 1;
  maxSteps: number = 3;
  isFinalStep: boolean = false;

  userForm: FormGroup;
  msg: string = "";
  show: boolean = false;
  showError: boolean = false;
  id!: number;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private activeRouter: ActivatedRoute
  ) {
    this.userForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      address: [''],
      zipCode: [''],
      picture: [''],
      password: ['', [Validators.required, Validators.minLength(6)]],
      active: [true]
    });
  }

  ngOnInit(): void {
    this.activeRouter.params.subscribe(async (params: Params) => {
      this.id = +params['id'];
      await this.getUserById(this.id);
    });
  }

  getUserById(id: number) {
    this.userService.getUserById(id).subscribe(user => {
      console.log("user", user);
      
      this.userForm.patchValue({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        address: user.address,
        zipCode: user.zipCode,
        picture: user.picture,
        active: user.active
      });
    });
  }

  goToPreviousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  goToNextStep(): void {
    if (this.currentStep < this.maxSteps) {
      this.currentStep++;
    }
  }

  Onsubmit() {
    // Initialiser l'objet user correctement
    let user: any = {};
    console.log('hello', this.userForm.value);
    
    // Utiliser directement les valeurs du formulaire
    user.firstName = this.userForm.get('firstName')?.value;
    user.lastName = this.userForm.get('lastName')?.value;
    user.email = this.userForm.get('email')?.value;
    user.phone = this.userForm.get('phone')?.value;
    user.address = this.userForm.get('address')?.value;
    user.zipCode = this.userForm.get('zipCode')?.value;
    user.picture = this.userForm.get('picture')?.value;
    user.password = this.userForm.get('password')?.value;
    user.active = this.userForm.get('active')?.value;
    
    console.log("user", user);
    
    this.userService.updateUser(this.id, user).subscribe(data => {
      console.log("data", data);
      this.show = true;
      this.msg = "Utilisateur modifié avec succès !";
    }, error => {
      this.showError = true;
      this.msg = "Veuillez remplir tous les champs correctement";
    });
  }
}