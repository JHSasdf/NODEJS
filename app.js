const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();

app.set("views", path.join(__dirname, "views")); // 2번째 view는 폴더이름 views
app.set("view engine", "ejs");
// express 앱에 대한 특정 option을 설정할 수 있음
// ejs 파일이 view engine을 통해 browser에서 받는 html content로 parse되고 templeate engine을 이용해서 동적으로 삽입 되는 것.

app.get("/", function (req, res) {
  res.render('index'); // 파일 확장자 생략
  //parse template engine, rendering, convert to html and send to the browser

  // const htmlFilePath = path.join(__dirname, 'views', 'index.html')
  // res.sendFile(htmlFilePath);
});

app.use(express.static("public")); // 터미널 경로의 public 폴더의 static 자료들을 이용할 수 있게 하는 method, css link 할 때 public부터 시작

app.use(express.urlencoded({ extended: false }));

app.get("/restaurants", function (req, res) {
  const filePath = path.join(__dirname, 'data', 'restaurant.json');
  
  const fileData = fs.readFileSync(filePath);
  const storedRestaurant = JSON.parse(fileData);

  res.render('restaurants', { numberOfRestaurants: storedRestaurant.length, restaurants: storedRestaurant});
  // storedRestaurant는 배열이기 때문에 length 값 출력 가능


  // 해당 템플릿에 동적 html 코드가 있으면 두번째 parameter가 필요함. 템플릿에서 참조하는 variable, placeholder 등의 자바스크립트 객체 전달 가능
  

  // const htmlFilePath = path.join(__dirname, "views", "restaurants.html");
  // res.sendFile(htmlFilePath);
});

app.get("/about", function (req, res) {
  res.render('about');
});

app.get("/confirm", function (req, res) {
  res.render('confirm');
});

app.get("/recommend", function (req, res) {
  
  res.render('recommend');
  
   // const htmlFilePath = path.join(__dirname, "views", "recommend.html");
  // res.sendFile(htmlFilePath);
});

app.post("/recommend", function (req, res) {
  const restaurant = req.body;
  const filePath = path.join(__dirname, "data", "restaurant.json");

  const fileData = fs.readFileSync(filePath);
  const storedRestaurant = JSON.parse(fileData);

  storedRestaurant.push(restaurant); //storedRestaurant에 restaurant를 추가함

  fs.writeFileSync(filePath, JSON.stringify(storedRestaurant)); // text화하고 추가

  res.redirect("/confirm");
});

app.listen(3000);
