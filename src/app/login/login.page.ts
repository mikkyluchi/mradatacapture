import { Component,OnInit } from '@angular/core'; 
import { DatacaptureService } from '../services/datacapture.service';
import { Router, NavigationExtras } from '@angular/router';

import { ActionSheetController, ToastController, Platform, LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Storage } from '@ionic/storage';
const LOGGED_IN_USER = 'logged_in_user';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  login = {
    'username':'',
    'password':''
  }
  loading = false;
  constructor(private storage: Storage,private toastController: ToastController,private loadingController: LoadingController,private userService: DatacaptureService, private router: Router) { }

  ngOnInit() {
  }
  
  async doLogin() {
    const loading = await this.loadingController.create({
      message: 'Logging in...',
    });
    await loading.present();
    
    this.userService.login(this.login).pipe(
      finalize(() => {
        loading.dismiss();
      })
    )
      .subscribe(result => {
        if(result['status'] == true){ 
          this.storage.set(LOGGED_IN_USER, JSON.stringify(result['data']));
          let navigationExtras: NavigationExtras = {
            queryParams: { 
              user: JSON.stringify(result['data']) 
            }
          };  
          this.router.navigate(['home'], navigationExtras); 
        }else{
          this.presentToast(result['message']);
        }
    });
  }
  async presentToast(text) {
    const toast = await this.toastController.create({
      message: text,
      position: 'bottom',
      duration: 3000
    });
    toast.present();
  }
}
