function changeAmount(id, by) {
    const amountDiv = document.getElementById(`bs${id}`)
    const amount = Number.parseInt(amountDiv.innerHTML)
    if (amount + by >= 0) {
        amountDiv.innerHTML = amount + by
        const bs = JSON.parse(window.localStorage.getItem('bs'))
        if (amount + by === 0) {
            delete bs[id]
        }
        else {
            bs[id] = amount + by;
        }
        window.localStorage.setItem('bs', JSON.stringify(bs))
    }
}

function createAmountSelector(id) {
    const amount = JSON.parse(window.localStorage.getItem('bs'))[id]
    return `
        <div>
            <div id="bs${id}">${amount || 0}</div>
            <button class="minus" onclick="changeAmount(${id}, -1)">-</button>
            <button class="plus" onclick="changeAmount(${id}, 1)">+</button>
        </div>
    `
}

function viewBeer(id) {
    window.localStorage.setItem('beerid', id)
    window.location.href = 'beer.html'
}

async function onLoad() {
    window.localStorage.setItem('bs', '{}')

    const response = await fetch("http://127.0.0.1:5000/pivo")
    const beers = await response.json()
    const beerList = document.getElementById("beerlist");

    beers.map(beer => {
        const card = document.createElement('div');
        card.className = 'beer-card'
        card.innerHTML = `
            <h2 class="bn" onclick=viewBeer(${beer.id})>${beer.name}</h2>
            <p class="tva">${beer.type}, ${beer.volume}l, ${beer.alc}%</p>
            <p class="price">${beer.price} UAH</p>
            <p>${createAmountSelector(beer.id)}</p>
        `;
        beerList.appendChild(card)
    })


    const purchaseForm = document.getElementById("purchaseform");
    purchaseForm.addEventListener('submit', async (e) => {
        e.preventDefault()

        const clientName = purchaseForm.elements['clientname'].value;
        const city = purchaseForm.elements['city'].value;
        const address = purchaseForm.elements['address'].value;
        const comment = purchaseForm.elements['comment'].value;

        const order = JSON.parse(window.localStorage.getItem('bs'))
        window.localStorage.setItem('bs', '{}')

        const data = {
            clientName,
            city,
            address,
            comment,
            order
        }
        const response = await fetch(`http://127.0.0.1:5000/purchase`, {
            method: 'POST',
            body: JSON.stringify(data)
        })
        const body = await response.json();
        window.localStorage.setItem('purchaseid', body.id)
        window.location.href = 'purchase.html'
    })

    const search = document.getElementById("searchorder");
    search.addEventListener('submit', async (e) => {
        e.preventDefault()

        const purchaseid = search.elements['purchaseid'].value;
        window.localStorage.setItem('purchaseid', purchaseid)
        window.location.href = 'purchase.html'
    })
}

onLoad().then()