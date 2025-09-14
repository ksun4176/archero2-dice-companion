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
import { Label } from '@/components/ui/label';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { zodResolver } from '@hookform/resolvers/zod';
import { Info, Undo2, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { ControllerRenderProps, useForm } from 'react-hook-form';
import { z } from 'zod';
import { calculateSuccessRate } from '../_utils/simulate';
import { calculateNetDiceUsed } from '../_utils/utils';

const formSchema = z.object({
  totalRolls: z.number().min(1),
  pointsAchieved: z.number().min(0),
  diceFromBoard: z.number().min(0),
});

type Result = {
  points: number;
  diceUsed: number;
  percentile: number;
};

type StoredState = {
  diceFromBoard: number;
  diceAddedStack: number[];
};

interface RunTrackerCardProps {
  className?: string;
}
export default function RunTrackerCard({ className }: RunTrackerCardProps) {
  const [showInfo, setShowInfo] = useState(false);
  const resultRef = useRef<HTMLDivElement | null>(null);
  const [result, setResult] = useState<Result | undefined>();
  const [multiplier, setMultiplier] = useState<number>(1);
  const [diceAddedStack, setDiceAddedStack] = useState<number[]>([]);
  const [confirmReset, setConfirmReset] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      totalRolls: NaN,
      pointsAchieved: NaN,
      diceFromBoard: 0,
    },
  });

  // Load state from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('diceTrackerDiceUsed');
    if (saved) {
      try {
        const data = JSON.parse(saved) as StoredState;
        if (data.diceAddedStack) {
          setDiceAddedStack(data.diceAddedStack);
        }
        if (data.diceFromBoard) {
          form.setValue('diceFromBoard', data.diceFromBoard);
        }
      } catch {
        console.warn('Failed to load saved state');
      }
    }
  }, [form]);
  // Save state to localStorage whenever it changes
  useEffect(() => {
    const state: StoredState = {
      diceFromBoard: form.getValues().diceFromBoard,
      diceAddedStack: diceAddedStack,
    };
    localStorage.setItem('diceTrackerDiceUsed', JSON.stringify(state));
  }, [form, diceAddedStack]);

  useEffect(() => {
    if (result && resultRef) {
      resultRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [result]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const diceUsed = calculateNetDiceUsed(
      values.totalRolls,
      values.pointsAchieved,
      values.diceFromBoard
    );
    const successRate = await new Promise<number>((resolve) =>
      setTimeout(
        () => resolve(calculateSuccessRate(values.pointsAchieved, diceUsed)),
        0
      )
    );
    setResult({
      points: values.pointsAchieved,
      diceUsed,
      percentile: 100 - successRate,
    });
  }

  const updateDiceFromBoard = (
    field: ControllerRenderProps<z.infer<typeof formSchema>, 'diceFromBoard'>,
    newValue: number
  ) => {
    field.onChange((field.value += newValue));
    setDiceAddedStack((oldStack) => {
      const newStack = [...oldStack];
      newStack.push(newValue);
      return newStack;
    });
  };

  const undoLastDiceAdded = () => {
    const lastAdded = diceAddedStack.pop();
    if (lastAdded) {
      form.setValue(
        'diceFromBoard',
        form.getValues().diceFromBoard - lastAdded
      );
      setDiceAddedStack([...diceAddedStack]);
    }
  };

  const resetDiceAdded = () => {
    form.setValue('diceFromBoard', 0);
    setDiceAddedStack([]);
    setConfirmReset(false);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className='flex items-center'>
          <span className='text-lg font-bold'>Track How My Run Went</span>
          <CardAction className='flex-1'>
            <div className='flex items-center justify-between'>
              <Button
                variant='ghost'
                size='icon'
                onClick={() => setShowInfo(!showInfo)}
              >
                <Info />
              </Button>
              {confirmReset ? (
                <Button
                  onClick={resetDiceAdded}
                  variant='destructive'
                  aria-label='Confirm reset'
                >
                  Confirm
                </Button>
              ) : (
                <Button
                  onClick={() => setConfirmReset(true)}
                  variant='ghost'
                  aria-label='Reset dice from board'
                  disabled={diceAddedStack.length <= 0}
                >
                  <X />
                  Reset Dice
                </Button>
              )}
            </div>
          </CardAction>
        </div>
      </CardHeader>
      <CardContent>
        {showInfo && (
          <div className='mb-4 p-2 bg-secondary border rounded-lg text-sm'>
            <h3 className='font-semibold mb-2'>How to use:</h3>
            <ul className='space-y-1 list-disc pl-4'>
              <li>
                As you do your run, track how many dice you are getting from the
                board.
                <ul className='space-y-1 list-disc pl-4'>
                  <li>Pick the multiplier that matches your roll</li>
                  <li>Add the amount of dice you got as a reward</li>
                </ul>
              </li>
              <li>
                At the end of your run, put in how many points you got and how
                many rolls you did in total
              </li>
              <li>Press Calculate</li>
            </ul>
          </div>
        )}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4'
          >
            <FormField
              control={form.control}
              name='diceFromBoard'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dice From Board ({field.value})</FormLabel>
                  <FormControl>
                    <div className='flex flex-col gap-2'>
                      <div className='space-y-1'>
                        <Label>Multiplier</Label>
                        <ToggleGroup
                          variant='outline'
                          type='single'
                          value={`${multiplier}`}
                          onValueChange={(newValue) =>
                            newValue && setMultiplier(parseInt(newValue))
                          }
                          className='w-full'
                        >
                          <ToggleGroupItem value='1'>1x</ToggleGroupItem>
                          <ToggleGroupItem value='2'>2x</ToggleGroupItem>
                          <ToggleGroupItem value='3'>3x</ToggleGroupItem>
                          <ToggleGroupItem value='5'>5x</ToggleGroupItem>
                          <ToggleGroupItem value='10'>10x</ToggleGroupItem>
                        </ToggleGroup>
                      </div>
                      <div className='space-y-1'>
                        <Label>Dice to Add</Label>
                        <div className='flex gap-1'>
                          <Button
                            className='flex-2 bg-success'
                            type='button'
                            onClick={() =>
                              updateDiceFromBoard(field, multiplier)
                            }
                          >
                            {multiplier} Dice
                          </Button>
                          <Button
                            className='flex-2 bg-success'
                            type='button'
                            onClick={() =>
                              updateDiceFromBoard(field, multiplier * 2)
                            }
                          >
                            {multiplier * 2} Dice
                          </Button>
                          <Button
                            variant='secondary'
                            className='flex-1'
                            type='button'
                            disabled={diceAddedStack.length <= 0}
                            onClick={undoLastDiceAdded}
                          >
                            <Undo2 size={14} />
                            Undo
                          </Button>
                        </div>
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Dice you have collected directly from board tiles.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='pointsAchieved'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Points Achieved</FormLabel>
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
                    The total points you have earned so far.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='totalRolls'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Rolls</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      step={1}
                      placeholder='# of rolls'
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
                    The total number of dice rolls you have done. Check your
                    tasks.
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
            className='text-lg mt-2 flex flex-col gap-1'
          >
            <div className='flex justify-between'>
              <span>Points Achieved</span>
              <span>{result.points}</span>
            </div>
            <div className='flex justify-between'>
              <span>Net Dice Used</span>
              <span>{result.diceUsed}</span>
            </div>
            <div className='flex justify-between'>
              <span>Points per Initial Dice</span>
              <span>{(result.points / result.diceUsed).toFixed(2)}</span>
            </div>
            <div className='flex justify-between'>
              <span>Percentile</span>
              <span
                className={
                  result.percentile >= 50
                    ? 'text-green-700 dark:text-green-300'
                    : 'text-red-700 dark:text-red-400'
                }
              >
                {result.percentile}%
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
