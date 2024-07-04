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
        attacksWith={['goblin', 'ogre','giant']}
      />

      <Threat
        name={'The Drake Nests'}
        isBoss={false}
        lifeTotal={30}
        attacksWith={['drake']}
      />
      
      <Threat
        name={'Elemental Pools'}
        isBoss={false}
        lifeTotal={50}
        attacksWith={['elemental']}
      />
      
      <Threat
        name={'Mons\' Castle'}
        isBoss={true}
        lifeTotal={200}
        attacksWith={['dragon']}
        // todo: I'd like to parameterize the quantity of attackers. So, Mons might attach with 20 goblins....
      />

    </div>
  );
}

export default App;
