const fs = require('fs'); // file system
const path = require('path')

const express = require('express') //express 패키지 요청

const app = express();  // express mothod 호출해서 app 객체 생성

// app.use() 들어오는 모든 요청에 대한 실행하는 함수를 등록하는 구문.

app.use(express.urlencoded({extended: false})); // app 객체를 생성한 후 해야함.
// urlencoded: body parser를 설정하는 method로, urlencoded가 찾는 데이터가 들어오면 구문 분석해서 자바스크립트 객체로 변환함/
// json data는 js를 문법을 닮은 원시 데이터이기 때문에 js에서 이용할 수 있게 parsing해야함.

app.get('/currenttime', function(req, res) { // request: 들어오는 요청에 대한 추가정보 제공, responce: 들어온 요청에 대한 응답을 준비하는 기능
  res.send("<h1>" + new Date().toISOString() + "</h1>");
});  // localhost:3000/currenttime 
// 들어오는 get 요청에 대한 요청 hander 정의 .     // 익명 함수 생성, 함수 전달, 실행을 하지는 않음

app.get('/', function(req, res) {
  res.send('<form action="/store-user" method="POST"><label>Your Name</label><input type="text" name="username"><button>Submit</button></form>');
}) // localhost:3000/ 폼이 제출되면 브라우저는 /store-user 경로로 해당 양식에 있는 모든 필드를 가져와서 나가는 요청에 데이터로 추가함.

// post를 하기 위해서는 line 8의 app.use를 해야함. express에게 요청에 대해 모든 데이터를 구문 분석하고 변환해야한다고 명시적으로 말해주는 것.
app.post('/store-user', function(req, res) {
  const userName = req.body.username;
  
  const filePath = path.join(__dirname, 'data', 'users.json') // 프로젝트 디렉토리에 대한 절대경로를 실제로 보유하는 상수

  const fileData = fs.readFileSync(filePath);  // filePath에서 찾은 row data를 fileData에 넣기 (text 형식)
  const existingUsers = JSON.parse(fileData);  // Json 형식 데이터를 원시 자바스크립트 객체 또는 배열로 parse (분석)

  existingUsers.push(userName); // 해당 배열에 새로운 항목 추가, 새로운 값을 할당하지 않고 (existingUsers = []) 메모리를 변경하기 때문에  const여도 가능

  fs.writeFileSync(filePath, JSON.stringify(existingUsers));  // JSON.stringify(): object, arrays, number같은 자바스크립트 값을 제이슨 형식을 따르는 원시 텍스트 값으로 바꿔줌

  res.send('<h1>Username stored!</h1>');
});

app.get('/users', function(req, res) {
  const filePath = path.join(__dirname, 'data', 'users.json') 

  const fileData = fs.readFileSync(filePath); 
  const existingUsers = JSON.parse(fileData);

  let responseData = '<ul>';

  for (const user of existingUsers) {
    responseData += '<li>' + user + '</li>';
  }
  responseData += '</ul>';
  res.send(responseData);
});

app.get('/dummy', function(req, res) {
  res.send("<h1>It's dummy file!</h1>")
});

app.listen(3000);