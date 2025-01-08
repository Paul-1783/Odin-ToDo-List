import "./styles.css";
import {
  newTodo,
  allProjectsContainer,
  makeOneProject,
  temporalStore,
} from "./logic.js";
const { isToday, differenceInBusinessDays, format } = require("date-fns");

const newProjectButton = document.querySelector("#newProjectButton");
const showAllProjectsButton = document.querySelector(".showAllProjects");
let dialogNewProject = document.querySelector(".newProjectDialog");
let newToDoDialog = document.querySelector(".newToDoDialog");
dialogNewProject.returnValue = "NoNewProjectName";
let newNameInput = document.querySelector("#NewProjectName");
const projectList = document.querySelector(".projectList");
const presentationSection = document.querySelector(".presentationSection");
const addAToDoButton = document.querySelector(".addAToDo");
const projectSelectField = document.querySelector("#projectSelect");
const allProjectsSection = document.querySelector(".allProjectsSection");
const oneProjectShow = document.querySelector(".oneProjectShow");
const prio1_container = document.querySelector(".prio1_container");
const prio2_container = document.querySelector(".prio2_container");
const prio3_container = document.querySelector(".prio3_container");
const extendedTodo = document.querySelector(".extendedTodo");
const todosToday = document.querySelector(".todosToday");
const todosNextSevenDays = document.querySelector(".todosNext7Days");

function buildProjectTable(project) {
  const projectButton = document.createElement("button");
  projectButton.classList.add("projectButton");
  projectButton.textContent = project.getProjectName();
  projectButton.addEventListener("click", () => {
    showToDos(project);
  });
  projectList.appendChild(projectButton);
}

function storeProjects() {
  if (localStorage.getItem("allProjects") !== null) {
    localStorage.removeItem("allProjects");
  }
  let storageArray = allProjectsContainer.getAllProjects().map((project) => {
    return {
      projectName: project.getProjectName(),
      todoList: project.getAllTodos(),
    };
  });
  localStorage.setItem("allProjects", JSON.stringify(storageArray));
}

function retrieveStoredProjects() {
  return JSON.parse(localStorage.getItem("allProjects"));
}

function showAllProjects() {
  let currentProjects = allProjectsContainer.getAllProjects();
  allProjectsSection.innerHTML = "";
  oneProjectShow.style.display = "none";
  allProjectsSection.style.display = "grid";

  currentProjects.forEach((project) => {
    const card = document.createElement("div");
    card.classList.add("projectCard");
    card.insertAdjacentHTML(
      "beforeend",
      `<h1 class="title">${project.getProjectName()}</h1
      <p>Due Date:</p>`
    );
    card.addEventListener("click", () => {
      showToDos(project);
    });
    allProjectsSection.appendChild(card);
  });
}

function buildCard(toDoCard, toDo, count) {
  toDoCard.innerHTML = "";
  toDoCard.insertAdjacentHTML(
    "beforeend",
    `
        <div class="toDoCard">
            <div class="face face1">
                <div class="content">
                  <h1 class="title"> ${toDo.getTitle()}</h1>
                  <div class="toDoEntry">${formatDate(toDo.getDueDate())}</div>
                  <p id="clickNotice">CLICK TO EDIT</p>
                </div>
            </div>
            <div class="face face2">
            <div class="cardNumber">${count}</div>
                <div class="content">
                  <section>
                        <p>Title: ${toDo.getTitle()}<p/>
                        <p>Description: ${toDo.getDescr()}</p>
                        <p>Set Priority: ${toDo.getPrio()}</p>
                        <p>Status: ${toDo.getStatus()}</p>
                        <p>Due Date: ${formatDate(toDo.getDueDate())}</p>
                  </section>
                </div>
            </div>
        </div>
       `
  );
}

function changeCardPrio(toDoCard, toDo) {
  if (toDo.getPrio() === "1") {
    toDoCard.classList.add("prio1");
    prio1_container.appendChild(toDoCard);
  } else if (toDo.getPrio() === "2") {
    toDoCard.classList.add("prio2");
    prio2_container.appendChild(toDoCard);
  } else if (toDo.getPrio() === "3") {
    toDoCard.classList.add("prio3");
    prio3_container.appendChild(toDoCard);
  }
}

function removeTodoCard(toDo, toDoCard) {
  if (toDo.getPrio() === "1") {
    prio1_container.remove(toDoCard);
  } else if (toDo.getPrio() === "2") {
    prio2_container.remove(toDoCard);
  } else if (toDo.getPrio() === "3") {
    prio3_container.remove(toDoCard);
  }
}

function showToDos(project) {
  allProjectsSection.style.display = "none";
  oneProjectShow.style.display = "grid";

  prio1_container.innerHTML = "";
  prio2_container.innerHTML = "";
  prio3_container.innerHTML = "";

  let count = 0;
  let toDos = project.getAllTodos();

  toDos.forEach((toDo) => {
    let toDoCard = document.createElement("div");
    toDoCard.classList.add(`container`);
    buildCard(toDoCard, toDo, count);
    changeCardPrio(toDoCard, toDo);

    toDoCard.addEventListener("click", () => {
      temporalStore.setTempToDo(
        toDo.getTitle(),
        toDo.getDescr(),
        toDo.getDueDate(),
        toDo.getPrio(),
        toDo.getStatus()
      );
      temporalStore.setTempProject(project);
      temporalStore.setTempCard(toDoCard);
      temporalStore.setTempCount(
        toDoCard.querySelector(".cardNumber").innerText
      );

      document.querySelector("#extendedToDoTitle").value = toDo.getTitle();
      document.querySelector("#extendedDescr").value = toDo.getDescr();
      document.querySelector("#extendedPriority").value = toDo.getPrio();
      document.querySelector("#extendedStatus").value = toDo.getStatus();
      document.querySelector("#extendedDueDate").value = toDo.getDueDate();
      extendedTodo.showModal();
    });

    count++;
  });
}

