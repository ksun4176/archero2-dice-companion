'use client';

import ChanceCalculatorCard from './chance-calc-card';
import RunTrackerCard from './run-tracker-card';
import ShouldRollCard from './should-roll-card';

export default function HomeContent() {
  return (
    <div className='flex justify-center'>
      <div className='grid md:grid-cols-2 gap-4'>
        <div className='flex flex-col gap-4'>
          <ShouldRollCard />
          <RunTrackerCard />
        </div>
        <ChanceCalculatorCard />
      </div>
    </div>
  );
}
