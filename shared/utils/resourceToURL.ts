export const extractResourceFromURL = (url: string) => {
    const text = '/resource/';
    return url.substring(url.indexOf(text)+text.length);
}