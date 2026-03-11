import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms"; 
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field"; 
import { MatInputModule } from "@angular/material/input";
import { ProductListComponent } from "./product-list/product-list.component";
import { AddProductComponent } from "./product-create/create-product.component";

@NgModule({
  declarations: [
    ProductListComponent,
    AddProductComponent 
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule, 
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
  ],
  exports: [
    ProductListComponent,
    AddProductComponent 
  ]
})
export class ProductsModule { }