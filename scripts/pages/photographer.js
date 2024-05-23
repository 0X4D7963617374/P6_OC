const urlParams = new URLSearchParams(window.location.search);
const photographerId = urlParams.get('id');
const dataUrl = 'https://raw.githubusercontent.com/OpenClassrooms-Student-Center/Front-End-Fisheye/main/data/photographers.json';

async function fetchJson(url)
{
    const response = await fetch(url);
    const jsonData = await response.json();
    return jsonData;
}

async function getPhoto(id)
{
    const data = await fetchJson(dataUrl);
    const photographer = data.photographers.find(photographer => photographer.id == id);
    return photographer;
}

async function getMedia(id)
{
    const data = await fetchJson(dataUrl);
    const media = data.media.filter(media => media.photographerId == id);
    return media;
}

function createPhotographerDetailsHtml(photographer)
{
    const picture = `assets/photographers/${photographer.portrait}`;
    return `
        <img src="${picture}" alt="${photographer.name}, ${photographer.tagline}">
        <h2>${photographer.name}</h2>
        <p>${photographer.city}, ${photographer.country}</p>
        <p>${photographer.tagline}</p>
        <p>${photographer.price}€/heure</p>`;
}

async function displayPhotographerDetails(photographer)
{
    const photographerSection = document.querySelector(".photographer_details");
    const article = document.createElement('article');
    article.classList.add("photographer-detail");
    article.innerHTML = createPhotographerDetailsHtml(photographer);
    photographerSection.appendChild(article);
}

function createMediaCardHtml(item, photographerFirstName)
{
    let mediaContent = '';
    const mediaImagePath = item.image ? `assets/images/${photographerFirstName}/${item.image}` : '';
    const mediaVideoPath = item.video ? `assets/images/${photographerFirstName}/${item.video}` : '';

    if (item.image)
        mediaContent = `<img src="${mediaImagePath}" alt="${item.title}">`;
    else if (item.video)
        mediaContent = `
            <video controls>
                <source src="${mediaVideoPath}" type="video/mp4">
            </video>`;
    return `
        ${mediaContent}
        <h3>${item.title}</h3>
        <p>${item.likes} ♡</p>
        <p>${item.date}</p>`;
}

async function displayMedia(media, photographerFirstName)
{
    const mediaSection = document.querySelector(".media_section");
    const mediaCards = [];
    let i = 0;
    let item, mediaCard;

    while (i < media.length)
    {
        item = media[i++];
        mediaCard = document.createElement('article');
        mediaCard.classList.add("media-card");
        mediaCard.innerHTML = createMediaCardHtml(item, photographerFirstName);
        mediaCards.push(mediaCard);
    }

    i = 0;
    while (i < mediaCards.length)
        mediaSection.appendChild(mediaCards[i++]);  

}

async function init()
{
    const photographer = await getPhoto(photographerId);
    const media = photographer ? await getMedia(photographerId) : [];
    const photographerFirstName = photographer ? photographer.name.split(" ")[0].replace(/-/, ' ') : '';

    if (photographer)
        displayPhotographerDetails(photographer);
    if (media.length > 0)
        displayMedia(media, photographerFirstName);

}

init();
