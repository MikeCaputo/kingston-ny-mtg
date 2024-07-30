import React, { useEffect, useState } from 'react';
import './css/App.scss';
import Threat from './Threat.js';
// import defaultBackground from 'gray-patterned-bg.jpg';

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

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const mapData = JSON.parse(e.target.result);
          // set the quantitty maps here?
          setSelectedMap(mapData);

          setBackgroundImage(mapData.backgroundImage);
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      };
      reader.readAsText(file);
    }
  };

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

  return (
    <div className="App" style={{ backgroundImage: `url(/map-backgrounds/${backgroundImage})` }}>

      <h1>Castle Siege</h1>

      <h4>A new format of Magic the Gathering, being developed by Mike Caputo of Calamity Bay Games</h4>

      <hr />

      {!selectedMap &&
        <input type="file" accept=".json,.js" onChange={handleFileChange} />
      }

      {selectedMap && (
        <div>
          <h2 className="map-header-name">Selected Map: {selectedMap.name}</h2>

          {selectedMap.enemyBases.map((enemyBase) => {

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
