"use strict";
//Lấy DOM element
const submitBtn = document.getElementById("submit-btn");
const idInput = document.getElementById("input-id");
const nameInput = document.getElementById("input-name");
const ageInput = document.getElementById("input-age");
const typeInput = document.getElementById("input-type");
const weightInput = document.getElementById("input-weight");
const lengthInput = document.getElementById("input-length");
const colorInput = document.getElementById("input-color-1");
const breedInput = document.getElementById("input-breed");
const vaccinatedInput = document.getElementById("input-vaccinated");
const dewormedInput = document.getElementById("input-dewormed");
const sterilizedInput = document.getElementById("input-sterilized");
const btnDanger = document.querySelector(".btn-danger");
const btnHealthy = document.getElementById("healthy-btn");
const btnBMI = document.getElementById("bmi-btn");
const tableBodyEl = document.getElementById("tbody");
//Thêm để focus vào phần nhập id khi load lại trang
idInput.focus();

//Tạo array lưu data các pet
const petArr = [];
//Tạo array lưu data các healthy pet
let healthyPetArr = [];
//Đặt giá trị false vì chưa truy cập/ click
let healthyCheck = false;
let BMICheck = false;

//Xử lý sự kiện khi ấn button "Submit"
submitBtn.addEventListener("click", function (e) {
  const data = {
    id: idInput.value,
    name: nameInput.value,
    age: parseInt(ageInput.value),
    type: typeInput.value,
    weight: weightInput.value,
    length: lengthInput.value,
    breed: breedInput.value,
    color: colorInput.value,
    vaccinated: vaccinatedInput.checked,
    dewormed: dewormedInput.checked,
    sterlized: sterilizedInput.checked,
    //Thêm .toLocaleDateString('en-GB') để chỉ hiện ngày tháng năm
    date: new Date().toLocaleDateString("en-GB"),
    //Phương thức tính BMI dựa trên type của pet
    //tofixed(2) để lấy giá trị đc làm tròn tới sô thập phân thứ 2
    calBMI: function (type) {
      if (type == "Dog") {
        return ((this.weight * 703) / this.length ** 2).toFixed(2);
      } else if (type == "Cat") {
        return ((this.weight * 886) / this.length ** 2).toFixed(2);
      }
    },
  };
  const validateData = function () {
    if (
      checkFormFilling() &&
      !checkID() &&
      checkAge() &&
      checkWeight() &&
      checkLength() &&
      checkTypeBreed()
    ) {
      return true;
    } else return false;
  };
  //Chạy hàm để kiểm tra việc nhập dữ liệu đúng chưa
  if (validateData(data)) {
    //Đẩy dữ liệu vào petArray
    petArr.push(data);
    //Xóa dữ liệu đã nhập trong các trường
    clearInput();
    //Chạy hàm render dữ liệu lên trình duyệt
    renderTableData(petArr);
  }
});
//Tạo hàm kiểm tra thông tin nhập
//1. Không có trường nào bị nhập thiếu dữ liệu.
const checkFormFilling = function () {
  if (
    !idInput.value ||
    !nameInput.value ||
    !ageInput.value ||
    !weightInput.value ||
    !lengthInput.value
  ) {
    alert("Please fill in the form!");
    return false;
  } else return true;
};
// 2. Giá trị ID không được trùng với các thú cưng còn lại.
// Chạy loop để so sánh giá trị id mới nhập với id cũ
// Return true khi tìm được id trùng, ko tìm được return false
const checkID = function () {
  for (let i = 0; i < petArr.length; i++) {
    if (idInput.value == petArr[i].id) {
      alert("ID must be unique!");
      return true;
    }
  }
};
//3. Trường Age chỉ được nhập giá trị trong khoảng 1 đến 15
const checkAge = function () {
  if (ageInput.value < 1 || ageInput.value > 15) {
    alert("Age must be between 1 and 15!");
    return false;
  } else return true;
};
//4.Trường Weight chỉ được nhập giá trị trong khoảng 1 đến 15
const checkWeight = function () {
  if (weightInput.value < 1 || weightInput.value > 15) {
    alert("Weight must be between 1 and 15!");
    return false;
  } else return true;
};
//5. Trường Length chỉ được nhập giá trị trong khoảng 1 đến 100
const checkLength = function () {
  if (lengthInput.value < 1 || lengthInput.value > 100) {
    alert("Length must be between 1 and 100!");
    return false;
  } else return true;
};
//6. Bắt buộc phải chọn giá trị cho trường Type/ Breed
// Em đã thêm value "select" trong HMTL cho option "Select type"
const checkTypeBreed = function () {
  if (typeInput.value == "select") alert("Please select Type!");
  if (breedInput.value == "select") alert("Please select Breed!");
  if (typeInput.value != "select" && breedInput.value != "select") return true;
};
//Hàm xóa dữ liệu đầu vào
const clearInput = () => {
  idInput.value = "";
  nameInput.value = "";
  ageInput.value = "";
  weightInput.value = "";
  lengthInput.value = "";
  //Set giá trị về mặc định (Select type) sau khi ấn submit
  typeInput.value = "select";
  breedInput.value = "select";
  vaccinatedInput.checked = false;
  dewormedInput.checked = false;
  sterilizedInput.checked = false;
};
//Render dữ liệu lên trình duyệt
const renderTableData = function (petArr) {
  tableBodyEl.innerHTML = "";
  for (let i = 0; i < petArr.length; i++) {
    const row = document.createElement("tr");
    //Tạo toán thử 3 ngôi để hiện icon theo dữ liệu đã nhập - Tạo biến mới để HTML Code dễ nhìn hơn
    const vaccin_css = petArr[i].vaccinated
      ? "bi bi-check-circle-fill"
      : "bi bi-x-circle-fill";

    const dewormed_css = petArr[i].dewormed
      ? "bi bi-check-circle-fill"
      : "bi bi-x-circle-fill";
    const sterlized_css = petArr[i].sterlized
      ? "bi bi-check-circle-fill"
      : "bi bi-x-circle-fill";
    //Toán tử 3 ngôi tính BMI (hoặc hiện '?') dựa vào giá trị boolean của BMICheck
    const x = BMICheck ? petArr[i].calBMI(petArr[i].type) : "?";
    //HTML Code
    row.innerHTML = `<th>${petArr[i].id}</th> <td>${petArr[i].name}</td>
    <td>${petArr[i].age}</td><td>${petArr[i].type}</td>
    <td>${petArr[i].weight} kg</td><td>${petArr[i].length} cm</td>
    <td>${petArr[i].breed}</td>
    <td><i class="bi bi-square-fill" style="color: ${petArr[i].color}"></i></td>
    <td><i class="${vaccin_css}"></td>
    <td><i class="${dewormed_css}"></i></td>
    <td><i class="${sterlized_css}"></i></td>
    <td class = "bmi_java">${x}</td>
    <td>${petArr[i].date}</td>
    <td><button class="btn btn-danger" onclick="deletePet('${petArr[i].id}')">Delete</button></td>`;
    //Chèn thêm 1 hàng
    tableBodyEl.appendChild(row);
  }
};