extendedTodo.addEventListener("submit", () => {
  let toDoTitle = document.querySelector("#extendedToDoTitle").value;
  let description = document.querySelector("#extendedDescr").value;
  let priority = document.querySelector("#extendedPriority").value;
  let status = document.querySelector("#extendedStatus").value;
  let dueDate = document.querySelector("#extendedDueDate").value;

  let editedTodoElement = newTodo(
    toDoTitle,
    description,
    dueDate,
    priority,
    status
  );

  let project = Object.assign({}, temporalStore.getTempProject());
  let count = temporalStore.getTempCount();

  project.updateTodo(count, editedTodoElement);
  storeProjects();
  showDueTodos();
  showToDos(project);
});

extendedTodo.addEventListener("reset", () => {
  extendedTodo.close();
});

addAToDoButton.addEventListener("click", () => {
  projectSelectField.innerHTML = "";
  let currentProjects = allProjectsContainer.getAllProjects();
  currentProjects.forEach((project) => {
    const optionElement = document.createElement("option");
    optionElement.setAttribute("value", project.getProjectName());
    optionElement.insertAdjacentHTML(
      "beforeend",
      `${project.getProjectName()}`
    );
    projectSelectField.appendChild(optionElement);
  });
  newToDoDialog.showModal();
});

newToDoDialog.addEventListener("reset", () => {
  newToDoDialog.close();
});

newToDoDialog.addEventListener("submit", () => {
  let toDoTitle = document.querySelector("#toDoTitle").value;
  let description = document.querySelector("#descr").value;
  let priority = document.querySelector("#priority").value;
  let status = document.querySelector("#status").value;
  let dueDate = document.querySelector("#dueDate").value;

  let newTodoElement = newTodo(
    toDoTitle,
    description,
    dueDate,
    priority,
    status
  );

  allProjectsContainer
    .findProject(projectSelectField.value)[0]
    .addTodo(newTodoElement);

  storeProjects();
  showDueTodos();
  showToDos(allProjectsContainer.findProject(projectSelectField.value)[0]);
});

newProjectButton.addEventListener("click", () => {
  dialogNewProject.showModal();
});

showAllProjectsButton.addEventListener("click", () => {
  showAllProjects();
});

function insertProject() {
  let oneNewProject;
  if (allProjectsContainer.getAllProjects().length === 0) {
    oneNewProject = makeOneProject("default project");
  } else {
    oneNewProject = makeOneProject(newNameInput.value);
  }
  allProjectsContainer.addProject(oneNewProject);
  let currentProjects = allProjectsContainer.getAllProjects();
  projectList.innerHTML = "";
  currentProjects.forEach((project) => {
    buildProjectTable(project);
  });
}

dialogNewProject.addEventListener("submit", () => {
  insertProject();
  showAllProjects();
  storeProjects();
});

dialogNewProject.addEventListener("reset", () => {
  dialogNewProject.close();
});

window.addEventListener("load", () => {
  let storedProjects = retrieveStoredProjects();

  if (storedProjects && storedProjects.length > 0) {
    storedProjects.forEach((elem) => {
      let storedProject = makeOneProject(elem.projectName);
      elem.todoList.forEach((todo) => {
        storedProject.addTodo(
          newTodo(
            todo.title,
            todo.description,
            todo.dueDate,
            todo.priority,
            todo.status
          )
        );
      });
      buildProjectTable(storedProject);
      allProjectsContainer.addProject(storedProject);
    });
    showDueTodos();
  } else {
    insertProject();
    storeProjects();
  }
  showAllProjects();
});

function showDueTodos() {
  todosToday.innerHTML = "";
  todosNextSevenDays.innerHTML = "";
  allProjectsContainer
    .getAllProjects()
    .forEach((project) => showUpcomingToDos(project));
}

function formatDate(rawDate) {
  return format(rawDate, `PPPP`);
}

function createDiv(newEntry, project, toDo) {
  newEntry.classList.add("upcomingToDo");
  newEntry.insertAdjacentHTML(
    "beforeend",
    `<h1 class="title">${project.getProjectName()}</h1
        <p>${toDo.getTitle()}</p>
      <p>Due Date: ${formatDate(toDo.getDueDate())}</p>`
  );
}

function showUpcomingToDos(project) {
  let toDos = project.getAllTodos();

  toDos.forEach((toDo) => {
    if (isToday(toDo.getDueDate())) {
      let entry = document.createElement("div");
      createDiv(entry, project, toDo);
      todosToday.appendChild(entry);
    } else if (differenceInBusinessDays(new Date(), toDo.getDueDate()) <= 7) {
      let newEntry = document.createElement("div");
      createDiv(newEntry, project, toDo);
      todosNextSevenDays.appendChild(newEntry);
    }
  });
}
