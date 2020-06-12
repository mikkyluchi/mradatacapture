import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatacaptureService } from '../services/datacapture.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';

import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/Camera/ngx';
import { ActionSheetController, ToastController, Platform, LoadingController } from '@ionic/angular';
import { File, FileEntry } from '@ionic-native/File/ngx';
import { HttpClient } from '@angular/common/http';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { Storage } from '@ionic/storage';
import { FilePath } from '@ionic-native/file-path/ngx';

import { finalize } from 'rxjs/operators';

const STORAGE_KEY = 'my_images';
const LOGGED_IN_USER = 'logged_in_user';
import { ExampleModalPage } from '../example-modal/example-modal.page'

@Component({
  selector: 'app-voter',
  templateUrl: './voter.page.html',
  styleUrls: ['./voter.page.scss'],
})
export class VoterPage implements OnInit {

  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;
  channelForm: FormGroup;
  voter: any = {
    title:'',
    id:'',
    surname: '',
    firstname: '',
    middlename: '',
    gender: '',
    primarytelephone: '',
    secondarytelephone: '',
    alternatephoneone: '',
    alternatephonetwo: '',
    emailaddressone: '',
    emailaddresstwo: '',
    houseno: '',
    plotno: '',
    blockno: '',
    streetname: '',
    offprimarystreet: '',
    zone: ''
  };
  myId = null;
  zones = [
    {
      id: '1',
      displayName: 'Zone One'
    }
  ];
  genders = [
    {
      id: '0',
      name: 'Male'
    },
    {
      id: '1',
      name: 'Female'
    }
  ];
  images = [];
  spouse:any;
  has_spouse = false;
  base64Image: any;
  croppedImagepath = "";
  croppingImage = false;
  imageChangedEvent: any = '';
  is_new = false;
  constructor(public modalController: ModalController,private camera: Camera, private file: File, private http: HttpClient, private webview: WebView,
    private actionSheetController: ActionSheetController, private toastController: ToastController,
    private storage: Storage, private plt: Platform, private loadingController: LoadingController,
    private ref: ChangeDetectorRef, private filePath: FilePath, private userService: DatacaptureService, private activatedRoute: ActivatedRoute, private router: Router) {
      this.activatedRoute.queryParams.subscribe(params => {
        this.zones = JSON.parse(params.zones);
        this.spouse = JSON.parse(params.voter);
        this.has_spouse =  JSON.parse(params.spouse);
        this.is_new = JSON.parse(params.is_new);
        if(this.has_spouse == true){
          this.voter = JSON.parse(params.spousedetails);
          this.base64Image = this.voter.photofile;
        }
      });
  }

