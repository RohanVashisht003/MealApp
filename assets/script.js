const searchWrapper = document.querySelector(".search-input");
const inputBox = searchWrapper.querySelector("input");
const suggBox = searchWrapper.querySelector(".autocom-box");
const icon = searchWrapper.querySelector(".icon");
// let linkTag = searchWrapper.querySelector("a");

var eventDelegation;
// create meal info
function createMealInfo(meal, textInput) {
    const mealName = meal.strMeal;
    const mealPhoto = meal.strMealThumb;
    const mealInstruction = meal.strInstructions;


}

function select(element) {
    let selectUserData = element.textContent;
    inputBox.value = selectUserData; //passing the user selected list item data in textfield
}

// 7. showing suggestions
function showSuggestions(array, textInput) {
    let arrayData;
    if (!array.length) {
        userInput = inputBox.value;
        arrayData = '<li>' + userInput + '</li>';
    } else {
        arrayData = array.join('');
    }
    suggBox.innerHTML = arrayData;
}


//5. rendering and filtering results
function renderAndFilterResults(meals, userInput) {
    // var userInput = inputBox.value;
    var emptyArray = [];
    if (userInput) {
        emptyArray = meals.filter(meal => {
            let mealName = meal.strMeal;
            var str = mealName.toLocaleLowerCase().includes(userInput.toLocaleLowerCase()) || mealName.toLocaleLowerCase().startsWith(userInput.toLocaleLowerCase());
            if (str == true)
                return mealName;
        });
        emptyArray = emptyArray.map(meal => {
            return '<li>' + meal.strMeal + '</li>'
        });
        console.log(emptyArray);
        searchWrapper.classList.add("active"); // show autocomplete
        showSuggestions(emptyArray);
        let allList = suggBox.querySelectorAll('li');
        console.log(allList);
        for (let i = 0; i < allList.length; i++) {
            // adding onclick attribute in all tags
            allList[i].setAttribute('onclick', 'select(this)');
        }
    } else {
        searchWrapper.classList.remove('active'); //remove autocomplete
    }
}

function dataFoundOrNot(meal, userInput) {
    if (meal) {
        renderAndFilterResults(meal, userInput);
    } else {
        const noMealFound = document.getElementById('no-meal-found');
        noMealFound.innerText = `No meal found for ${userInput}!`;
    }
}

function fetchData(text) {
    // if text is entered by user
    const url = `https://www.themealdb.com/api/json/v1/1/search.php?s= ${text}`

    fetch(url)
        .then(res => res.json())
        .then(data =>
            // sending array data only
            dataFoundOrNot(data.meals, text)
            // console.log(data," ",text)
        )
        .catch(err => {
            console.log("!!!!!!Something went wrong Data not received from API!!!!!", err);
        });
}


//1. triggering starting point
inputBox.onkeyup = (e) => {
    let userInput = e.target.value;
    if (userInput.trim().length > 0) {
        const noMealFound = document.getElementById('no-meal-found');
        noMealFound.innerText = ``;

        const mealInfoSection = document.getElementById('meal-info');
        mealInfoSection.innerHTML = ``;

        fetchData(userInput);
    } else {
        const noMealFound = document.getElementById('no-meal-found');
        noMealFound.innerText = `You haven't entered anything`;
    }
}

function handleClickListener(event) {
    eventDelegation = event.target.id;
    // console.log(eventDelegation.id);
}