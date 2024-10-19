import axios from 'axios';

// todo: adjjust this so it uses a single object as a parameter. fewer ambiguous parameters.
export const queryScryfall = async (cardName, isToken = false, queryParameters = {}, returnSingleCard = true) => {
  // TODO: before hitting the API, we need to check if we've already fetched and stored it locally. That will save greatly on API hits.
  // > For both exact and fuzzy, card names are case-insensitive and punctuation is optional (you can drop apostrophes and periods etc). For example: fIReBALL is the same as Fireball and smugglers copter is the same as Smuggler's Copter. - https://scryfall.com/docs/api/cards/named
  try {
    //~ Second pass on this: using `/search` instead of `/named` gives me more parameters, specifically the ability to search for tokens. This seems to be the more robust way.
    // Adding the `color` parameter, so we can specify to get the correct color creatures (red giant instead of green). In the future, this section would need to be more robust, but this is a good v1.

    //~ Discoveries: a query such as "Shock" will get ALL cards with the name `shock` in them. Then they will be returned alphabetically. So, searching for "Shock", just grabbing the first will result in "Aether Shockwave" which is not what we want.
    //~ So, it looks like I'll need to locally do a `find` by the name to get the exact match.
    //~ Very inefficient right now, pulling down all of that extra data. Hopefully I can get better queries in place eventually.
    // TODO: I should be able to pass in `+oracle:' '` to have no rules text, but that isn't quite working yet.

    // Start with the name, and whether or not it is a token. Then, loop through any additional queryParameters and append those to the query.
    let scryfallQuery = `https://api.scryfall.com/cards/search?q=name:${cardName}${isToken ? '+layout:token' : ''}`;
    for (const property in queryParameters) {
      scryfallQuery = scryfallQuery.concat(`+${property}:${queryParameters[property]}`);
    }

    // Can also test queries using the normal Scryfall API: https://scryfall.com/search?q=layout%3Atoken+name%3Agiant+color%3Ar&unique=cards&as=grid&order=name

    // console.log('scryfallQuery is: ', scryfallQuery)
    const response = await axios.get(scryfallQuery);
    const scryfallData = response.data; // This `data` is from Axios.
    const scryfallCardList = scryfallData.data;  // This `data` is from Scryfall. `scryfallData` is a few scraps of metadata that we don't need.


    // WIP ~~~~~~~~~~~~
    // In some cases, we'll want a single, exact query match: when we're searching for the cards pre-populated in the map data. So even if there are multiple results for a "zombie token" or something, we just want the first one, even if it's a bit wrong. That's up to the map creator to adjust.
    // In other cases, we'll want a collection: when the player is validating their commander.

    // wip. probably a better name for the `returnSingleCard` parameter. I _could_ break it down into two functions for clarity, or I could leave it. I think this is okay for now...
    if(returnSingleCard) {
      const cardWithExactNameMatch = scryfallCardList.find(card => card.name === cardName);
      // Watch out when logging with template literals!! They will parse an object into a string of "[Object object]". Don't try to get so fancy here. Log out using comma-separated values. - MC 8.22.2024
      console.log('cardWithExactNameMatch: ' , cardWithExactNameMatch);
      return cardWithExactNameMatch;
    } else {
      // console.log('scryfallCardList is: ', scryfallCardList);
      return scryfallCardList;
    }
    
  } catch (error) {
    console.error(error); // Log the error or handle it as needed
    return null; // Return null or handle it appropriately
  }
}

export const generateBorderColors = (enemyBase) => {
  // Generate border color. Could maybe use refactoring but its okay for now.
  let borderColors = '';
  if(enemyBase.borderColor.length === 1) {
    // ex, "red" is turned into "red red". The parameter needs at least two.
    borderColors = `${enemyBase.borderColor[0]}, ${enemyBase.borderColor[0]}`
  } else {
    for (let i = 0; i < (enemyBase.borderColor.length); i++) {
      const addCommaOrNot = i + 1 === enemyBase.borderColor.length ? '' : ',';
      borderColors += `${enemyBase.borderColor[i]}${addCommaOrNot}`;
    }
  }

  // Match colors. TODO: need to get colors from a more global source, like a shared exported data source. But this is fine for now.
  // Starting with this random reddit link here: https://imgur.com/dMjPOq0
  // white: 249, 250, 244 // f9fff4
  // green: 0, 115, 62 // 00733e
  // blue: 14, 104, 171 // 0e68ab
  // red: 211, 32, 42 // d3202a
  // black: 21, 11, 0 // #150b00
  borderColors = borderColors.replaceAll('white', '#f9fff4');
  borderColors = borderColors.replaceAll('green', '#00733e');
  borderColors = borderColors.replaceAll('blue', '#0e68ab');
  borderColors = borderColors.replaceAll('red', '#d3202a');
  borderColors = borderColors.replaceAll('black', '#150b00');

  return borderColors;

}

export const colorTranslate = (colorInitial) => {
  switch(colorInitial) {
    case 'W': return 'white'; break;
    case 'G': return 'green'; break;
    case 'U': return 'blue'; break;
    case 'R': return 'red'; break;
    case 'B': return 'black'; break;
    default: return null; break;
  }
}

export const listOfCommanderNames = (whichCommandersArray, includeOnlyAttackers = false) => {
  // Needs refinement. I think I did this exact same code in VoD somewhere.... this is good enough for now.
  let text = '';
  for (let i = 0; i < (whichCommandersArray.length); i++) {
    if(!includeOnlyAttackers || (includeOnlyAttackers && whichCommandersArray[i].isAttacking)) {

      if(whichCommandersArray.length > 1 && i === whichCommandersArray.length - 1) {
        // text += '.';
        text += ' and ';
      }
      if(whichCommandersArray[i].scryfallCardData.name) {
        text += whichCommandersArray[i].scryfallCardData.name;
      }
      if(i < whichCommandersArray.length - 1) {
        text += ', ';
      }
    }
  }
  return text;
}

