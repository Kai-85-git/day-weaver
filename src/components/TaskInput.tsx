
"use client";

import { useState } from 'react';
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Task } from '@/types/task';

interface TaskInputProps {
    setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

const TaskInput: React.FC<TaskInputProps> = ({ setTasks }) => {
    const [description, setDescription] = useState('');
    const [deadline, setDeadline] = useState<Date | undefined>(undefined);
    const [priority, setPriority] = useState('medium');
    const { toast } = useToast()

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        if (!description || !deadline || !priority) {
            toast({
                title: "エラー",
                description: "すべてのフィールドを入力してください。",
                variant: "destructive",
            });
            return;
        }

        const newTask: Task = {
            id: Date.now().toString(),
            description,
            deadline: deadline.toISOString(),
            priority,
            completed: false,
        };

        setTasks((prevTasks) => [...prevTasks, newTask]);

        toast({
            title: "タスクを追加しました",
            description: `タスク: ${description} を追加しました!`,
        });

        setDescription('');
        setDeadline(undefined);
        setPriority('medium');
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-md p-4 rounded-lg border">
            <div>
                <Label htmlFor="description">説明</Label>
                <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="タスクの説明"
                />
            </div>
            <div>
                <Label>締め切り</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                                "w-[240px] justify-start text-left font-normal",
                                !deadline && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {deadline ? format(deadline, "PPP") : <span>日付を選択</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={deadline}
                            onSelect={setDeadline}
                            disabled={(date) =>
                                date < new Date()
                            }
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
            </div>
            <div>
                <Label htmlFor="priority">優先度</Label>
                <select
                    id="priority"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full p-2 rounded border"
                >
                    <option value="high">高</option>
                    <option value="medium">中</option>
                    <option value="low">低</option>
                </select>
            </div>
            <Button type="submit">タスクを追加</Button>
        </form>
    );
};

export default TaskInput;
