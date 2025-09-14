export enum QuestName {
  KillBosses = 'Kill Bosses',
  KillMinions = 'Kill Minions',
  GoldCave = 'Gold Cave',
  DailyLogin = 'Daily Login',
  ClaimAfkRewards = 'Claim AFK Rewards',
  SealBattle = 'Seal Battles',
  Arena = 'Arena',
  IslandPack2 = 'Island Pack 2',
  IslandPack3 = 'Island Pack 3',
  UseGems = 'Use Gems',
  Keys = 'Keys',
  Wishes = 'Wishes',
  Shovels = 'Shovels',
}

export type Quest = {
  name: QuestName;
  breakpoints: [number[], number[]];
  placeholderText: string;
};

export const Quests: Quest[] = [
  {
    name: QuestName.IslandPack2,
    breakpoints: [
      Array(7)
        .fill(0)
        .map((_v, index) => index + 1),
      Array(7).fill(1),
    ],
    placeholderText: '# Bought',
  },
  {
    name: QuestName.IslandPack3,
    breakpoints: [
      Array(7)
        .fill(0)
        .map((_v, index) => index + 1),
      Array(7).fill(5),
    ],
    placeholderText: '# Bought',
  },
  {
    name: QuestName.DailyLogin,
    breakpoints: [
      Array(5)
        .fill(0)
        .map((_v, index) => index + 1),
      Array(5).fill(2),
    ],
    placeholderText: '# Days',
  },
  {
    name: QuestName.GoldCave,
    breakpoints: [
      Array(4)
        .fill(0)
        .map((_v, index) => (index + 1) * 2),
      Array(4).fill(2),
    ],
    placeholderText: '# Done',
  },
  {
    name: QuestName.KillMinions,
    breakpoints: [
      Array(4)
        .fill(0)
        .map((_v, index) => (index + 1) * 500),
      Array(4).fill(1),
    ],
    placeholderText: '# Killed',
  },
  {
    name: QuestName.SealBattle,
    breakpoints: [
      Array(5)
        .fill(0)
        .map((_v, index) => (index + 1) * 2),
      Array(5).fill(2),
    ],
    placeholderText: '# Done',
  },
  {
    name: QuestName.KillBosses,
    breakpoints: [[5, 10, 20, 30], Array(4).fill(1)],
    placeholderText: '# Killed',
  },
  {
    name: QuestName.ClaimAfkRewards,
    breakpoints: [[3, 5, 10, 15, 20], Array(5).fill(1)],
    placeholderText: '# Collected',
  },
  {
    name: QuestName.Arena,
    breakpoints: [[3, 6, 10, 15, 20, 30], Array(6).fill(1)],
    placeholderText: '# Done',
  },
  {
    name: QuestName.Keys,
    breakpoints: [
      [1, 2, 3, 5, 10, 15, 20],
      [1, 1, 1, 1, 2, 2, 2],
    ],
    placeholderText: '# Used',
  },
  {
    name: QuestName.UseGems,
    breakpoints: [
      [200, 500, 1000, 2000, 3000, 4000, 6000, 8000, 10000],
      [1, 1, 1, 2, 2, 2, 2, 2, 2],
    ],
    placeholderText: '# Used',
  },
  {
    name: QuestName.Shovels,
    breakpoints: [
      [2, 4, 6, 10, 20, 30, 40],
      [2, 2, 2, 2, 2, 2, 2],
    ],
    placeholderText: '# Used',
  },
  {
    name: QuestName.Wishes,
    breakpoints: [
      [1, 2, 3, 5, 10, 15, 20],
      [2, 2, 2, 2, 2, 2, 2],
    ],
    placeholderText: '# Used',
  },
];

export const PointsBreakpoints: number[] = [0, 20000, 40000, 60000, 80000]
  .map((s) => [2000, 5000, 8000, 12000, 16000, 20000].map((bp) => bp + s))
  .flat();

export const PointsMilestoneReward: number[] = Array(
  PointsBreakpoints.length
).fill(2);

export const RollDiceTaskBreakpoints: number[] = [
  5, 10, 20, 30, 40, 60, 80, 100, 150, 200, 250, 300, 350, 400, 450, 500, 600,
];

export const RollDiceTaskReward: number[] = [
  1, 2, 2, 2, 2, 3, 3, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
];

/**
 * Return a random integer between min and max (inclusive).
 * @param min - Minimum integer value
 * @param max - Maximum integer value
 * @returns Random integer in [min, max]
 */
export function randint(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Selects one item from an array based on weights.
 * @template T
 * @param items - Array of items to choose from
 * @param weights - Array of weights (same length as items)
 * @returns Randomly selected item based on weight distribution
 */
export function weightedChoice<T>(items: T[], weights: number[]): T {
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < items.length; i++) {
    if (r < weights[i]) return items[i];
    r -= weights[i];
  }
  return items[items.length - 1];
}

/**
 * Calculate the net dice used based on total rolls, points achieved, and dice gained from the board.
 *
 * @param totalRolls - Total dice rolls done.
 * @param pointsAchieved - Total points achieved.
 * @param diceFromBoard - Dice gained directly from board tiles.
 * @returns Net dice used.
 */
export function calculateNetDiceUsed(
  totalRolls: number,
  pointsAchieved: number,
  diceFromBoard: number
): number {
  let rollDiceBonus = 0;
  for (let i = 0; i < RollDiceTaskBreakpoints.length; i++) {
    if (totalRolls < RollDiceTaskBreakpoints[i]) {
      break;
    }
    rollDiceBonus += RollDiceTaskReward[i];
  }
  let pointsBonus = 0;
  for (let i = 0; i < PointsBreakpoints.length; i++) {
    if (pointsAchieved < PointsBreakpoints[i]) {
      break;
    }
    pointsBonus += PointsMilestoneReward[i];
  }
  const netDiceUsed = totalRolls - diceFromBoard - rollDiceBonus - pointsBonus;
  return netDiceUsed;
}