//Hàm xóa pet theo petID
function deletePet(petID) {
  if (confirm("Are you sure?")) {
    //Tìm index của object chứa petID cần xóa
    let row = petArr.find((row) => row.id == petID);
    //Xóa object đã tìm được
    petArr.splice(petArr.indexOf(row), 1);
    renderTableData(petArr);
  }
}
//Xử lý sự kiện khi ấn button "Show healthy pet"
btnHealthy.addEventListener("click", function () {
  if (healthyCheck == false) {
    //Lọc object đủ tiêu chí heo thì và gán vô healthyPetArr
    healthyPetArr = petArr.filter(
      (el) =>
        el.vaccinated == true && el.dewormed == true && el.sterlized == true
    );
    renderTableData(healthyPetArr);
    //Đổi nội dung hiển thị trên HTML sau khi click
    btnHealthy.textContent = "Show all Pet";
    healthyCheck = true;
  } else {
    renderTableData(petArr);
    btnHealthy.textContent = "Show Healthy Pet";
    healthyCheck = false;
  }
});

//Xử lý sự kiện khi ấn button "Calculate BMI"
btnBMI.addEventListener("click", function () {
  if (BMICheck) {
    renderTableData(petArr);
    BMICheck = false;
  } else {
    renderTableData(petArr);
    BMICheck = true;
  }
});