  ngOnInit() {
    this.channelForm = new FormGroup({ 
      id: new FormControl(''),
      title: new FormControl(''),
      surname: new FormControl('', Validators.required),
      firstname: new FormControl('', Validators.required),
      middlename: new FormControl(''),
      gender: new FormControl('', Validators.required),
      primarytelephone: new FormControl('', Validators.required),
      secondarytelephone: new FormControl(''),
      alternatephoneone: new FormControl(''),
      alternatephonetwo: new FormControl(''),
      emailaddressone: new FormControl('', Validators.required),
      emailaddresstwo: new FormControl(''),
      // houseno: new FormControl('', Validators.required),
      // plotno: new FormControl(''),
      // blockno: new FormControl(''),
      // streetname: new FormControl('', Validators.required),
      // offprimarystreet: new FormControl(''),
      // zone: new FormControl('', Validators.required), 
    });
  }
  imageCropped(image: string) {
    this.base64Image = image;
  }
  imageLoaded() {
    // show cropper
  }
  loadImageFailed() {
    // show message
  }
  fileChangeEvent(event: any): void { 
    this.imageChangedEvent = event;
    this.croppingImage = true;
    this.openModal(event)
  }
  openDialog() {
    this.fileInput.nativeElement.click()
  }
  async openModal(event) {
    const modal = await this.modalController.create({
      component: ExampleModalPage,
      componentProps: {
        "event": event
      }
    });
 
    modal.onDidDismiss().then((dataReturned) => { 
      if (dataReturned !== null) {
        this.base64Image = dataReturned.data; 
        this.saveProfilePicture();
      }
    });
 
    return await modal.present();
  }
  getUser() {

  }
  pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      let converted = this.webview.convertFileSrc(img);
      return converted;
    }
  }
  async onSave() {
    if (this.channelForm.valid) {
      const loading = await this.loadingController.create({
        message: 'Adding user...',
      });
      await loading.present();
      this.storage.get(LOGGED_IN_USER).then(images => {
        let arr = JSON.parse(images);
        let data = this.channelForm.getRawValue();
        data.loggedinuser = arr.id;
        data.spouseid = this.spouse.id;
        this.userService.savespousedetails(data).pipe(
          finalize(() => {
            loading.dismiss();
          })
        )
          .subscribe(users => {
            if (users['status'] == false) {
              this.presentToast(users['message']);
            }else{
              this.presentToast(users['message']);
              this.voter.id = users['data']['id'];
            }
          });
      }); 
     
    }
  }
  async selectImage() {
    if(this.voter.id==''){
      this.presentToast('Please save the voter details first');
    }else{
      const actionSheet = await this.actionSheetController.create({
        header: "Select Image source",
        buttons: [{
          text: 'Load from Library',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Use Camera',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
        ]
      });
      await actionSheet.present();
    }
  }

  takePicture(sourceType: PictureSourceType) {
    var options: CameraOptions = {
      quality: 100,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true,
      destinationType: this.camera.DestinationType.DATA_URL, 
      targetWidth: 2000,
      targetHeight: 2000,
      allowEdit: true, 
    };

    this.camera.getPicture(options).then(imageData => {
      // if (this.plt.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
      //   this.filePath.resolveNativePath(imagePath)
      //     .then(filePath => {
      //       let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
      //       let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
      //       this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
      //     });
      // } else {
      //   var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
      //   var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
      //   this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
      // }
      this.base64Image = "data:image/jpeg;base64," + imageData;
      this.saveProfilePicture();
    });

  }
  createFileName() {
    var d = new Date(),
      n = d.getTime(),
      newFileName = n + ".jpg";
    return newFileName;
  }
  async presentToast(text) {
    const toast = await this.toastController.create({
      message: text,
      position: 'bottom',
      duration: 3000
    });
    toast.present();
  }
  copyFileToLocalDir(namePath, currentName, newFileName) {
    this.file.copyFile(namePath, currentName, this.file.dataDirectory, newFileName).then(success => {
      this.updateStoredImages(newFileName);
    }, error => {
      this.presentToast('Error while storing file.');
    });
  }
  updateStoredImages(name) {
    this.storage.get(STORAGE_KEY).then(images => {
      let arr = JSON.parse(images);
      if (!arr) {
        let newImages = [name];
        this.storage.set(STORAGE_KEY, JSON.stringify(newImages));
      } else {
        arr.push(name);
        this.storage.set(STORAGE_KEY, JSON.stringify(arr));
      }

      let filePath = this.file.dataDirectory + name;
      let resPath = this.pathForImage(filePath);

      let newEntry = {
        name: name,
        path: resPath,
        filePath: filePath
      };

      this.images = [newEntry, ...this.images];
      this.ref.detectChanges(); // trigger change detection cycle
      this.startUpload(newEntry);
    });
  }
  startUpload(imgEntry) {
    this.file.resolveLocalFilesystemUrl(imgEntry.filePath)
      .then(entry => {
        (<FileEntry>entry).file(file => this.readFile(file))
      })
      .catch(err => {
        this.presentToast('Error while reading file.');
      });
  }

  readFile(file: any) {
    const reader = new FileReader();
    reader.onloadend = () => {
      const formData = new FormData();
      const imgBlob = new Blob([reader.result], {
        type: file.type
      });
      // formData.append('file', imgBlob, file.name);
      // formData.append('id', this.voter.id);
      this.storage.get(LOGGED_IN_USER).then(images => {
        let arr = JSON.parse(images);
        formData.append('file', imgBlob, file.name);
      formData.append('id', this.voter.id);
      formData.append('logged_in_user', arr.id);
      this.uploadImageData(formData);
      });
      this.uploadImageData(formData);
    };
    reader.readAsArrayBuffer(file);
  }

  async uploadImageData(formData: FormData) {
    
    const loading = await this.loadingController.create({
      message: 'Uploading image...',
    });
    await loading.present();

    this.http.post("http://voting.kowafirst.com/index.php/accreditation/upload", formData)
      .pipe(
        finalize(() => {
          loading.dismiss();
        })
      )
      .subscribe(res => {
        if (res['success']) {
          this.presentToast('File upload complete.')
        } else {
          this.presentToast('File upload failed.')
        }
        this.reloadVoter();
      });
  }
  async reloadVoter(){
    const loading = await this.loadingController.create({
      message: 'Reloading voter...',
    });
    await loading.present(); 
    this.userService.getVoter(this.voter).pipe(
      finalize(() => {
        loading.dismiss();
      })
    )
      .subscribe(users => {
       this.voter = users['data'];
      });
  }
  async saveProfilePicture(){
    const loading = await this.loadingController.create({
      message: 'Uploading image...',
    });
    await loading.present();
    let data = {
      id: this.voter.id,
      image: this.base64Image
    }; 
    this.userService.saveMyProfilePicture(data).pipe(
      finalize(() => {
        loading.dismiss();
      })
    )
      .subscribe(users => {
       this.voter = users['data'];
       this.base64Image = this.voter.photofile;
       
       this.userService.reloadVotersList.emit();
      });
  }
  async onDelete() {
    const loading = await this.loadingController.create({
      message: 'Delete voter...',
    });
    await loading.present();
    this.storage.get(LOGGED_IN_USER).then(images => {
      let arr = JSON.parse(images);
      let data = this.voter;
      data.loggedinuser = arr.id;
      this.userService.deletevoter(data).pipe(
        finalize(() => {
          loading.dismiss();
        })
      )
        .subscribe(users => {
          if (users['status'] == false) {
            this.presentToast(users['message']);
          } else {
            this.presentToast(users['message']);
          }
          //this.router.navigate(['home']);
        });
    });
  }
}
