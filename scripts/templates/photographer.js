function photographerTemplate(data)
{
    const { name, city, country, tagline, price, portrait, id } = data;
    const picture = `assets/photographers/${portrait}`;

    return {
        name,
        picture,
        getUserCardDOM: () => createPhotographerCard(name, picture, city, country, tagline, price, id)
    };
}

function createPhotographerCard(name, picture, city, country, tagline, price, id)
{
    const article = document.createElement('article');
    const link = document.createElement('a');
    const imageContainer = document.createElement('div');
    const svg = `
        <svg width="300" height="300" viewBox="0 0 150 150" class="photographer-svg">
            <defs>
                <radialGradient id="grad1" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                    <stop offset="0%" style="stop-color:rgba(255, 255, 255, 0.0);stop-opacity:0" />
                    <stop offset="100%" style="stop-color:rgba(255, 255, 255, 1);stop-opacity:1" />
                </radialGradient>
            </defs>
            <circle cx="75" cy="75" r="75" fill="rgba(255, 255, 255, 0.0)"/>
            <circle cx="75" cy="75" r="70" fill="none" stroke="url(#grad1)" stroke-width="20"/>
        </svg>
    `;
    const img = document.createElement('img');
    const h2 = document.createElement('h2');
    const cityCountry = document.createElement('p');
    const tag = document.createElement('p');
    const pricePerHour = document.createElement('p');

    article.classList.add("photographer-card");

    link.href = `photographer.html?id=${id}`;
    link.classList.add("photographer-link");

    imageContainer.classList.add("image-container");

    img.setAttribute("src", picture);
    img.setAttribute("alt", `${name}, ${tagline}`);
    img.classList.add("photographer-portrait");

    imageContainer.innerHTML = svg;
    imageContainer.appendChild(img);

    h2.textContent = name;
    h2.classList.add("photographer-name");

    cityCountry.textContent = `${city}, ${country}`;
    cityCountry.classList.add("photographer-location");

    tag.textContent = tagline;
    tag.classList.add("photographer-tagline");

    pricePerHour.textContent = `${price}€/heure`;
    pricePerHour.classList.add("photographer-price");

    link.append(imageContainer, h2, cityCountry, tag, pricePerHour);
    article.appendChild(link);

    return article;
}
