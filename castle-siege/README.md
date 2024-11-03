# MtG Castle Siege

## A new MtG format being developed by Mike Caputo of Kingston, NY (https://calamitybaygames.com)

### Background

1. I love MtG Commander
2. I love late-game RTS campaigns, where you face an enemy sprawled across a huge map
3. Is there a way to combine this experience, using standard MtG Commander decks?

### Overview

The players will use stanard MtG Commander decks for this game variant; and the game experience is cooperative. The game is played on different customized maps. Each map will contain nodes, and the players will travel from one node to the next. Each node will contain an enemy base that must be defeated before they can proceed. Finally, the players will have a powerful boss to defeat at the end.

The game ends when the boss is defeated, or when all players are defeated.

### Game Rules
- Players will be represented by some simple game piece on the map
- Each node represents an enemy base to deal with. The players cannot advance until they have removed the enemy base. The enemy base will function similarly to an AI magic player, but for simplicity will not have a "board state"
- Each turn, the player will play as normal.
  - They play lands, spells, creatures.
  - When they attack, the enemy has no blockers and casts no spells.
- On the "enemy turn", different things can happen:
  - They will play one spell, or multiple spells. They will be chosen from a random set.
  - Example: a red-colored enemy base might lightning bolt you. Or they could cast cataclysm, dealing 2 damage to all of your creatures.
  - They will attack with creatures. These will be represented by "invisible" token creatures.
  - Example: "They attack you with four 1/1 goblins" or "They attack you with three 3/3 giants with trample"
  - The idea is to represent a muscular enemy base, while minimizing board state complexity. The goal here is endurance, not complexity of board state. You as a player have a lot to punch through. Not all players might make it to the end.
  - Early enemy bases have smaller effects. Later enemy bases use huge spells (make you discard your hand, wipe all your creatures, etc) and dish out powerful attacks. By late game, you need to have a strong and varied board state which will let you recover and endure.
- When the enemy base is eliminated, a few things can happen:
  - Players will receive some small rewards for defeating the enemy base; mainly thematic tokens (Treasure tokens, Clue tokens, Food tokens, etc)
  - Future possibility: some global effect might get shut down. Will define and refine this idea later. _Example: Suppose some effect was in play: while you're in this swamp zone, each player loses 2 life during their upkeep. That effect could be shut down if a certain enemy base is defeated. This would facilitate branching maps._

### Long-term Goals
- This could be controlled via a web app, accessible by anyone
- A map editor could be built, allowing people to create and submit their own maps
- This would use a hexagonal map overlap, allowing for easy standardization of the map nodes.

### Game design ideas:
- Branching paths can lead to different strategies. There could be one amusing map where you can go to the Boss on turn one, but without a board state you'll get flattened. But there are different branching "back doors" that will let you build up your board state.
- There could be branches that force you to deal with enemy bases, but also gain reward bigger than usual. For example, there might be a storehouse area which you could battle, in order to get 10 food tokens. This could give you the staying power needed to make it to the end. And if your deck doesn't have lifegain, moreso. Could be similar things for clue tokens, flying creature tokens, etc.
- When there are multiple players on an enemy base at the same time, they take their turn together and attack together: two-headed giant rules
- This allows the players to boost each other; for example, an effect that reads "All attacking creatures get +2/+0 until end of turn" would apply to both players. It will also allow the players to weather the enemy attacks more easily, with shared blockers. But watch out, because enemy spells will affect them all as well! Ex, Pyroclasm.
When the enemy attacks, the players not only have shared blockers, but they also decide who gets dealt damage. So, if the enemy base deals 20 damage, and there are two players there with life totals of 30 and 10, the player with the 30 life total can take all of the 20 damage. This can allow players with low life total to continue to participate and be "shielded" by another player with higher life.
- When an enemy base is defeated and rewards are given, the players at that location choose how to distribute the rewards amongst themselves.
- Effects that read "Target player" can be used at any time. So, on your turn you can let other players gain life, draw cards, etc.

### Rule Clarifications
- Cards which read "Target Player" or "Target Opponent" can indeed target an enemy base
- Cards which read "Target Player" can target another player. So, you can use a Maze of Ith to help your ally one turn.
- But, cards which have global effects ("All creatures get -2/-2 until end of turn", "All players discard a card"), etc: these effects will only affect the enemy base and player(s) at the given node. Example: if a player casts Inferno to kill an enemy base's attacking creatures, it does not affect players outside of that node.
- When an enemy base attacks, their creatures are considered to _phase in_. They do not "enter the battlefield". So if you have a Soul Warden, and your enemy base attacks you with 8 goblins, you do not gain 8 life. _Similarly_, any unkilled enemy creatures _phase out_. They do not exit the battlefield.

## Technical Notes

1. Uses Scryfall API to fetch card data: https://scryfall.com/docs/api
2. **For this project, documentation is more important than code quality.** Writing this on Aug 28: now that I'm working full time, plus taking care of Luca, I have very little time for this project. So, it's more important that I write good PR descriptions and BDD tests so that I can quickly get back into context. Code quality, especially optimizations, is not the top priority because this is being used by a _very_ tiny audience right now.

## Map Creation Notes

1. Hex setup: to help get the hex coordinates, un-comment `console.log(`clicked a hex: column and row is  is: [${col},${row}]`)` in Hex.jsx. Then, you can click on all of the hexes you want, and they will populate into the console. You can then grab this data to edit or create maps.
2. Background image:
  - Start at https://scryfall.com/
  - Search for the card image you want. If you are looking at a card list, you can browse and navigate to the print you want. If you are looking at an individual card, look for the link "View all prints" so you can view all prints.
  - Once you have the image you want, right-click and open the card image in a ne wtab. Example url: `https://cards.scryfall.io/large/front/2/7/279df7e2-2a3b-464a-a7df-e91da28e3a8c.jpg?1730489639`.
  - Then you can grab the uuid from that value (in this case, `279df7e2-2a3b-464a-a7df-e91da28e3a8c`), and use that to populate the map's `backgroundImageScryfallCardId` value.

## Copyright

1. Magic the Gathering is &copy; Wizards of the Coast / Hasbro
2. Castle Siege and the materials for this variant are &copy; Calamity Bay Games
