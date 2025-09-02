import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegisteredUser } from '../../models/cocon.models';
import { LoginService } from '../../../services/login/login.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { OtpComponent } from '../otp/otp.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  emailError = '';
  otpError = '';
  currentuser: RegisteredUser = {} as RegisteredUser;
  private returnUrl: string = '/home/dashboard';

  //  Track which tab is active
  activeTab: 'delegates' | 'guests' = 'delegates';

  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private route: ActivatedRoute,
    private router: Router,
    private modalCtrl: ModalController
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      otp: ['']
    });

    this.route.queryParams.subscribe(params => {
      if (params['returnUrl']) {
        this.returnUrl = params['returnUrl'];
      } else if (this.router.getCurrentNavigation()?.extras.state) {
        this.returnUrl = this.router.getCurrentNavigation()?.extras?.state?.['returnUrl'] || '/home';
      }
    });

    this.loginForm.get('email')?.valueChanges.subscribe(() => {
      this.validateEmail();
    });
    this.loginForm.get('otp')?.valueChanges.subscribe(() => {
      this.validateOtp();
    });
  }

  async ngOnInit() {}

  dismiss() {
    this.modalCtrl.dismiss();
  }

  async onSubmit() {
    if (this.emailError !== '') {
      return;
    }

    if (this.loginForm.valid) {
      try {
        await this.loginService.getOtp(this.loginForm.value).then((response: Boolean) => {
          if (response) {
            this.showOtpModal();
          }
        });
      } catch (error) {
        console.error('Login failed:', error);
      }
    }
  }

  private async showOtpModal() {
    const modal = await this.modalCtrl.create({
      component: OtpComponent,
      componentProps: { email: this.loginForm.value.email },
      breakpoints: [0, 0.5, 0.75],
      initialBreakpoint: 0.5,
      handle: true
    });

    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data?.otp) {
      this.dismiss();
    }
  }

  private validateEmail() {
    const emailControl = this.loginForm.get('email');
    if (emailControl?.errors?.['required']) {
      this.emailError = 'Email is required';
    } else {
      this.emailError = '';
    }
  }

  private validateOtp() {
    const otpControl = this.loginForm.get('otp');
    if (otpControl?.errors?.['required']) {
      this.otpError = 'OTP is required';
    } else {
      this.otpError = '';
    }
  }

  //  Tab switching
  setActiveTab(tab: 'delegates' | 'guests') {
    this.activeTab = tab;
  }

  //  Guest actions
  onGuestContinue() {
    console.log('Guest Continue clicked');
    this.router.navigate(['/home']); // adjust route if needed
  }

  onGuestRegister() {
    console.log('Guest Register Now clicked');
    this.router.navigate(['/register']); // adjust route if needed
  }
}
