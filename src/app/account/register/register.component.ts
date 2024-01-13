import { CommonModule } from '@angular/common';

import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormControlName } from '@angular/forms';
import { Router } from '@angular/router';

import { Observable, fromEvent, merge } from 'rxjs';

import { User } from '../models/user';
import { AccountService } from '../services/account.service';
import { ValidationMessages, GenericValidator, DisplayMessage } from '../../utils/generic-form-validation';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  imports: [CommonModule, HttpClientModule],
  providers: [AccountService]
})
export class RegisterComponent implements OnInit, AfterViewInit {

  @ViewChildren(FormControlName, { read: ElementRef })
  formInputElements!: ElementRef[];

  errors: any[] = [];

  registerForm!: FormGroup;
  usuario!: User;

  validationMessages: ValidationMessages;
  genericValidator: GenericValidator;
  displayMessage: DisplayMessage = {};

  mudancasNaoSalvas: boolean = true;

  constructor(private fb: FormBuilder,
    private accountService: AccountService,
    private router: Router
    // ,private toastr: ToastrService
  ) {

    this.validationMessages = {
      email: {
        required: 'Informe o e-mail',
        email: 'Email inválido'
      },
      password: {
        required: 'Informe a senha',
        rangeLength: 'A senha deve possuir entre 6 e 15 caracteres'
      },
      confirmPassword: {
        required: 'Informe a senha novamente',
        rangeLength: 'A senha deve possuir entre 6 e 15 caracteres',
        equalTo: 'As senhas não conferem'
      }
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  ngOnInit(): void {

    // let senha = new FormControl('', [Validators.required, CustomValidators.rangeLength([6, 15])]);
    // let senhaConfirm = new FormControl('', [Validators.required, CustomValidators.rangeLength([6, 15]), CustomValidators.equalTo(senha)]);
    let senha = new FormControl('', [Validators.required]);
    let senhaConfirm = new FormControl('', [Validators.required]);
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: senha,
      confirmPassword: senhaConfirm
    });
  }

  ngAfterViewInit(): void {
    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

    merge(...controlBlurs).subscribe(() => {
      this.displayMessage = this.genericValidator.processarMensagens(this.registerForm);
      this.mudancasNaoSalvas = true;
    });
  }

  addAccount() {
    if (this.registerForm.dirty && this.registerForm.valid) {
      this.usuario = Object.assign({}, this.usuario, this.registerForm.value);

      this.accountService.registerUser(this.usuario)
        .subscribe(
          sucesso => { this.processarSucesso(sucesso) }
          // falha => {this.processarFalha(falha)}
        );

      this.mudancasNaoSalvas = false;
    }
  }

  processarSucesso(response: any) {
    this.registerForm.reset();
    this.errors = [];

    this.accountService.LocalStorage.saveUserLocalData(response);
    this.router.navigate(['/home'])

    // let toast = this.toastr.success('Registro realizado com Sucesso!', 'Bem vindo!!!');
    // if(toast){
    //   toast.onHidden.subscribe(() => {
    //     this.router.navigate(['/home']);
    //   });
    // }
  }

  processarFalha(fail: any) {
    this.errors = fail.error.errors;
    // this.toastr.error('Ocorreu um erro!', 'Opa :(');
  }
}