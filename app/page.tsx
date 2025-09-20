import { Button } from '@/components/ui/button';
import { BookAlert } from 'lucide-react';
import Image from 'next/image';
import AppBar from './_components/app-bar';
import ChanceCalculatorCard from './_components/chance-calc-card';
import RunTrackerCard from './_components/run-tracker-card';
import ShouldRollCard from './_components/should-roll-card';
import QuestTrackerButton from './_components/quest-tracker-button';

export default function Home() {
  return (
    <div className='min-w-sm max-w-7xl mx-auto p-4 min-h-screen'>
      <AppBar />
      <div className='flex justify-center'>
        <div className='grid md:grid-cols-2 gap-4'>
          <div className='flex flex-col gap-4'>
            <ShouldRollCard />
            <div className='flex gap-4'>
              <Button
                variant='outline'
                size='lg'
                className='h-15 flex-1 text-lg'
              >
                <BookAlert
                  size='6'
                  className='size-6'
                />
                How To Guide
              </Button>
              <QuestTrackerButton />
            </div>
            <RunTrackerCard />
          </div>
          <ChanceCalculatorCard />
        </div>
      </div>
    </div>
  );
}
