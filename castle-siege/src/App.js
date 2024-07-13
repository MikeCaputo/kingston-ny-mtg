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
        name={'Lowland Tribes'}
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
              quantityRange: [3,6]
            },
            {
              name: 'Ogre',
              quantityRange: [1,2]
            }
          ]
        }
        usesSpells={
          [
            {
              name: 'Shock',
              targetsPlayer: true
            }
          ]
        }
        rewards={
          [
            {
              name: 'Goblin', // todo: Need to specify that type of goblin token. There are many. But for now, the API results _seem_ to sort the most basic ones to the top, so we'll see...
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
        closeModal={closeModal}
        setIsModalOpen={setIsModalOpen}
        turnOrder={
          ['castSpell', 'attack']
        }
        attacksWith={
          [
            {
              name: 'Giant',
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
        lifeTotal={100}
        populateModal={populateModal}
        closeModal={closeModal}
        setIsModalOpen={setIsModalOpen}
        turnOrder={
          ['castSpell', 'attack']
        }
        attacksWith={
          [
            {
              name: 'Dragon', // TODO: this prop might need to be more robust, basically an object that would contain as much of a query as needed to get the card/token we want.
              quantityRange: [3,6]
            },
            {
              name: 'Goblin',
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

      {/* July 9: thinking about trimming this down, no longer using it for Threat-specific purposes. */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-content">
              {modalText &&
                <p>{modalText}</p>
              }
              {cardToDisplay &&
                <>
                  <img src={cardToDisplay?.image_uris?.border_crop} alt={cardToDisplay.name} title={cardToDisplay.name} />
                  <button className="close-button" onClick={closeModal}>
                    {modalButtonText}
                  </button>
                </>
              }
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;
