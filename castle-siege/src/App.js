import React, { useEffect, useState } from 'react';
import './css/App.scss';
import Threat from './Threat.js';

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [cardToDisplay, setCardToDisplay] = useState(null);
  const [modalText, setModalText] = useState(null);

  const [modalButtonText, setModalButtonText] = useState('');
  const [modalButtonFunction, setModalButtonFunction] = useState(null); // wip
  const [shouldModalBeOpen, setShouldModalBeOpen] = useState(null); // wip

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

  // shouldModalBeOpen
  // useEffect(() => {
  //   setShouldModalBeOpen(shouldModalBeOpen);
  // }, [shouldModalBeOpen]);




  return (
    <div className="App">

      <h1>Castle Siege</h1>

      <h4>A new format of Magic the Gathering, being developed by Mike Caputo of Calamity Bay Games</h4>

      <hr />

      {/* Long-term, this will import a JSON data set which will be rendered into any number of playables maps! */}

      <Threat
        name={'Lowland Tribes 1'}
        isBoss={false}
        lifeTotal={20}
        populateModal={populateModal}
        closeModal={closeModal}
        setIsModalOpen={setIsModalOpen}
        turnOrder={
          ['attack']
        }
        attacksWith={
          [
            {
              name: 'Goblin',
              queryParameters: {
                color: 'red',
                power: 1,
                toughness: 1,
              },
              quantityRange: [3,6]
            },
            {
              name: 'Ogre',
              queryParameters: {
                color: 'red',
                power: 3,
                toughness: 3,
              },
              quantityRange: [1,2]
            }
          ]
        }
        usesSpells={
          []
        }
        rewards={
          [
            {
              name: 'Goblin',
              queryParameters: {
                color: 'red',
                power: 1,
                toughness: 1
              },
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
        name={'Lowland Tribes 2'}
        isBoss={false}
        lifeTotal={20}
        populateModal={populateModal}
        closeModal={closeModal}
        setIsModalOpen={setIsModalOpen}
        turnOrder={
          ['attack']
        }
        attacksWith={
          [
            {
              name: 'Goblin',
              queryParameters: {
                color: 'red',
                power: 1,
                toughness: 1,
              },
              quantityRange: [3,6]
            },
            {
              name: 'Ogre',
              queryParameters: {
                color: 'red',
                power: 3,
                toughness: 3,
              },
              quantityRange: [1,2]
            }
          ]
        }
        usesSpells={
          []
        }
        rewards={
          [
            {
              name: 'Goblin',
              queryParameters: {
                color: 'red',
                power: 1,
                toughness: 1
              },
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
        name={'Lowland Tribes 3'}
        isBoss={false}
        lifeTotal={20}
        populateModal={populateModal}
        closeModal={closeModal}
        setIsModalOpen={setIsModalOpen}
        turnOrder={
          ['attack']
        }
        attacksWith={
          [
            {
              name: 'Goblin',
              queryParameters: {
                color: 'red',
                power: 1,
                toughness: 1,
              },
              quantityRange: [3,6]
            },
            {
              name: 'Ogre',
              queryParameters: {
                color: 'red',
                power: 3,
                toughness: 3,
              },
              quantityRange: [1,2]
            }
          ]
        }
        usesSpells={
          []
        }
        rewards={
          [
            {
              name: 'Goblin',
              queryParameters: {
                color: 'red',
                power: 1,
                toughness: 1
              },
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
        name={'Lowland Tribes 4'}
        isBoss={false}
        lifeTotal={20}
        populateModal={populateModal}
        closeModal={closeModal}
        setIsModalOpen={setIsModalOpen}
        turnOrder={
          ['attack']
        }
        attacksWith={
          [
            {
              name: 'Goblin',
              queryParameters: {
                color: 'red',
                power: 1,
                toughness: 1,
              },
              quantityRange: [3,6]
            },
            {
              name: 'Ogre',
              queryParameters: {
                color: 'red',
                power: 3,
                toughness: 3,
              },
              quantityRange: [1,2]
            }
          ]
        }
        usesSpells={
          []
        }
        rewards={
          [
            {
              name: 'Goblin',
              queryParameters: {
                color: 'red',
                power: 1,
                toughness: 1
              },
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
        name={'Highland Tribes 1'}
        isBoss={false}
        lifeTotal={30}
        populateModal={populateModal}
        closeModal={closeModal}
        setIsModalOpen={setIsModalOpen}
        turnOrder={
          ['castSpell', 'attack']
        }
        attacksWith={
          [
            {
              name: 'Giant',
              queryParameters: {
                color: 'red',
                power: 4,
                toughness: 4,
              },
              quantityRange: [3,4]
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
        name={'Highland Tribes 2'}
        isBoss={false}
        lifeTotal={30}
        populateModal={populateModal}
        closeModal={closeModal}
        setIsModalOpen={setIsModalOpen}
        turnOrder={
          ['castSpell', 'attack']
        }
        attacksWith={
          [
            {
              name: 'Giant',
              queryParameters: {
                color: 'red',
                power: 4,
                toughness: 4,
              },
              quantityRange: [3,4]
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
        name={'Highland Tribes 3'}
        isBoss={false}
        lifeTotal={30}
        populateModal={populateModal}
        closeModal={closeModal}
        setIsModalOpen={setIsModalOpen}
        turnOrder={
          ['castSpell', 'attack']
        }
        attacksWith={
          [
            {
              name: 'Giant',
              queryParameters: {
                color: 'red',
                power: 4,
                toughness: 4,
              },
              quantityRange: [3,4]
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
        name={'Highland Tribes 4'}
        isBoss={false}
        lifeTotal={30}
        populateModal={populateModal}
        closeModal={closeModal}
        setIsModalOpen={setIsModalOpen}
        turnOrder={
          ['castSpell', 'attack']
        }
        attacksWith={
          [
            {
              name: 'Giant',
              queryParameters: {
                color: 'red',
                power: 4,
                toughness: 4,
              },
              quantityRange: [3,4]
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

      {/* <Threat
        name={'Elemental Pools'}
        isBoss={false}
        lifeTotal={50}
        populateModal={populateModal}
        closeModal={closeModal}
        setIsModalOpen={setIsModalOpen}
        turnOrder={
          ['castSpell', 'attack']
        }
        attacksWith={
          [
            {
              name: 'Elemental',
              queryParameters: {
                color: 'red',
                power: 3,
                toughness: 1,
              },
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
              name: 'Clue',
              quantityRange: [2,3]
            }
          ]
        }
      /> */}

      <Threat
        name={'Pirate Cove'}
        isBoss={false}
        lifeTotal={70}
        populateModal={populateModal}
        closeModal={closeModal}
        setIsModalOpen={setIsModalOpen}
        turnOrder={
          ['castSpell', 'attack']
        }
        attacksWith={
          [
            {
              name: 'Pirate',
              queryParameters: {
                color: 'red',
                power: 4,
                toughness: 2,
              },
              quantityRange: [3,5]
            }
          ]
        }
        usesSpells={
          [
            {
              name: 'Fiery Cannonade',
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
              quantityRange: [2,4]
            }
          ]
        }
      />

      <Threat
        name={'Wizard Tower'}
        isBoss={false}
        lifeTotal={70}
        populateModal={populateModal}
        closeModal={closeModal}
        setIsModalOpen={setIsModalOpen}
        turnOrder={
          ['castSpell', 'castSpell', 'castSpell']
        }
        attacksWith={
          []
        }
        usesSpells={
          [
            {
              name: 'Lava Axe',
              targetsPlayer: true
            },
            {
              name: 'Structural Collapse',
              targetsPlayer: true
            }
          ]
        }
        rewards={
          [
            {
              name: 'Clue',
              quantityRange: [4,5]
            }
          ]
        }
      />

      <Threat
        name={'Mons\' Fortress'}
        isBoss={true}
        lifeTotal={200}
        populateModal={populateModal}
        closeModal={closeModal}
        setIsModalOpen={setIsModalOpen}
        turnOrder={
          ['castSpell', 'attack']
        }
        attacksWith={
          [
            {
              name: 'Dragon',
              queryParameters: {
                color: 'red',
                power: 4,
                toughness: 4,
              },
              quantityRange: [3,6]
            },
            {
              name: 'Goblin',
              queryParameters: {
                color: 'red',
                power: 1,
                toughness: 1,
              },
              quantityRange: [14,20]
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
