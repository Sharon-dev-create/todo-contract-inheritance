//SPDX-License-Identifier: MIT

pragma solidity ^0.8.26;

contract Todo {
    string[] public task;

    function addTask(string memory _task) public {
        task.push(_task);
    }

    function getTask(uint256 _taskId) public view returns(string[] memory){
        return task[_taskId];
    }
}