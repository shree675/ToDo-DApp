//@ts-check

import React, { useEffect, useState } from "react";
import { contractAddresses, abi } from "../constants";
import {
  useMoralis,
  useWeb3Contract,
  useWeb3ExecuteFunction,
} from "react-moralis";
import {
  Table,
  Avatar,
  Tag,
  Bin,
  Check,
  useNotification,
  Input,
  Button,
} from "web3uikit";

export default function Body() {
  const [data, setData] = useState([]);
  const [taskInput, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useNotification();

  let id, strId, address;

  const { chainId, isWeb3Enabled } = useMoralis();
  if (isWeb3Enabled) {
    id = parseInt(chainId ? chainId : "0x0");
    if (id === 1337) {
      id = 31337;
    }
    strId = id.toString();
    address = contractAddresses[strId][0];
  }

  const handleNewNotification = (message, type) => {
    dispatch({
      type: type,
      message: message,
      title: "Notification",
      position: "topR",
    });
  };

  let { runContractFunction: getTasks } = useWeb3Contract({
    abi: abi,
    contractAddress: address,
    functionName: "getTasks",
    params: {},
  });

  let {
    runContractFunction: addTask,
    isLoading,
    isFetching,
  } = useWeb3Contract({
    abi: abi,
    contractAddress: address,
    functionName: "addTask",
    params: {
      _name: taskInput,
    },
  });

  const { fetch } = useWeb3ExecuteFunction();

  const markCompleted = async (id) => {
    const options = {
      abi: abi,
      contractAddress: address,
      functionName: "completeTask",
      params: {
        id: id,
      },
    };
    setLoading(true);
    await fetch({
      params: options,
      onSuccess: async (tx) => {
        //@ts-ignore
        await tx.wait(1);
        setLoading(false);
        if (isWeb3Enabled) {
          await updateTasks();
        }
      },
    });
  };

  const removeTask = async (id) => {
    const options = {
      abi: abi,
      contractAddress: address,
      functionName: "deleteTask",
      params: {
        id: id,
      },
    };
    setLoading(true);
    await fetch({
      params: options,
      onSuccess: async (tx) => {
        //@ts-ignore
        await tx.wait(1);
        setLoading(false);
        if (isWeb3Enabled) {
          await updateTasks();
        }
      },
    });
  };

  const updateTasks = async () => {
    const tasks = await getTasks({
      onSuccess: () => {},
      onError: (error) => console.log(error),
    });
    let complete = [];
    let incomplete = [];
    //@ts-ignore
    if (tasks.length === 0) {
      handleNewNotification("No tasks", "info");
    }
    //@ts-ignore
    tasks.map((task) => {
      if (task.isCompleted) {
        complete.push([
          <Avatar isRounded size={36} theme="image" />,
          task.name,
          <Tag color="green" text="Complete" />,
          "",
          <button
            className="check-button"
            onClick={async () => {
              await removeTask(task.id.toString());
            }}
          >
            <Bin fill="red" fontSize={32} />
          </button>,
        ]);
      } else {
        incomplete.push([
          <Avatar isRounded size={36} theme="image" />,
          task.name,
          <Tag color="blue" text="Ongoing" />,
          <button
            className="check-button"
            onClick={async () => {
              await markCompleted(task.id.toString());
            }}
          >
            <Check fill="green" fontSize={32} />
          </button>,
          <button
            className="check-button"
            onClick={async () => {
              await removeTask(task.id.toString());
            }}
          >
            <Bin fill="red" fontSize={32} />
          </button>,
        ]);
      }
    });
    //@ts-ignore
    setData([...incomplete, ...complete]);
  };

  const addTaskButton = async () => {
    if (taskInput === "") {
      alert("Please enter a task");
      return;
    }
    setLoading(true);
    await addTask({
      onSuccess: async (tx) => {
        handleNewNotification("Added a new task", "success");
        //@ts-ignore
        await tx.wait(1);
        setLoading(false);
        if (isWeb3Enabled) {
          await updateTasks();
        }
      },
      onError: (err) => {
        handleNewNotification(err.message, "error");
      },
    });
    setInput("");
  };

  useEffect(() => {
    if (isWeb3Enabled) {
      handleNewNotification("Fetching your tasks", "info");
      updateTasks();
    } else {
      setData([]);
    }
  }, [isWeb3Enabled]);

  return (
    <div>
      {!loading ? (
        <div className="speed">
          Note: The platform may take some time to reflect the changes
        </div>
      ) : (
        <div className="speed">
          <b>Please wait...</b>
        </div>
      )}

      {isWeb3Enabled ? (
        <div className="add-tasks">
          <div className="add-left">
            <Input
              label="Task"
              name="Task"
              width="94%"
              onChange={(e) => {
                setInput(e.target.value);
              }}
              value={taskInput}
            />
          </div>
          <div className="add-right">
            <Button
              onClick={addTaskButton}
              text=" + Add"
              theme="primary"
              disabled={isLoading || isFetching}
            />
          </div>
        </div>
      ) : (
        <div className="connect-message">
          <div>Please connect your wallet to continue</div>
        </div>
      )}

      <Table
        columnsConfig="80px 5fr 1fr 1fr 80px"
        data={data}
        header={[
          "",
          <span>Task</span>,
          <span>Status</span>,
          <span>Mark as completed</span>,
          "",
        ]}
        isColumnSortable={[false, false, false, false]}
        maxPages={3}
        onPageNumberChanged={function noRefCheck() {}}
        onRowClick={function noRefCheck() {}}
        pageSize={5}
      />
    </div>
  );
}
