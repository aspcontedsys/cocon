import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../../services/data/data.service';
import { FeedbackQuestion } from '../models/cocon.models';
import { AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.page.html',
  styleUrls: ['./feedback.page.scss'],
  standalone: false
})
export class FeedbackPage implements OnInit {
  feedbackForm: FormGroup;
  questions: FeedbackQuestion[] = [];
  isLoading = true;
  options: string[] = ['Excellent', 'Good', 'Average', 'Poor', 'Very Poor'];

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private router: Router
  ) {
    this.feedbackForm = this.fb.group({
      responses: this.fb.array([])
    });
  }

  async ngOnInit() {
    await this.loadFeedbackQuestions();
  }

  get responses() {
    return this.feedbackForm.get('responses') as FormArray;
  }

  async loadFeedbackQuestions() {
    this.isLoading = true;
    try {
      this.questions = await this.dataService.getFeedbackQuestionList();
      
      // Clear existing form array
      const formArray = this.feedbackForm.get('responses') as FormArray;
      formArray.clear();

      // Initialize form controls based on question type
      this.questions.forEach(question => {
        if (question.answer_type === '1') {
          // For radio buttons, initialize with null (no selection)
          formArray.push(this.fb.control(null, Validators.required));
        } else {
          // For text inputs
          formArray.push(this.fb.control('', Validators.required));
        }
      });
      
    } catch (error) {
      console.error('Error loading feedback questions:', error);
      const alert = await this.alertCtrl.create({
        header: 'Error',
        message: 'Failed to load feedback questions. Please try again later.',
        buttons: ['OK']
      });
      await alert.present();
    } finally {
      this.isLoading = false;
    }
  }

  async onSubmit() {
    if (this.feedbackForm.invalid) {
      const alert = await this.alertCtrl.create({
        header: 'Incomplete Form',
        message: 'Please answer all questions before submitting.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Submitting feedback...',
    });
    
    try {
      await loading.present();
      
      // Prepare the response data as an object with question_index keys
      const formResponses: { [key: string]: string }[] = [];
      this.responses.value.forEach((response: any, index: number) => {
        formResponses.push({[`question_${index + 1}`]: response});
      });

      // Submit the feedback
      await this.dataService.saveFeedbackSubmit(formResponses);
      
      // Show success message
      const alert = await this.alertCtrl.create({
        header: 'Thank You!',
        message: 'Your feedback has been submitted successfully.',
        buttons: ['OK']
      });
      await alert.present();
      
      // Reset the form
      this.feedbackForm.reset();
      this.responses.clear();
      await this.loadFeedbackQuestions();
      
    } catch (error) {
      console.error('Error submitting feedback:', error);
      const alert = await this.alertCtrl.create({
        header: 'Error',
        message: 'Failed to submit feedback. Please try again.',
        buttons: ['OK']
      });
      await alert.present();
    } finally {
      await loading.dismiss();
    }
  }

  private async showAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['OK']
    });
    
    await alert.present();
  }

  getQuestionType(index: number): string {
    return this.questions[index]?.answer_type || '2';
  }
  goBack() {
    this.router.navigate(['/home']);
  }
}
