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
    let i = 0;
    const photographers = data.photographers;

    while (i < photographers.length)
    {
        if (photographers[i].id == id)
            return photographers[i];
        i++;
    }
    return null;
}

async function getMedia(id)
{
    const data = await fetchJson(dataUrl);
    let media = [];
    let i = 0;

    while (i < data.media.length)
    {
        if (data.media[i].photographerId == id)
            media.push(data.media[i]);
        i++;
    }
    return media;
}

function getPhotographerCardDOM(name, city, country, tagline, price)
{
    const article = document.createElement('article');
    const h2 = document.createElement('h2');
    const cityCountry = document.createElement('p');
    const tag = document.createElement('p');
    const pricePerHour = document.createElement('p');

    article.classList.add("photographer-detail-photographer");
    h2.textContent = name;
    cityCountry.textContent = `${city}, ${country}`;
    tag.textContent = tagline;
    pricePerHour.textContent = `${price}€/heure`;

    article.appendChild(h2);
    article.appendChild(cityCountry);
    article.appendChild(tag);
    article.appendChild(pricePerHour);

    return article;
}

function photographerFactory(data)
{
    const { name, city, country, tagline, price, portrait } = data;
    return { getPhotographerCardDOM };
}

function createMediaPath(data, photographerFirstName)
{
    const { image, video } = data;
    return image ? `assets/images/${photographerFirstName}/${image}` : `assets/images/${photographerFirstName}/${video}`;
}

function getMediaDOM(data, mediaPath)
{
    const { image, video, title, likes } = data;
    const article = document.createElement('article');
    article.classList.add("media-card-photographer");

    let mediaElement;
    if (image)
    {
        mediaElement = document.createElement('img');
        mediaElement.setAttribute('src', mediaPath);
        mediaElement.setAttribute('alt', title);
    }
    else if (video)
    {
        mediaElement = document.createElement('video');
        mediaElement.setAttribute('controls', '');
        const source = document.createElement('source');
        source.setAttribute('src', mediaPath);
        source.setAttribute('type', 'video/mp4');
        mediaElement.appendChild(source);
    }

    const info = document.createElement('div');
    const mediaTitle = document.createElement('h3');
    const mediaLikes = document.createElement('div');
    const likesCount = document.createElement('span');
    const heartIcon = document.createElement('span');

    info.classList.add('info');
    mediaTitle.textContent = title;
    mediaLikes.classList.add('likes');
    likesCount.textContent = likes;
    heartIcon.classList.add('heart', 'fas', 'fa-heart');

    heartIcon.addEventListener('click', () =>
    {
        if (heartIcon.classList.contains('liked'))
        {
            likesCount.textContent = parseInt(likesCount.textContent) - 1;
            heartIcon.classList.remove('liked');
        } else
        {
            likesCount.textContent = parseInt(likesCount.textContent) + 1;
            heartIcon.classList.add('liked');
        }
    });

    mediaLikes.appendChild(likesCount);
    mediaLikes.appendChild(heartIcon);
    info.appendChild(mediaTitle);
    info.appendChild(mediaLikes);
    article.appendChild(mediaElement);
    article.appendChild(info);

    return article;
}

function mediaFactory(data, photographerFirstName)
{
    const mediaPath = createMediaPath(data, photographerFirstName);
    return { getMediaDOM: () => getMediaDOM(data, mediaPath) };
}

function sortMedia(media, criterion)
{
    let sortedMedia;
    switch (criterion)
    {
        case 'popularity':
            sortedMedia = media.sort((a, b) => b.likes - a.likes);
            break;
        case 'date':
            sortedMedia = media.sort((a, b) => new Date(b.date) - new Date(a.date));
            break;
        case 'title':
            sortedMedia = media.sort((a, b) => a.title.localeCompare(b.title));
            break;
        default:
            sortedMedia = media;
    }
    return sortedMedia;
}

async function displayPhotographerDetails(photographer)
{
    const photographerSection = document.querySelector(".photographer-details-photographer");
    const photographerCardDOM = getPhotographerCardDOM(photographer.name, photographer.city, photographer.country, photographer.tagline, photographer.price);
    photographerSection.appendChild(photographerCardDOM);

    const photographerPortrait = document.querySelector('.photographer-portrait-photographer');
    photographerPortrait.setAttribute('src', `assets/photographers/${photographer.portrait}`);
    photographerPortrait.setAttribute('alt', photographer.name);
}

async function displayMedia(media, photographerFirstName)
{
    const mediaSection = document.querySelector(".media-section-photographer");
    mediaSection.innerHTML = '';
    let mediaCards = [];
    let i = 0;
    while (i < media.length)
    {
        let item = media[i];
        let mediaCard = mediaFactory(item, photographerFirstName).getMediaDOM();
        mediaCards.push(mediaCard);
        i++;
    }

    i = 0;
    while (i < mediaCards.length)
        mediaSection.appendChild(mediaCards[i++]);

}

async function init()
{
    const photographer = await getPhoto(photographerId);
    let media = [];
    if (photographer)
        media = await getMedia(photographerId);
    const photographerFirstName = photographer ? photographer.name.split(" ")[0].replace(/-/, ' ') : '';
    if (photographer)
        displayPhotographerDetails(photographer);
    if (media.length > 0)
        displayMedia(media, photographerFirstName);

    const selectElement = document.getElementById('sort-photographer');
    selectElement.addEventListener('change', (event) =>
    {
        const sortedMedia = sortMedia(media, event.target.value);
        displayMedia(sortedMedia, photographerFirstName);
    });
}

document.addEventListener('DOMContentLoaded', () =>
{
    const selectElement = document.getElementById('sort-photographer');
    const sortContainer = document.querySelector('.sort-section-photographer');

    selectElement.addEventListener('click', () =>
    {
        sortContainer.classList.toggle('open');
    });

    selectElement.addEventListener('blur', () =>
    {
        sortContainer.classList.remove('open');
    });
});

init();

