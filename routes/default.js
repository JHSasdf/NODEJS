const express = require('express');

const router = express.Router();

router.get("/", function (req, res) {
  res.render("index"); // 파일 확장자 생략
  //parse template engine, rendering, convert to html and send to the browser

  // const htmlFilePath = path.join(__dirname, 'views', 'index.html')
  // res.sendFile(htmlFilePath);
});

router.get("/about", function (req, res) {
  res.render("about");
});

module.exports = router;