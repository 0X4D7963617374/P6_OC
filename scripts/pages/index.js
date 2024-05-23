const url = "https://raw.githubusercontent.com/OpenClassrooms-Student-Center/Front-End-Fisheye/main/data/photographers.json";

async function getPhotographers()
{
    const response = await fetch(url);
    const data = await response.json();
    return data.photographers;
}

async function displayData(photographers)
{
    const photographersSection = document.querySelector(".photographer_section");
    let photographerModel;
    let userCardDOM;
    let i = 0;

    while (i < photographers.length)
    {
        photographerModel = photographerTemplate(photographers[i++]);
        userCardDOM = photographerModel.getUserCardDOM();
        photographersSection.appendChild(userCardDOM);
    }
}


async function init()
{
    const photographers = await getPhotographers();
    displayData(photographers);
}

init();
