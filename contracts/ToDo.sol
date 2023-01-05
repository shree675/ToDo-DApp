// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract ToDo {
    struct Task {
        uint256 id;
        string name;
        bool isCompleted;
        address user;
    }

    Task[] private tasks;

    function addTask(string memory _name) public {
        tasks.push(Task(tasks.length, _name, false, msg.sender));
    }

    function completeTask(uint256 id) public {
        tasks[id].isCompleted = true;
    }

    function deleteTask(uint256 id) public {
        if (id >= tasks.length) {
            return;
        }
        for (uint i = id; i < tasks.length - 1; i++) {
            tasks[i] = tasks[i + 1];
        }
        tasks.pop();
    }

    function getTasks() public view returns (Task[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < tasks.length; i++) {
            if (tasks[i].user == msg.sender) {
                count++;
            }
        }

        Task[] memory userTasks = new Task[](count);
        uint256 j = 0;
        for (uint256 i = 0; i < tasks.length; i++) {
            if (tasks[i].user == msg.sender) {
                userTasks[j++] = tasks[i];
            }
        }

        return userTasks;
    }

    fallback() external {}
}
