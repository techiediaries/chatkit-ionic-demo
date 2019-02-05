import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ChatService } from '../chat.service';
import { AuthService } from '../auth.service';
import { User } from '../user';
import {Content} from "@ionic/angular";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  messageList: any[] = [];
  chatMessage: string = "";
  attachment: File = null;
  @ViewChild('scrollArea') content: Content;
  //@ViewChild('messageList') messageListElemenet;

  //private mutationObserver: MutationObserver;
  
  constructor(private router: Router, private chatService: ChatService, private authService: AuthService) { }


  ngOnInit() {
    this.chatService.getMessages().subscribe(messages => {
      this.messageList = messages;
      this.scrollToBottom();
    });
    
  }

  sendMessage() {
    this.chatService.sendMessage({ text: this.chatMessage, attachment: this.attachment }).then(() => {
      this.chatMessage = "";
      this.attachment = null;
      this.scrollToBottom();
    });
  }



  get typingUsers(){
    return this.chatService.getTypingUsers();
  }

  onKeydown(e){
    this.chatService.sendTypingEvent();
  }
  onKeyup(e){
    this.chatService.sendTypingEvent();
  }
  attachFile(e){
    if (e.target.files.length == 0) {
      console.log("No file selected!");
      return
    }
    let file: File = e.target.files[0];
    console.log(file);
    this.attachment = file;
  }
  scrollToBottom() {

    setTimeout(()=>{
      if (this.content.scrollToBottom) {
        this.content.scrollToBottom();
      }
    }, 1000);

  }

  async logout(){
    await this.authService.logout();
    this.router.navigateByUrl('/login');
  }

}
