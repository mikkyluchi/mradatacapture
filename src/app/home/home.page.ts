import { Component } from '@angular/core'; 
import { DatacaptureService } from '../services/datacapture.service';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';

import { ActionSheetController, ToastController, Platform, LoadingController, AlertController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Storage } from '@ionic/storage';
const LOGGED_IN_USER = 'logged_in_user';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  contacts:any; 
  dataSubscription: Subscription;
  userSubscription: Subscription;
  searchText='';
  zones:any; 
  voter: any;
  user:any;
  constructor(private activatedRoute: ActivatedRoute,private storage: Storage,private toastController:ToastController, 
    private alertController: AlertController, private loadingController: LoadingController,
    private userService: DatacaptureService, private router: Router) { 
      this.activatedRoute.queryParams.subscribe(params => {
        
        if (params && params.user) {
         
          this.user = JSON.parse(params.user); 
          if(this.user.password_changed=='1'){
        
             
            }else{
              this.presentAlertPrompts();
            }
        }
      });
      this.userService.reloadVotersList.subscribe(params => {
        
         this.loadData();
      });
    }

  ngOnInit() {
    this.loadData();
  }
  // ionViewDidEnter(){
  //   this.loadData();
  // }
  // ngOnDestroy() {
  //   if (this.dataSubscription) {
  //     this.dataSubscription.unsubscribe();
  //   }

  //   this.userSubscription.unsubscribe();
  // }

  async loadData(event?) {
    const loading = await this.loadingController.create({
      message: 'Getting voters...',
    });
    await loading.present();
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }

    this.userService.getlistofvoter({}).pipe(
      finalize(() => {
        loading.dismiss();
      })
    )
      .subscribe(users => {
        this.contacts = users; 
        this.zones = users['zones'];
    });
  }
  createDirectChannel(contact: any) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        special: JSON.stringify(contact),
        zones: JSON.stringify(this.zones)
      }
    };
    this.router.navigate(['profile'], navigationExtras); 
  }
  newVoter(){
    let navigationExtras: NavigationExtras = {
      queryParams: { 
        zones: JSON.stringify(this.zones),
      }
    };
    this.router.navigate(['newvoter'], navigationExtras); 
  }
  async updatePassword(details){
    const loading = await this.loadingController.create({
      message: 'Updating your password...',
    });
    await loading.present();
    this.storage.get(LOGGED_IN_USER).then(images => {
      let arr = JSON.parse(images);
      details.loggedinuser = arr; 
      this.userService.updatePassword(details).pipe(
        finalize(() => {
          loading.dismiss();
        })
      )
        .subscribe(users => {
          if (users['status'] == false) {
            this.presentToast(users['message']);
          }else{
            this.presentToast(users['message']);
          }
      });
    });
    
  }
  async updatePasswords(details){
    const loading = await this.loadingController.create({
      message: 'Updating your password...',
    });
    await loading.present();
    this.storage.get(LOGGED_IN_USER).then(images => {
      let arr = JSON.parse(images);
      details.loggedinuser = arr; 
      this.userService.updatePassword(details).pipe(
        finalize(() => {
          loading.dismiss();
        })
      )
        .subscribe(users => {
          if (users['status'] == false) {
            this.presentToast(users['message']);
            this.storage.set(LOGGED_IN_USER, JSON.stringify(users['data']));
          }else{
            this.presentToast(users['message']);
          }
          this.loadData();
      });
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
  async search() {
    const loading = await this.loadingController.create({
      message: 'Getting voters...',
    });
    await loading.present();
    const text = this.searchText.toLowerCase().trim();
    let data = {
      search_text: text
    }
    this.userService.getlistofvoter(data).pipe(
      finalize(() => {
        loading.dismiss();
      })
    )
      .subscribe(users => {
        this.contacts = users; 
    });
  }
  logout(){
    this.router.navigate(['login']); 
  }
  async presentAlertPrompt() {
    const alert = await this.alertController.create({
      header: 'Change Password',
      inputs: [
        {
          name: 'password',
          type: 'password',
          placeholder: 'Old Password'
        },
        {
          name: 'newpassword',
          type: 'password', 
          placeholder: 'New Password'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (data) => {
            console.log(data)
          }
        }, {
          text: 'Submit',
          handler: (data) => {
            this.updatePassword(data);
          }
        }
      ]
    });

    await alert.present();
  }
  async presentAlertPrompts() {
    const alert = await this.alertController.create({
      backdropDismiss:false,
      header: 'Change Password',
      inputs: [
        {
          name: 'password',
          type: 'password',
          placeholder: 'Old Password'
        },
        {
          name: 'newpassword',
          type: 'password', 
          placeholder: 'New Password'
        }
      ],
      buttons: [
         {
          text: 'Submit',
          handler: (data) => {
            this.updatePasswords(data);
          }
        }
      ]
    });

    await alert.present();
  }

}
