const express = require("express");
const uuid = require("uuid");

const router = express.Router();

const resData = require("./../util/restaurant-data"); // 직접 파일 추가\

router.get("/restaurants", function (req, res) {
  let order = req.query.order; // post를 통해 route가 생겼을 경우에 body가 생김, but query는 항상 있음. query에 있는 order라는 변수를 찾는 것.
  let nextOrder = "desc";
  if (order !== "asc" && order !== "desc") {
    order = "asc";
  }

  if (order === 'desc') {
    nextOrder = 'asc';
  }
  const storedRestaurants = resData.getStoredRestaurants();

  storedRestaurants.sort(function (resA, resB) {
    if (
      (order === "asc" && resA.name > resB.name) ||
      (order === "desc" && resB.name > resA.name)
    ) {
      return 1;
    }
    return -1;
  });
  // sort 함수에서 return값이 > 0 이면 순서를 바꾸고 < 0이면 그대로 둠
  // 미들웨어 함수와 라우터 함수를 통과할 때는 쿼리 매개변수는 무시됨. (? name=value 값).
  //      -- 하지만 서버측 코드에서는 인식됨.

  res.render("restaurants", {
    numberOfRestaurants: storedRestaurants.length,
    restaurants: storedRestaurants,
    nextOrder: nextOrder,
  });
  // storedRestaurant는 배열이기 때문에 length 값 출력 가능

  // 해당 템플릿에 동적 html 코드가 있으면 두번째 parameter가 필요함. 템플릿에서 참조하는 variable, placeholder 등의 자바스크립트 객체 전달 가능

  // const htmlFilePath = path.join(__dirname, "views", "restaurants.html");
  // res.sendFile(htmlFilePath);
});

router.get("/restaurants/:id", function (req, res) {
  // /restaurants.r1, 동적으로 /restaurants/id에 들어갈 id 생성 가능...
  const restaurantId = req.params.id; // id 값을 restaurantId에 넣음

  const storedRestaurants = resData.getStoredRestaurants();
  for (const restaurant of storedRestaurants) {
    if (restaurant.id === restaurantId) {
      return res.render("restaurant-detail", {
        /*rid: restaurantId,*/ restaurant: restaurant,
      }); // 주소에 동적으로 값을 넣으면 주소를 알아서 생성하고 해당 id 값을 변수로 사용 가능.
      // get의 URL에서 :id를 해서 params.id key가 있음.
    }
  }
  res.status(404).render("404");
});
// status code 404로 수정하고 404.ejs파일 render

router.get("/confirm", function (req, res) {
  res.render("confirm");
});

router.get("/recommend", function (req, res) {
  res.render("recommend");

  // const htmlFilePath = path.join(__dirname, "views", "recommend.html");
  // res.sendFile(htmlFilePath);
});

router.post("/recommend", function (req, res) {
  const restaurant = req.body;
  restaurant.id = uuid.v4(); // string
  // js는 object에서 존재하지 않는 property (key) 값을 호출하면 자동으로 생성해줌.

  const storedRestaurants = resData.getStoredRestaurants();

  storedRestaurants.push(restaurant); //storedRestaurant에 restaurant를 추가함

  resData.storeRestaurants(storedRestaurants); // text화하고 추가

  res.redirect("/confirm");
});

module.exports = router;
