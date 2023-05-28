const items = document.getElementById("items"); // this is show all our serach items query ...
const searchtext = document.getElementById("search"); // input text
const searchBtn = document.getElementById("searchBtn"); // search btn
const main = document.getElementById("main"); // this is the main body where we will show favourite or description..
const favourite = document.getElementById("favouritePage"); // for clicking favoruite page

//if there is not data in local storage then we initalize empty array in local storage
if (localStorage.getItem("favourites") == null) {
  localStorage.setItem("favourites", JSON.stringify([]));
}

const showItems = (meal) => {
  // take meals arrays result which we get by searching by name using from the Api and then we map for to display all items details

  //  taking meal array and favoruite
  let meals = JSON.parse(localStorage.getItem("favourites"));

  let msg = "";
  items.innerHTML = "";

  if (meal == null) {
    // if we have null array that means we have not found any meal
    items.innerHTML += `<span class="card card-body">Sorry Meal Not Found Please Search Something Else...
    </span>`;
  } else {
    items.innerHTML = "";
    meal.map((item) => {
      if (meals.includes(item.idMeal)) {
        // if in localStorage Meal is Already present that meaan we will
        msg = "Remove Meal From Favourite"; //show remove meal Button
      } else {
        msg = "Add Meal to ur Favourites"; // otherwise we will show normal Add Meal Button
      }
      items.innerHTML += `
      <div class="card mb-3" >
      <div class="card-body">
      <h5 class="card-title fs-3 fw-bolder text-decoration-underline">${item.strMeal}</h5>
      <h5>Category : ${item.strCategory}</h5>
      <h5>Country of Origin : ${item.strArea}</h5>
      <a class="btn btn-outline-secondary fs-6 mb-3"id="detail" data-id=${item.idMeal}>
       Click here to Know more About the recipe
        </a>
      <img src="${item.strMealThumb}" class="card-img-top " alt="food pics" style="width: 90%; height: 50vh" />
      <a class="btn btn-outline-success mt-3" id="favourite" data-id=${item.idMeal}> ${msg}
      <i class="fa-solid fa-heart"></i>
      </a></div>
      </div>
      `;
    });
  }
};

const getMeals = (text) => {
  // taking text from input and then searching meals in APi by name
  try {
    const response = fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${text}`
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        showItems(data.meals);
      });
  } catch (error) {
    console.error("Error:", error);
  }
};

const showSingleItem = (item, favourite) => {
  let text = "";
  text += `
  <div class="card mb-3" >
        <div class="card-body">
          <p class="card-title fs-4">
          Meal Name  : 
          <span class="fs-3 text-decoration-underline fw-bolder">${item.strMeal}</span>
          </p>
          <a class="navbar-brand fs-4 fw-bold">Description : </a>;
          `;
  // if favourite is true means we are looking favourite page then  we will display page differently
  if (favourite) {
    text += `
    <p class="card-text fs-5 ">${item.strInstructions.slice(0, 200)}</p>;
    <img src="${
      item.strMealThumb
    }" class="card-img-top " alt="food pics" style="width: 25vw; height: 35vh" />
    <a class="btn btn-outline-success mt-3 d-block w-25 remove" id="favourite"  data-id=${
      item.idMeal
    }> Remove Meal From Favourite       
      <i class="fa-solid fa-heart"></i>
      </a>
    `;
    // if favourite is true means we are looking Meal Detail Page
  } else {
    text += `
    <p class="card-text fs-5 ">${item.strInstructions}</p>;
    <img src="${item.strMealThumb}" class="card-img-top " alt="food pics" style="width: 50vw; height: 65vh" />`;
  }

  text += ` <h5>Category : ${item.strCategory}</h5>
          <h5>Country of Origin : ${item.strArea}</h5>
        </div>
      </div>
      `;
  main.innerHTML += text;
};

const getDetails = (id) => {
  // this will serach the meals By its id
  try {
    const response = fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        const meal = data.meals[0];
        main.innerHTML = "";
        showSingleItem(meal, false); // false because its a detail page
      });
  } catch (error) {
    console.error("Error:", error);
  }
};

const favouritePage = () => {
  main.innerHTML = "";
  // taking data from local storage
  let meals = JSON.parse(localStorage.getItem("favourites"));
  const items = meals;
  if (items.length === 0) {
    // if there is no item in FavouriteMeal and User Click on the Favourite Page then it will show error
    main.innerHTML += `<span class="card card-body fs-2 fw-bold mt-5">U have Not Added Any Meal Yet ..</span>`;
  } else {
    items.map((id) => {
      try {
        const response = fetch(
          `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
        )
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            const result = data.meals[0];
            showSingleItem(result, true); // true because its a Favourite true
          });
      } catch (error) {
        console.error("Error:", error);
      }
    });
  }
};

const addItems = (e) => {
  let id = e.target.dataset.id;

  // taking data from local storage
  let meals = JSON.parse(localStorage.getItem("favourites"));
  //if Meal is already present in local Storage Array
  if (meals.includes(id)) {
    let idx = meals.indexOf(id); // searching meal id index in local Storage array
    meals = meals.splice(idx + 1, 1); // removing from local stroage array
    alert("Meal Deleted from Favourite");
    if (e.target.classList.contains("remove")) {
      location.reload();
    } else {
      getMeals(searchtext.value);
    }
  } else {
    // add Items  in LocalStorage Array
    meals.push(id);
    alert("Meal is added to ur favourites");
    getMeals(searchtext.value);
  }

  // adding data to local storage
  localStorage.setItem("favourites", JSON.stringify(meals));
};

searchBtn.addEventListener("click", (e) => {
  // When user clicks on serach btn
  e.preventDefault();
  getMeals(searchtext.value);
});

// localStorage.removeItem("favourites");
main.addEventListener("click", (e) => {
  // event on parent node that is item
  e.preventDefault();
  if (e.target.getAttributeNode("id").value === "detail") {
    // now if user clicks node with  detail tag id attribute
    getDetails(e.target.dataset.id); // call getDetails for meal
  } else if (e.target.getAttributeNode("id").value === "favourite") {
    // and user click  id with Favourite
    addItems(e); // cals addItem
  }
});

favourite.addEventListener("click", favouritePage); // user clicks on Favoruite link
