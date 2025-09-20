'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Info } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { calculateSuccessRate } from '../_utils/simulate';
import { basePath } from '../_utils/utils';

const formSchema = z.object({
  goal: z.number().min(20000),
  dice: z.number().min(1),
  tileOn: z.number().min(0).max(23).optional(),
  current: z.number().optional(),
  rollsDone: z.number().optional(),
});

interface ChanceCalculatorCardProps {
  className?: string;
}
export default function ChanceCalculatorCard({
  className,
}: ChanceCalculatorCardProps) {
  const [showInfo, setShowInfo] = useState(false);
  const resultRef = useRef<HTMLDivElement | null>(null);
  const [result, setResult] = useState<number | undefined>();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      goal: NaN,
      dice: NaN,
      tileOn: undefined,
      current: undefined,
      rollsDone: undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const successRate = await new Promise<number>((resolve) =>
      setTimeout(
        () =>
          resolve(
            calculateSuccessRate(
              values.goal,
              values.dice,
              values.current,
              values.rollsDone,
              values.tileOn
            )
          ),
        0
      )
    );
    setResult(successRate);
  }

  useEffect(() => {
    if (result && resultRef) {
      resultRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [result]);

  return (
    <Card className={className}>
      <CardHeader>
        <div className='flex items-center'>
          <span className='text-lg font-bold'>Success Rate Calculator</span>
          <CardAction>
            <Button
              variant='ghost'
              size='icon'
              onClick={() => setShowInfo(!showInfo)}
            >
              <Info />
            </Button>
          </CardAction>
        </div>
      </CardHeader>
      <CardContent>
        {showInfo && (
          <div className='mb-4 p-2 bg-secondary border rounded-lg text-sm'>
            <h3 className='font-semibold mb-2'>How to use:</h3>
            <ul className='space-y-1 list-disc pl-4'>
              <li>{`Fill in the fields`}</li>
              <li>Press Calculate</li>
              <li>See image below for tile numbers</li>
            </ul>
            <Image
              src={`${basePath}/NumberedTiles.jpeg`}
              alt='Map with tiles labeled by numbers'
              width={300}
              height={350}
              unoptimized
            />
          </div>
        )}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4'
          >
            <FormField
              control={form.control}
              name='goal'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Goal Points</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      step={1}
                      placeholder='# of Points'
                      {...field}
                      value={!field.value ? '' : `${field.value}`}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? parseInt(e.target.value) : 0
                        )
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    This is the points you are aiming for.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='dice'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dice</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      step={1}
                      placeholder='# of Dice'
                      {...field}
                      value={!field.value ? '' : `${field.value}`}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? parseInt(e.target.value) : 0
                        )
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    This is the amount of dice you have. Collect all of your
                    dice from tasks + milestones.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='tileOn'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{`Current Tile (Optional)`}</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      step={1}
                      placeholder='Tile #'
                      {...field}
                      value={
                        field.value === 0
                          ? '0'
                          : !field.value
                          ? ''
                          : `${field.value}`
                      }
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? parseInt(e.target.value) : undefined
                        )
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    This is the tile you are on. If left empty, we assume 0.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='current'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{`Current Points (Optional)`}</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      step={1}
                      placeholder='# of Points'
                      {...field}
                      value={!field.value ? '' : `${field.value}`}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? parseInt(e.target.value) : undefined
                        )
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    This is the number of points you currently have.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='rollsDone'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{`Rolls Done (Optional)`}</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      step={1}
                      placeholder='# of Rolls Done'
                      {...field}
                      value={!field.value ? '' : `${field.value}`}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? parseInt(e.target.value) : undefined
                        )
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    This is the number of rolls you have already done. Check the
                    Tasks in game.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type='submit'
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? 'Calculating...' : 'Calculate'}
            </Button>
          </form>
        </Form>
        {result && (
          <div
            ref={resultRef}
            className='text-lg mt-2'
          >
            <span>Chance of achieving goal: {result.toFixed(2)}%</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
