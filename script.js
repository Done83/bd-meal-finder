const search = document.getElementById("search");
const submit = document.getElementById("submit");
const random = document.getElementById("random");
const mealsEl = document.getElementById("meals");
const resultHeading = document.getElementById("result-heading");
const single_mealEl = document.getElementById("single-meal");

// Search meal function / Fetch API endpoint
const searchMeal = async (e) => {
  e.preventDefault();

  // Clear single meal
  single_mealEl.innerHTML = "";

  // Get search term
  const term = search.value;

  // Check for a valid search term
  if (term?.trim()) {
    try {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`
      );
      const data = await response.json();
      resultHeading.innerHTML = `<h2>Search results for '${term}':</h2>`;
      if (data.meals === null) {
        resultHeading.innerHTML = `<p>There are no search results. Try again!</p>`;
      } else {
        mealsEl.innerHTML = data.meals
          .map(
            (meal) => `<div class='meal'>
            <img src='${meal.strMealThumb}' alt='${meal.strMeal}'/>
            <div class='meal-info' data-mealID=${meal.idMeal}>
              <h3>${meal.strMeal}</h3>
            </div>
          </div>`
          )
          .join("");
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
    // Clear search bar
    search.value = "";
  } else {
    alert("Please enter a search term!");
  }
};

// Fetch meal by ID
const getMealById = async (mealID) => {
  try {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`
    );
    const data = await response.json();
    const meal = data.meals[0];
    addMealtoDOM(meal);
  } catch (error) {
    console.error("Failed to fetch data:", error);
  }
};

// Fetch random meal
const getRandomMeal = async () => {
  // Clear meals and heading
  mealsEl.innerHTML = "";
  resultHeading.innerHTML = "";

  try {
    const response = await fetch(
      "https://www.themealdb.com/api/json/v1/1/random.php"
    );
    const data = await response.json();
    const meal = data.meals[0];
    addMealtoDOM(meal);
  } catch (error) {
    console.error("Failed to fetch data:", error);
  }
};

// Add single meal to DOM
const addMealtoDOM = (meal) => {
  const ingredients = [];

  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(
        `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
      );
    } else {
      break;
    }
  }

  single_mealEl.innerHTML = `
    <div class='single-meal'>
      <h1>${meal.strMeal}</h1>
      <img src='${meal.strMealThumb}' alt='${meal.strMeal}'/>
      <div class='single-meal-info'>
        ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ""}
        ${meal.strArea ? `<p>${meal.strArea}</p>` : ""}
      </div>
      <div class='main'>
        <p>${meal.strInstructions}</p>
        <h2>Ingredients:</h2>
        <ul>
          ${ingredients.map((ing) => `<li>${ing}</li>`).join("")}
        </ul>
      </div>
    </div>
  `;
};

// Event listeners
submit.addEventListener("submit", searchMeal);

mealsEl.addEventListener("click", (e) => {
  const mealInfo = e.composedPath().find((item) => {
    if (item.classList) {
      return item.classList.contains("meal-info");
    } else {
      return false;
    }
  });
  if (mealInfo) {
    const mealID = mealInfo.getAttribute("data-mealid");
    getMealById(mealID);
  } else {
  }
});

random.addEventListener("click", getRandomMeal);
