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
          ['lightningBolt', 'shock']
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
          ['lightningBolt', 'shock']
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
          ['lavaAxe', 'shatterStorm']
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
          ['lavaAxe', 'destructiveForce']
        }
      />

    </div>
  );
}

export default App;
