const path = require("path");

const express = require("express"); // 타사 패키지 사용 참조 선언 (import)


const defaultRoutes = require('./routes/default');
const restaurantRoutes = require('./routes/restaurants');

const app = express();


app.set("views", path.join(__dirname, "views")); // 첫번째 views는 view engine 쓰겠다는 말, 2번째 view는 폴더이름 views
app.set("view engine", "ejs");
// express 앱에 대한 특정 option을 설정할 수 있음
// ejs 파일이 view engine을 통해 browser에서 받는 html content로 parse되고 templeate engine을 이용해서 동적으로 삽입 되는 것.


// app.use() 들어오는 모든 요청에 대한 실행하는 함수를 등록하는 구문.
app.use(express.static("public")); // 터미널 경로의 public 폴더의 static 자료들을 이용할 수 있게 하는 미들웨어 method, css link 할 때 public부터 시작
app.use(express.urlencoded({ extended: false }));
// urlencoded: body parser를 설정하는 method로, urlencoded가 찾는 데이터가 들어오면 구문 분석해서 자바스크립트 객체로 변환함/
// json data는 js를 문법을 닮은 원시 데이터이기 때문에 js에서 이용할 수 있게 parsing해야함.
// app.use() 함수는 Express 앱에서 항상 실행하는 미들웨어의 역할을 함. app.get(), app.post() 등과 달리 요청 URL을 지정하지 않아도 app.use()를 사용할 수 있으며, 해당 경우에는 URL에 상관없이 앱이 요청을 수신할 때마다 매번 실행됨.

app.use('/', defaultRoutes);
// 30번째 get은 도메인 /restaurants 이 있는 경우에만 접속할 수 있지만, use는 들어오는 경로의 시작을 확인하는 필터 역할을 함. '/'로 설정했으니 들어오는 모든 요청이 defaultRoutes로 전달됨.
app.use('/', restaurantRoutes);



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
