import "./styles.css";
import { newTodo, allProjectsContainer, oneProject } from "./logic.js";

const newProjectButton = document.querySelector("#newProjectButton");
let dialogNewProject = document.querySelector(".newProjectDialog");
let closeNewProjectDialogButton = document.querySelector(".closeDialog");

newProjectButton.addEventListener("click", (event) => {
  dialogNewProject.showModal();

  // allProjectsContainer.addProject();
});

dialogNewProject.addEventListener("close", () => {
  if (!dialogNewProject.returnValue) {
    console.log("HERE ", dialogNewProject.returnValue, " AFTER");
  } else console.log("THERE");
});
