import { Component, NgModule, OnInit } from '@angular/core';
import { single, multi } from './data';
import html2canvas from 'html2canvas';
import domtoimage from 'dom-to-image';
import * as htmlToImage from 'html-to-image';
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NgxService } from './services/ngx.service';
import { getTestBed } from '@angular/core/testing';

var pdfMake = require('pdfmake/build/pdfmake');
var pdfFonts = require('pdfmake/build/vfs_fonts');
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
  // options
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
  getTest() {
    var node = document.getElementById('chart');
    // var img = new Image();
    // img.src = dataUrl;
    // img.style.height = '1000px';
    // img.style.height = '845px';
    // console.log(console.log(node!.getBoundingClientRect()));
    document.body.appendChild(node!);
    console.log(node!.outerHTML);

    // this.ngxService.getPdf("").subscribe((res) => {
    //   console.log(res);
    // });
  }

  async downloadChart() {
    console.log('download button clicked');
    var node = document.getElementById('chart');
    var base64ImageStr = '';
    // console.log(node!.outerHTML);

    await htmlToImage
      .toPng(node!)
      .then(function (dataUrl) {
        base64ImageStr = dataUrl;
      })
      .catch(function (error) {
        console.error('oops, something went wrong!', error);
      });
    var dataUrl = '';
    await this.ngxService.getPdf(base64ImageStr).subscribe(async (res) => {
      dataUrl = res['resposne'];
      console.log(res);
      const link = await document.createElement('a');
      const source = `data:application/pdf;base64,${dataUrl}`;
      link.href = source;
      link.download = 'test.pdf';
      link.click();
    });
  }
}
