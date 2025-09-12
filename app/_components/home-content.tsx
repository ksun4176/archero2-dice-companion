'use client';

import ChanceCalculatorCard from './chance-calc-card';

export default function HomeContent() {
  return (
    <div className='flex flex-col items-center'>
      <ChanceCalculatorCard className='max-w-md' />
    </div>
  );
}
