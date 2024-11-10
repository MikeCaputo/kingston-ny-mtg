export const gameRules = () => {

  return (`

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

  `);
}
