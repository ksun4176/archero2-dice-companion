import { randint, weightedChoice } from './utils';

/**
 * Stats tracked throughout a simulation run.
 */
enum Stat {
  POINTS = 'Points',
  ROLLS_DONE = 'Rolls Done',
  INITIAL_DICE = 'Initial Dice',
  EXTRA_DICE = 'Extra Dice',
  // GEMS = "Gems",
  // CHROMA = "Chromatic Keys",
  // WISHES = "Wish Coins",
  // SHOVELS = "Rune Shovels",
  // PROMISE = "Promise Shovels",
  // OTTA = "Otta Shards",
  // GOLD = "Gold Coins",
  TILE = 'Tile',
}

/**
 * Tracks results of a single simulation run, including points, dice gained/spent.
 */
class SimResult {
  static pointsBreakpoints: number[] = [0, 20000, 40000, 60000, 80000]
    .map((s) => [2000, 5000, 8000, 12000, 16000, 20000].map((bp) => bp + s))
    .flat();

  static rollDiceTaskBreakpoints: number[] = [
    5, 10, 20, 30, 40, 60, 80, 100, 150, 200, 250, 300, 350, 400, 450, 500, 600,
  ];
  static rollDiceTaskReward: number[] = [
    1, 2, 2, 2, 2, 3, 3, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
  ];

  pointsBpMet: number = -1;
  rollDiceBpMet: number = -1;
  stats: Record<Stat, number>;

  constructor() {
    this.stats = {} as Record<Stat, number>;
    Object.values(Stat).forEach((s) => (this.stats[s] = 0));
  }

  /**
   * Add points to the simulation result and check for milestone rewards.
   * @param numPoints - Number of points gained
   */
  addPoints(numPoints: number) {
    if (numPoints <= 0) return 0;
    this.stats[Stat.POINTS] += numPoints;
    let numDice = 0;

    for (
      let i = this.pointsBpMet + 1;
      i < SimResult.pointsBreakpoints.length;
      i++
    ) {
      const bp = SimResult.pointsBreakpoints[i];
      if (this.stats[Stat.POINTS] < bp) break;
      this.pointsBpMet = i;
      numDice += 2;
    }
    this.stats[Stat.EXTRA_DICE] += numDice;
  }

  /**
   * Add dice rolls and check for roll-task milestone rewards.
   * @param numRolls - Number of dice rolled
   */
  addRolls(numRolls: number) {
    if (numRolls <= 0) return 0;
    this.stats[Stat.ROLLS_DONE] += numRolls;

    if (this.stats[Stat.EXTRA_DICE] <= numRolls) {
      this.stats[Stat.INITIAL_DICE] += numRolls - this.stats[Stat.EXTRA_DICE];
    }
    this.stats[Stat.EXTRA_DICE] = Math.max(
      0,
      this.stats[Stat.EXTRA_DICE] - numRolls
    );

    let numDice = 0;
    for (
      let i = this.rollDiceBpMet + 1;
      i < SimResult.rollDiceTaskBreakpoints.length;
      i++
    ) {
      const bp = SimResult.rollDiceTaskBreakpoints[i];
      if (this.stats[Stat.ROLLS_DONE] < bp) break;
      this.rollDiceBpMet = i;
      numDice += SimResult.rollDiceTaskReward[i];
    }
    this.stats[Stat.EXTRA_DICE] += numDice;
  }
}

/**
 * Abstract class representing a board tile.
 */
abstract class Tile {
  /**
   * Roll two dice and increment roll counters.
   * @param multiplier - Multiplier for rolls
   * @param result - Current simulation result
   * @returns Sum of two dice rolls
   */
  roll(multiplier: number, result: SimResult): number {
    result.addRolls(multiplier);
    return randint(1, 6) + randint(1, 6);
  }

  /**
   * Apply rewards from this tile.
   * @param multiplier - Tile multiplier
   * @param result - Current simulation result
   */
  abstract getReward(multiplier: number, result: SimResult): void;
}

/**
 * Flat reward tile (points, gems, dice).
 */
class FlatTile extends Tile {
  constructor(public points = 0, public gems = 0, public dice = 0) {
    super();
  }

