import React, { useEffect, useState } from "react";
import axios from "axios";
import './home.css';
// const backendApi = "https://quaint-blue-penguin.cyclic.app/api/v1";
const backendApi = "http://localhost:8000";
const Home = () => {

  const [newTask, setNewTask] = useState("");
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editTask, setEditTask] = useState({ id: null, value: "", isCompleted: null, data_of_creation: null });

  const backgroundColor = ["rgb(32, 90, 207)", "rgb(225, 228, 234)"];

  useEffect(() => {
    const getData = async () => {
      const res = await axios.get(`${backendApi}/toDoList`);
      setDataList(res.data);
      setLoading(false);
    }
    getData();
  }, [loading]);


  const addIntoList = (e) => {
    setNewTask(e.target.value);
  }

  const addToDo = async () => {
    try {
      if (newTask.trim() === "") return alert("Task should not be empty.");

      const result = await axios.post(`${backendApi}/toDoList`,
        { task: newTask.trim(), isCompleted: false, data_of_creation: new Date().toLocaleDateString() });

      setDataList([...dataList, result.data]);
      setNewTask("");
      alert("Task added successfully.");
    }
    catch (error) {
      console.log("error at adding to do", error);
    }
  };

  const deleteToDo = async (taskId) => {
    try {
      await axios.delete(`${backendApi}/toDoList/${taskId}`);
      const updatedTasks = dataList.filter((task) => task.id !== taskId);

      setDataList(updatedTasks);
      alert("Task deleted successfully.");
    }
    catch (error) {
      console.log(error);
    }
  };

  const setEditData = (taskId, taskValue, isCompleted, data_of_creation) => {
    setEditTask({ id: taskId, value: taskValue, isCompleted, data_of_creation});
  };

  const editToDo = async () => {
    try {
      if (editTask.value.trim() === "") return alert("Task should not be empty.");
      const updatedData = await axios.put(`${backendApi}/toDoList/${editTask.id}`,
        {
          task: editTask.value.trim(), isCompleted: editTask.isCompleted,
          data_of_creation: editTask.data_of_creation
        });

      const updatedDataList = dataList.map((task) =>
        task.id === editTask.id ? updatedData.data : task
      );

      setDataList(updatedDataList);
      setEditTask({ id: null, value: "" });
      alert("Task edited successfully.");
    } catch (error) {
      console.error(error);
    }
  };

  const toggleTaskCompletion = async (task, taskId, isCompleted, data_of_creation) => {
    try {
      const updatedTask = await axios.put(`${backendApi}/toDoList/${taskId}`,
        { task: task.trim(), isCompleted: !isCompleted, data_of_creation });

      const updatedDataList = dataList.map((task) =>
        task.id === taskId ? updatedTask.data : task);
      setDataList(updatedDataList);
      if(!isCompleted){
        alert("Task marked as completed");
      }
      else{
        alert("Task marked as not completed");
      }
      alert(`Task marked as ${!isCompleted ? 'completed' : 'not completed'}`);

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="to-do-heading">
        <h1 >My-To-Do-List</h1>
      </div>
      <div className="to-do-list">
        <div className="input-area">
          <input type="text" className="text-field" placeholder="Add a new task" value={newTask} onChange={addIntoList} />
          <button style={{ backgroundColor: backgroundColor[0] }} onClick={addToDo}>+</button>
        </div>
        <div className="show-list-item">
          {
            dataList?.length > 0 ? (
              dataList?.map((item) => {
                if (item === "") return null;
                return (
                  <div className="each-item">
                    <sup style={{ fontFamily:"cursive", color:"blue", fontSize:"12px"}}>{item?.data_of_creation}</sup>
                    <input className="checkbox"
                      type="checkbox"
                      checked={item?.isCompleted}
                      onChange={() =>
                        toggleTaskCompletion(item?.task, item?.id, item?.isCompleted, item?.data_of_creation)
                      }
                    />
                    {editTask?.id === item?.id ? (
                      <>
                        <input
                          type="text"
                          value={editTask?.value}
                          onChange={(e) =>
                            setEditTask({
                              id: editTask?.id, value: e.target.value,
                              isCompleted: item?.isCompleted, data_of_creation: item?.data_of_creation
                            })
                          }
                        />
                        <button onClick={editToDo} style={{ backgroundColor: backgroundColor[1], color: "green" , 
                        fontSize: "14px", marginLeft: "5px", marginTop: "-1px", border: "2px solid black",
                         borderRadius: "5px", padding: "5px"}}
                        >Save</button>
                      </>
                    ) : (
                      <>
                        <li>{item?.task}</li>
                        <button
                          style={{ backgroundColor: backgroundColor[1], color: "green" , fontSize: "13px" }}
                          onClick={() => setEditData(item?.id, item?.task, item?.isCompleted, item?.data_of_creation)}
                        >
                          Edit
                        </button>
                        <button
                          style={{ backgroundColor: backgroundColor[1], color: "red" }}
                          onClick={() => deleteToDo(item?.id)}
                        >
                          x
                        </button>
                      </>
                    )}
                  </div>
                );
              })
            ) : (<h1> No task in the To-Do-List</h1>)
          }
        </div>
      </div>
    </>
  );
}

export default Home