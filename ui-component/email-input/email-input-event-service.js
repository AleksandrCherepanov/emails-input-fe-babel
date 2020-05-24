const createEvent = (eventId, isBubbled, detail = {}) => {
    return new CustomEvent(eventId, {
        bubbles: isBubbled,
        detail: detail
    })
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