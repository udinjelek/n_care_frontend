import { Component, HostListener  } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth.service';
import { LoginService } from 'src/app/_services/login.service';
import { trigger, transition, animate, style } from '@angular/animations';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [
    trigger('devAnimationDev', [
      transition(':leave', [
        style({ transform: 'translateX(0)' }),
        animate('0.3s ease-out', style({ transform: 'translateX(-100%)' }))
      ]),
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('0.3s ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ])
    ]),
    trigger('devAnimationMain', [
      transition(':leave', [
        style({ transform: 'translateX(0)' }),
        animate('0.3s ease-out', style({ transform: 'translateX(-100%)' }))
      ]),
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('0.3s ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ])
    ])
  ]
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  isLoggedIn: boolean = false;
  listmemberActive:boolean = true;
  isMouseOver: boolean = false;
  listNonAdmin: any[] = [];
  listAdmin: any[] = [];
  isWidthWeb: boolean = true;
  isDevShow: boolean = false;
  showMain = true;
  showDevMode = false;
  constructor(  
    private authService: AuthService, 
    private router: Router,
    private loginService: LoginService
) { 
    this.isLoggedIn = this.authService.getLoggedInStatus();
    console.log('login status: ',this.isLoggedIn)
  }



  checkLogin() {
    // Your login logic here
    console.log('Username:', this.username);
    console.log('Password:', this.password);
    if ( this.username == 'member'){
      this.listmemberActive = true;
    }

    this.loginService.getLogin({'username': this.username, 'password': this.password}).subscribe({ 
      next: (response) => { 
          if (response.status) {
            // this.sidebarLatestMessages = response.data;
            
            if ( response.hasOwnProperty('login') ){
              if (response.login == 'success'){
                this.authService.setLoggedIn(true, response.userid );
                this.isLoggedIn = this.authService.getLoggedInStatus();
                console.log('login status: ',this.isLoggedIn)
                this.router.navigate(['./']);
              }
              else {
                Swal.fire('Login ', 'Username or password is incorrect..', 'error');
              }
            }
    
          } else {
            Swal.fire('Login ', 'Username or password is incorrect.', 'error');
          }
        },
      error: ( error) => { // Type the error for clarity
          Swal.fire('Login ', 'Username or password is incorrect', 'error');
        },
      }
      
    );

    
    // Add your authentication logic, for example, call a service to check credentials
    // If credentials are valid, navigate to the dashboard or perform other actions
  }

  close_listmemberActive(){
    this.listmemberActive = false;
  }
  
  ngOnInit(): void {
    this.checkWidthWeb();
    this.loadDevModeUser();
  }

  loadDevModeUser(){
    this.loginService.getloadDevModeUser().subscribe({ 
      next: (response) => { 
          if (response.status) {
            // this.sidebarLatestMessages = response.data;
            console.log(response);

            if ( response.hasOwnProperty('data') ){
              if (response.data.hasOwnProperty('non_admin_users')){
                this.listNonAdmin = response.data.non_admin_users;
              }
              if (response.data.hasOwnProperty('admin_users')){
                this.listAdmin = response.data.admin_users;
              }
            }
    
          } else {
            Swal.fire('Login ', 'Username or password is incorrect.', 'error');
          }
        },
      error: ( error) => { // Type the error for clarity
          Swal.fire('Login ', 'Username or password is incorrect', 'error');
        },
      }
      
    );
  }
  
  setUser(user_selected:any){
    this.username = user_selected.username; 
    this.password = user_selected.password; 
    this.isDevShow =false;
  }

  checkWidthWeb() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.isWidthWeb = width > height
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkWidthWeb();
  }

  showHideDev(){
    this.isDevShow = !this.isDevShow;
  }

  test(){
    console.log('test')
  }
}
