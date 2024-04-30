import { Component, HostListener  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogMessage, SidebarLatestMessage } from './chat.interfaces';
import { ChatMessageService} from 'src/app/_services/chat-message.service'
import { Router} from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { Observer } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule,],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})

export class ChatComponent {

  constructor(
    private authService: AuthService,
    private router: Router,
    private chatMessageService: ChatMessageService

  ){
    this.isLoggedIn = this.authService.getLoggedInStatus();
    if (!this.isLoggedIn){
      this.router.navigateByUrl('/login');
    }
    this.selfid = this.authService.getLoggedInUserid();
    console.log('login status: ',this.isLoggedIn)
  }
  @HostListener('scroll', ['$event'])
  isLoggedIn:boolean ;
  loadScroll:boolean = false;
  newMessage:string='';
  users:string[] = ['kucing','kertas','apple'];
  url_user_photo = 'https://randomuser.me/api/portraits/men/78.jpg'
  selfid:number = 2;
  self_name:string = '';
  dialogUser:any =  { userid: null,
                      name:'Amy',
                      photoUrl: ''
                    };
  dialogMessages: DialogMessage[] = [
            { sender_id:  14, sender_name_used: 'Kail' , message: 'Hello!' },
            { sender_id:  15, sender_name_used: 'Amy' , message: 'Hi there!' },
            { sender_id:  14, sender_name_used: 'Kail' , message: 'How are you?' },
            { sender_id:  15, sender_name_used: 'Amy' , message: 'I\'m doing well, thank you.' },
            { sender_id:  14, sender_name_used: 'Kail' , message: 'That\'s great!' },
            { sender_id:  15, sender_name_used: 'Amy' , message: 'Yes, it is.' },
            { sender_id:  14, sender_name_used: 'Kail' , message: 'What have you been up to?' },
            { sender_id:  15, sender_name_used: 'Amy' , message: 'I\'m working on a new feature for our app.' },
            { sender_id:  14, sender_name_used: 'Kail' , message: 'Sounds exciting!' },
            { sender_id:  15, sender_name_used: 'Amy' , message: 'It is! How about you?' },
            { sender_id:  14, sender_name_used: 'Kail' , message: 'I\'m studying for exams.' },
            { sender_id:  15, sender_name_used: 'Amy' , message: 'Good luck with your exams!' },
            { sender_id:  14, sender_name_used: 'Kail' , message: 'Thanks!' },
            { sender_id:  15, sender_name_used: 'Amy' , message: 'Anytime.' },
            { sender_id:  14, sender_name_used: 'Kail' , message: 'It was nice chatting with you.' },
            { sender_id:  15, sender_name_used: 'Amy' , message: 'Likewise!' },
            { sender_id:  14, sender_name_used: 'Kail' , message: 'Have you heard the story of the tortoise and the hare?' },
            { sender_id:  15, sender_name_used: 'Amy' , message: 'Yes, it\'s a classic!' },
            { sender_id:  14, sender_name_used: 'Kail' , message: 'Once upon a time, there was a speedy hare who bragged about how fast he could run.' },
            { sender_id:  15, sender_name_used: 'Amy' , message: 'He was always teasing the slow-moving tortoise.' },
            { sender_id:  14, sender_name_used: 'Kail' , message: 'The tortoise, tired of the hare\'s boasting, challenged him to a race.' },
            { sender_id:  15, sender_name_used: 'Amy' , message: 'The hare accepted the challenge, confident in his speed.' },
            { sender_id:  14, sender_name_used: 'Kail' , message: 'On the day of the race, the hare sprinted ahead and quickly left the tortoise behind.' },
            { sender_id:  15, sender_name_used: 'Amy' , message: 'However, the hare became overconfident and decided to take a nap under a tree.' },
            { sender_id:  14, sender_name_used: 'Kail' , message: 'Meanwhile, the tortoise continued at a slow but steady pace.' },
            { sender_id:  15, sender_name_used: 'Amy' , message: 'To the hare\'s surprise, when he woke up, he found the tortoise near the finish line.' },
            { sender_id:  14, sender_name_used: 'Kail' , message: 'The slow and steady tortoise won the race, proving that consistency pays off.' },
            { sender_id:  15, sender_name_used: 'Amy' , message: 'The moral of the story: Slow and steady wins the race.' },
            { sender_id:  14, sender_name_used: 'Kail' , message: 'In a small village, there was a wise old man known for his insightful advice.' },
            { sender_id:  15, sender_name_used: 'Amy' , message: 'People from neighboring villages would often seek his guidance.' },
            { sender_id:  14, sender_name_used: 'Kail' , message: 'One day, a young man approached the wise old man and asked for the secret to a happy life.' },
            { sender_id:  15, sender_name_used: 'Amy' , message: 'The wise old man smiled and said, "Gratitude is the key. Be grateful for what you have, and happiness will follow."' },
            { sender_id:  14, sender_name_used: 'Kail' , message: 'The young man pondered on these words and decided to practice gratitude in his daily life.' },
            { sender_id:  15, sender_name_used: 'Amy' , message: 'Over time, he found that his perspective shifted, and he indeed became happier.' },
            { sender_id:  14, sender_name_used: 'Kail' , message: 'The moral of the story: Cultivating gratitude leads to a content and joyful life.' },
            { sender_id:  15, sender_name_used: 'Amy' , message: 'Remember, it\'s not about having more; it\'s about appreciating what you already have.' },
            { sender_id:  14, sender_name_used: 'Kail' , message: 'As the sun set on the horizon, painting the sky in hues of orange and pink,' },
            { sender_id:  15, sender_name_used: 'Amy' , message: 'a group of friends gathered around a bonfire for a night of storytelling.' },
            { sender_id:  14, sender_name_used: 'Kail' , message: 'Each friend took turns sharing their most cherished memories and dreams.' },
            { sender_id:  15, sender_name_used: 'Amy' , message: 'Under the starlit sky, the atmosphere was filled with laughter, warmth, and camaraderie.' },
            { sender_id:  14, sender_name_used: 'Kail' , message: 'In that moment, they realized the true beauty of friendship and the magic of shared moments.' },
            { sender_id:  15, sender_name_used: 'Amy' , message: 'The crackling of the fire seemed to echo the bonds they had formed over the years.' },
            { sender_id:  14, sender_name_used: 'Kail' , message: 'The night became a memory etched in their hearts, a reminder of the power of connection.' },
            { sender_id:  15, sender_name_used: 'Amy' , message: 'And so, they continued to create stories together, woven into the fabric of their friendship.' },
            { sender_id:  14, sender_name_used: 'Kail' , message: 'The journey continued through picturesque landscapes and ancient forests.' },
            { sender_id:  15, sender_name_used: 'Amy' , message: 'As they ventured deeper into the unknown, they discovered hidden treasures and mysteries.' },
            { sender_id:  14, sender_name_used: 'Kail' , message: 'Each step brought new challenges, but also moments of awe and wonder.' },
            { sender_id:  15, sender_name_used: 'Amy' , message: 'Their courage and determination forged a path through adversity.' },
            { sender_id:  14, sender_name_used: 'Kail' , message: 'In the end, they stood at the summit, gazing at the vast expanse below.' },
            { sender_id:  15, sender_name_used: 'Amy' , message: 'The view was breathtaking, a testament to their resilience and shared triumphs.' },
  ];

