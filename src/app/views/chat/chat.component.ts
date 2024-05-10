import { Component, HostListener, ViewChild, ElementRef   } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogMessage, SidebarLatestMessage } from './chat.interfaces';
import { ChatMessageService} from 'src/app/_services/chat-message.service'
import { Router} from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { Observer } from 'rxjs';
import { SocketService } from 'src/app/_services/socket.service';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule,],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})

export class ChatComponent {
  @ViewChild('dialogBox') dialogBox!: ElementRef;
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;
  constructor(
    private authService: AuthService,
    private router: Router,
    private chatMessageService: ChatMessageService,
    private socketService: SocketService,
    private http: HttpClient,
  ){
    this.isLoggedIn = this.authService.getLoggedInStatus();
    if (!this.isLoggedIn){
      this.router.navigateByUrl('/login');
    }
    this.selfid = this.authService.getLoggedInUserid();
    console.log('login status: ',this.isLoggedIn)
    
  }
  @HostListener('scroll', ['$event'])
  blank_text: string = '_____';
  isAdmin:number = 0;
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
  dialogMessages: DialogMessage[] = [];
  sidebarLatestMessages: SidebarLatestMessage[] = [];

  selectedFile: File = new File(['file content'], '', { type: 'text/plain' });
  selectedFile_isPicture:boolean = false;
  attachmentData:FormData = new FormData()
  
  renderPreview: string | ArrayBuffer | null = null;

