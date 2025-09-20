'use client';

import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import Image from 'next/image';
import QuestTrackerContent from './quest-tracker-content';

export default function QuestTrackerButton() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          variant='outline'
          size='lg'
          className='h-15 text-lg flex items-center'
          aria-label={`Open Task List`}
        >
          <Image
            src='/archero2-dice-companion/Icon_TaskCenter.png'
            alt='Icon Task Center'
            width={150}
            height={150}
            unoptimized
            className='size-7 border-0'
          />
          Quests
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Quest Tracker</DrawerTitle>
        </DrawerHeader>
        <div className='p-4 overflow-auto'>
          <QuestTrackerContent />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
