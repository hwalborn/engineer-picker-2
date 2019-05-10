$(document).ready(() => {
  var engineerIds = [];
  // use the api key and the sheet passed in
  $.get(`https://sheets.googleapis.com/v4/spreadsheets/1CJRNkEB2ImbiNrbW-1ceWQyOkiLXpPjXlpYcYLNuJ9E/values:batchGet?key=&ranges=sheet1&majorDimension=ROWS`, (resp) => {
    // make some json, this also happens async
    let sheetObjects = resp.valueRanges[0].values
    let $engineerDiv = $('#engineer-container')
    // there's a header we need to think about
    engineerCount = sheetObjects.length - 1
    sheetObjects.forEach((obj, i) => {
      // watch out for the header and any people that are out
      if(i === 0 || obj[3] === 'X') {
        return
      }
      let engineerId = `single-${i}`
      engineerIds.push(engineerId)
      $engineerDiv.append(`
          <div class='single-container' id='${engineerId}'>
            <h1>${obj[0]}</h1>
            <h3>${obj[2]}</h3>
            <h6>${obj[1]}</h6>
          </div>
        `)
    })
  })

  $('#pick-button').click(() => {
    let index = Math.floor(Math.random() * engineerIds.length)
    let engineerId = engineerIds[index]
    let $currentEngineer = $(`#${engineerId}`)
    let $engineerLoc = $("#current-engineer")
    let searchBy = $(`#${engineerId} h1`).text()[0]
    $.get(`https://swapi.co/api/people/?search=${searchBy}`, (resp) => {
      let character = resp.results[Math.floor(Math.random() * resp.count)]
      let characterName = `
        <h2>Star Wars Character: ${character.name}</h2>
      `
      $engineerLoc.empty()
      $currentEngineer.append(characterName)
      $engineerLoc.append($currentEngineer)
      engineerIds.splice(index, 1)
    })
  })
})
