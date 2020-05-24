const createEvent = (eventId, isBubbled, detail = {}) => {
    let event;
    if(typeof(Event) === "function") {
        event = new CustomEvent(eventId, {
            bubbles: isBubbled,
            detail: detail
        })
    } else {
        event = document.createEvent("CustomEvent");
        event.initCustomEvent(eventId, isBubbled, true, detail);
    }

    return event;
}

export const dispatchEvent = (elementDispatcher, eventId, details = {}) => {
    elementDispatcher.dispatchEvent(
        createEvent(
            eventId,
        true,
            details
        )
    );
}