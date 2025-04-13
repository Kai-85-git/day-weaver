
export type Task = {
    id: string;
    description: string;
    deadline: string;
    priority: 'high' | 'medium' | 'low';
    completed: boolean;
};
