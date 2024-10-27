import './css/App.scss';
import CommanderDisplay from './CommanderDisplay.jsx';

const CommandersAtThisLocation = (props) => {

  // Passed props
  const commandersArray = props.commandersArray;
  const isEnemyBaseAlive = props.isEnemyBaseAlive;

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
          <>
            {commander.isDefeated && (
              <p className="commander-has-been-defeated-text">Alas, {commander.scryfallCardData.name} is defeated!</p>
            )}
  
            {!commander.isDefeated && (
              isCommanderAtThisLocation(commander) ? (
                <CommanderDisplay
                  key={index}
                  commander={commander}
                  canChangeLifeTotal={isEnemyBaseAlive}
                />
              ) : (
                <button
                  onClick={() => updateCommanderLocation(commander)}
                  className="move-commander-here-button"
                >
                  Move {commander.scryfallCardData.name} here
                </button>
              )
            )}
          </>
        ))
      }
    </section>
  );

}

export default CommandersAtThisLocation;
