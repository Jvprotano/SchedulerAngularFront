import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { LocationService } from '../services/location.service';
import { HttpClientModule } from '@angular/common/http';
import { StringUtils } from '../../utils/string-utils';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create',
  standalone: true,
  providers: [LocationService],
  imports: [ReactiveFormsModule, HttpClientModule, NgxSpinnerModule, CommonModule, FormsModule],
  templateUrl: './create.component.html',
  styleUrl: './create.component.css'
})
export class CreateComponent {
  createForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
  ) {

    this.createForm = this.fb.group({
      cep: ['', Validators.required],
      city: [''],
      street: [''],
      state: [''],
      neighborhood: [''],
      complement: [''],
      number: [''],
      isPhysicalCompany: true,
      image: [''],
      cnpj: [''],
      name: [''],
      email: [''],
    });
  }

  ngOnInit(): void {
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 500);
  }

  locationService = inject(LocationService);


  searchCEP(): void {
    var cep = this.createForm.get('cep')?.value;

    cep = StringUtils.onlyNumbers(cep);

    if (cep?.length !== 8) {
      return;
    }

    this.locationService.obterDadosCep(cep).subscribe(
      (dados: any) => this.updateForm(dados),
      // (error: any) => console.error('Erro ao obter dados do CEP', error)
    );
  }

  onFileChange(event: any) {
    console.log("entrou file change")
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);

      reader.onload = () => {
        this.createForm.patchValue({
          image: reader.result as string
        });
      };
    }
  }

  hasImage(): boolean {
    return !StringUtils.isNullOrEmpty(this.createForm.get('image')?.value);
  }

  removeImage(): void {
    this.createForm.patchValue({
      image: ''
    });
  }

  updateForm(dados: any): void {
    this.createForm.patchValue({
      city: dados.localidade,
      street: dados.logradouro,
      state: dados.uf,
      neighborhood: dados.bairro,
    });
  }

  onSubmit(): void {
    // Lógica para enviar dados do formulário para o backend
  }
}