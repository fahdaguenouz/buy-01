import { NgModule } from "@angular/core";
import { ProductListComponent } from "./product-list/product-list.component";
import { CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";

@NgModule({
  declarations: [ProductListComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule
  ],
  exports: [ProductListComponent]
})
export class ProductsModule { }