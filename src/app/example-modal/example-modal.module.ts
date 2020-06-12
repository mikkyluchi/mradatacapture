import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ExampleModalPage } from './example-modal.page';
import { ImageCropperModule } from 'ngx-image-cropper';

const routes: Routes = [
  {
    path: '',
    component: ExampleModalPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ImageCropperModule
  ],
  declarations: [ExampleModalPage]
})
export class ExampleModalPageModule {}
