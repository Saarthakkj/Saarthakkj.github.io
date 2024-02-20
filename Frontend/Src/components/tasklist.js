import React from 'react';

function TaskList({ tasks, setTasks }) {
  // Placeholder for task list rendering
  return (
    <div>
      {tasks.map((task, index) => (
        <div key={index}>
          <p>{task.name}</p>
          {/* Additional task details here */}
        </div>
      ))}
    </div>
  );
}

export default TaskList;
