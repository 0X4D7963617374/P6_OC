function photographerTemplate(data)
{
    const { name, city, country, tagline, price, portrait, id } = data;
    const picture = `assets/photographers/${portrait}`;

    const getUserCardDOM = createPhotographerCard.bind(null, name, picture, city, country, tagline, price, id);

    return { getUserCardDOM };
}

function createPhotographerCard(name, picture, city, country, tagline, price, id)
{
    const article = document.createElement('article');
    article.classList.add("photographer-card");

    article.innerHTML =
    `<a href="photographer.html?id=${id}">
        <img src="${picture}" alt="${name}, ${tagline}">
        <h2>${name}</h2>
        <p>${city}, ${country}</p>
        <p>${tagline}</p>
        <p>${price}€/heure</p>
    </a>`;

    return article;
}
