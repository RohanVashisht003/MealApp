// meals details
const mealTitle = document.getElementById('meal-title');
const category = document.getElementById('cat');
const area = document.getElementById('area');
const video = document.getElementById('ifream');
const img = document.getElementById('thumb');
const inst = document.getElementById('ins');
const ingre = document.getElementById('ingredients');

let id = window.location.search.split('?')[1];

let meal = JSON.parse(localStorage.getItem(id));

document.title = meal.strMeal;

function renderPage(meal){
    const {strMeal, strCategory, strArea, strInstructions, strYoutube, strMealThumb} = meal;

    mealTitle.innerText = strMeal;
    category.innerHTML = strCategory;
    area.innerHTML = strArea;
    video.setAttribute('src', strYoutube.replace("watch?v=","embed/"));
    inst.innerHTML = strInstructions;

    img.style.backgroundImage = `url("${strMealThumb}")`;

    // looping for ingredients
    for(let i=1; i<21; i++){
        let index = i.toString();
        let ingredient = 'strIngredient'+index;
        let measure = 'strMeasure'+index;

        if(meal[ingredient]==="" || meal[ingredient]===null){
            break;
        }
        const li = document.createElement('li');
        li.innerHTML = `<input type="checkbox"> ${meal[measure]} ${meal[ingredient]}`

        ingredients.appendChild(li);
    }
}


// trigerring function
window.onload = ()=>{
        renderPage(meal);
}