const urlParams = new URLSearchParams(window.location.search);
const photographerId = urlParams.get('id');
const dataUrl = 'https://raw.githubusercontent.com/OpenClassrooms-Student-Center/Front-End-Fisheye/main/data/photographers.json';
let mediaItems = [];
let currentIndex = 0;

class Utils
{
    static async fetchJson(url)
    {
        let response;
        let jsonData;

        response = await fetch(url);
        jsonData = await response.json();

        return jsonData;
    }

    static calculateTotalLikes(media)
    {
        let total;
        let i;

        total = 0;
        i = 0;

        while (i < media.length)
            total += media[i++].likes;

        return total;
    }
}

class Photographer
{
    constructor(data)
    {
        this.id = data.id;
        this.name = data.name;
        this.city = data.city;
        this.country = data.country;
        this.tagline = data.tagline;
        this.price = data.price;
        this.portrait = data.portrait;
    }

    static async getPhotographer(id)
    {
        let data;
        let photographer;
        let i;

        data = await Utils.fetchJson(dataUrl);
        i = 0;

        while (i < data.photographers.length)
        {
            if (data.photographers[i++].id == id)
            {
                photographer = data.photographers[i - 1];
                i = data.photographers.length + 1; // sortir de la boucle
            }
        }

        return photographer ? new Photographer(photographer) : null;
    }

    getPhotographerCardDOM()
    {
        let article;
        let h2;
        let cityCountry;
        let tag;

        article = document.createElement('article');
        article.classList.add("photographer-detail-photographer");

        h2 = document.createElement('h2');
        h2.textContent = this.name;

        cityCountry = document.createElement('p');
        cityCountry.textContent = `${this.city}, ${this.country}`;

        tag = document.createElement('p');
        tag.textContent = this.tagline;

        article.append(h2);
        article.append(cityCountry);
        article.append(tag);

        return article;
    }

    displayPhotographerDetails()
    {
        let photographerSection;
        let photographerCardDOM;
        let photographerPortrait;

        photographerSection = document.querySelector(".photographer-details-photographer");
        photographerCardDOM = this.getPhotographerCardDOM();
        photographerSection.appendChild(photographerCardDOM);

        photographerPortrait = document.querySelector('.photographer-portrait-photographer');
        photographerPortrait.setAttribute('src', `assets/photographers/${this.portrait}`);
        photographerPortrait.setAttribute('alt', this.name);

        document.getElementById('daily-rate').innerText = `${this.price}€/jour`;
    }
}

class Media
{

    constructor(data, photographerFirstName)
    {
        this.photographerFirstName = photographerFirstName;
        Object.assign(this, data);
    }

    static async getMedia(photographerId, photographerFirstName)
    {
        let data;
        let media;
        let i;

        data = await Utils.fetchJson(dataUrl);
        media = [];
        i = 0;

        while (i < data.media.length)
            if (data.media[i++].photographerId == photographerId)
                media.push(new Media(data.media[i - 1], photographerFirstName));

        return media;
    }

    createMediaPath()
    {
        let mediaPath;

        if (this.image)
            mediaPath = `assets/images/${this.photographerFirstName}/${this.image}`;
        else
            mediaPath = `assets/images/${this.photographerFirstName}/${this.video}`;

        return mediaPath;
    }

    getMediaDOM(index)
    {
        let mediaPath;
        let article;
        let mediaElement;
        let source;
        let info;
        let mediaTitle;
        let mediaLikes;
        let likesCount;
        let heartIcon;

        mediaPath = this.createMediaPath();
        article = document.createElement('article');
        article.classList.add("media-card-photographer");

        if (this.image)
        {
            mediaElement = document.createElement('img');
            mediaElement.setAttribute('src', mediaPath);
            mediaElement.setAttribute('alt', this.title);
            mediaElement.addEventListener('click', () => openMediaModal(mediaPath, true, index));
        }
        else if (this.video)
        {
            mediaElement = document.createElement('video');
            mediaElement.setAttribute('controls', '');
            source = document.createElement('source');
            source.setAttribute('src', mediaPath);
            source.setAttribute('type', 'video/mp4');
            mediaElement.appendChild(source);
        }

        info = document.createElement('div');
        info.classList.add('info');

        mediaTitle = document.createElement('h3');
        mediaTitle.textContent = this.title;
        mediaTitle.addEventListener('click', () => openMediaModal(mediaPath, !!this.image, index));

        mediaLikes = document.createElement('div');
        mediaLikes.classList.add('likes');

        likesCount = document.createElement('span');
        likesCount.textContent = this.likes;

        heartIcon = document.createElement('span');
        heartIcon.classList.add('heart', 'fas', 'fa-heart');

        heartIcon.addEventListener('click', () =>
        {
            if (heartIcon.classList.contains('liked'))
            {
                likesCount.textContent = parseInt(likesCount.textContent) - 1;
                heartIcon.classList.remove('liked');
            }
            else
            {
                likesCount.textContent = parseInt(likesCount.textContent) + 1;
                heartIcon.classList.add('liked');
            }
            updateTotalLikes();
        });

        mediaLikes.append(likesCount);
        mediaLikes.append(heartIcon);
        info.append(mediaTitle);
        info.append(mediaLikes);
        article.append(mediaElement);
        article.append(info);

        return article;
    }

