import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChatService } from '../services/chatservice.service';
import { error } from 'console';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  useForm: FormGroup = new FormGroup({});
  submitted = false;
  apiErrorMessages: string[] = [];

  constructor(private formBuilder: FormBuilder, private service: ChatService) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.useForm = this.formBuilder.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(15),
        ],
      ],
    });
  }

  submitForm(): void {
    this.submitted = true;

    if (this.useForm.valid) {
      this.service.registration(this.useForm.value).subscribe({
        next: (res: any) => {
          console.log('Open chat');
        },
        error: (error: any) => {
          console.log(error);
          if (typeof error.error !== 'object') {
            this.apiErrorMessages.push(error.error);
          }
        },
      });
    }
    console.log(this.useForm);
  }
}
