# BDD Tests

_I can break this into multiple files in the future, if needed_

## Game Setup

### Scenario: I first open the Castle Siege app
GIVEN I am a player
AND I have just opened the Castle Siege app
WHEN I observe the page
THEN I will that I have the ability to choose a map
AND I will see that I have the ability to add an OpenAI key
AND I will see that I have the ability to populate the game with up to 4 commanders
AND I will see that the button to start the game is disabled

### Scenario: I can open a dialog box, allowing me select a map file
GIVEN I am a player
AND I have not started the game yet
WHEN I select "Choose File" beneath the "Choose the map" section
THEN a system dialogue will appear, allowing me to select a map file

### Scenario: I select a map to play
GIVEN I am a player
AND I have not started the game yet
AND I can see a system dialogue, allowing me to select a `.json` map file
WHEN I select a file containing a Castle Siege map
THEN the file name will appear next to the "Choose the file" button
AND the map's background image will appear over a portion of the page

### Scenario: I can open a dialog box, allowing me select a file containing an OpenAI API key
GIVEN I am a player
AND I have not started the game yet
WHEN I select "Choose File" beneath the "Choose the map" section
THEN a system dialogue will appear, allowing me to select a `.txt` file containing an OpenAI API key
* _Note: this is a temporary solution. Long-term this will be handled via secrets management. https://github.com/MikeCaputo/kingston-ny-mtg/issues/8_

### Scenario: I select a file containing an OpenAI API key
GIVEN I am a player
AND I have not started the game yet
AND I can see a system dialogue, allowing me to select a `.txt` file
WHEN I select a file containing an OpenAI API key
THEN the file name will appear next to the "Choose the file" button

### Scenario: I can search for a card to choose as my commander
GIVEN I am a player
AND I have not started the game yet
AND I have added text to one of the input fields beneath the title "Who are the Commander(s)?"
WHEN I blur out of the input field
THEN I will see a list of cards which contain the input value as part of its card title

### Scenario: I choose a card as my commander
GIVEN I am a player
AND I have not started the game yet
AND I have added text to one of the input fields beneath the title "Who are the Commander(s)?"
AND I see a list of cards which contain the input value as part of its card title
WHEN I select one of those cards
THEN my selected card will appear alone
AND I will no longer see the accompanying text input fields
AND my card will no longer be selectable

### Scenario: I see the ability to start the game
GIVEN I am a player
AND I have not started the game yet
AND I have chosen a Castle Siege map
AND I have added an OpenAI API key
AND at least one commander hsa been selected
WHEN I observe the button at the bottom of the page
THEN I will see that the button to start the game is no longer disabled
AND it will read "Start the Game"

### Scenario: I start the game, and see a prologue modal
GIVEN I am a player
AND I have not started the game yet
AND the button to start the game is no longer disabled
WHEN I start the game
THEN a modal will appear
AND it will populate after a few seconds
AND it will contain an AI-generated game prologue
AND that prologue will draw from the selected commander(s) and the map setting
AND I will see a button reads "Let the Siege Begin!"

### Scenario: I close the prologue modal and I can now interact with the game
GIVEN I am a player
AND I can see an AI-generated game prologue in a modal
AND I see a button reads "Let the Siege Begin!"
WHEN I select that button
THEN the modal will close
AND I will see a hex grid
AND the grid will have map-specific enemy bases, represented by castle icons
AND the grid will have map-specific connecting paths, represented by stone path icons
AND the grid will display where the commanders are, in plain text

## Hex Grid

### Scenario: I can open an enemy base
GIVEN I am a player
AND I have started the game
AND I see a hex grid
AND I see at least one enemy base, represented by a castle
WHEN I click on the castle
THEN the enemy base will be displayed
AND I will see button(s) which would allow me to move commander(s) to this location
AND the enemy base will show its name
AND the enemy base will have a life total
AND the enemy base will have a field allowing the player(s) to damage that base
AND the enemy base will have checkboxes, used for indicating which commander(s) are performing an attack
AND the enemy base will have a button allowing the player(s) to perform an attack
AND the enemy base will have a Notes section
AND the enemy base will have a button allowing the enemy base to take its turn
AND the enemy base will have a button allowing the player to close the enemy base

### Scenario: I can close an enemy base
GIVEN I am a player
AND I have started the game
AND I see a hex grid
AND I see at least one enemy base, represented by a castle
AND that enemy base is open
WHEN I click on the castle
THEN the enemy base will close

### Scenario: I can click on any hex grids to see its coordinates in the console log
GIVEN I am Castle Siege developer
AND I have started the game
AND I see a hex grid
AND I have browser developer tools open
WHEN I click on any hex
THEN I will see the column and row numbers for that hex
AND I can use that information to debug and/or edit map information

## Enemy Bases

### Scenario: I can move a commander to an enemy base
GIVEN I am a player
AND I have started the game
AND there is an opened enemy base
AND I see button(s) which would allow me to move commander(s) to this location
WHEN I click one to move the desired commander to that location
THEN I will see that commander's card image
AND I will see that commander's life total
AND I will no longer have the ability to move that commander to that location
AND that commander will no longer be displayed at any other location

### Scenario: I initiate an enemy base turn
GIVEN I am a player
AND I have started the game
AND there is an opened enemy base
AND that enemy base has more than 0 life total
WHEN I begin their turn
THEN the enemy base UI will expand to display a card
AND they will cast a spell or perform an attack

### Scenario: An enemy base takes an additional action
GIVEN I am a player
AND I have started the game
AND there is an opened enemy base
AND that enemy base has more than 0 life total
AND that enemy has started their turn
AND they have an additional action
WHEN I continue their turn
THEN they will cast a spell or perform an attack

### Scenario: An enemy base finishes their turn
GIVEN I am a player
AND I have started the game
AND there is an opened enemy base
AND that enemy base has more than 0 life total
AND that enemy has started their turn
AND they have no additional actions
WHEN I end their turn
THEN the enemy base UI will partially collapse

### Scenario: One or more players deals damage to an enemy base
GIVEN I am a player
AND I have started the game
AND there is an opened enemy base
AND that enemy base has more than 0 life total
AND one or more players are located at that base
AND a damage amount has been populated
WHEN I deal damage to the enemy base
AND that will not cause the enemy life total to drop to 0 or below 0
THEN the enemy base life total will decrease by that amount

### Scenario: A non-boss enemy base is defeated
GIVEN I am a player
AND I have started the game
AND there is an opened enemy base
AND that enemy base has more than 0 life total
AND one or more players are located at that base
WHEN I deal damage to the enemy base
AND that causes the enemy life total to drop to 0 or below 0
AND that enemy is not a boss
THEN a victory modal will appear
AND reward item(s) will be distributed to the players located at that base

### Scenario: I close a victory modal
GIVEN I am a player
AND I have started the game
AND I have just defeated an enemy base
AND I am viewing a victory modal
WHEN I close that victory modal
THEN the modal will close
AND that enemy base will no longer have the ability to take a turn, or have damage dealt to it
AND that enemy base will no longer have a hover state

### Scenario: The boss enemy base is defeated
GIVEN I am a player
AND I have started the game
AND there is an opened enemy base
AND that enemy base has more than 0 life total
AND one or more players are located at that base
WHEN I deal damage to the enemy base
AND that causes the enemy life total to drop to 0 or below 0
AND that enemy is a boss
THEN a victory modal will appear
AND the modal will initially be in a loading state
AND the modal will populate with an AI-generated game epilogue once it is finished loading
AND that epilogue will contain elements related to the game commander(s)
AND that epilogue will contain elements related to the map elements
AND that epilogue will contain references to the actions taken during the game
