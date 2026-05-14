// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {TodoContract} from "./todoContract.sol";

/// @title GetAllTodoContract
/// @notice Helper that reads all tasks for a given owner from a TodoContract.
contract GetAllTodoContract {
    TodoContract public immutable todo;

    constructor(TodoContract todo_) {
        todo = todo_;
    }

    function getAllTasks(address owner) external view returns (TodoContract.Task[] memory) {
        return todo.getTasks(owner);
    }
}
