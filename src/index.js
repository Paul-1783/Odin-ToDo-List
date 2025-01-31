import "./reset.css";
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
const notStarted_container = document.querySelector(".notStarted_container");
const progress_container = document.querySelector(".progress_container");
const done_container = document.querySelector(".done_container");
const extendedTodo = document.querySelector(".extendedTodo");
const todosToday = document.querySelector(".todosToday");
const todosNextSevenDays = document.querySelector(".todosNext7Days");
const workflowContainers = document.querySelectorAll(".workflow");
const openProject = document.querySelector(".openProject");

const checklistContainer = document.querySelector(".checklistContainer");
const openCheckListButton = document.querySelector(".openCheckListButton");
const submitNewCheck = document.querySelector("#submitNewCheck");
const checklistAll = document.querySelector(".checklistAll");
const newCheck = document.querySelector("#newCheck");

function buildProjectTable(project) {
  const projectButton = document.createElement("button");
  projectButton.classList.add("projectButton");
  projectButton.textContent = project.getProjectName();
  projectButton.addEventListener("click", () => {
    showToDos(project);
  });
  projectList.appendChild(projectButton);
}

function retrieveStoredProjects() {
  return JSON.parse(localStorage.getItem("allProjects"));
}

function showAllProjects() {
  let currentProjects = allProjectsContainer.getAllProjects();
  allProjectsSection.innerHTML = "";
  oneProjectShow.style.display = "none";
  allProjectsSection.style.display = "grid";

  openProject.textContent = "Projects";

  currentProjects.forEach((project) => {
    const card = document.createElement("div");
    card.classList.add("projectCard");
    card.insertAdjacentHTML(
      "beforeend",
      `<h1 class="title">${project.getProjectName()}</h1>`
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
                  <p id="clickNotice">CLICK TO EDIT OR TO SHOW YOUR CHECKLIST</p>
                </div>
            </div>
            <div class="face face2">
            <div class="cardNumber">${count}</div>
                <div class="content">
                  <section>
                        <p>Title: ${toDo.getTitle()}<p/>
                        <p>Description: ${toDo.getDescr()}</p>
                        <p>Set Priority: ${toDo.getPrio()}</p>
                         <p>Due Date: ${formatDate(toDo.getDueDate())}</p>
                  </section>
                </div>
            </div>
        </div>
       `
  );
}

function emptyWorkflowContainers() {
  workflowContainers.forEach((container) => {
    container.innerHTML = "";
  });
}

function showToDos(project) {
  allProjectsSection.style.display = "none";
  oneProjectShow.style.display = "grid";
  openProject.textContent = `Project "${project.getProjectName()}" - all contained Todos`;

  emptyWorkflowContainers();

  let count = 0;
  let toDos = project.getAllTodos();

  toDos.forEach((toDo) => {
    let toDoCard = document.createElement("div");
    toDoCard.classList.add(`container`);
    toDoCard.setAttribute("draggable", true);
    buildCard(toDoCard, toDo, count);

    toDoCard.addEventListener("click", () => {
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

    addToStatusBar(toDo, toDoCard);
    count++;

    toDoCard.addEventListener("dragstart", () => {
      toDoCard.classList.add("dragging");
    });
    toDoCard.addEventListener("dragend", () => {
      toDoCard.classList.remove("dragging");
    });

    workflowContainers.forEach((container) => {
      container.addEventListener("dragover", () => {
        const draggable = document.querySelector(".dragging");
        container.append(draggable);
        let className = container.className.split(" ")[0];
        let cardNumber = draggable.querySelector(".cardNumber").innerText;
        setStatus(project, cardNumber, className);
        storeProjects();
      });
    });
  });
}

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
    storedProjects.forEach((project) => {
      let storedProject = makeOneProject(project.projectName);
      JSON.parse(project.todoList).forEach((todo) => {
        let oneTodo = newTodo(
          todo.title,
          todo.description,
          todo.dueDate,
          todo.priority,
          todo.status
        );
        todo.checkList.forEach((entry) => {
          oneTodo.addToCheckList(entry);
        });
        storedProject.addTodo(oneTodo);
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

function addToStatusBar(toDo, toDoCard) {
  if (toDo.getStatus() === "not started") {
    notStarted_container.appendChild(toDoCard);
  } else if (toDo.getStatus() === "in progress") {
    progress_container.appendChild(toDoCard);
  } else if (toDo.getStatus() === "done") {
    done_container.appendChild(toDoCard);
  }
}

function setStatus(project, cardNumber, name) {
  let toDo = project.getTodo(cardNumber);
  if (name === "notStarted_container") {
    project.getTodo(cardNumber).changeStatus("not started");
  } else if (name === "progress_container") {
    project.getTodo(cardNumber).changeStatus("in progress");
  } else if (name === "done_container") {
    project.getTodo(cardNumber).changeStatus("done");
  }
  project.updateTodo(cardNumber, toDo);
}

function storeProjects() {
  if (localStorage.getItem("allProjects") !== null) {
    localStorage.removeItem("allProjects");
  }
  let storageArray = allProjectsContainer.getAllProjects().map((project) => {
    const newTodoList = [];
    project.getAllTodos().forEach((todo) => {
      let todoLocallyStored = {
        title: todo.getTitle(),
        description: todo.getDescr(),
        dueDate: todo.getDueDate(),
        priority: todo.getPrio(),
        status: todo.getStatus(),
        checkList: todo.getCheckList(),
      };
      newTodoList.push(todoLocallyStored);
    });
    return {
      projectName: project.getProjectName(),
      todoList: JSON.stringify(newTodoList),
    };
  });
  localStorage.setItem("allProjects", JSON.stringify(storageArray));
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

  let list = project.getTodo(count).getCheckList();
  list.forEach((checklistEntry) => {
    editedTodoElement.addToCheckList(checklistEntry);
  });

  project.updateTodo(count, editedTodoElement);
  storeProjects();
  showDueTodos();
  closeTodo();
  showToDos(project);
});

extendedTodo.addEventListener("reset", () => {
  closeTodo();
});

openCheckListButton.addEventListener("click", () => {
  if (checklistAll.classList.toggle("visible")) {
    let project = Object.assign({}, temporalStore.getTempProject());
    let count = temporalStore.getTempCount();
    let todo = project.getTodo(count);
    let theChecklist = project.getTodo(count).getCheckList();
    checklistAll.style.display = "block";
    openCheckListButton.innerText = "Close Checklist";

    theChecklist.forEach((bulletpoint, indexToBeUpdated) => {
      let checkListLabel = document.createElement("label");
      checkListLabel.setAttribute("contentEditable", true);
      checkListLabel.setAttribute("id", "checkListLabel");
      if (bulletpoint.done) {
        checkListLabel.classList.add("checkedOutItem");
      }
      checkListLabel.innerText = bulletpoint.checkEntry;
      checkListLabel.setAttribute("for", "checkboxForLabel");

      let inputCheck = document.createElement("input");
      inputCheck.type = "checkbox";
      inputCheck.setAttribute("name", "checkboxForLabel");
      inputCheck.setAttribute("id", "checkboxForLabel");

      let checkListEntry = document.createElement("div");
      checkListEntry.appendChild(checkListLabel);
      checkListEntry.appendChild(inputCheck);

      inputCheck.addEventListener("change", () => {
        let checkListElement = {
          checkEntry: checkListLabel.innerText,
          done: true,
        };
        let newTodoElement = newTodo(
          todo.getTitle(),
          todo.getDescr(),
          todo.getDueDate(),
          todo.getPrio(),
          todo.getStatus()
        );

        theChecklist.forEach((checkElem) => {
          newTodoElement.addToCheckList(checkElem);
        });
        newTodoElement.updateChecklist(indexToBeUpdated, checkListElement);

        project.updateTodo(count, newTodoElement);
        storeProjects();
        checkListLabel.classList.add("checkedOutItem");
      });

      checklistContainer.appendChild(checkListEntry);
    });
  } else {
    checklistAll.style.display = "none";
    checklistContainer.innerHTML = "";
    openCheckListButton.innerText = "Show Checklist";
  }
});

function closeTodo() {
  checklistAll.classList.remove("visible");
  checklistContainer.innerHTML = "";
  checklistAll.style.display = "none";
  openCheckListButton.innerText = "Show Checklist";
  extendedTodo.close();
}

submitNewCheck.addEventListener("click", () => {
  let project = Object.assign({}, temporalStore.getTempProject());
  let count = temporalStore.getTempCount();
  let updatedTodo = project.getTodo(count);

  let todoDeepCopy = newTodo(
    updatedTodo.getTitle(),
    updatedTodo.getDescr(),
    updatedTodo.getDueDate(),
    updatedTodo.getPrio(),
    updatedTodo.getStatus()
  );

  updatedTodo.getCheckList().forEach((entry) => {
    todoDeepCopy.addToCheckList(entry);
  });

  todoDeepCopy.addToCheckList({ checkEntry: newCheck.value, done: false });
  project.updateTodo(count, todoDeepCopy);
  storeProjects();
  openCheckListButton.click();
  openCheckListButton.click();

  newCheck.value = "";
});

function removeTodoCard(toDo, toDoCard) {}