    static sortMedia(media, criterion)
    {
        let sortedMedia;
        let sorters;

        sorters = {
            'popularity': (a, b) => b.likes - a.likes,
            'date': (a, b) => new Date(b.date) - new Date(a.date),
            'title': (a, b) => a.title.localeCompare(b.title)
        };

        sortedMedia = media.sort(sorters[criterion]);
        return sortedMedia;
    }
}

async function displayModal()
{
    let photographer;
    let photographerName;

    photographer = await Photographer.getPhotographer(photographerId);
    photographerName = photographer ? photographer.name : '';
    document.getElementById('photographer-name').innerText = photographerName;
    document.getElementById('contact_modal').style.display = 'block';
}

function closeModal()
{
    document.getElementById('contact_modal').style.display = 'none';
}

function updateTotalLikes()
{
    let likesElements;
    let totalLikes;
    let i;

    likesElements = document.querySelectorAll('.media-card-photographer .likes span:first-child');
    totalLikes = 0;
    i = 0;

    while (i < likesElements.length)
        totalLikes += parseInt(likesElements[i++].textContent);
    document.getElementById('total-likes').innerText = `${totalLikes} `;
}

async function displayMedia(media, photographerFirstName)
{
    let mediaSection = document.querySelector(".media-section-photographer");
    let mediaInstance

    mediaSection.innerHTML = '';
    mediaItems = [];
    media.forEach((item, index) =>
    {
        mediaInstance = new Media(item, photographerFirstName);
        mediaItems.push({
            path: mediaInstance.createMediaPath(),
            isImage: !!mediaInstance.image,
        });
        mediaSection.appendChild(mediaInstance.getMediaDOM(index));
    });
    updateTotalLikes();
}

async function init()
{
    let photographer;
    let photographerFirstName;
    let media;
    let selectElement;

    photographer = await Photographer.getPhotographer(photographerId);
    if (photographer)
    {
        photographer.displayPhotographerDetails();
        photographerFirstName = photographer.name.split(" ")[0].replace(/-/, ' ');
        media = await Media.getMedia(photographerId, photographerFirstName);
        if (media.length > 0)
            displayMedia(media, photographerFirstName);

        selectElement = document.getElementById('sort-photographer');
        selectElement.addEventListener('change', (event) =>
        {
            let sortedMedia = Media.sortMedia(media, event.target.value);
            displayMedia(sortedMedia, photographerFirstName);
        });
    }
}

document.addEventListener('DOMContentLoaded', () =>
{
    let selectElement;
    let sortContainer;

    selectElement = document.getElementById('sort-photographer');
    sortContainer = document.querySelector('.sort-section-photographer');

    selectElement.addEventListener('click', () =>
    {
        sortContainer.classList.toggle('open');
    });

    selectElement.addEventListener('blur', () =>
    {
        sortContainer.classList.remove('open');
    });
});

function navigateMedia(direction)
{
    let currentMedia;
    let mediaPath;
    let isImage;

    if (direction === 'next')
        currentIndex = (currentIndex + 1) % mediaItems.length;
    else if (direction === 'prev')
        currentIndex = (currentIndex - 1 + mediaItems.length) % mediaItems.length;

    currentMedia = mediaItems[currentIndex];
    mediaPath = currentMedia.path;
    isImage = currentMedia.isImage;

    openMediaModal(mediaPath, isImage, currentIndex);
}

function openMediaModal(src, isImage, index)
{
    let mediaModal = document.getElementById('media_modal');
    let mediaImage = document.getElementById('media_modal_image');
    let mediaVideo = document.getElementById('media_modal_video');

    currentIndex = index;

    if (isImage)
    {
        mediaImage.src = src;
        mediaImage.style.display = 'block';
        mediaVideo.style.display = 'none';
    }
    else
    {
        mediaVideo.src = src;
        mediaVideo.style.display = 'block';
        mediaImage.style.display = 'none';
    }
    mediaModal.style.display = 'flex';
}

function closeMediaModal()
{
    let mediaModal = document.getElementById('media_modal');
    mediaModal.style.display = 'none';
}


init();
