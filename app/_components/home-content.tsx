'use client';

import ChanceCalculatorCard from './chance-calc-card';
import ShouldRollCard from './should-roll-card';

export default function HomeContent() {
  return (
    <div className='flex justify-center'>
      <div className='max-w-md flex flex-col gap-4'>
        <ShouldRollCard />
        <ChanceCalculatorCard />
      </div>
    </div>
  );
}
