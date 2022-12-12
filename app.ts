import { TestBed } from '@angular/core/testing';
import express, { Request, Response,NextFunction } from 'express';

const app = express();
var path = require('path');
const port = 4000;
app.use(express.json({ limit: '50mb' }));
var allowCrossDomain = function(req:Request, res:Response, next:NextFunction) {
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
}
app.use(allowCrossDomain);
app.listen(port);


const getPdf = async (req: Request, res: Response) => {
  var data = req.body.data;
  var fonts = {
    Roboto: {
      normal: path.resolve('src', 'fonts', 'Roboto.ttf'),
      bold: path.resolve('src', 'fonts', 'Roboto-Bold.ttf'),
    },
  };

  var PdfPrinter = require('pdfmake');
  var printer = new PdfPrinter(fonts);

  const docDefinition = {
    info: {
      title: 'PDF with External Image',
      author: 'Matt Hagemann',
      subject: 'PDF with External Image',
    },
    content: [
      {
        image: data,
        width: 595, // Full A4 size width.
        absolutePosition: { x: 0, y: 0 },
      },
    ],
    defaultStyle: {
      fontSize: 11,
      font: 'Roboto', // The font name was defined above.
      lineHeight: 1.2,
    },
  };
  try {
    var pdfDoc = await printer.createPdfKitDocument(docDefinition, {});
  } catch (error) {
    console.log('That did not go well.')
    console.log(error);
  }
  var chunks: Uint8Array[] = [];
  await pdfDoc.on('data', (val: Uint8Array) => {
    chunks.push(val);
  });
  await pdfDoc.on('end', function () {
    var result = Buffer.concat(chunks);
    var str = result.toString('base64');
    var json = {"resposne":str};
    res.json(json);
  });
  pdfDoc.end();

};
app.post('/', getPdf);

