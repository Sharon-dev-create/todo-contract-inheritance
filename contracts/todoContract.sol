// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract TodoContract {
    error TodoContract__EmptyTask();
    error TodoContract__InvalidTaskId(uint256 taskId);

    struct Task {
        string text;
        bool completed;
        uint64 createdAt;
        uint64 updatedAt;
    }

    mapping(address => Task[]) private _tasks;

    event TaskAdded(address indexed owner, uint256 indexed taskId, string text);
    event TaskTextUpdated(address indexed owner, uint256 indexed taskId, string text);
    event TaskCompletedUpdated(address indexed owner, uint256 indexed taskId, bool completed);

    /// @notice Add a new task for the caller.
    function addTask(string calldata text) external returns (uint256 taskId) {
        if (bytes(text).length == 0) revert TodoContract__EmptyTask();

        taskId = _tasks[msg.sender].length;
        _tasks[msg.sender].push(
            Task({text: text, completed: false, createdAt: uint64(block.timestamp), updatedAt: uint64(block.timestamp)})
        );

        emit TaskAdded(msg.sender, taskId, text);
    }

    /// @notice Get a task for a given owner.
    function getTask(address owner, uint256 taskId)
        external
        view
        returns (string memory text, bool completed, uint64 createdAt, uint64 updatedAt)
    {
        if (taskId >= _tasks[owner].length) revert TodoContract__InvalidTaskId(taskId);
        Task storage task = _tasks[owner][taskId];
        return (task.text, task.completed, task.createdAt, task.updatedAt);
    }

    /// @notice Get all tasks for an owner (may be expensive for large lists).
    function getTasks(address owner) external view returns (Task[] memory) {
        return _tasks[owner];
    }

    /// @notice Get the number of tasks for an owner.
    function getTaskCount(address owner) external view returns (uint256) {
        return _tasks[owner].length;
    }

    /// @notice Update the task text for the caller.
    function updateTaskText(uint256 taskId, string calldata newText) external {
        if (bytes(newText).length == 0) revert TodoContract__EmptyTask();
        if (taskId >= _tasks[msg.sender].length) revert TodoContract__InvalidTaskId(taskId);

        Task storage task = _tasks[msg.sender][taskId];
        task.text = newText;
        task.updatedAt = uint64(block.timestamp);

        emit TaskTextUpdated(msg.sender, taskId, newText);
    }

    /// @notice Set completion state for the caller's task.
    function setTaskCompleted(uint256 taskId, bool completed) external {
        if (taskId >= _tasks[msg.sender].length) revert TodoContract__InvalidTaskId(taskId);

        Task storage task = _tasks[msg.sender][taskId];
        task.completed = completed;
        task.updatedAt = uint64(block.timestamp);

        emit TaskCompletedUpdated(msg.sender, taskId, completed);
    }

    /// @notice Toggle completion state for the caller's task.
    function toggleTaskCompleted(uint256 taskId) external {
        if (taskId >= _tasks[msg.sender].length) revert TodoContract__InvalidTaskId(taskId);

        Task storage task = _tasks[msg.sender][taskId];
        bool newValue = !task.completed;
        task.completed = newValue;
        task.updatedAt = uint64(block.timestamp);

        emit TaskCompletedUpdated(msg.sender, taskId, newValue);
    }
}
