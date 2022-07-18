import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultView from './views/resultView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView';

import "core-js/stable";
import "regenerator-runtime/runtime";

if (module.hot) {
    module.hot.accept()
}

const controlRecipes = async function () {
    try {


        const id = window.location.hash.slice(1);
        // console.log(id)

        if (!id) return;

        // 0. Update results view to mark selected search result
        bookmarksView.update(model.state.bookmarks);

        // 1. Updating bookmarks view
        resultView.update(model.getSearchResultsPage());

        recipeView.renderSpinner()
        // 2. Loading recipe
        await model.loadRecipe(id);

        // 3. Render recipe
        recipeView.render(model.state.recipe); // model.state.recipe = #data of recipeView




    } catch (err) {
        // alert(err)
        recipeView.renderError()
        console.log(err)
    }
};

const controlSearchResults = async function () {
    try {
        resultView.renderSpinner()
        // console.log(resultView)

        // 1. Get search query
        const query = searchView.getQuery();
        if (!query) return;

        // 2. Load search results
        await model.loadSearchResults(query)

        // 3. Render search results
        // console.log(model.state.search.results)
        resultView.render(model.getSearchResultsPage())

        // 4.Render initial pagination buttons
        paginationView.render(model.state.search)

    } catch (err) {
        console.log(err)
    }
}

const controlPagination = function (gotoPage) {
    // 1. Render NEW results
    resultView.render(model.getSearchResultsPage(gotoPage))

    // 4.Render NEW pagination buttons
    paginationView.render(model.state.search)

}

const controlServings = function (newServings) {
    // Update the recipe servings (in state)
    model.updateServings(newServings);

    // Update the recipe view
    // recipeView.render(model.state.recipe)
    recipeView.update(model.state.recipe);
}

const controlAddBookmark = function () {
    // 1. Add/Remove bookmark
    if (!model.state.recipe.bookmarked) {
        model.addBookmark(model.state.recipe);
    } else {
        model.deleteBookmark(model.state.recipe.id)
    }

    // 2. Update recipe view
    recipeView.update(model.state.recipe);

    // 3. Render bookmarks
    bookmarksView.render(model.state.bookmarks)
}


const controlBookmarks = function () {
    bookmarksView.render(model.state.bookmarks);
}

const controlAddRecipe = async function (newRecipe) {
    // console.log(newRecipe)

    try {
        // Show loading spinner
        addRecipeView.renderSpinner()

        // Upload the new recipe data
        await model.uploadRecipe(newRecipe)
        console.log(model.state.recipe)

        // Render recipe
        recipeView.render(model.state.recipe)

        // Success message
        addRecipeView.renderMessage()

        // Render bookmark view
        bookmarksView.render(model.state.bookmarks);

        // Change ID in URL
        window.history.pushState(null, '', `#${model.state.recipe.id}`);

        // Close form window
        setTimeout(() => {
            addRecipeView.toggleWindow()
        }, MODAL_CLOSE_SEC * 1000)

    } catch (err) {
        console.error('🐞🐞🐞', err);
        addRecipeView.renderError(err.message)
    }
}

const newFeature = function () {
    console.log('Welcome to the application')
}

const init = function () {
    recipeView.addHandlerRender(controlRecipes);
    recipeView.addHandlerUpdateServings(controlServings);
    recipeView.addHandlerAddBookmark(controlAddBookmark);
    searchView.addHandlerSearch(controlSearchResults);
    bookmarksView.addHandlerRender(controlBookmarks)
    paginationView.addHandlerClick(controlPagination);
    addRecipeView.addHandlerUpload(controlAddRecipe);
    newFeature()
}
init();


