'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
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
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { findDiceForSuccessRate } from '../_utils/simulate';

const formSchema = z.object({
  goal: z.number().min(20000),
  successRate: z.number().min(50).lt(100),
});

interface ShouldRollCardProps {
  className?: string;
}
export default function ShouldRollCard({ className }: ShouldRollCardProps) {
  const resultRef = useRef<HTMLDivElement | null>(null);
  const [result, setResult] = useState<number | undefined>();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      goal: NaN,
      successRate: 98.69,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const numDice = await new Promise<number>((resolve) =>
      setTimeout(
        () => resolve(findDiceForSuccessRate(values.goal, values.successRate)),
        0
      )
    );
    setResult(numDice);
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
          <span className='text-lg font-bold'>Should I Roll?</span>
        </div>
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
              name='successRate'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chance to reach Goal</FormLabel>
                  <FormControl>
                    <div className='flex items-center gap-2'>
                      <Input
                        type='number'
                        step={0.01}
                        placeholder='Chance of success'
                        {...field}
                        value={!field.value ? '' : `${field.value}`}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? parseFloat(e.target.value) : 0
                          )
                        }
                      />
                      <span>%</span>
                    </div>
                  </FormControl>
                  <FormDescription>
                    {`Enter the desired probability of success (as a percentage) for reaching your goal.`}
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
            <span>You need {result} dice</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
