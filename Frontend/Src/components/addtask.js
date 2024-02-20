import React, { useState } from 'react';
import axios from 'axios';


function AddTask({ setTasks }) {
  const [taskName, setTaskName] = useState('');


    const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:3001/tasks', {
        name: taskName,
        completed: false,
        // Set the completionDate or any other required fields
    })
    .then(response => {
        console.log(response.data);
        // Update tasks state in App component or fetch new list
    })
    .catch(error => console.error('There was an error!', error));
    };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
        placeholder="Enter task name"
      />
      <button type="submit">Add Task</button>
    </form>
  );
}

export default AddTask;
