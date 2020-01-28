const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const { PDFDocument, PageSizes } = require("pdf-lib");
const Epub = require("epub-gen");

async function printPDF() {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto("http://localhost:8001", {
      waitUntil: "networkidle2",
      timeout: 0
    });
    const book = await page.pdf({
      displayHeaderFooter: true,
      printBackground: true,
      format: "A4",
      margin: {
        top: "100px",
        bottom: "100px"
      },
      headerTemplate: " ",
      footerTemplate:
        '<style>@font-face {font-family: "Merriweather"; font-style: normal; font-weight: 400; font-display: swap; src: local("Merriweather Regular"), local("Merriweather-Regular"), url(./merryi.woff2) format("woff2");}</style><div style="margin: 0 auto;"><h1 style="font-family: Merriweather, serif; color: #000; font-size: 6px; text-align: center;">Page <span class="pageNumber"></span> of <span class="totalPages"></span></h1></div>'
    });
    await browser.close();
    const pdfDoc = await PDFDocument.load(book);
    const newPage = pdfDoc.insertPage(0, PageSizes.A4);
    const imageBytes = fs.readFileSync(
      path.join(__dirname, "../static/a4.png")
    );
    const image = await pdfDoc.embedPng(imageBytes);
    pdfDoc.setTitle("The Opinionated Guide To React");
    pdfDoc.setAuthor("Sara Vieira");
    pdfDoc.setSubject("It Depends");
    pdfDoc.setKeywords(["javascript", "react"]);

    // Get the width and height of the first page
    const { width, height } = newPage.getSize();

    newPage.drawImage(image, {
      x: 0,
      y: 0,
      width,
      height
    });

    // Serialize the PDFDocument to bytes (a Uint8Array)
    const pdfBytes = await pdfDoc.save();
    fs.writeFile(path.join(__dirname, "../book/book.pdf"), pdfBytes, function(
      err
    ) {
      if (err) {
        return console.log(err);
      }

      const html = fs.readFileSync(
        path.join(__dirname, "../public/index.html"),
        "utf8"
      );

      const option = {
        title: "The Opinionated Guide To React",
        verbose: true,
        author: "Sara Vieira",
        cover: path.join(__dirname, "../static/cover.png"),
        fonts: [path.join(__dirname, "./Merriweather-Regular.ttf")],
        customHtmlTocTemplatePath: path.join(__dirname, "./toc.html"),
        css: `
  @font-face {
    font-family: "Merriweather";
    font-style: normal;
    font-weight: normal;
    src: url("./Merriweather-Regular.ttf");
  }
  body {color: #000; font-family: "Helvetica";}
  .alert, .title {display: none;}
  .menu-toggle,
  .title,
  .alert {
    display: none;
  }
  pre,
  .toc {
    page-break-inside: avoid;
  }`,
        content: [
          {
            data: html
          }
        ]
      };

      new Epub(option, path.join(__dirname, "../book/book.epub"));
    });
  } catch (e) {
    console.log(e);
  }
}

printPDF().then(() => {
  console.log("done PDF");
});
