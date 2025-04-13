
import { Task } from '@/types/task';

interface TaskListProps {
    tasks: Task[];
}

const TaskList: React.FC<TaskListProps> = ({ tasks }) => {
    return (
        <div className="w-full max-w-md p-4 rounded-lg border">
            <h2 className="text-lg font-bold mb-2">タスクリスト</h2>
            {tasks.length === 0 ? (
                <p className="text-sm text-gray-500">タスクはまだありません。</p>
            ) : (
                <ul>
                    {tasks.map((task) => (
                        <li key={task.id} className="mb-2 p-2 rounded border">
                            <p className="font-bold">{task.description}</p>
                            <p className="text-sm">締め切り: {new Date(task.deadline).toLocaleDateString()}</p>
                            <p className="text-sm">優先度: {task.priority}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default TaskList;
