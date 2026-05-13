//SPDX-License-Identifier: MIT

pragma solidity ^0.8.26;

import { Todo } from "./todoContract.sol"

contract allTask{

    
    function getAllTasks() public view returns (string[] memory) {
        return tasks;
    }
    
}