  sidebarLatestMessages: SidebarLatestMessage[] = [
    { userid:15,
      name: 'Amy', 
      latestMessage: 'Hey!', 
      latestTime: '12:30 PM', 
      isRead: true,
      photoUrl:  'https://randomuser.me/api/portraits/men/76.jpg'
    },
    { userid:14,
      name: 'Kail', 
      latestMessage: 'What\'s up?', 
      latestTime: '1:45 PM', 
      isRead: false,
      photoUrl:  'https://randomuser.me/api/portraits/men/75.jpg'
    },
    
    // ... other latest messages
  ];

  getSidebarChat(){
    this.selfid
    this.chatMessageService.getSidebarChat({'self_id': this.selfid}).subscribe({ 
      next: (response) => { 
          if (response.status) {
            console.log(this.sidebarLatestMessages);
            console.log('====================================================');
            this.sidebarLatestMessages = response.data.sidebar;
            this.url_user_photo = response.data.self.photo_url;
            this.self_name =  response.data.self.name;
            console.log(response.data);
          } else {
            // Handle errors here (optional)
          }
        },
      error: ( error) => { // Type the error for clarity
          Swal.fire('Get Side Chat ', error.error.message, 'error');
        },
      }
      
    );
  }

  ngOnInit(): void {
    this.getSidebarChat();
  }

  openSettings(){}

  openMail(){}

  logout(){
    this.authService.setLoggedIn(false, -1);
    this.router.navigate(['./login']);
  }

  // sendMessage(){
  //   this.chatMessageService.getUser().subscribe(
  //     response => {
  //       if (response.status) {
  //       } else {
  //         Swal.fire('Get Data CostAllocation ', response.message, 'warning');
          
  //       }
  //       // this.loadingData = false;
  //     }, error => {
  //       Swal.fire('Get Data CostAllocation ', error.error.message, 'error');
        
  //       // this.loadingData = false;
        
  //     }
  //   ); 

  // }

  sendMessage(){
    let params = {'self_id' : 10, 'target_id': 23, 'message': this.newMessage };
    Swal.fire('-',this.newMessage)
    // this.chatMessageService.getChatHistory(params).subscribe(
    //   response => {
    //       if(response.status){

    //       }else{

    //       }
    //   }, error => {
    //     Swal.fire('Get Data CostAllocation ', error.error.message, 'error');
    //   }
    // );
  }

  getMessage(){
    let params = {'self_id' : 10, 'target_id': 23 };
    this.chatMessageService.getChatHistory(params).subscribe(
      {
        next: (response) => { 
        
        },
        error: ( error) => { // Type the error for clarity
            Swal.fire('Get Side Chat ', error.error.message, 'error');
          },
      }
    );
  }

  userListSelected(selected_user:any){
   
    if (selected_user.userid != this.dialogUser.userid )
    {
      this.setDialogUser(selected_user)
      this.loadChatFrom_dialogUser()
    }
    
  }

  setDialogUser(selected_user:any)
  { 
    console.log(selected_user.userid)
    this.dialogUser.userid = selected_user.userid;
    this.dialogUser.name = selected_user.name;
    this.dialogUser.photoUrl = selected_user.photoUrl;
  }

  loadChatFrom_dialogUser()
  {
    let params = {'self_id' : this.selfid, 'target_id': this.dialogUser.userid };
    this.chatMessageService.getChatHistory(params).subscribe(
      {
        next: (response) => { 
            this.dialogMessages = response.data;
            console.log(response)
        },
        error: ( error) => { // Type the error for clarity
            Swal.fire('Get Side Chat ', error.error.message, 'error');
          },
      }
    );
  }

  onScroll(event: any): void {
    // Check if the user has scrolled to the top (within a certain threshold, e.g., 10px)
    const isAtTop = event.target.scrollTop == 0;
    if (isAtTop) {
      if (this.loadScroll == false){
        this.loadScroll = true;
        console.log('Hurray! Scrolled to the top.');
      // Load more messages or perform any other action here
        this.loadScroll = false;
      }
    }
  }
}
