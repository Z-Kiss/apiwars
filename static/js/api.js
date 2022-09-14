const tableBodyPlanets = document.querySelector('#planets')
const tableBodyResidents = document.querySelector('#residents')
const buttonNext = document.querySelector('#next')
const buttonBack = document.querySelector('#back')
const buttonClose = document.querySelector('#close_modal')
const modal = document.querySelector('.modal_container')
const content = document.querySelector('.content_wrapper')
let start = 1
// const ship = document.querySelector('#session_user')
// const userName = ship.getAttribute('data-user')

getTenPlanet()

async function getBackTenPlanet(){
    if(start >= 20){
        start -= 20
        await getTenPlanet()
    }
}
async function getTenPlanet(){
    let planets = document.createElement('tbody')
    for(let i = 0; i < 10; i++){
       await fetch('https://swapi.dev/api/planets/'+ start +'/')
            .then ( response => response.json() )
            .then ( data => createTableFromPlanet(data, planets) )
    }
    tableBodyPlanets.innerHTML = planets.innerHTML
}
function createTableFromPlanet(data, planets){
    let row = document.createElement('tr')

    data.population = data.population.replace(/\B(?=(\d{3})+(?!\d))/g, ",")

    row.innerHTML = `
    <td>${data.name}</td>
    <td>${data.diameter.replace(/\B(?=(\d{3})+(?!\d))/g, ",")} Km</td>  
    <td>${data.climate}</td>
    <td>${data.terrain}</td>
    <td>${data.surface_water != 'unknown' ? data.surface_water += '%' : data.surface_water = 'Unknown' }</td>
    <td>${data.population != 'unknown' ? data.population += ' people': data.population = 'Unknown' } </td>
    `
    let residents = document.createElement('td')
    if (data.residents.length == 0) {
        residents.innerText = 'Unknown'
    } else {
        residents.innerHTML = `
        <button id=${start}> ${data.residents.length} resident(s) </button>
        `
    }

    row.appendChild(residents)
    planets.appendChild(row)
    start++
}

function getPlanetById(id){
     fetch('https://swapi.dev/api/planets/'+ id +'/')
        .then(response => response.json())
        .then(data => getResidentsOfPlanet(data.residents))
}
async function getResidentsOfPlanet(residents){
   let tableResidents = document.createElement("tbody")
    for(const resident of residents){
        await fetch(resident)
            .then(response => response.json())
            .then(data => createTableFromResidents(data, tableResidents))
    }
    tableBodyResidents.innerHTML = tableResidents.innerHTML
    showModal()
}
function createTableFromResidents(data, tableResidents) {
    let row = document.createElement('tr')
    row.innerHTML = `
                <td>${data.name}</td>
                <td>${data.height}</td>
                <td>${data.mass}</td>
                <td>${data.hair_color}</td>
                <td>${data.skin_color}</td>
                <td>${data.eye_color}</td>
                <td>${data.birth_year}</td>
                <td>${data.gender}</td>
                `
    tableResidents.appendChild(row)
}

function showModal(){
    modal.classList.add('show')
    content.classList.add('hide')
}
function hideModal(){
    content.classList.remove('hide')
    modal.classList.remove('show')

}

buttonNext.addEventListener('click', getTenPlanet)
buttonBack.addEventListener('click', getBackTenPlanet)
buttonClose.addEventListener('click', hideModal)
window.addEventListener('click',(event) => {
    if ((event.target.id <= 60) && (event.target.id >= 1)) {
         getPlanetById(event.target.id)
    }

})
