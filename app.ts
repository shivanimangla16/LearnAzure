import { TestBed } from '@angular/core/testing';
import express, { Request, Response, NextFunction } from 'express';
const router = express.Router();
const nodeHtmlToImage = require('node-html-to-image');

const htmlToBase64Image = require('html-to-base64-image');

const app = express();
var path = require('path');
const port = 4000;
app.use(express.json({ limit: '50mb' }));
var allowCrossDomain = function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
};
app.use(allowCrossDomain);
app.listen(port);
// console.log(req.body.data);
// res.json({"data":"test"});
// const image = await nodeHtmlToImage({
//   // html: '<html><body><div>Check out what I just did! #cool</div></body></html>'
//   html: req.body.data
// });
// res.writeHead(200, { 'Content-Type': 'image/png' });
// res.end(image);

// var data = req.body.data;

const getPdf = async (req: Request, res: Response) => {
  const image = await nodeHtmlToImage({
    // html: '<html><body><div class="row"><div>Check out what I just did! #cool</div><div>Check out what I just did! #cool</div></div></body></html>'
    // html: '<html><body><div><input/><input/></div></body></html>',
    html:req.body.data
  });
  // console.log(image);
  const base64Image = Buffer.from(image).toString('base64');
  const dataURI = 'data:image/jpeg;base64,' + base64Image;
  console.log(dataURI);
  res.json({ data: 'wygdu' });
  return;

  htmlToBase64Image(req.body.data).then(async (data: any) => {
    // console.log(data);
    var fonts = {
      Roboto: {
        normal: path.resolve('src', 'fonts', 'Roboto.ttf'),
        bold: path.resolve('src', 'fonts', 'Roboto-Bold.ttf'),
      },
    };
    var PdfPrinter = require('pdfmake');
    var printer = new PdfPrinter(fonts);
    //  var temp = PdfPrinter.pageLayout;
    //  console.log(temp);
    const docDefinition = {
      pageSize: 'A4',
      pageMargins: [50, 50, 50, 50],
      info: {
        title: 'PDF with External Image',
        author: 'Matt Hagemann',
        subject: 'PDF with External Image',
      },
      content: [
        {
          image: data,
          width: 500,
        },
        {
          image: data,
          width: 500,
        },
      ],
    };
    try {
      var pdfDoc = await printer.createPdfKitDocument(docDefinition, {});
    } catch (error) {
      console.log('That did not go well.');
      console.log(error);
    }
    var chunks: Uint8Array[] = [];
    await pdfDoc.on('data', (val: Uint8Array) => {
      chunks.push(val);
    });
    await pdfDoc.on('end', function () {
      var result = Buffer.concat(chunks);
      var str = result.toString('base64');
      var json = { resposne: str };
      console.log(json);
      res.json(json);
    });
    pdfDoc.end();
  });
};
app.post('/', getPdf);
