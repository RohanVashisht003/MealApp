
const inputBox = document.querySelector("input");
const searchList = document.getElementById('meal-suggestion-list');
const showFavourite = document.getElementById('show-fav-container');
const favBtn = document.getElementById('show-fav-btn');

// for showing your favourites
favBtn.addEventListener('click', function showFavourites() {
    inputBox.value = "";
    searchList.textContent = "";

    let listStringArray = JSON.parse(localStorage.getItem('favs'));
    if (listStringArray === null) {
        return;
    }

    let listArray = listStringArray.map(item => {
        return item.meal;
    });
    renderAndFilterResults(listArray, true);
});



//5. rendering and filtering results
function renderAndFilterResults(meals, isFavCalled) {

    for (let meal of meals) {

        // <<============================== Creating Structure of Page=============================>>


        //  main container
        const item = document.createElement('div');
        item.setAttribute('class', 'card meal-container');

        // image
        const img = document.createElement('img');
        img.src = meal.strMealThumb;

        // favourite button
        const favouriteBtn = document.createElement('button');
        favouriteBtn.setAttribute('class', 'favourite-btn');
        favouriteBtn.setAttribute('id', meal.idMeal);
        favouriteBtn.innerHTML = `♥`;

        // cardBody
        const cardBody = document.createElement('div');
        cardBody.setAttribute('class', 'card-body meta-data');
        const name = document.createElement('h6');
        name.innerText = meal.strMeal;

        const category = document.createElement('p');
        category.innerText = '[ ' + meal.strCategory + ' ]';
        name.setAttribute('class', 'card-title');
        cardBody.append(name);
        cardBody.append(category);

        item.append(favouriteBtn);

        item.append(img);
        item.append(cardBody);

        // if meal is in favourites then add fav-color to button
        if (isInFavs(meal.idMeal) !== -1) {
            favouriteBtn.classList.add('is-fav-color');
        }
        // append the updated list
        searchList.appendChild(item);

        // opening a page and storing fetched data in localStorage
        name.addEventListener('click', function loadDetails() {
            localStorage.setItem(meal.idMeal, JSON.stringify(meal));
            window.location.replace('meal.html?' + meal.idMeal);
        });


        // for adding to favourites
        favouriteBtn.addEventListener('click', function addToFavourites() {
            let id = meal.idMeal;

            // check if meal is in favourite localStorage ?
            let itemIndex = isInFavs(id);

            let favs;
            // meal is in localStorage
            if (itemIndex !== -1) {

                favs = JSON.parse(localStorage.getItem('favs'));
                favs.splice(itemIndex, 1);
                this.style.color = 'black';

                if (isFavCalled) {
                    this.parentNode.style.display = 'none';
                }
            }
            else {
                favs = [];
                let obj = {
                    id: id,
                    meal
                }

                if (localStorage.getItem('favs') === null) {
                    favs.push(obj);
                } else {
                    favs = JSON.parse(localStorage.getItem('favs'));
                    favs.push(obj);
                }

                this.style.color = '#ff0707';
            }

            if (favs.length != 0) {
                localStorage.setItem('favs', JSON.stringify(favs));
            } else {
                localStorage.removeItem('favs');
            }
        });
    }
}

// check if item is favs localStorage
function isInFavs(id) {
    let favs = JSON.parse(localStorage.getItem('favs'));
    if (favs == null) {
        return -1;
    }
    // get index of item in array
    let itemIndex = favs.findIndex(fav => fav.id == id);
    return itemIndex;
}

// fetching data using API
function fetchData(text) {

    // for showing loading animation
    let loader = `<div class="loader"></div>`;
    searchList.innerHTML = loader;

    // url
    const url = `https://www.themealdb.com/api/json/v1/1/search.php?s= ${text}`;

    fetch(url)
        .then(res => res.json())
        .then(data => {
            // sending array data only
            const arr = data.meals;

            // if no data found
            if (arr === null) {
                searchList.innerHTML = `<p style="color:white;">No data found!!</p>`;
                return;
            }
            searchList.textContent = ''
            renderAndFilterResults(arr, false);
        })
        .catch(err => {
            throw (err);
        });
}


//  triggering starting point
let searchTime = 0;
window.onload = () => {
    inputBox.onkeyup = (event) => {
        if (inputBox.value.trim().length === 0) {
            searchList.textContent = '';
            searchList.innerHTML = `<p style="color:white;">You haven't entered anything / Enter again to search</p>`;
            return;
        }
        clearTimeout(searchTime);

        searchTime = setTimeout(() => {
            fetchData(inputBox.value.trim());
        }, 250);
    }
}