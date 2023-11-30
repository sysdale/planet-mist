import axios from "axios";
import { useState, useEffect } from "react";

const API_URL = "http://localhost:1337/api/todos";

function App() {
  const [newTask, setNewTask] = useState("");
  const [allTasks, setAllTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      await axios.get(API_URL).then((response) => {
        setAllTasks(response.data.data);
      });
    } catch (error) {
      console.log("Error fetching", error);
    }
  };

  const addTask = async () => {
    try {
      await axios.post(API_URL, { data: { description: newTask } }).then(() => {
        setNewTask("");
        alert("Task added");
        fetchTasks();
      });
    } catch (error) {
      console.log("Error adding", error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`).then(() => {
        alert("Task Deleted");
        fetchTasks();
        // setAllTasks(allTasks.filter((task) => task.id !== id));
      });
    } catch (error) {
      console.log("Error deleting", error);
    }
  };

  const updateTask = async (id) => {
    try {
      await axios
        .put(`${API_URL}/${id}`, { data: { description: newTask } })
        .then(() => {
          alert("Task Updated");
          fetchTasks();
        });
    } catch (error) {
      console.log("Error updating", error);
    }
  };

  return (
    <div>
      <h1>To-Do App React+Strapi</h1>
      <div>
        <input
          type="text"
          placeholder="Enter task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
      </div>

      <h4>Tasks List</h4>

      <div>
        {allTasks.map((item) => {
          return (
            <li key={item.id}>
              {item.attributes.description}
              {"    "}
              <button onClick={() => deleteTask(item.id)}>Del</button>
              {"    "}
              <button onClick={() => updateTask(item.id)}>Update</button>
            </li>
          );
        })}
      </div>

      <button onClick={addTask}>Add Task</button>
    </div>
  );
}

export default App;
