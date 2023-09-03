//-------------------------------------------------- spiner functionallty----------------------------------------------------------------
function toggleSpinner() {
  $(".loading-spiner").toggleClass("d-none");
}
// --------------------------------------------------hide and show side bar---------------------------------------------------------------
$("nav .nav-controllers .controller i ").on("click", function () {
  $(this).toggleClass("fa-xmark");
  $(" nav .show-hide").animate({ width: "toggle" }, 1500);
  if ($(this).hasClass("fa-xmark")) {
    $(" nav .nav-links").removeClass("fide-out");
  }
  if (!$(this).hasClass("fa-xmark")) {
    $(" nav .nav-links").addClass("fide-out");
  }
});
// -----------------------------------------------get data form api------------------------------------------------------------------------
async function getData(url, callBAckfunction, searchPhase = false) {
  try {
    toggleSpinner();
    const res = await fetch(url);
    const data = await res.json();

    callBAckfunction(data, searchPhase);
  } catch (error) {
    console.log(error);
  } finally {
    toggleSpinner();
  }
}
//----------------------------------------- display  all meals   depend on filter type category-area-random-ingredient----------------------
function displayFilteredMeals(data, search = false) {
  $("section").addClass("d-none");
  $(".filtered-meals").removeClass("d-none");

  if (!search) {
    $(".filtered-meals").removeClass("d-none");
  } else {
    $(".filtered-meals,.search").removeClass("d-none");
  }

  let meals = data.meals.slice(0, 20);

  let mealsCO = "";
  meals.forEach((element) => {
    mealsCO += `
    <div class="col-md-4 col-lg-3">
    <div class="home-meal-img meal-and-overlay">
      <img
        class="w-100 rounded-2"
        src="${element.strMealThumb}"
        alt="meal"
      />
      <div class="home-meal-name meal-overlay">${element.strMeal}</div>
    </div>
  </div>
  `;
  });
  $(".filtered-meals .row").html(mealsCO);
}
//----------------------------------------------------- to get the targeted meal details work with home-category-area----------------------------------------------
$(".filtered-meals").on("click", (e) => {
  if (e.target == $(".filtered-meals")[0]) {
    return;
  }
  const destination = e.target.closest("div").innerText;
  getData(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${destination}`,
    displayMealDetails
  );
});
// ------------------------------------------------------- to display single meal details by it's name----------------------------------------------

function displayMealDetails(data) {
  $("section").addClass("d-none");
  $(".meal").removeClass("d-none");
  const currentMeal = data.meals[0];

  let ingredientList = "";

  let tages = "";
  const mealContainer = document.querySelector(".meal");
  const mealIngredientList = mealContainer.querySelector(".meal-recipe-list");
  const mealTagList = mealContainer.querySelector(".tag-list");
  mealContainer.querySelector(".meal-pic img").src = currentMeal.strMealThumb;
  mealContainer.querySelector(".meal-name").textContent = currentMeal.strMeal;
  mealContainer.querySelector(".meal-recipe").textContent =
    currentMeal.strInstructions;
  mealContainer.querySelector(".meal-area").textContent = currentMeal.strArea;
  mealContainer.querySelector(".meal-category").textContent =
    currentMeal.strCategory;
  mealContainer.querySelector(".source-btn").href = currentMeal.strSource;
  mealContainer.querySelector(".youtube-btn").href = currentMeal.strYoutube;

  for (let i = 0; i < 20; i++) {
    if (
      currentMeal[`strIngredient${i}`] !== "" &&
      currentMeal[`strIngredient${i}`] !== undefined &&
      currentMeal[`strIngredient${i}`] !== null
    ) {
      ingredientList += `<li class="alert alert-info p-1 m-2">${
        currentMeal[`strIngredient${i}`]
      }</li>`;
    }
  }
  // some meals don't have any tags so currentMeal.strTags=null ? to overcome this issue
  if (currentMeal.strTags?.length) {
    let tagList = currentMeal.strTags.split(",");
    tagList.forEach((tage) => {
      tages += `<li class="alert alert-danger p-1 m-2">${tage}</li>`;
    });
    mealTagList.innerHTML = tages;
  } else {
    mealTagList.innerHTML = "";
  }

  mealIngredientList.innerHTML = ingredientList;
}

// -----------------------------------------------------get intro meals------------------------------------------------------------------------
$(window).on("load", function () {
  getData(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=`,
    displayFilteredMeals
  );
});
//------------------------------------------------- search for meal lists by name and first letter------------------------------------------------
$("#search-btn").on("click", () => {
  $("section").addClass("d-none");
  $(".filtered-meals,.search").removeClass("d-none");
  $(".filtered-meals .row").html("");
});
$("#mealnames").on("input", function () {
  const mealName = $(this).val().trim();
  getData(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`,
    displayFilteredMeals,
    true
  );
});
$("#mealfirstletter").on("input", function () {
  const mealLetter = $(this).val().trim();
  // mealLetter = mealLetter == "" ? "a" : mealLetter;
  getData(
    `https://www.themealdb.com/api/json/v1/1/search.php?f=${mealLetter}`,
    displayFilteredMeals,
    true
  );
});
// ---------------------------------------------------------------------display category meals----------------------------------------------------