// AI functions

// Setting this here so this is set in a central place.
export const openAiSettings = () => {
  return {
    model: 'gpt-4o-mini',
    temperature: .9, // The temperature parameter controls the randomness or creativity of the model's output. It influences the model's sampling behavior when generating text. Lower temperatures result in more deterministic and focused responses, while higher temperatures make the output more random and creative. Default is 1.
    presence_penalty: .1, // The presence_penalty parameter is used to penalize new tokens based on whether they appear in the text so far. The higher the presence_penalty, the more the model is discouraged from mentioning new topics. This can encourage the model to stick to the current topic without introducing new concepts. Default is 0. I'm adding a tiny bit here to see if it helps with focus.
    frequency_penalty: .2 // The frequency_penalty parameter reduces the likelihood of the model repeating the same token or phrase multiple times within the same response. It's useful for avoiding repetitive responses where the same phrases or ideas are echoed multiple times. The default is 0; I'm adding a small amount here to try and keep it a tiny bit focused.

    // Note: max_tokens is another parameter here. But it will only truncate the result; it will not force the generated result to be briefer.
    // If I need the result to be briefer, I can try:
    // - Lowering the temperature can make the model more focused and less verbose.
    // - Increasing presence_penalty or frequency_penalty can discourage the model from repeating itself, which might also lead to a more concise output.
    // - Can also simply add to the prompt, "Keep the answer brief and concise"
  }
}

export const generateDescriptionForCommander = async (openai, commander) => {

  const translateColorsToString = (colorsArray, i) => {
    let colorsString = '';
    colorsArray.map(colorInitial => {
      colorsString += colorTranslate(colorInitial);
      if(colorsArray.length > 1 && i === colorsArray.length - 1) {
        colorsString += ' and ';
      }
    })
    return colorsString;
  }

  const aiInstructionPrompt = `Please write a rich character description for the following legendary creature. Its name is ${commander.scryfallCardData.name}, its power is ${commander.scryfallCardData.power}, its toughness is ${commander.scryfallCardData.toughness}, its colors are ${translateColorsToString(commander.scryfallCardData.colors)}, its creature type is ${commander.scryfallCardData.type_line}, its abilities are ${commander.scryfallCardData.oracle_text}, and its flavortext is ${commander.scryfallCardData.name}.`;
  console.log(`aiInstructionPrompt is: ${aiInstructionPrompt}`);

  const completion = await openai.chat.completions.create({
    ...openAiSettings(),
    messages: [
        { role: 'system', content: 'You are an expert at the game Magic the Gathering, and you will help to write a short but rich character description for a legendary creature.' },
        {
            role: 'user',
            content: aiInstructionPrompt,
        },
    ],
  });

  return completion.choices[0].message.content;

}

export const generateDynamicsBetweenCommanders = async (openai, whichCommandersArray) => {

  const aiInstructionPrompt = `The MtG commanders ${listOfCommanderNames(whichCommandersArray, false)} are cooperatively allied in a great battle against a powerful enemy. Please write a rich description of the dynamics and interactions between these commanders, taking into account their overall character attributes.`;
  console.log(`aiInstructionPrompt is: ${aiInstructionPrompt}`);
  const completion = await openai.chat.completions.create({
    ...openAiSettings(),
    messages: [
        { role: 'system', content: 'You are an expert at the game Magic the Gathering, and you will help to write a rich description of the dynamics and interactions between these commanders, taking into account their overall character attributes.' },
        {
            role: 'user',
            content: aiInstructionPrompt,
        },
    ],
  });

  return completion.choices[0].message.content;

}

export const generateGamePrologue = async (openai, commanderInfo, selectedMap) => {

  let enemyBaseNames = '';
  selectedMap.enemyBases.map(async (enemyBase, i) => {
    if(selectedMap.enemyBases.length > 1 && i === selectedMap.enemyBases.length - 1) {
      enemyBaseNames += ' and ';
    }
    enemyBaseNames += `${enemyBase.name}, `;
    if(i < selectedMap.enemyBases.length - 1) {
      enemyBaseNames += ', ';
    }
  });

  const maxWordCount = 425; // And unaltered test was 693, too long. I tried 400 and was nice and snappy! I'll try 500 to see if I get a _little_ more description. But I think this is a good way to control the length. update: nudging this down to 425.

  const aiInstructionPrompt = `A group of MtG commander(s) are cooperatively allied in a great battle against a powerful enemy. A description of the commander(s) is here in triple brackets: [[[${commanderInfo}]]]. Please write a prologue of their great battle against ${selectedMap.name}, which will take place in the places of ${enemyBaseNames}, and will include a mystery or quest which is thematic to the commanders and setting. Please only include a portion of this mystery or quest; it will be concluded at a later time. Please limit the response to no more than ${maxWordCount} words.`;
  console.log(`aiInstructionPrompt is: ${aiInstructionPrompt}`);
  const completion = await openai.chat.completions.create({
    ...openAiSettings(),
    messages: [
        { role: 'system', content: 'You are an expert at the game Magic the Gathering, and you will help to write a rich description of the dynamics and interactions between these commanders, taking into account their overall character attributes.' },
        {
            role: 'user',
            content: aiInstructionPrompt,
        },
    ],
  });

  return completion.choices[0].message.content;

}
