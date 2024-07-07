import React, { useState } from 'react';
import './App.css';
import Threat from './Threat.js';

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [cardToDisplay, setCardToDisplay] = useState(null);
  const [modalText, setModalText] = useState(null);

  const populateModal = (cardData, modalText) => {
    setCardToDisplay(cardData);
    setModalText(modalText);
    setIsModalOpen(true);
  }

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="App">

      <h1>Castle Siege</h1>

      <h2><em>A new format of Magic the Gathering, being developed by Mike Caputo</em></h2>

      <hr />

      {/* Long-term, this will import a JSON data set which will be rendered into any number of playables maps! */}

      <Threat
        name={'Lowland Tribes'}
        isBoss={false}
        lifeTotal={20}
        populateModal={populateModal}
        attacksWith={
          [
            {
              key: 'goblin',
              quantityRange: [3,6]
            },
            {
              key: 'ogre',
              quantityRange: [2,4]
            }
          ]
        }
        usesSpells={
          // These will pull from Scryfall API. Just use the spell name exactly and it will fetch and display the cards.
          // If they have a global effect or should target the player, indicate that here as well.
          [
            {
              name: 'Lightning Bolt',
              targetsPlayer: true
            },
            {
              name: 'Shock',
              targetsPlayer: true
            }
          ]
        }
        rewards={
          [
            {
              name: 'Goblin', // todo: Need to specify that type of goblin token. There are many.
              quantityRange: [2,3]
            },
            {
              name: 'Map',
              quantityRange: [1,2]
            },
            {
              name: 'Junk',
              quantityRange: [1,2]
            }
          ]
        }
      />

      <Threat
        name={'Highland Tribes'}
        isBoss={false}
        lifeTotal={30}
        populateModal={populateModal}
        attacksWith={
          [
            {
              key: 'giant',
              quantityRange: [4,6]
            }
          ]
        }
        usesSpells={
          [
            {
              name: 'Lightning Bolt',
              targetsPlayer: true
            },
            {
              name: 'Shock',
              targetsPlayer: true
            }
          ]
        }
        rewards={
          [
            {
              name: 'Junk',
              quantityRange: [1,2]
            },
            {
              name: 'Food',
              quantityRange: [1,2]
            },
            {
              name: 'Blood',
              quantityRange: [1,2]
            }
          ]
        }
      />

      <Threat
        name={'Elemental Pools'}
        isBoss={false}
        lifeTotal={50}
        populateModal={populateModal}
        attacksWith={
          [
            {
              key: 'elemental',
              quantityRange: [6,8]
            }
          ]
        }
        usesSpells={
          [
            {
              name: 'Lava Axe',
              targetsPlayer: true
            },
            {
              name: 'Shatterstorm',
              targetsPlayer: false
            },
            {
              name: 'Pyroclasm',
              targetsPlayer: false
            }
          ]
        }
        rewards={
          [
            {
              name: 'Treasure',
              quantityRange: [4,5]
            },
            {
              name: 'Map',
              quantityRange: [3,4]
            }
          ]
        }
      />

      <Threat
        name={'Mons\' Castle'}
        isBoss={true}
        lifeTotal={200}
        populateModal={populateModal}
        attacksWith={
          [
            {
              key: 'dragon',
              quantityRange: [3,6]
            },
            {
              key: 'goblin',
              quantityRange: [12,20]
            }
          ]
        }
        usesSpells={
          [
            {
              name: 'Lava Axe',
              targetsPlayer: true
            },
            {
              name: 'Destructive Force',
              targetsPlayer: false
            }
          ]
        }
      />

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="close-button" onClick={closeModal}>
              &times;
            </button>
            <div className="modal-content">
              {modalText &&
                <p>{modalText}</p>
              }
              {cardToDisplay &&
                <img src={cardToDisplay?.image_uris?.border_crop} alt={cardToDisplay.name} title={cardToDisplay.name} />
              }
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;
