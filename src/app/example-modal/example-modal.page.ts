import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-example-modal',
  templateUrl: './example-modal.page.html',
  styleUrls: ['./example-modal.page.scss'],
})
export class ExampleModalPage implements OnInit {
  croppedImage: any = ''; 

  modalTitle:string;
  modelId:number;
  imageChangedEvent: any = '';
 
  constructor(
    private modalController: ModalController,
    private navParams: NavParams
  ) { }
 
  ngOnInit() { 
    this.imageChangedEvent = this.navParams.data.event;  
  }
 
  async closeModal() {
    const onClosedData: string = this.croppedImage;
    await this.modalController.dismiss();
  }
  async finishCropping() {
    const onClosedData: string = this.croppedImage.base64;
    await this.modalController.dismiss(onClosedData);
  }
  imageCropped(image: string) {
    this.croppedImage = image;
  }
  imageLoaded() {
    // show cropper
  }
  loadImageFailed() {
    // show message
  }
  cropperReady(){

  }
}
