export function goToLinkWithoutHistoryUpdate(history, url){

    return () => {
        // window.history.replaceState(url);
        history.replace(url);
    }
}

