import { Component, NgModule, OnInit } from '@angular/core';
import { single, multi } from './data';
import * as htmlToImage from 'html-to-image';
import { NgxService } from './services/ngx.service';
import { LegendPosition } from '@swimlane/ngx-charts';
var pdfMake = require('pdfmake/build/pdfmake');

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})

export class AppComponent {
  single?: any[];
  multi?: any[];
  docDefinition?: any;
  view: any[] = [700, 400];
  title: string = 'Legend';
  below = LegendPosition.Right;
  base64StringArray?:string[] = [];
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Country';
  showYAxisLabel = true;
  yAxisLabel = 'Population';
  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA'],
  };

  constructor(private ngxService: NgxService) {
    Object.assign(this, { single, multi });
  }

  ngOnInit() {}
  async downloadChart() {
    console.log('download button clicked');
    var div1 = document.getElementById('chart');
    var div2 = document.getElementById('chart2');

    var arr : HTMLElement[] =[div1!,div2!];
    console.log(arr.length);
    for (const element of arr) {
      await this.convertHtmlToImage(element);
    }
    console.log("shivani");
    console.log(this.base64StringArray!.length);
    if(this.base64StringArray!.length > 0)
    {
      this.getPdf();
    }
  }

  async convertHtmlToImage(node:HTMLElement)
  {
    var base64ImageStr = '';
     await htmlToImage
      .toPng(node!)
      .then(function (dataUrl) {
        base64ImageStr = dataUrl;
      })
      .catch(function (error) {
        console.error('oops, something went wrong!', error);
      });
      console.log(base64ImageStr);
      if (base64ImageStr != '') {
         this.base64StringArray!.push(base64ImageStr);
      }
    console.log(this.base64StringArray!.length);
  }

  async getPdf() {
    var iterator = this.base64StringArray!.values();

    const docDefinition = {
      content: [
        {
          image: iterator.next().value,
          width: 520,
        },
      ],
    };

    this.base64StringArray!.forEach((item, index, array) => {
      if(index >0)
      {
        docDefinition.content!.push({ image: item!, width: 520});
      }
    });
    console.log(this.base64StringArray!.length);
    if (docDefinition) {
      pdfMake.createPdf(docDefinition).download('chartToPdf' + '.pdf');
      pdfMake.createPdf(docDefinition).open();
    } else {
      console.log('Chart is not yet rendered!');
    }
  }
}
