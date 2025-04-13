'use server';
/**
 * @fileOverview Subtask suggestion AI agent.
 *
 * - suggestSubtasks - A function that suggests subtasks for a given task.
 * - SuggestSubtasksInput - The input type for the suggestSubtasks function.
 * - SuggestSubtasksOutput - The return type for the suggestSubtasks function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const SuggestSubtasksInputSchema = z.object({
  taskDescription: z.string().describe('The description of the task to break down into subtasks.'),
});
export type SuggestSubtasksInput = z.infer<typeof SuggestSubtasksInputSchema>;

const SuggestSubtasksOutputSchema = z.object({
  subtasks: z.array(
    z.string().describe('A subtask that is part of the larger task.')
  ).describe('The list of subtasks suggested for the given task.'),
});
export type SuggestSubtasksOutput = z.infer<typeof SuggestSubtasksOutputSchema>;

export async function suggestSubtasks(input: SuggestSubtasksInput): Promise<SuggestSubtasksOutput> {
  return suggestSubtasksFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestSubtasksPrompt',
  input: {
    schema: z.object({
      taskDescription: z.string().describe('The description of the task to break down into subtasks.'),
    }),
  },
  output: {
    schema: z.object({
      subtasks: z.array(
        z.string().describe('A subtask that is part of the larger task.')
      ).describe('The list of subtasks suggested for the given task.'),
    }),
  },
  prompt: `You are a helpful assistant that suggests subtasks for a given task description.

Task Description: {{{taskDescription}}}

Suggest a list of subtasks that would be helpful to complete the task. Return the subtasks as a list of strings.
`,
});

const suggestSubtasksFlow = ai.defineFlow<
  typeof SuggestSubtasksInputSchema,
  typeof SuggestSubtasksOutputSchema
>(
  {
    name: 'suggestSubtasksFlow',
    inputSchema: SuggestSubtasksInputSchema,
    outputSchema: SuggestSubtasksOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