  getReward(multiplier: number, result: SimResult) {
    result.addPoints(this.points * multiplier);
    // result.stats[Stat.GEMS] += this.gems * multiplier;
    result.stats[Stat.EXTRA_DICE] += this.dice * multiplier;
  }
}

/**
 * Grand prize tile with weighted random rewards.
 */
class GrandPrizeTile extends Tile {
  getReward(multiplier: number, result: SimResult) {
    const prizes = [
      // { prize: Stat.CHROMA, amount: 2 },
      // { prize: Stat.WISHES, amount: 1 },
      // { prize: Stat.GEMS, amount: 100 },
      // { prize: Stat.PROMISE, amount: 1 },
      { prize: null, amount: 0 },
      { prize: Stat.EXTRA_DICE, amount: 2 },
      { prize: Stat.EXTRA_DICE, amount: 1 },
    ];
    const weights = [666 + 2666 + 2666 + 666, 666, 2666];
    const spin = weightedChoice(prizes, weights);
    if (spin.prize) {
      result.stats[spin.prize] += spin.amount * multiplier;
    }
  }
}

/**
 * Point wheel tile with weighted point & multiplier outcomes.
 */
class PointWheelTile extends Tile {
  getReward(multiplier: number, result: SimResult) {
    const points = [100, 200, 500, 1000];
    const pointsWeights = [3478, 3478, 2608, 434];
    const spin = weightedChoice(points, pointsWeights);

    const multipliers = [1, 3, 5];
    const multipliersWeights = [6153, 3076, 769];
    const spin2 = weightedChoice(multipliers, multipliersWeights);

    result.addPoints(spin * spin2 * multiplier);
  }
}

/**
 * Fate wheel tile with multiple possible outcomes.
 */
class FateWheelTile extends Tile {
  getReward(multiplier: number, result: SimResult) {
    const prizes = [
      { prize: Stat.POINTS, amount: 500 },
      // { prize: Stat.OTTA, amount: 2 },
      // { prize: Stat.WISHES, amount: 1 },
      { prize: Stat.EXTRA_DICE, amount: 1 },
      // { prize: Stat.GOLD, amount: 2000 },
      { prize: null, amount: 0 },
    ];
    const weights = [2500, /*300, 700,*/ 1500, 300 + 700 + 5000];
    const spin = weightedChoice(prizes, weights);

    if (spin.prize === Stat.POINTS) {
      result.addPoints(spin.amount * multiplier);
    } else if (spin.prize) {
      result.stats[spin.prize] += spin.amount * multiplier;
    }
  }
}

const board: Tile[] = [
  new FlatTile(400),
  new FlatTile(0, 50),
  new FlatTile(50),
  new FlatTile(400),
  new FlatTile(800),
  new FlatTile(50),
  new FlatTile(0, 0, 2),
  new FlatTile(0, 50),
  new GrandPrizeTile(),
  new FlatTile(),
  new PointWheelTile(),
  new FlatTile(50),
  new FlatTile(200),
  new FlatTile(),
  new FlatTile(0, 0, 2),
  new FlatTile(200),
  new FlatTile(800),
  new FlatTile(),
  new FlatTile(50),
  new FlatTile(200),
  new PointWheelTile(),
  new FlatTile(),
  new FateWheelTile(),
  new FlatTile(200),
];

const multiplierMap: number[] = [1,1,1,1,1,1,1,1,10,10,1,1,1,1,1,1,1,1,1,1,10,10,10,1];

/**
 * Simulate going around the board starting with a specified number of dice rolls.
 *
 * @param numDiceRolls - Number of dice to start with.
 * @param pointsToMeet - Number of points to aim for. Stops early if threshold is reached.
 * @param prevRun - Previous simulation result to continue from (optional).
 * @param skipNextBp - Whether to skip checking the next breakpoint logic (optional).
 * @returns Simulation result after playing with the given parameters.
 */
