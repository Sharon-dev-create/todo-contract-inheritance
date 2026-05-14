const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TodoContract", function () {
  async function deployFixture() {
    const [owner, other] = await ethers.getSigners();
    const TodoContract = await ethers.getContractFactory("TodoContract");
    const todo = await TodoContract.deploy();
    await todo.waitForDeployment();
    return { todo, owner, other };
  }

  it("starts empty per account", async function () {
    const { todo, owner, other } = await deployFixture();
    expect(await todo.getTaskCount(await owner.getAddress())).to.equal(0n);
    expect(await todo.getTaskCount(await other.getAddress())).to.equal(0n);
  });

  it("adds tasks, emits event, and reads back", async function () {
    const { todo, owner } = await deployFixture();

    await expect(todo.addTask("buy milk"))
      .to.emit(todo, "TaskAdded")
      .withArgs(await owner.getAddress(), 0n, "buy milk");

    expect(await todo.getTaskCount(await owner.getAddress())).to.equal(1n);

    const [text, completed, createdAt, updatedAt] = await todo.getTask(
      await owner.getAddress(),
      0n,
    );
    expect(text).to.equal("buy milk");
    expect(completed).to.equal(false);
    expect(createdAt).to.equal(updatedAt);
    expect(createdAt).to.be.greaterThan(0);
  });

  it("reverts on empty task text", async function () {
    const { todo } = await deployFixture();
    await expect(todo.addTask("")).to.be.revertedWithCustomError(
      todo,
      "TodoContract__EmptyTask",
    );
  });

  it("updates task text and updatedAt", async function () {
    const { todo, owner } = await deployFixture();
    await todo.addTask("a");

    const [, , , updatedAtBefore] = await todo.getTask(
      await owner.getAddress(),
      0n,
    );

    await expect(todo.updateTaskText(0, "b"))
      .to.emit(todo, "TaskTextUpdated")
      .withArgs(await owner.getAddress(), 0n, "b");

    const [text, , , updatedAtAfter] = await todo.getTask(
      await owner.getAddress(),
      0n,
    );
    expect(text).to.equal("b");
    expect(updatedAtAfter).to.be.greaterThanOrEqual(updatedAtBefore);
  });

  it("sets and toggles completion", async function () {
    const { todo, owner } = await deployFixture();
    await todo.addTask("x");

    await expect(todo.setTaskCompleted(0, true))
      .to.emit(todo, "TaskCompletedUpdated")
      .withArgs(await owner.getAddress(), 0n, true);

    let [, completed] = await todo.getTask(await owner.getAddress(), 0n);
    expect(completed).to.equal(true);

    await expect(todo.toggleTaskCompleted(0))
      .to.emit(todo, "TaskCompletedUpdated")
      .withArgs(await owner.getAddress(), 0n, false);

    [, completed] = await todo.getTask(await owner.getAddress(), 0n);
    expect(completed).to.equal(false);
  });

  it("keeps tasks isolated per account", async function () {
    const { todo, owner, other } = await deployFixture();

    await todo.connect(owner).addTask("owner task");
    expect(await todo.getTaskCount(await owner.getAddress())).to.equal(1n);
    expect(await todo.getTaskCount(await other.getAddress())).to.equal(0n);

    await expect(todo.connect(other).updateTaskText(0, "hijack"))
      .to.be.revertedWithCustomError(todo, "TodoContract__InvalidTaskId")
      .withArgs(0);
  });
});
