import './App.css';
// import _, { map, random } from 'underscore';
import _ from 'underscore';
import Threat from './Threat.js';

function App() {



  return (
    <div className="App">

      <h1>Castle Siege</h1>

      <h2><em>A new format of Magic the Gathering, being developed by Mike Caputo</em></h2>

      <hr />

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
            },
            {
              key: 'giant',
              quantityRange: [1,2]
            }
          ]
        }
        usesSpells={
          ['lightningBolt', 'shock']
        }
      />

      <Threat
        name={'The Carnivore Nests'}
        isBoss={false}
        lifeTotal={30}
        attacksWith={
          [
            {
              key: 'carnivore',
              quantityRange: [4,6]
            }
          ]
        }
        usesSpells={
          ['lightningBolt', 'shock']
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
          ['lavaAxe', 'lightningBolt']
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
          ['lavaAxe', 'pyroclasm']
        }
      />

    </div>
  );
}

export default App;