function simulateSingleRun(
  numDiceRolls: number,
  pointsToMeet: number,
  prevRun: SimResult | null = null,
): SimResult {
  const result = prevRun ?? new SimResult();
  while (
    result.stats[Stat.POINTS] < pointsToMeet &&
    numDiceRolls - result.stats[Stat.INITIAL_DICE] + result.stats[Stat.EXTRA_DICE] > 0
  ) {
    // turns left
    const numTurns = numDiceRolls - result.stats[Stat.INITIAL_DICE] + result.stats[Stat.EXTRA_DICE];

    // enforce multiplier caps by turns taken
    let multiplier = multiplierMap[result.stats[Stat.TILE]];
    if (numTurns < 20) multiplier = Math.min(1, multiplier);
    else if (numTurns < 30) multiplier = Math.min(2, multiplier);
    else if (numTurns < 50) multiplier = Math.min(3, multiplier);
    else if (numTurns < 100) multiplier = Math.min(5, multiplier);

    // roll and move
    const oldTile = board[result.stats[Stat.TILE]];
    const roll = oldTile.roll(multiplier, result);
    result.stats[Stat.TILE] = (result.stats[Stat.TILE] + roll) % board.length;

    // apply tile reward
    const tile = board[result.stats[Stat.TILE]];
    tile.getReward(multiplier, result);
  }

  // handle "just shy of breakpoint" edge case
  if (result.rollDiceBpMet < SimResult.rollDiceTaskBreakpoints.length - 1) {
    const nextDiceBp = SimResult.rollDiceTaskBreakpoints[result.rollDiceBpMet + 1];
    const nextDiceBpReward = SimResult.rollDiceTaskReward[result.rollDiceBpMet + 1];
    if (nextDiceBp - result.stats[Stat.ROLLS_DONE] < nextDiceBpReward) {
      let difference = nextDiceBp - result.stats[Stat.ROLLS_DONE];
      while (
        difference > 0 &&
        (result.stats[Stat.INITIAL_DICE] < numDiceRolls || result.stats[Stat.EXTRA_DICE] > 0)
      ) {
        const numTurns = numDiceRolls - result.stats[Stat.INITIAL_DICE] + result.stats[Stat.EXTRA_DICE];

        let multiplier = multiplierMap[result.stats[Stat.TILE]];
        if (numTurns < 20 || difference < 2) multiplier = Math.min(1, multiplier);
        else if (numTurns < 30 || difference < 3) multiplier = Math.min(2, multiplier);
        else if (numTurns < 50 || difference < 4) multiplier = Math.min(3, multiplier);
        else if (numTurns < 100 || difference < 6) multiplier = Math.min(5, multiplier);

        const oldTile = board[result.stats[Stat.TILE]];
        const roll = oldTile.roll(multiplier, result);
        result.stats[Stat.TILE] = (result.stats[Stat.TILE] + roll) % board.length;

        const tile = board[result.stats[Stat.TILE]];
        tile.getReward(multiplier, result);

        difference = nextDiceBp - result.stats[Stat.ROLLS_DONE];
      }
    }
  }

  return result;
}

/**
 * Run 10,000 simulations and calculate success rate of reaching a goal.
 *
 * @param goalPoints - The number of points to aim for.
 * @param numDice - The number of dice available.
 * @param currentPoints - Current number of points already held (default 0).
 * @param rollsDone - Number of rolls already done (default 0).
 * @param currentTile - The current tile index (default 0).
 * @returns Success rate (%) of hitting the goal points.
 */
export function calculateSuccessRate(
  goalPoints: number,
  numDice: number,
  currentPoints = 0,
  rollsDone = 0,
  currentTile = 0
): number {
  let numSuccess = 0;
  const numRuns = 10_000;

  for (let i = 0; i < numRuns; i++) {
    const initialResult = new SimResult();

    // add previous rolls, but reset free dice so it doesn’t spill over
    initialResult.addRolls(rollsDone);
    initialResult.stats[Stat.EXTRA_DICE] = 0;

    // add previous points, also reset free dice
    initialResult.addPoints(currentPoints);
    initialResult.stats[Stat.EXTRA_DICE] = 0;

    // set starting tile
    initialResult.stats[Stat.TILE] = currentTile;

    const run = simulateSingleRun(
      numDice + rollsDone,
      Infinity,
      initialResult
    );

    if (run.stats[Stat.POINTS] >= goalPoints) {
      numSuccess++;
    }
  }

  const successRate =
    (numSuccess === numRuns ? numRuns - 1 : numSuccess) / numRuns * 100;

  return successRate;
}