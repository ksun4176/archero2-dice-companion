'use client';

import { Button } from '@/components/ui/button';
import { BookAlert } from 'lucide-react';
import { useState } from 'react';
import QuestTrackerButton from './quest-tracker-button';
import MonopolyMap from './MonopolyMap';

export default function GuideButtonContent() {
  const [showGuide, setShowGuide] = useState(false);

  return (
    <div>
      <div className='flex gap-2'>
        <Button
          variant='outline'
          size='lg'
          className='flex-1 h-15 text-lg'
          onClick={() => setShowGuide(!showGuide)}
        >
          <BookAlert
            size='6'
            className='size-6'
          />
          How To Guide
        </Button>
        <QuestTrackerButton />
      </div>

      {showGuide && (
        <div className='mt-4 p-3 bg-secondary border rounded-lg text-sm'>
          <h3 className='font-semibold'>How to use the map</h3>
          <ol className='list-decimal pl-5'>
            <li>Find your tile on the map</li>
            <li>Set multiplier to match (ideally 10x)</li>
            <li>Roll and repeat</li>
            <li>Track dice from board below</li>
          </ol>
          <MonopolyMap
            multipliers={[
              1, 1, 1, 1, 1, 1, 1, 1, 10, 10, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 10,
              10, 10, 1,
            ]}
          />
        </div>
      )}
    </div>
  );
}
