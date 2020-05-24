import "./style/email-input-tag.scss";
import "./style/email-input.scss";
import removeIcon from "./style/img/remove.svg";
import {appendTextToElement, createElementDiv, createElementImg} from "./html-dom-service";
import {dispatchEvent} from "./email-input-event-service";
import {getRandomString, isValidEmail} from "./utils";

class EmailInput {
    constructor(inputElement, options = {}) {
        this.emailList = new Map();

        this.parentOfInputId = options.parentOfInputId !== undefined
            ? options.parentOfInputId : "#emails-input-text-1";

        this.inputElement = inputElement;
        this.input = inputElement.querySelector("input");
        this.parentOfInputElement = inputElement.querySelector(this.parentOfInputId);
        this.eventChangeId = this.inputElement.id + "_change";

        this.input.addEventListener("keydown", this.eventEnterPressHandler.bind(this));
        this.input.addEventListener("keydown", this.eventBackspaceHandler.bind(this));
        this.input.addEventListener("focusout", this.eventFocusOutHandler.bind(this));
        this.input.addEventListener("input", this.eventCommaEnteringHandler.bind(this));
    }

    removeTag(elementRemove) {
        const emailRemove = elementRemove.querySelector(".tag-text").textContent;

        if (!this.emailList.has(emailRemove)) {
            return;
        }

        this.emailList.delete(emailRemove);
        elementRemove.parentNode.removeChild(elementRemove);

        dispatchEvent(this.inputElement, this.eventChangeId, {eventType: "remove", email: [emailRemove]});
    }

    createTag(email) {
        const trimmedEmail = email.trim();

        if (trimmedEmail === "") {
            return;
        }

        if (this.emailList.has(trimmedEmail)) {
            return;
        }

        const newTagText = createElementDiv("tag-text");
        const tagClass = isValidEmail(trimmedEmail) ? "tag" : "wrong-tag";

        let newTag = createElementDiv(tagClass);
        let newTagRemoveIcon = createElementDiv("tag-remove-icon");
        let newImg = createElementImg(removeIcon);

        newImg.addEventListener("click", (e) => {
            this.removeTag(e.target.parentElement.parentElement);
        });

        appendTextToElement(trimmedEmail, newTagText);

        newTagRemoveIcon.appendChild(newImg)
        newTag.appendChild(newTagText);
        newTag.appendChild(newTagRemoveIcon);

        this.inputElement.insertBefore(newTag, this.parentOfInputElement);
        this.emailList.set(trimmedEmail, newTag);

        dispatchEvent(this.inputElement, this.eventChangeId, {eventType: "add", email: [trimmedEmail]});
    }

    addRandomEmail() {
        const email = getRandomString(7) + "@" + getRandomString(5) + ".com";
        this.createTag(email);
    }

    getValidEmailCount() {
        return Array.from(this.emailList.keys()).filter((el) => {
            return isValidEmail(el);
        }).length;
    }

    getEmailList() {
        return Array.from(this.emailList.keys());
    }

    emailListChangeEventSubscribe(element, callback) {
        element.addEventListener(this.eventChangeId, callback);
    }

    replaceEmailList(emailList) {
        for(let el of this.emailList.values()) {
            el.remove();
        }

        this.emailList.clear();
        dispatchEvent(this.inputElement, this.eventChangeId, {eventType: "replace", email: emailList});

        while (this.inputElement.firstChild !== this.parentOfInputElement) {
            this.inputElement.removeChild(this.inputElement.firstChild)
        }

        emailList.forEach((el) => {
            this.createTag(el);
        });
    }

    eventEnterPressHandler(e) {
        const enterKeyCode = 13;
        if (e.keyCode === enterKeyCode) {
            this.createTag(this.input.value);
            this.input.value = "";
            e.preventDefault();
            e.stopPropagation();
        }
    }

    eventBackspaceHandler(e) {
        const backspaceKeyCode = 8;
        if (e.keyCode === backspaceKeyCode && this.input.value === "" && this.emailList.size > 0) {
            const lastElement = Array.from(this.emailList)[this.emailList.size - 1][1];
            this.removeTag(lastElement);
            e.preventDefault();
            e.stopPropagation();
        }
    }

    eventFocusOutHandler(e) {
        this.createTag(this.input.value);
        this.input.value = "";
        e.preventDefault();
        e.stopPropagation();
    }

    eventCommaEnteringHandler(e) {
        const commaPos = this.input.value.indexOf(",");
        if (commaPos !== -1) {
            const tags = this.input.value.split(",")
            tags.forEach((el) => {
                this.createTag(el);
                this.input.value = "";
            });
        }
        e.preventDefault();
        e.stopPropagation();
    }
}

export default EmailInput;