const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '..', "data", "restaurant.json");

function getStoredRestaurants() {

  const fileData = fs.readFileSync(filePath);
  const storedRestaurants = JSON.parse(fileData);

  return storedRestaurants;
}

function storeRestaurants(storableRestaurants) {
    fs.writeFileSync(filePath, JSON.stringify(storableRestaurants)); // text화하고 추가
}

module.exports = {
    getStoredRestaurants: getStoredRestaurants,
    storeRestaurants: storeRestaurants
};
// 노출하려는 항목 정의
// fucntion()을 사용하지 않는 이유는 함수의 결과값을 export 하는 게 아니라 함수 전체를 export하기 위해