import React, { useEffect, useState } from 'react';
import './css/App.scss';
import Threat from './Threat.js';
// OpenAI
import OpenAI from 'openai';

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [cardToDisplay, setCardToDisplay] = useState(null);
  const [modalText, setModalText] = useState(null);

  const [modalButtonText, setModalButtonText] = useState('');
  const [modalButtonFunction, setModalButtonFunction] = useState(null); // wip
  const [shouldModalBeOpen, setShouldModalBeOpen] = useState(null); // wip
  const [selectedMap, setSelectedMap] = useState(null);
  // const [backgroundImage, setBackgroundImage] = useState('/gray-patterned-bg.jpg');
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [isGameStarted, setIsGameStarted] = useState(false);

  // Player / Commander data
  const [commander1, setCommander1] = useState('');
  const [commander2, setCommander2] = useState('');
  const [commander3, setCommander3] = useState('');
  const [commander4, setCommander4] = useState('');
  const [commandersArray, setCommandersArray] = useState([]);

  // OpenAI. Will be handled differently once secrets management is set up.
  const [openai, setOpenai] = useState(null);
  
  // Game Log; plain text. Will be used to generate a summary at the end.
  const [gameLog, setGameLog] = useState('');

  const addToGameLog = (additionalText) => {
    setGameLog(gameLog + additionalText);
    // Has n+1 issue, but is okay just for logging.
    console.log(`gameLog is: ${gameLog}`)
  }

  const generateGameSummary = async () => {

    // Just until secrets management is implemented.
    if(!openai) {
      return 'OpenAI not initialized.';
    }

    // todo, idea: have the "quest or mystery" part displayed at the beginning, to give the players a primer.
    // todo, idea: use smaller, more numerous prompts to build up more internal intelligence: probably would be beneficial to first create text blocks describing each commander, their powers and personalities, etc. Also to create a description of their dynamics, and a description of the map settings. All for future state.
    // Other optional parameters to learn about and explore: `max_tokens`, `n`, `temperature`. https://platform.openai.com/tokenizer
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
          { role: 'system', content: 'You are an expert at the game Magic the Gathering, and you will help to write short, dramatic stories drawing from user-provided content.' },
          {
              role: 'user',
              content: `Please write a fun, engaging, and dramatic game summary based on the following game log. The player commanders are ${listOfCommanderNames(false)}, and they are cooperatively facing a series of enemy threats. Additionally, please create a mystery or quest which is thematic to the setting and commanders, and have that mystery or quest resolved at the game completion. The game log is: ${gameLog}`,
          },
      ],
    });

    // TODO: can also possibly generate an image to accompany the game conclusion:
    // openai
  // .images
    // .generate({
    //   prompt: `An image of ${commandersArray} standing victoriously together.`,
    //   n: 2,
    //   size: "1024x1024",
    // })
    // .then((response) => console.log(response.data));

    console.log(`The game summary is: ${completion.choices[0].message.content}`);
    return completion.choices[0].message.content;
  }

  const populateModal = (cardData, modalText, modalButtonOptions) => {
    setCardToDisplay(cardData);
    setModalText(modalText);

    // console.log(`modalButtonOptions is: ${JSON.stringify(modalButtonOptions)}`)
    console.log(`cardData is: ${cardData}`)
    console.log(`modalText is: ${modalText}`)
    console.log(`modalButtonOptions is: ${modalButtonOptions}`)
    console.log(`modalButtonOptions.text is: ${modalButtonOptions.text}`)
    console.log(`modalButtonOptions.function is: ${modalButtonOptions.function}`)

    // Populate the modal button. This will allow the modal to control multiple attacks per threat.
    // setModalButtonText('hard-coded CLOSE');
    setModalButtonText(modalButtonOptions.text); // wip!
    // setModalButtonFunction(closeModal); // wip!
    setIsModalOpen(true); // hard-coded for now, need to get back to baseline.
    // setModalButtonFunction(closeModal); // wip!
    // setModalButtonFunction(modalButtonOptions.function); // THIS causes the modal to not work correctly. ** I think it's because: if it passes in `closeModal`, it is for some reason running immediately. Maybe because I'm passing it in without prefacing it with `() => function` ?? 

  }

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleMapFileUpload = (event) => {
    // TODO: need to validate map selection
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const mapData = JSON.parse(e.target.result);
          setSelectedMap(mapData);
          setBackgroundImage(mapData.backgroundImage);
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      };
      reader.readAsText(file);
    }
  };

  // A temporary, local solution. Will handle with secrets management in the future.
  const initializeOpenAi = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const openAiKey = e.target.result;
          // TODO: need to handle this with secrets management: https://github.com/MikeCaputo/kingston-ny-mtg/issues/8
          // https://help.openai.com/en/articles/5112595-best-practices-for-api-key-safety
          const thisOpenai = new OpenAI({ apiKey: openAiKey, dangerouslyAllowBrowser: true });
          setOpenai(thisOpenai);
        } catch (error) {
          console.error("Error reading file:", error);
        }
      };
      reader.readAsText(file);
    }
  }

  const generateBorderColors = (enemyBase) => {
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

  const startTheGame = () => {
    const commandersArray = [commander1, commander2, commander3, commander4];
    const thisGameCommanders = commandersArray
      .filter(commander => commander)  // Filter out empty strings
      .map(commander => ({
        commanderName: commander,
        isAttacking: false
      }));
    
    setCommandersArray(thisGameCommanders);
    setIsGameStarted(true);
  }

  const listOfCommanderNames = (includeOnlyAttackers = false) => {
    // Needs refinement. I think I did this exact same code in VoD somewhere.... this is good enough for now.
    let text = '';
    for (let i = 0; i < (commandersArray.length); i++) {
      if(!includeOnlyAttackers || (includeOnlyAttackers && commandersArray[i].isAttacking)) {

        if(i === commandersArray.length - 1) {
          // text += '.';
          text += ' and ';
        }
        if(commandersArray[i].commanderName) {
          text += commandersArray[i].commanderName;
        }
        if(i < commandersArray.length - 1) {
          text += ', ';
        }
      }
    }
    return text;
  }

  return (
    <div className="App" style={{ backgroundImage: `url(/map-backgrounds/${backgroundImage})` }}>

      <h1>Castle Siege</h1>

      <h4>A new format of Magic the Gathering, being developed by Mike Caputo of Calamity Bay Games</h4>

      <hr />

      {!isGameStarted &&
        <>
          <p>1. Choose the map</p>
          <input type="file" accept=".json,.js" onChange={handleMapFileUpload} />

          <p>2. Add the OpenAI apiKey file (temporary solution)</p>
          <input type="file" accept=".txt" onChange={initializeOpenAi} />

          <p>3. Who are the Commander(s)?</p>
          <input
            type="text"
            value={commander1}
            onChange={e => setCommander1(e.target.value)}
          /><br />
          <input
            type="text"
            value={commander2}
            onChange={e => setCommander2(e.target.value)}
          /><br />
          <input
            type="text"
            value={commander3}
            onChange={e => setCommander3(e.target.value)}
          /><br />
          <input
            type="text"
            value={commander4}
            onChange={e => setCommander4(e.target.value)}
          /><br />

          <button className="" onClick={startTheGame}>
            Start the Game
          </button>
        </>
      }

      {isGameStarted && (
        <div>
          <h2 className="map-header-name">Selected Map: {selectedMap?.name}</h2>

          <h4>They are facing the combined forces of {listOfCommanderNames()}.</h4>

          {selectedMap?.enemyBases.map((enemyBase) => {

            // Handle the ability to have multiple quantity of each Threat.
            const threats = [];
            for (let i = 0; i < (enemyBase.quantity); i++) {
              threats.push(
                <Threat
                  style={
                    {
                      backgroundImage: `linear-gradient(white, white), linear-gradient(45deg, ${generateBorderColors(enemyBase)})`
                    }
                  }
                  name={`${enemyBase.name} ${enemyBase.quantity > 1 ? i + 1 : ''}`}
                  key={`${enemyBase.name}-${i}`} // Ensure unique keys for each instance
                  isBoss={enemyBase.isBoss}
                  lifeTotal={enemyBase.lifeTotal}
                  populateModal={populateModal}
                  closeModal={closeModal}
                  setIsModalOpen={setIsModalOpen}
                  turnOrder={enemyBase.turnOrder}
                  attacksWith={enemyBase.attacksWith}
                  usesSpells={enemyBase.usesSpells}
                  rewards={enemyBase.rewards}
                  commandersArray={commandersArray}
                  setCommandersArray={setCommandersArray}
                  listOfCommanderNames={listOfCommanderNames}
                  addToGameLog={addToGameLog}
                  generateGameSummary={generateGameSummary}
                />
              );
            }
            return threats;
          })}

        </div>
      )}

      {/* <hr /> */}

      {/* July 9: thinking about trimming this down, no longer using it for Threat-specific purposes. */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-content">
              {modalText &&
                <p>{modalText}</p>
              }
              {cardToDisplay &&
                <img src={cardToDisplay?.image_uris?.border_crop} alt={cardToDisplay.name} title={cardToDisplay.name} />
              }
              <button className="close-button" onClick={closeModal}>
                {modalButtonText}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;
