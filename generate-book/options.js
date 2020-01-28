const { footerTemplate, epubCSS } = require("./templates");
const path = require("path");

const bookData = {
  title: "The Opinionated Guide To React",
  author: "Sara Vieira",
  subject: "It Depends",
  keywords: ["javascript", "react"]
};

const cover = path.join(__dirname, "../static/cover.png");
const pdfOptions = {
  displayHeaderFooter: true,
  printBackground: true,
  format: "A4",
  margin: {
    top: "100px",
    bottom: "100px"
  },
  headerTemplate: " ",
  footerTemplate
};

const epubOptions = data => ({
  title: bookData.title,
  author: bookData.author,
  cover,
  fonts: ["./Merriweather-Regular.ttf"],
  customHtmlTocTemplatePath: "./toc.html",
  css: epubCSS,
  content: [{ data }],
  verbose: true
});

module.exports = {
  epubOptions,
  pdfOptions,
  bookData
};
