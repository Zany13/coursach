async function getBrewery(guid) {
    const response = await fetch(`https://api.openbrewerydb.org/v1/breweries/${guid}`)
    return await response.json()
}

async function onLoad() {
    const beerId = window.localStorage.getItem('beerid')
    const response = await fetch(`http://127.0.0.1:5000/pivo/${beerId}`)
    const beer = await response.json()
    const brewery = await getBrewery(beer.brewery_id);
    const beerCard = document.getElementById("beerCard");
    beerCard.innerHTML = `
        <h2 class="he2">${beer.name}</h2>
        <p><b>Type:</b> <i>${beer.type}</i></p>
        <p><b>Alc:</b> <i>${beer.alc}</i></p>
        <p><b>Volume:</b> <i>${beer.volume}</i></p>
        <p><b>Country:</b> <i>${beer.country}</i></p>
        <p><b>Price:</b> <i>${beer.price} UAH</i></p>
        <p><b>Brewery:</b> <i>${brewery.name}</i></p>
    `;
}

onLoad().then()