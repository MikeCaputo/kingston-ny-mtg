import React, { useEffect, useState } from 'react';
import './css/App.scss';
import {
  generateDescriptionForCommander,
  generateDynamicsBetweenCommanders,
  generateGamePrologue,
  listOfCommanderNames,
  openAiSettings,
} from './helper-methods.js';
// OpenAI
import OpenAI from 'openai';
import CommanderPicker from './CommanderPicker.jsx';
import HexGrid from './HexGrid.jsx';

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [cardToDisplay, setCardToDisplay] = useState(null);
  const [modalText, setModalText] = useState(null);

  const [modalButtonText, setModalButtonText] = useState('');
  // const [modalButtonFunction, setModalButtonFunction] = useState(null); // wip
  // const [shouldModalBeOpen, setShouldModalBeOpen] = useState(null); // wip
  const [selectedMap, setSelectedMap] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [isGameStarted, setIsGameStarted] = useState(false);

  // Player / Commander data
  const [commander1, setCommander1] = useState(null);
  const [commander2, setCommander2] = useState(null);
  const [commander3, setCommander3] = useState(null);
  const [commander4, setCommander4] = useState(null);
  const [commandersArray, setCommandersArray] = useState([]);

  // Skip AI generation. Will speed up development and will not incur API costs.
  const [skipAi, setSkipAi] = useState(false);

  // When a user selects a commander from the picker, reset the selector.
  useEffect(() => {
    // Sets the commanders array; only adds those with a value. The `filter` will exclude any non-nulls.
    setCommandersArray([commander1, commander2, commander3, commander4].filter(commander => commander));
  }, [commander1, commander2, commander3, commander4]);

  // Can worry about drying this up later if needed.
  const getCommanderByPlayerNumber = (playerNumber) => {
    switch(playerNumber) {
      case 1: return commander1;
      case 2: return commander2;
      case 3: return commander3;
      case 4: return commander4;
      default: return null;
    }
  }

  // Could combine this with the above, probably.... it's okay for now.
  const getCommanderSetterByPlayerNumber = (playerNumber) => {
    switch(playerNumber) {
      case 1: return setCommander1;
      case 2: return setCommander2;
      case 3: return setCommander3;
      case 4: return setCommander4;
      default: return null;
    }
  }

  // OpenAI. Will be handled differently once secrets management is set up.
  const [openai, setOpenai] = useState(null);
  
  // Game Log; plain text. Will be used to generate a summary at the end.
  const [gameLog, setGameLog] = useState('');
  // We store the game prologue so that we can reference it later when generating the game's conclusion.
  const [gamePrologue, setGamePrologue] = useState('');

  const addToGameLog = (additionalText) => {
    setGameLog(gameLog + additionalText);
    // Has n+1 issue, but is okay just for logging.
    console.log(`gameLog is: ${gameLog}`)
  }

  const generateGameSummary = async () => {

    if(skipAi) {
      return 'Skipping AI generation. Game summary would go here.';
    }

    // todo, idea: have the "quest or mystery" part displayed at the beginning, to give the players a primer.
    // todo, idea: use smaller, more numerous prompts to build up more internal intelligence: probably would be beneficial to first create text blocks describing each commander, their powers and personalities, etc. Also to create a description of their dynamics, and a description of the map settings. All for future state.
    // Other optional parameters to learn about and explore: `max_tokens`, `n`, `temperature`. https://platform.openai.com/tokenizer
    const completion = await openai.chat.completions.create({
      ...openAiSettings(),
      messages: [
          { role: 'system', content: 'You are an expert at the game Magic the Gathering, and you will help to write short, dramatic stories drawing from user-provided content.' },
          {
              role: 'user',
              content: `Starting with this game prologue: ${gamePrologue}, incorporate the events that unfolded during the game, as follows: ${gameLog}. Please write a fun, engaging, and dramatic game conclusion, concluding the quest or mystery referenced during the gmae's prologue.`,
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

  // wip: Making this more flexible by making parameters optional. That way we can update modals that are already open.
  const populateModal = (cardData = null, modalText = null, modalButtonOptions = {}) => {
    setCardToDisplay(cardData);
    if(modalText) {
      setModalText(modalText);
    }

    // Populate the modal button. This will allow the modal to control multiple attacks per enemy base.
    if(modalButtonOptions?.text) {
      setModalButtonText(modalButtonOptions.text);
    }
    setIsModalOpen(true);
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

  const startTheGame = async() => {
    // Start loading state here
    populateModal(
      null,
      'Loading...',
      {text: 'Loading...', function: setIsModalOpen(false)}
    );

    // 1. Generate AI descriptions for each commander, and assign that description to the commander object
    // 2. React will ASYNC (batch) those updates to the normal `commandersArray` array.
    // 3. But, so that we will have access to it here in its entirety, I'm storing `availableCommandersArray` so that we can use it immediately.
    const availableCommandersArray = await Promise.all(
      commandersArray.map(async (commander) => {
        const descriptionForCommander = skipAi ? 'Skipping AI generation. Commander description would go here.' : await generateDescriptionForCommander(openai, commander);
        const whichSetterFunction = getCommanderSetterByPlayerNumber(commander.playerNumber);
        whichSetterFunction(prevData => ({
          ...prevData,
          aiGeneratedDescription: descriptionForCommander,
        }));
        return {
          ...commander,
          aiGeneratedDescription: descriptionForCommander,
        };
      })
    );

    /*
      Note:
      This is not following React best practices, but it works for now. (following the mantra right now: documentation is more important than code quality)

      1. I think it would be useful to separate each Commander out into its own component, so each one can be more independently reactive.
      2. The bigger note here is that I need to change more pieces to be React-like. For example, if I had something like:

        useEffect(() => {
          // generateAiDescription
        }, [commander1.scryFallData]);

        And then, ugh, can't think need to take care of Luca now. But basically, keep making chain-reaction reactive functions,
        so that as get all of the ai-generated info populated, we finally set a flag state of "everythingIsGenerated", and only then
        would we update the modal with the populated info.

    */

    // Generate dynamics between the commanders, or single commander.
    let thisGamePrologue = 'Skipping AI generation. Game prologue would go here.';
    if(!skipAi) {
      const commanderInfo = availableCommandersArray.length > 1
        ? await generateDynamicsBetweenCommanders(openai, availableCommandersArray)
        : availableCommandersArray[0].aiGeneratedDescription;
      thisGamePrologue = await generateGamePrologue(openai, commanderInfo, selectedMap);
    }
    setGamePrologue(thisGamePrologue);

    populateModal(
      null,
      thisGamePrologue,
      {text: 'Let the Siege Begin!', function: setIsModalOpen(false)}
    );

    setIsGameStarted(true);
  }

  const [canStartTheGame, setCanStartTheGame] = useState(false);

  // Players can only start the game after the map has been selected, openai has been added, and the commander(s) have been selected.
  useEffect(() => {
    setCanStartTheGame(selectedMap && openai && commandersArray.length > 0);
  }, [selectedMap, openai, commandersArray]);

  return (
    <main className="App" style={{ backgroundImage: `url(/map-backgrounds/${backgroundImage})` }}>

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

          {
            [1,2,3,4].map((playerNumber) => (
              // Once the player has selected their commander, display it. Until then, display a picker.
              // Future UX: allow a player to cancel out and select a different commander if they made a mistake.
              getCommanderByPlayerNumber(playerNumber)
                ? <img
                    key={playerNumber}
                    src={getCommanderByPlayerNumber(playerNumber).scryfallCardData?.image_uris?.small}
                    alt={getCommanderByPlayerNumber(playerNumber).scryfallCardData?.name}
                    title={getCommanderByPlayerNumber(playerNumber).scryfallCardData?.name}
                  />
                : <CommanderPicker
                    key={playerNumber}
                    playerNumber={playerNumber}
                    setCommanderFunction={getCommanderSetterByPlayerNumber(playerNumber)}
                  />
            ))
          }

          <button onClick={startTheGame} disabled={!canStartTheGame}>
            {canStartTheGame ? 'Start the Game' : 'Please finish setting up'}
          </button>

          <label>
            <input
              type="checkbox"
              checked={skipAi}
              onChange={(event) => setSkipAi(event.target.checked)}
            />
            Skip AI generation (for development)
          </label>
        </>
      }

      {isGameStarted && (
        <div>
          <h2 className="map-header-name">Selected Map: {selectedMap?.name}</h2>

          <h4>They are facing the combined forces of {listOfCommanderNames(commandersArray)}.</h4>

          <HexGrid
            selectedMap={selectedMap}
            populateModal={populateModal}
            closeModal={closeModal}
            setIsModalOpen={setIsModalOpen}
            setModalText={setModalText}
            commandersArray={commandersArray}
            addToGameLog={addToGameLog}
            generateGameSummary={generateGameSummary}
          />

        </div>
      )}

      {/* July 9: thinking about trimming this down, no longer using it for enemy base-specific purposes. */}
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

    </main>
  );
}

export default App;
