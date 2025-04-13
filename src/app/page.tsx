
"use client";

import TaskInput from '@/components/TaskInput';
import TaskList from '@/components/TaskList';
import { useState } from 'react';
import { Task } from '@/types/task';

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-2xl font-bold mb-4">Day Weaver</h1>
      <TaskInput setTasks={setTasks} />
      <TaskList tasks={tasks} />
    </div>
  );
}
