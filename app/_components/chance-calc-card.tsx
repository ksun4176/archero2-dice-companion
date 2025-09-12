'use client';

import { Button } from '@/components/ui/button';
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
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { calculateSuccessRate } from '../_utils/simulate';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useEffect, useRef, useState } from 'react';

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
      resultRef.current?.scrollIntoView();
    }
  }, [result]);

  return (
    <Card className={className}>
      <CardHeader>
        <span className='text-lg font-bold'>Success Rate Calculator</span>
      </CardHeader>
      <CardContent>
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
                    This is the amount of dice you have.
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
                  <FormLabel>Current Tile</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      step={1}
                      placeholder='Tile #'
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
                  <FormLabel>Current Points</FormLabel>
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
                  <FormLabel>Rolls Done</FormLabel>
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