$("#cateagore-btn").on("click", () => {
  getData(
    `https://www.themealdb.com/api/json/v1/1/categories.php`,
    displayCategories
  );
});
function displayCategories(data) {
  $("section").addClass("d-none");
  $(".categories").removeClass("d-none");
  // to remove old result
  $(".categories .row").html("");
  const categories = data.categories.slice(0, 20);
  categories.forEach((element) => {
    const discription = element.strCategoryDescription
      .split(" ")
      .slice(0, 15)
      .join(" ");
    const cat = `
    <div class="col-md-4 col-lg-3">
    <div class="meal-and-overlay" id=${element.idCategory}>
      <img
        class="w-100 rounded-2"
        src="${element.strCategoryThumb}"
        alt="meal"
      />
      <div class="meal-overlay cat-overlay">
        <h3>${element.strCategory}</h3>
        <p>
          ${discription}
        </p>
      </div>
    </div>
  </div>
  `;
    $(".categories .row").append(cat);
  });
}

$(".categories").on("click", (e) => {
  if (e.target == $(".categories")[0]) {
    return;
  }
  const category = e.target.closest("div").querySelector("h3").innerText;

  getData(
    `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`,
    displayFilteredMeals
  );
});

// ---------------------------------------------------------------------display area meals----------------------------------------------------
$("#area-btn").on("click", () => {
  getData(
    `https://www.themealdb.com/api/json/v1/1/list.php?a=list`,
    displayArea
  );
});

function displayArea(data) {
  $("section").addClass("d-none");
  $(".area").removeClass("d-none");
  const areas = data.meals.slice(0, 20);
  let areasContainer = "";
  areas.forEach((element) => {
    areasContainer += `
    <div class="col-md-4 col-lg-3">
              <div class="area-info text-center">
                <i class="fa-regular fa-flag"></i>
                <h3>${element.strArea}</h3>
              </div>
            </div>
  `;
  });
  $(".area .row").html(areasContainer);
}
$(".area").on("click", (e) => {
  if (e.target == $(".area")[0]) {
    return;
  }
  const destination = e.target.closest("div").querySelector("h3").innerText;
  getData(
    `https://www.themealdb.com/api/json/v1/1/filter.php?a=${destination}`,
    displayFilteredMeals
  );
});
// ---------------------------------------------------------------------display area meals----------------------------------------------------
$("#ingredients-btn").on("click", () => {
  getData(
    `https://www.themealdb.com/api/json/v1/1/list.php?i=list`,
    displayIngredients
  );
});

function displayIngredients(data) {
  $("section").addClass("d-none");
  $(".ingredients").removeClass("d-none");
  $(".ingredients .row").html("");
  const dataIng = data.meals.slice(0, 20);
  dataIng.forEach((element, index) => {
    const discription = element.strDescription
      .split(" ")
      .slice(0, 15)
      .join(" ");

    if (index < 20) {
      const ingredient = `
        <div class="col-md-4 col-lg-3">
        <div class="ingre-info">
          <i class="fa-solid fa-book-open"></i>
          <h3>${element.strIngredient}</h3>
          <p>
            ${discription}
          </p>
        </div>
      </div>
      `;
      $(".ingredients .row").append(ingredient);
    }
  });
}
$(".ingredients").on("click", (e) => {
  if (e.target == $(".ingredients")[0]) {
    return;
  }
  const destination = e.target.closest("div").querySelector("h3").innerText;
  getData(
    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${destination}`,
    displayFilteredMeals
  );
});

// ------------------------------------------------------------------------contact us-------------------------------------------------------------
let userpass = "";
$("#contact-btn").on("click", () => {
  // to show spinner
  toggleSpinner();
  $("section").addClass("d-none");
  $(".contact-us").removeClass("d-none");
  // to hide spinner
  setTimeout(() => {
    toggleSpinner();
  }, 800);
});
// vaildation with regex
function vaildation(regex, element, nextp) {
  const regPattern = regex;
  if (!regPattern.test($(element).val().trim())) {
    $(nextp).removeClass("d-none");
  } else {
    $(nextp).addClass("d-none");
    if ($(element).attr("id") == "userpass") {
      userpass = $(element).val();
    }
  }
  if ($(element).val().length == 0) {
    $(nextp).addClass("d-none");
  }
}

$("#userName").on("input", function () {
  const nameReg = /^[a-zA-Z]{3,}$/;
  vaildation(nameReg, this, $(this).next());
  submitState();
});

$("#userMail").on("input", function () {
  const emailReg =
    /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  vaildation(emailReg, this, $(this).next());
  submitState();
});

$("#userphone").on("input", function () {
  vaildation(/\d{11}/, this, $(this).next());
  submitState();
});

$("#userage").on("input", function () {
  const ageReg = /^(?:100|[0-9]|[1-9][0-9])$/;
  vaildation(ageReg, this, $(this).next());
  submitState();
});

$("#userpass").on("input", function () {
  const passReg = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  vaildation(passReg, this, $(this).next());
  submitState();
});
$("#Repassword").on("input", function () {
  if (!($(this).val().trim() == userpass)) {
    $(this).next("p").removeClass("d-none");
  } else {
    $(this).next("p").addClass("d-none");
  }
  if ($(this).val().length == 0) {
    $(this).next("p").addClass("d-none");
  }
  submitState();
});

function submitState() {
  const nameReg = /^[a-zA-Z]{3,}$/;
  const emailReg =
    /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  const ageReg = /^(?:100|[0-9]|[1-9][0-9])$/;
  const passReg = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  const phoneReg = /\d{11}/;
  const userName = nameReg.test($("#userName").val().trim());
  const userEmail = emailReg.test($("#userMail").val().trim());
  const userPhone = phoneReg.test($("#userphone").val().trim());
  const userAge = ageReg.test($("#userage").val().trim());
  const userPass = passReg.test($("#userpass").val().trim());
  const rePass = $("#Repassword").val().trim();

  if (
    userName &&
    userAge &&
    userEmail &&
    userPhone &&
    userPass &&
    userpass == rePass
  ) {
    $(".submit-btn").removeClass("disabled");
  } else {
    $(".submit-btn").addClass("disabled");
  }
}
