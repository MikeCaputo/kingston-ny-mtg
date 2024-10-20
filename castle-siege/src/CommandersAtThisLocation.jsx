import './css/App.scss';
import React, { useState } from 'react';
import CommanderDisplay from './CommanderDisplay.jsx';

const CommandersAtThisLocation = (props) => {

  // const [commanderPickerArray, setCommanderPickerArray] = useState([]);
  // const [cardSearchInput, setCardSearchInput] = useState('');

  // Passed props
  const commandersArray = props.commandersArray;
  const setCommander1 = props.setCommander1;
  console.log('commandersArray (in CommandersAtThisLocation): ', commandersArray)
  // const playerNumber = props.playerNumber;

  const updateCommander1Location = () => {
    setCommander1({...commandersArray[0], hexLocation: [props.hexCol, props.hexRow]});
    console.log('commandersArray: ', commandersArray)
  }

  const isCommander1AtThisLocation = () => {
    return commandersArray[0].hexLocation && commandersArray[0].hexLocation[0] == props.hexCol && commandersArray[0].hexLocation[1] == props.hexRow;
  }

  // useEffect(() => {
  //   console.log('in the Hex component; need to update commander location. commandersArray is: ', commandersArray)
  // }, [commandersArray]);

  return (
    <section className="commanders-at-this-location">

      {isCommander1AtThisLocation() && 
        <CommanderDisplay
          commander={commandersArray[0]}
        />
      }
      {!isCommander1AtThisLocation() &&
        <>
          <p>update commander 1 - WIP</p>
          <button onClick={() => updateCommander1Location()}>Move Player 1 Here</button>
        </>
      }

      <p>commander 2 - todo</p>
      <p>commander 3 - todo</p>
      <p>commander 4 - todo</p>

    </section>
  );
}

export default CommandersAtThisLocation;
