const mtg = require('mtgsdk');
// const axios = require('axios');

async function fetchData() {

  document.getElementById('button').innerHTML = 'Loading...';

  try {

    // It seems that there are about 968 results, isntead of the 384 that I was seeing from Gatherer.
    // It might be counting reprints and such... oh well.
    // I'm also going to take a shortcut here and just randomly choose from among the pages that I've found,
    // and then choose randomly from within that. Seems to be working.
    const randomPageOfNinePages = Math.floor(Math.random(9) * 10);

    const randomUncommonLegendList = await mtg.card.where({
            supertypes: 'legendary',
            type: 'creature',
            rarity: 'uncommon',
            language: 'english',
            page: randomPageOfNinePages
        })
    const randomCard = randomUncommonLegendList[Math.floor(Math.random() * randomUncommonLegendList.length)];

    // It seems that some of these fail to have images. In that case, I'll display the text...
    if(randomCard.imageUrl) {
      document.getElementById('commander-data').innerHTML = `
        <hr />  
        <img src="${randomCard.imageUrl}" alt="${randomCard.name}" title="${randomCard.name}"/>
        <p>Now, go forth: build a fun deck and show the world what ${randomCard.name} can do!</p>
        <hr />  
      `;
    } else {
      document.getElementById('commander-data').innerHTML = `
        <hr />  
        <p><em>Image was not available for this card...</em></p>
        <p>${randomCard.name} [${randomCard.manaCost}]</p>
        <p>${randomCard.type}</p>
        <p>${randomCard.power} / ${randomCard.toughness}</p>
        <p>${randomCard.text}</p>
        <p>${randomCard.setName}</p>
        <hr />  
      `;
    }

    document.getElementById('button').innerHTML = `No, the fates were wrong. I want a different commander!`;

  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

// Expose the fetchData function to the global scope
window.fetchData = fetchData;
