const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require("ejs");
const upload = require('./handlers/multer')

const app = express() 

app.set('view engine', 'ejs');

app.use(bodyParser.json()).use(bodyParser.urlencoded({ extended: true }));

app.get("/merge-pdf", (req,res)=>{
    res.render("index");
})

app.post("/merged-pdfs",upload.array('pdfinput',2), async (req,res)=>{
    console.log(req.files);
    // Load cover and content pdfs
  const cover = await PDFDocument.load(fs.readFileSync(req.files[0].path));
  const content = await PDFDocument.load(fs.readFileSync(req.files[1].path));

    // Create a new document
  const doc = await PDFDocument.create();

    // Add the cover to the new doc
  const contentPages1 = await doc.copyPages(cover, cover.getPageIndices());
  for (const page of contentPages1) {
    doc.addPage(page);
  }

    // Add individual content pages
  const contentPages2 = await doc.copyPages(content, content.getPageIndices());
  for (const page of contentPages2) {
    doc.addPage(page);
  }
  fs.writeFileSync('./downloads/test.pdf', await doc.save())
    // Write the PDF to a file
   res.download('./downloads/test.pdf');
});
//.catch(err => console.log(err));

app.listen(1337, function(err){
    if(err){
        console.log(err);
    }
    else{
        console.log("server started at 3000");
    }
})
