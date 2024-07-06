import './App.css';
import Threat from './Threat.js';

function App() {

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
              key: 'goblin',
              quantityRange: [2,3]
            },
            {
              key: 'map',
              quantityRange: [1,2]
            },
            {
              key: 'junk',
              quantityRange: [1,2]
            }
          ]
        }
      />

      <Threat
        name={'Highland Tribes'}
        isBoss={false}
        lifeTotal={30}
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
              key: 'treasure',
              quantityRange: [1,2]
            },
            {
              key: 'food',
              quantityRange: [1,2]
            }
          ]
        }
      />
      
      <Threat
        name={'Elemental Pools'}
        isBoss={false}
        lifeTotal={50}
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
              key: 'treasure',
              quantityRange: [4,5]
            },
            {
              key: 'map',
              quantityRange: [3,4]
            }
          ]
        }
      />
      
      <Threat
        name={'Mons\' Castle'}
        isBoss={true}
        lifeTotal={200}
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

    </div>
  );
}

export default App;
