const path = require("path");
const fs = require("fs"); // 내장된 패키지들

const express = require("express"); // 타사 패키지 사용 참조 선언 (import)
const uuid = require("uuid");

const resData = require('./util/restaurant-data'); // 직접 파일 추가

const app = express();


app.set("views", path.join(__dirname, "views")); // 첫번째 views는 view engine 쓰겠다는 말, 2번째 view는 폴더이름 views
app.set("view engine", "ejs");
// express 앱에 대한 특정 option을 설정할 수 있음
// ejs 파일이 view engine을 통해 browser에서 받는 html content로 parse되고 templeate engine을 이용해서 동적으로 삽입 되는 것.

app.get("/", function (req, res) {
  res.render("index"); // 파일 확장자 생략
  //parse template engine, rendering, convert to html and send to the browser

  // const htmlFilePath = path.join(__dirname, 'views', 'index.html')
  // res.sendFile(htmlFilePath);
});

// app.use() 들어오는 모든 요청에 대한 실행하는 함수를 등록하는 구문.
app.use(express.static("public")); // 터미널 경로의 public 폴더의 static 자료들을 이용할 수 있게 하는 미들웨어 method, css link 할 때 public부터 시작
app.use(express.urlencoded({ extended: false }));
// urlencoded: body parser를 설정하는 method로, urlencoded가 찾는 데이터가 들어오면 구문 분석해서 자바스크립트 객체로 변환함/
// json data는 js를 문법을 닮은 원시 데이터이기 때문에 js에서 이용할 수 있게 parsing해야함.
// app.use() 함수는 Express 앱에서 항상 실행하는 미들웨어의 역할을 함. app.get(), app.post() 등과 달리 요청 URL을 지정하지 않아도 app.use()를 사용할 수 있으며, 해당 경우에는 URL에 상관없이 앱이 요청을 수신할 때마다 매번 실행됨.


app.get("/restaurants", function (req, res) {
  
  const storedRestaurants = resData.getStoredRestaurants();

  res.render("restaurants", {
    numberOfRestaurants: storedRestaurants.length,
    restaurants: storedRestaurants,
  });
  // storedRestaurant는 배열이기 때문에 length 값 출력 가능

  // 해당 템플릿에 동적 html 코드가 있으면 두번째 parameter가 필요함. 템플릿에서 참조하는 variable, placeholder 등의 자바스크립트 객체 전달 가능

  // const htmlFilePath = path.join(__dirname, "views", "restaurants.html");
  // res.sendFile(htmlFilePath);
});

app.get("/restaurants/:id", function (req, res) {
  // /restaurants.r1, 동적으로 /restaurants/id에 들어갈 id 생성 가능...
  const restaurantId = req.params.id; // id 값을 restaurantId에 넣음
  
  const storedRestaurants = resData.getStoredRestaurants();
  for (const restaurant of storedRestaurants) {
    if (restaurant.id === restaurantId) {
      return res.render("restaurant-detail", { /*rid: restaurantId,*/ restaurant: restaurant }); // 주소에 동적으로 값을 넣으면 주소를 알아서 생성하고 해당 id 값을 변수로 사용 가능.
      // get의 URL에서 :id를 해서 params.id key가 있음.
    }
  }
  res.status(404).render('404');
});
// status code 404로 수정하고 404.ejs파일 render

app.get("/about", function (req, res) {
  res.render("about");
});

app.get("/confirm", function (req, res) {
  res.render("confirm");
});

app.get("/recommend", function (req, res) {
  res.render("recommend");

  // const htmlFilePath = path.join(__dirname, "views", "recommend.html");
  // res.sendFile(htmlFilePath);
});

app.post("/recommend", function (req, res) {
  const restaurant = req.body;
  restaurant.id = uuid.v4(); // string
  // js는 object에서 존재하지 않는 property (key) 값을 호출하면 자동으로 생성해줌.

  const storedRestaurants = resData.getStoredRestaurants();

  storedRestaurants.push(restaurant); //storedRestaurant에 restaurant를 추가함

  resData.storeRestaurants(storedRestaurants); // text화하고 추가

  res.redirect("/confirm");
});

// app.use('/admin', function() {}); 
// 밑에 구문은 주소를 생략하여 위 line에서 정의된 url이 아닌 모든 url에 대해 404를 띄우는 기능.
// 왜? 구문은 위에서 아래로 parsing 되니까!!
app.use(function(req, res) {
  res.status(404).render('404');
});
// app.use() 함수는 Express 앱에서 항상 실행하는 미들웨어의 역할을 함. app.get(), app.post() 등과 달리 요청 URL을 지정하지 않아도 app.use()를 사용할 수 있으며, 해당 경우에는 URL에 상관없이 앱이 요청을 수신할 때마다 매번 실행됨.

// 서버 error 500, 서버측 문제 (서버 경로 문제 등)
app.use(function(error, req, res, next) {
  res.status(500).render('500');
});
app.listen(3000);
