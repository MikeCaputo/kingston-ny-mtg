import './css/App.scss';
import CommanderDisplay from './CommanderDisplay.jsx';

const CommandersAtThisLocation = (props) => {

  // Passed props
  const commandersArray = props.commandersArray;

  const updateCommanderLocation = (commander) => {
    commander.selfUpdate({...commander, hexLocation: [props.hexCol, props.hexRow]});
  }

  const isCommanderAtThisLocation = (commander) => {
    return commander.hexLocation && commander.hexLocation[0] === props.hexCol && commander.hexLocation[1] === props.hexRow;
  }

  return (
    <section className="commanders-at-this-location">
      {
        commandersArray.map((commander, index) => (
          isCommanderAtThisLocation(commander) ? (
            <CommanderDisplay
              key={index}
              commander={commander}
            />
          ) : (
            <button
              key={index}
              onClick={() => updateCommanderLocation(commander)}
              className="move-commander-here-button"
            >
              Move {commander.scryfallCardData.name} here
            </button>
          )
        ))
      }
    </section>

  );
}

export default CommandersAtThisLocation;
