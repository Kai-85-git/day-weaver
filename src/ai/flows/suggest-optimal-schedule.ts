// src/ai/flows/suggest-optimal-schedule.ts
'use server';
/**
 * @fileOverview This file defines a Genkit flow for suggesting optimal task schedules.
 *
 * The flow takes a list of tasks with descriptions, deadlines, and priorities,
 * and uses an AI model to suggest optimal times to schedule each task.
 *
 * @module ai/flows/suggest-optimal-schedule
 *
 * @interface SuggestOptimalScheduleInput - The input type for the suggestOptimalSchedule function.
 * @interface SuggestOptimalScheduleOutput - The output type for the suggestOptimalSchedule function.
 * @function suggestOptimalSchedule - A function that takes task details and returns suggested schedule.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const SuggestOptimalScheduleInputSchema = z.object({
  tasks: z.array(
    z.object({
      description: z.string().describe('The description of the task.'),
      deadline: z.string().describe('The deadline for the task (e.g., YYYY-MM-DD HH:mm).'),
      priority: z
        .enum(['high', 'medium', 'low'])
        .describe('The priority level of the task.'),
      estimatedTime: z
        .string()
        .describe('Estimated time in minutes that the task will take.'),
    })
  ).describe('A list of tasks to schedule.'),
});
export type SuggestOptimalScheduleInput = z.infer<typeof SuggestOptimalScheduleInputSchema>;

const SuggestOptimalScheduleOutputSchema = z.object({
  schedule: z.array(
    z.object({
      taskDescription: z.string().describe('The description of the task.'),
      suggestedTime: z.string().describe('The suggested time to schedule the task (e.g., YYYY-MM-DD HH:mm).'),
      reasoning: z.string().describe('Reasoning for choosing the suggested time slot.'),
    })
  ).describe('The suggested schedule with specific times for each task.'),
});
export type SuggestOptimalScheduleOutput = z.infer<typeof SuggestOptimalScheduleOutputSchema>;

export async function suggestOptimalSchedule(
  input: SuggestOptimalScheduleInput
): Promise<SuggestOptimalScheduleOutput> {
  return suggestOptimalScheduleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestOptimalSchedulePrompt',
  input: {
    schema: z.object({
      tasks: z.array(
        z.object({
          description: z.string().describe('The description of the task.'),
          deadline: z.string().describe('The deadline for the task (e.g., YYYY-MM-DD HH:mm).'),
          priority: z
            .enum(['high', 'medium', 'low'])
            .describe('The priority level of the task.'),
          estimatedTime: z
            .string()
            .describe('Estimated time in minutes that the task will take.'),
        })
      ).describe('A list of tasks to schedule.'),
    }),
  },
  output: {
    schema: z.object({
      schedule: z.array(
        z.object({
          taskDescription: z.string().describe('The description of the task.'),
          suggestedTime: z.string().describe('The suggested time to schedule the task (e.g., YYYY-MM-DD HH:mm).'),
          reasoning: z.string().describe('Reasoning for choosing the suggested time slot.'),
        })
      ).describe('The suggested schedule with specific times for each task.'),
    }),
  },
  prompt: `Given the following list of tasks, their deadlines, priorities and estimated time, suggest an optimal schedule. Return the schedule in JSON format.

Tasks:
{{#each tasks}}
- Description: {{{description}}}, Deadline: {{{deadline}}}, Priority: {{{priority}}}, Estimated Time: {{{estimatedTime}}} minutes
{{/each}}

Consider the priority and deadlines of each task when creating the schedule. High priority tasks with earlier deadlines should be scheduled first.
For each task include a brief reasoning for the suggested time slot.
`,
});

const suggestOptimalScheduleFlow = ai.defineFlow<
  typeof SuggestOptimalScheduleInputSchema,
  typeof SuggestOptimalScheduleOutputSchema
>(
  {
    name: 'suggestOptimalScheduleFlow',
    inputSchema: SuggestOptimalScheduleInputSchema,
    outputSchema: SuggestOptimalScheduleOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
