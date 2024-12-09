import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChatService } from '../services/chatservice.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  useForm: FormGroup = new FormGroup({});
  submitted = false;
  apiErrorMessages: string[] = [];
  openChat: boolean = false;

  constructor(private formBuilder: FormBuilder, private service: ChatService) { }

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
          this.service.currentName = this.useForm.get('name')?.value;
          this.openChat = true;
          this.useForm.reset();
          this.submitted = false;
        },
        error: (error: any) => {
          console.log(error);
          if (typeof error.error !== 'object') {
            this.apiErrorMessages.push(error.error);
            this.openChat = false;
          }
        },
      });
    }
    console.log(this.useForm);
  }

  closeChatEmitter(): void {
    this.openChat = false;
  }
}
