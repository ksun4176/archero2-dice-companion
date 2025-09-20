'use client';

import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

export default function AppBar() {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div>
      <div className='flex items-center mb-4 justify-between'>
        <h1 className='text-xl font-bold'>Dice Companion</h1>
        <div className='flex items-center'>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => setShowInfo(!showInfo)}
          >
            <Info size={20} />
          </Button>
          <a
            href='https://ko-fi.com/O4O71FBM0I'
            target='_blank'
          >
            <Image
              src='https://storage.ko-fi.com/cdn/kofi5.png?v=6'
              alt='Buy Me a Coffee at ko-fi.com'
              width={143}
              height={36}
              unoptimized
              className='h-9 border-0'
            />
          </a>
        </div>
      </div>
      {showInfo && (
        <div className='mb-4 p-2 bg-secondary border rounded-lg text-sm'>
          <h3 className='font-semibold mb-2'>How to use:</h3>
          <ul className='space-y-1 list-disc pl-4'>
            <li>Track the amount of dice you can still get</li>
            <li>Track your rolls</li>
            <li>
              Calculate your Points per Initial Dice to see how you did compared
              to others
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
