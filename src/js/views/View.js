
import icons from "url:../../img/icons.svg";
export default class View {
    _data;

    /**
     * Render the Received object to the DOM
     * @param {Object | Object[]} data  The data to be rendered (e.g. Recipe)
     * @param {boolean} [render= true] If false, create markup string instead of rendering to the DOM
     * @returns {undefined | string} A markup string is returned if render=false
     * @this {Object}  View instance
     * @author Tri Hieu
     * 
    */

    render(data, render = true) {

        if (!data || (Array.isArray(data) && data.length === 0)) return this.renderError();

        this._data = data;
        // console.log(data)
        const markup = this._generateMarkup();

        if (!render) return markup;

        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }

    update(data) {
        this._data = data;
        // console.log(data)
        const newMarkup = this._generateMarkup();

        const newDom = document.createRange().createContextualFragment(newMarkup);
        const newElements = Array.from(newDom.querySelectorAll('*'));
        const curElements = Array.from(this._parentElement.querySelectorAll('*'));

        newElements.forEach((newEle, i) => {
            const curEle = curElements[i];
            // console.log(curEle, newEle.isEqualNode(curEle));

            // Updates change TEXT
            if (!newEle.isEqualNode(curEle) && newEle.firstChild?.nodeValue.trim() !== '') {
                // console.log('==>', newEle.firstChild.nodeValue.trim())
                curEle.textContent = newEle.textContent;
            }

            // Updates change ATTRIBUTES
            if (!newEle.isEqualNode(curEle)) {
                // console.log(Array.from(newEle.attributes))
                Array.from(newEle.attributes).forEach(attr => curEle.setAttribute(attr.name, attr.value));
            }

        });
    }

    _clear() {
        this._parentElement.innerHTML = '';
    }

    renderSpinner() {
        const markup = `
            <div class="spinner">
                <svg>
                     <use href="${icons}#icon-loader"></use>
                </svg>
            </div> 
    `;
        this._clear();
        // this._parentElement.innerHTML = '';
        this._parentElement.insertAdjacentHTML('afterbegin', markup);

    }

    renderError(messages = this._errorMessage) {
        const markup = `
            <div class="error">
                <div>
                <svg>
                    <use href="${icons}#icon-alert-triangle"></use>
                </svg>
                </div>
                <p>${messages}</p>
            </div>
        `;
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }

    renderMessage(messages = this._message) {
        const markup = `
            <div class="message">
                <div>
                <svg>
                    <use href="${icons}#icon-smile"></use>
                </svg>
                </div>
                <p>${messages}</p>
            </div>
        `;
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }
}