  getSidebarChat(){
    this.selfid
    this.chatMessageService.getSidebarChat({'self_id': this.selfid}).subscribe({ 
      next: (response) => { 
          if (response.status) {
            console.log(this.sidebarLatestMessages);
            console.log('====================================================');
            this.sidebarLatestMessages = response.data.sidebar;
            this.translate_timestamp_to_datetime_string_in_sidebarLatestMessages()
            this.url_user_photo = response.data.self.photo_url;
            this.self_name =  response.data.self.name;
            this.isAdmin = response.data.self.is_admin;
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
    this.socketService.connectToChat();
    this.socketService.onNewMessage().subscribe((message: any) => {
      // Handle new message received
      console.log('New message received:', message);
      this.retriveNewMessage(message) // Update the UI to show the new message
      this.scrollToBottom(); 
      this.retriveNewSidebar(message);
      
    });
  }

  openSettings(){}

  openMail(){}

  logout(){
    this.authService.setLoggedIn(false, -1);
    this.router.navigate(['./login']);
  }

  sendMessage(){
    
    // let params = {'self_id' : this.selfid, 'target_id': this.dialogUser.userid, 'message': this.newMessage, 'attachmentData':this.attachmentData };
    // console.log(params)
    this.chatMessageService.sendMessage(this.selectedFile, this.selfid, this.dialogUser.userid, this.newMessage ).subscribe(
      {
        next: (response) => { 
          if (response.data == 'success'){
            this.newMessage = '';
          }
        },
        error: ( error) => { // Type the error for clarity
            Swal.fire('Send Message Error  ', error.error.message, 'error');
          },
      }
    );

    // clear attachmentData
    this.resetVar()
  }

  // getMessage(){
  //   let params = {'self_id' : 10, 'target_id': 23 };
  //   this.chatMessageService.getChatHistory(params).subscribe(
  //     {
  //       next: (response) => { 
        
  //       },
  //       error: ( error) => { // Type the error for clarity
  //           Swal.fire('Get Side Chat ', error.error.message, 'error');
  //         },
  //     }
  //   );
  // }

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
    this.resetVar()
    let params = {'self_id' : this.selfid, 'target_id': this.dialogUser.userid };
    this.chatMessageService.getChatHistory(params).subscribe(
      {
        next: (response) => { 
            this.dialogMessages = response.data;
            this.translate_timestamp_to_datetime_string_in_dialogMessages()
            this.calculate_dialogMessages_isFirst_isLast()
            this.checkLinkValidityForAll()
            // console.log(this.dialogMessages)
            this.scrollToBottom()
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

  // scrollToBottom() {
  //   setTimeout(() => {
  //     const dialogBoxElement = this.dialogBox.nativeElement;
  //     dialogBoxElement.scrollTop = dialogBoxElement.scrollHeight;
  //   }, 100); 
  // }

  scrollToBottom() {
    setTimeout(() => {
      const dialogBoxElement = this.dialogBox.nativeElement;
      const scrollHeight = dialogBoxElement.scrollHeight;
      const currentScrollTop = dialogBoxElement.scrollTop;
      const targetScrollTop = scrollHeight - dialogBoxElement.clientHeight;
      const scrollDifference = targetScrollTop - currentScrollTop;
      const animationDuration = 500; // Adjust the duration of the animation
  
      let startTime: number;
  
      const animateScroll = (timestamp: number) => {
        if (!startTime) {
          startTime = timestamp;
        }
  
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / animationDuration, 1); // Ensure progress does not exceed 1
  
        const newScrollTop = currentScrollTop + scrollDifference * progress;
        dialogBoxElement.scrollTop = newScrollTop;
  
        if (progress < 1) {
          requestAnimationFrame(animateScroll);
        }
      };
  
      requestAnimationFrame(animateScroll);
    }, 100); // Adjust the delay as needed
  }

  retriveNewMessage(message:any)
  { 
    // user adalah admin
    if (this.isAdmin == 1)
    {   
        // nerima mesej. yg ngirim dari admin, (bisa diri sendiri, bisa rekan yg login tapi sama sama admin)
        // user lagi buka chatingan dengan target
        if (message.sender_id_alias == 0 
          &&  message.receive_id == this.dialogUser.userid)
        {
                this.dialogMessages.push( { sender_id: message.sender_id
                                          , sender_name_used: 'CS (' + message.sender_firstname + ')'
                                          , message: message.message 
                                          , receive_id: message.receive_id 
                                          , timestamp: message.timestamp
                                          , date_time_string: this.translateTimestampToDatetimeString(message.timestamp)
                                          , group_ally: true
                                          , is_first: true
                                          , is_last: true
                                          , attachment_url: message.attachment_url
                                          , is_picture: false
                                          , file_name: message.file_name
                                          , }
                                        )
                this.calculate_dialogMessages_isFirst_isLast()
                this.checkLinkValidityForIndex(this.dialogMessages.length - 1)
                console.log(this.dialogMessages)

        } 
        // nerima mesej yg ngirim dari client 
        // cek apakah user lagi buka chatingan dengan client
        if (message.sender_id_alias == this.dialogUser.userid 
           &&  message.receive_id == 0)
        {
          
                this.dialogMessages.push( { sender_id: message.sender_id
                                          , sender_name_used: message.sender_firstname 
                                          , message: message.message 
                                          , receive_id: message.receive_id 
                                          , timestamp: message.timestamp
                                          , date_time_string: this.translateTimestampToDatetimeString(message.timestamp)
                                          , group_ally: false
                                          , is_first: true
                                          , is_last: true
                                          , attachment_url: message.attachment_url
                                          , is_picture: false
                                          , file_name: message.file_name
                                          , }
                                        )
                this.calculate_dialogMessages_isFirst_isLast()
                this.checkLinkValidityForIndex(this.dialogMessages.length - 1)
                console.log(this.dialogMessages)
        }
    } 

    // user adalah client
    else 
    {
        // nerima mesej yg ngirim dari admin, (kita g tau siapa admin nya, karena kita adalah cilent)
        // kita sebagai client nereima message
        // kita lagi buka chat sama admin
        if (    message.sender_id_alias == 0 
            &&  message.receive_id == this.selfid 
            &&  0 == this.dialogUser.userid)
          {
            this.dialogMessages.push( { sender_id: message.sender_id
                                      , sender_name_used: 'Customer Care'
                                      , message: message.message 
                                      , receive_id: message.receive_id 
                                      , timestamp: message.timestamp
                                      , date_time_string: this.translateTimestampToDatetimeString(message.timestamp)
                                      , group_ally: false
                                      , is_first: true
                                      , is_last: true
                                      , attachment_url: message.attachment_url
                                      , is_picture: false
                                      , file_name: message.file_name
                                      , }
                                    )
            this.calculate_dialogMessages_isFirst_isLast()
            this.checkLinkValidityForIndex(this.dialogMessages.length - 1)
            console.log(this.dialogMessages)
          } 
          // kita sebagai client ngirim messeage,
          //  yang kita kirim, chat nya sedang kita buka
          if (    message.sender_id_alias == this.selfid 
            &&  message.receive_id == this.dialogUser.userid)
          {
            this.dialogMessages.push( { sender_id: message.sender_id
                                      , sender_name_used: message.sender_firstname 
                                      , message: message.message 
                                      , receive_id: message.receive_id 
                                      , timestamp: message.timestamp
                                      , date_time_string: this.translateTimestampToDatetimeString(message.timestamp)
                                      , group_ally: true
                                      , is_first: true
                                      , is_last: true
                                      , attachment_url: message.attachment_url
                                      , is_picture: false
                                      , file_name: message.file_name
                                      , }
                                    )
            this.calculate_dialogMessages_isFirst_isLast()
            this.checkLinkValidityForIndex(this.dialogMessages.length - 1)
            console.log(this.dialogMessages)
          }
    }
  }

  retriveNewSidebar(message:any){
    const maxLength = 20;
    // potong message.message jadi 20 char + ... karena kalau kebanyakan akan over size di tampilan sidebar nya
    const truncatedMessage = message.message.length > maxLength ? message.message.substring(0, maxLength) + '...' : message.message
    // jika kita adalah admin
    if (this.isAdmin == 1)
    {   
      if (message.sender_id_alias == 0 )
      {   this.updateSidebar( message.receive_id, truncatedMessage, message.timestamp);
          this.sort_sidebarLatestMessages();
      }
      if (message.receive_id == 0 )
      {   this.updateSidebar( message.sender_id_alias, truncatedMessage, message.timestamp);
          this.sort_sidebarLatestMessages();
      }
    }
    // jika kita bukan admin
    else 
    {
      // jika yg chat adalah admin kepada kita.
      // atau yg chat adalah kita kepada admin.
      if ( (message.sender_id_alias == 0 && message.receive_id == this.selfid  ) 
        || (message.sender_id_alias == this.selfid && message.receive_id == 0  ) )
        {   this.updateSidebar( 0, truncatedMessage, message.timestamp);
            this.sort_sidebarLatestMessages();
        }
      
      // jika yg chat adalah kita kepada non admin.  
      if (message.sender_id_alias == this.selfid  && message.receive_id != 0 ) 
        {   this.updateSidebar( message.receive_id, truncatedMessage, message.timestamp);
            this.sort_sidebarLatestMessages();
        }
      
      // jika yg chat adalah non admin kepada kita.  
      if (message.sender_id_alias != 0 && message.receive_id == this.selfid ) 
        {   this.updateSidebar( message.sender_id_alias, truncatedMessage, message.timestamp);
            this.sort_sidebarLatestMessages();
        }
    }
  }

  updateSidebar( param_id:number, param_message:string, param_timestamp:number)
  {
    let findMatchId = false;
    let idMatch = 0;
    let new_message: SidebarLatestMessage;
    for (let i = 0; i < this.sidebarLatestMessages.length; i++) 
    { 
      new_message = this.sidebarLatestMessages[i];
        if (new_message.userid == param_id)
        {   
            idMatch = i;
            findMatchId = true;
            break;
        }
    }

    // jika id ketemu dengan semua list yg ada di existing
    if (findMatchId )
    {   new_message = this.sidebarLatestMessages[idMatch];
        new_message.userid = param_id;
        new_message.latestMessage = param_message;
        new_message.timestamp = param_timestamp;
        new_message.date_time_string = this.translateTimestampToDatetimeString(param_timestamp);
        this.sidebarLatestMessages[idMatch] = new_message;
    }
    // jika tidak ketemu
    else
    {
      // harusnya sidebar appand 1 data
      // karena ada user baru yg belum pernah chat sebelumnya
      // jangan lupa tambah foto juga
    }

  }

  calculate_dialogMessages_isFirst_isLast(): void 
  {
    for (let i = 0; i < this.dialogMessages.length; i++) 
    {
      const message = this.dialogMessages[i];
      message.is_first = false;
      message.is_last = false;
      // Check if it's the first message
      if (i == 0) {
        message.is_first = true;
      } else {
        // Check if groupAlly is different from previous
        if (message.group_ally != this.dialogMessages[i - 1].group_ally) {
          message.is_first = true;
          this.dialogMessages[i - 1].is_last = true; // Set previous message as last
        }
      }
  
      // Check if it's the last message
      if (i == this.dialogMessages.length - 1) {
        message.is_last = true;
      } else {
        // Check if groupAlly is different from next
        if (message.group_ally != this.dialogMessages[i + 1].group_ally) {
          message.is_last = true;
        }
      }
  
      // Update the message back in the dialogMessages array
      this.dialogMessages[i] = message;
    }
  }
  
  translateTimestampToDatetimeString(timestampSource: number): string {
    const date = new Date(timestampSource * 1000); // Convert timestamp to milliseconds
  
    const day = ('0' + date.getDate()).slice(-2); // Get the day with leading zero if needed
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthIndex = date.getMonth();
    const month = monthNames[monthIndex]; // Get the abbreviated month name
    const year = date.getFullYear(); // Get the full year
  
    const hours = ('0' + date.getHours()).slice(-2); // Get the hours with leading zero if needed
    const minutes = ('0' + date.getMinutes()).slice(-2); // Get the minutes with leading zero if needed
  
    return `${day} ${month} ${year}, ${hours}:${minutes}`;
  }

  translate_timestamp_to_datetime_string_in_dialogMessages():void{
    this.dialogMessages.forEach(message => {
      message.date_time_string = this.translateTimestampToDatetimeString(message.timestamp);
    });
  }

  translate_timestamp_to_datetime_string_in_sidebarLatestMessages():void{
    this.sidebarLatestMessages.forEach(message => {
      message.date_time_string = this.translateTimestampToDatetimeString(message.timestamp);
    });
  }

  sort_sidebarLatestMessages():void{
    this.sidebarLatestMessages.sort((a, b) => b.timestamp - a.timestamp);
  }

  onFileSelected(event: any) {
    console.log(this.selectedFile)
    this.selectedFile = event.target.files[0];
    // this.uploadFile()
    this.previewImage(this.selectedFile)
    this.checkValidityForNewAttachment()
    
  }

  previewImage(file: File) {
    const reader = new FileReader();
    if (file) {
      reader.readAsDataURL(file);  
      reader.onload = () => {
        this.renderPreview = reader.result;
      };
    }
    
    else{
      this.renderPreview = null;
    }
    
    
  }

  uploadFile():void{
    if (this.selectedFile) {
      this.attachmentData = new FormData();
      this.attachmentData.append('file', this.selectedFile);
      this.sendMessage()
    }  else {
      console.error('No file selected.');
      // Handle no file selected
      Swal.fire('Attachment Chat ', 'No file selected', 'warning');
    }
    
  }

  resetVar():void{
    this.renderPreview = null;
    this.selectedFile = new File(['file content'], '', { type: 'text/plain' });
    this.selectedFile_isPicture = false;
    console.log(this.selectedFile)
  }

  closePreviewImage(){
    this.resetVar()
    this.scrollToBottom()
  }

  checkLinkValidityForIndex(index: number) {
    if (index >= 0 && index < this.dialogMessages.length) {
      const message = this.dialogMessages[index];
      const img = new Image();
      img.onload = () => {
        message.is_picture = true; // Set is_link_valid to true if image loads successfully
      };
      img.src = message.attachment_url; // Load the image to trigger onload or onerror events
    } else {
      console.error('Invalid index');
    }
  }

  checkLinkValidityForAll() {
    this.dialogMessages.forEach((message, index) => {
      const img = new Image();
      img.onload = () => {
        message.is_picture = true; // Set is_link_valid to true if image loads successfully
      };
      img.src = message.attachment_url; // Load the image to trigger onload or onerror events
    });
  }

  checkValidityForNewAttachment(){
    const img = new Image();
    this.selectedFile_isPicture = false
    img.onload = () => {
      this.selectedFile_isPicture = true
    };
    img.src = URL.createObjectURL(this.selectedFile);
  }

}
