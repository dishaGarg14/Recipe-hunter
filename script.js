

let nextBtn = document.querySelector('#nextbtn');
let prevBtn = document.querySelector('#prevbtn');
let allDish = document.querySelectorAll('.dishes');
let searchInput = document.querySelector('#searchspace');
let searchBtn = document.querySelector('.searchicon');
let dishValue = document.querySelectorAll(".dishVal");
let stopWatch=document.querySelector(".stopwatch");
let timerBtn=document.querySelector('#timerbtn');
let count = 0;

// Function to get detailed information about a dish
const getDishDetails = async (mealId) => {
    try {
        let response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
        let data = await response.json();
        return data.meals[0];
    } catch (error) {
        console.error('Error fetching dish details:', error);
        return null;
    }
};


// Function to handle "View More" button click
const handleViewMore = async (mealId) => {
    let dishDetails = await getDishDetails(mealId);
    if (dishDetails) {
        // Display recipe details
        displayRecipeDetails(dishDetails);
        // Show the recipe details section
        const recipeDetailsSection = document.querySelector('.recipe-details');
        recipeDetailsSection.style.display = 'block';
        // Scroll to the detailed instructions part
        const instructionsSection = document.getElementById('instructions');
        instructionsSection.scrollIntoView({ behavior: 'smooth' });
    } else {
        console.error('Dish details not found.');
        // Display an error message to the user
    }
};



// Function to display recipe details
const displayRecipeDetails = (dishDetails) => {
    // Display the dish name
    document.getElementById('dishName').textContent = dishDetails.strMeal;

    // Display the dish image
    document.getElementById('dishImage').src = dishDetails.strMealThumb;

    // Display the ingredients
    const ingredientsList = document.getElementById('ingredientsList');
    ingredientsList.innerHTML = '';
    for (let i = 1; i <= 20; i++) {
        const ingredient = dishDetails['strIngredient' + i];
        if (ingredient) {
            const measure = dishDetails['strMeasure' + i];
            const listItem = document.createElement('li');
            listItem.textContent = `${measure ? measure.trim() + ' ' : ''}${ingredient}`;
            ingredientsList.appendChild(listItem);
        }
    }

    // Display the instructions
    document.getElementById('instructions').textContent = dishDetails.strInstructions;
};

// Function to fetch data from API
const getData = async (value) => {
    try {
        let data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${value}`);
        let jsonData = await data.json();
        console.log(jsonData.meals);
        document.querySelector(".showMeal").innerHTML = ""; // Clear previous content
        jsonData.meals.forEach(function (data) {
            console.log(data);
            let div = document.createElement("div");
            div.classList.add('card');
            div.innerHTML = `
            <img src=${data.strMealThumb} alt=" ">
            <p>${data.strMeal}</p>
            <button onclick="handleViewMore('${data.idMeal}')" >View More</button>`;

            document.querySelector(".showMeal").appendChild(div);
        });
    } catch (error) {
        document.querySelector(".showMeal").innerHTML = "<h1>Meal Not Found</h1>";
        console.error('Error fetching data:', error);
    }
};

timerBtn.addEventListener("click",function(){
    stopWatch.style.display='block';
    timerBtn.style.display='none';
});



// Event listeners
searchBtn.addEventListener("click", function () {
    let searchValue = searchInput.value;
    if (searchValue == "") {
        alert("Please search for a recipe");
    } else {
        getData(searchValue);
    }
});

dishValue.forEach(function (dishData) {
    dishData.addEventListener("click", function () {
        getData(dishData.value);
    });
});

// Setting initial positions of slides
allDish.forEach(function (slide, index) {
    slide.style.left = `${index * 100}%`;
});

// Function to move slides
function myFun() {
    allDish.forEach(function (curVal) {
        curVal.style.transform = `translateX(-${count * 100}%)`;
    });
}

// Event listeners for next and previous buttons
nextBtn.addEventListener("click", function () {
    count++;
    if (count == allDish.length) {
        count = 0;
    }
    myFun();
});

prevBtn.addEventListener("click", function () {
    count--;
    if (count < 0) {
        count = allDish.length - 1;
    }
    myFun();
});



// Function to toggle the visibility of the grocery list popup
function toggleGroceryListPopup() {
    console.log("Toggle grocery list popup function called");
    const popupContainer = document.getElementById('popupContainer');
    popupContainer.style.display = popupContainer.style.display === 'none' ? 'block' : 'none';
}
// Function to add a new item to the grocery list
function addListItem() {
    // Get the input value
    const input = document.querySelector('.search1');
    const inputValue = input.value.trim();

    // If the input value is not empty
    if (inputValue !== '') {
        // Create a new list item
        const listItem = document.createElement('li');
        listItem.textContent = inputValue;

        // Append the new item to the list container
        const listContainer = document.getElementById('list_container');
        listContainer.appendChild(listItem);

        // Clear the input field
        input.value = '';

        // Save the changes
        saveData();
    } else {
        // Display an error message if the input is empty
        console.log("Please enter a valid item name.");
    }
}
// Event listener for the "Add" button
const addButton = document.querySelector('.search2');
addButton.addEventListener('click', addListItem);


// Function to reset the grocery list
function resetGroceryList() {
    const listContainer = document.getElementById('list_container');
    listContainer.innerHTML = ""; // Clearing the list
    saveData(); // Saving the changes
}
