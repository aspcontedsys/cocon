import {
  Component,
  Input,
  ViewChildren,
  QueryList,
  ElementRef,
  OnInit,
  OnDestroy
} from '@angular/core';
import { ModalController, IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { LoginService } from '../../../services/login/login.service';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss'],
  standalone: true,
  imports: [FormsModule, IonicModule, NgIf], // ✅ Add NgIf here
})
export class OtpComponent implements OnInit, OnDestroy {
  @Input() email: string = '';
  otp: string[] = ['', '', '', '', '', ''];

  @ViewChildren('otpInput') inputs!: QueryList<ElementRef>;

  resendCountdown: number = 30;
  resendInterval: any;

  constructor(private modalCtrl: ModalController,private loginService: LoginService) {}

  ngOnInit() {
    this.startResendCountdown();
  }

  ngOnDestroy() {
    if (this.resendInterval) {
      clearInterval(this.resendInterval);
    }
  }

  moveFocus(event: any, index: number) {
    const input = event.target;
    const value = input.value;

    if (value.length === 6 && /^\d{6}$/.test(value)) {
      this.otp = value.split('');
      setTimeout(() => {
        this.inputs.toArray()[5].nativeElement.focus();
      }, 50);
      return;
    }

    if (value && index < 5) {
      this.inputs.toArray()[index + 1]?.nativeElement.focus();
    }

    if (!value && index > 0) {
      this.inputs.toArray()[index - 1]?.nativeElement.focus();
    }
  }

  async verifyOtp() {
    const otpCode = this.otp.join('');
    if (otpCode.length === 6 && this.otp.every(d => d !== '')) {
      const loginData = {
        email: this.email,
        api_otp: otpCode
      };
      try {
        await this.loginService.verifyOtp(loginData).then((response:Boolean) => {
          if (response) {
            this.modalCtrl.dismiss({ otp: otpCode });
          }
        });
      } catch (error) {
        console.error('Login error:', error);
        // Handle login error (show error message, etc.)
      }
    } else {
      alert('Please enter all 6 digits.');
    }
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

  startResendCountdown() {
    this.resendCountdown = 90;
    if (this.resendInterval) {
      clearInterval(this.resendInterval);
    }

    this.resendInterval = setInterval(() => {
      this.resendCountdown--;
      if (this.resendCountdown === 0) {
        clearInterval(this.resendInterval);
      }
    }, 1000);
  }

  resendOtp() {
    console.log('Resending OTP...');
    this.otp = ['', '', '', '', '', ''];
    this.startResendCountdown();
  }
}
