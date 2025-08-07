import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from '../../services/chat/chat.service';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ChatHistory } from '../models/cocon.models';
import { RegisteredUser } from '../models/cocon.models';
import { CacheService } from '../../services/cache/cache.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FirebaseMessagingService } from '../../services/firebase/firebase.service';

@Component({
  selector: 'app-userchat',
  templateUrl: './userchat.page.html',
  styleUrls: ['./userchat.page.scss'],
  standalone: false
})
export class UserChatPage implements OnInit, OnDestroy {
  recipientId: number | null = null;
  conversationid: number = 0;
  messages: ChatHistory[] = [];
  groupedMessages: {date: string, messages: ChatHistory[]}[] = [];
  message: string = '';
  currentUser: RegisteredUser = {} as RegisteredUser;
  recipient: any;
  private messageSubscription: Subscription | null = null;

  constructor(
    private route: ActivatedRoute,
    private chatService: ChatService,
    private cacheService: CacheService,
    private router: Router,
    private firebaseService: FirebaseMessagingService
  ) {
    // Initialize currentUser
    this.cacheService.get('userDetails').then(user => this.currentUser = user as RegisteredUser);
  }

  handleKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  async doRefresh(event: any) {
    try {
      // Get the current scroll position
      const scrollElement = document.querySelector('.messages-container');
      const scrollPosition = scrollElement?.scrollTop;
      const scrollHeight = scrollElement?.scrollHeight;

      // Load older messages
      await this.loadMessages();

      // Wait for the view to update
      setTimeout(() => {
        // Restore scroll position to maintain user's place
        if (scrollElement && scrollPosition !== undefined && scrollHeight !== undefined) {
          const newScrollHeight = scrollElement.scrollHeight;
          const heightDiff = newScrollHeight - scrollHeight;
          if (scrollElement.scrollTop === 0 && heightDiff > 0) {
            scrollElement.scrollTop = heightDiff;
          }
        }
        // Complete the refresh
        event.target.complete();
      }, 500);
    } catch (error) {
      console.error('Error refreshing messages:', error);
      event.target.complete();
    }
  }

  private scrollToBottom() {
    try {
      // Try to find the scrollable ion-content element
      const ionContent = document.querySelector('ion-content.chat-content');
      if (ionContent) {
        // Use shadowRoot to access the scroll container
        const scrollElement = ionContent.shadowRoot?.querySelector('.inner-scroll');
        if (scrollElement) {
          // Use setTimeout to ensure the DOM has been updated
          setTimeout(() => {
            scrollElement.scrollTop = scrollElement.scrollHeight;
          }, 50);
        }
      }
    } catch (error) {
      console.error('Error scrolling to bottom:', error);
    }
  }

  private async loadMessages() {
    if (this.recipient) {
      const messages = await this.chatService.getChatMessages(this.conversationid);
      this.messages = messages;
      this.groupMessagesByDate();
      this.scrollToBottom();
    }
  }

  ngOnInit() {
    this.recipientId = Number(this.route.snapshot.paramMap.get('id'));
    this.conversationid = Number(this.route.snapshot.paramMap.get('conversationid'));
    
    if (!this.recipientId) {
      // Handle error case - no ID provided
      return;
    }
    
    // Subscribe to message updates
    this.messageSubscription = this.firebaseService.messageReceived.subscribe((message:any) => {
      console.log("Event received"+message.conversation_id +"_" + message.message)
      if (message.conversation_id == this.conversationid) {
        console.log("Message added to UI");
        this.updateMessageUI(message,false);
      }
    });
    
    this.chatService.getUsers().then(users => {
      const user = users.find(u => u.id === this.recipientId);
      this.recipient = user;
      if (user) {
        this.loadMessages();
      }
    });
  }
  
  ngOnDestroy() {
    // Clean up the subscription to prevent memory leaks
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
  }

  updateMessageUI(message: any,clearmessage: boolean=true) {
    console.log("Message added to UI", message);
    
    // Create a new array reference to trigger change detection
    this.messages = [...this.messages, message];
    
    // Force change detection for the messages array
    this.groupMessagesByDate();
    
    // Clear the input field if needed
    if(clearmessage){
      this.message = '';
    }
    
    // Scroll to bottom after the view updates
    setTimeout(() => {
      this.scrollToBottom();
    }, 0);
  }

  sendMessage() {
    if (this.message.trim() && this.recipientId) {
      const newMessage = {
        sender_id: this.currentUser.id,
        message: this.message,
        created_at: new Date(),
        read_at: new Date(),
        message_type: 'text',
        attachment_path: '',
        attachment_type: '',
        conversation_id: this.conversationid,
        id: 0
      };
      this.chatService.sendMessage(this.conversationid, this.recipientId, this.message);
      this.updateMessageUI(newMessage);
    }
  }

  attachFile() {
    // TODO: Implement file attachment functionality
    console.log('File attachment clicked');
  }

  openUserMenu() {
    // TODO: Implement user menu functionality
    console.log('User menu clicked');
  }

  private applyOffsetToDate(date: Date, offsetMinutes: number): Date {
    const localTime = new Date(date.getTime() + offsetMinutes * 60000);
    return localTime;
  }
  private groupMessagesByDate() {
    const groups: {[key: string]: ChatHistory[]} = {};
    
    this.messages.forEach(message => {
      message.created_at = this.applyOffsetToDate(new Date(message.created_at),0);
      const date = new Date(message.created_at);
      const dateStr = date.toLocaleDateString('en-In', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      
      if (!groups[dateStr]) {
        groups[dateStr] = [];
      }
      groups[dateStr].push(message);
    });
    
    this.groupedMessages = Object.entries(groups).map(([date, messages]) => ({
      date,
      messages
    }));
  }

  goBack() {
    this.router.navigate(['/home/chat']);
  }
}
