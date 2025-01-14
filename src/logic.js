let newTodo = function (ti, desc, due, prio, sta) {
  let title = ti;
  let description = desc;
  let dueDate = due;
  let priority = prio;
  let status = sta;
  let checkList = [];

  function changeTitle(ti) {
    this.title = ti;
  }
  function changeDescr(desc) {
    this.description = desc;
  }
  function changeDueDate(date) {
    this.dueDate = date;
  }
  function changePrio(prio) {
    priority = prio;
    console.log("this prio: ", priority);
  }

  function changeStatus(s) {
    status = s;
    console.log("this status: ", status);
  }

  function addToCheckList(checkElem) {
    this.checkList.push(checkElem);
  }

  function getTitle() {
    return title;
  }
  function getDescr() {
    return description;
  }
  function getDueDate() {
    return dueDate;
  }
  function getPrio() {
    return priority;
  }
  function getCheckList() {
    return checkList;
  }
  function getStatus() {
    return status;
  }

  function getAllData() {
    return { title, description, dueDate, priority, checkList, status };
  }

  return {
    changeTitle,
    changeDescr,
    changeDueDate,
    changePrio,
    addToCheckList,
    changeStatus,
    getTitle,
    getDescr,
    getDueDate,
    getPrio,
    getCheckList,
    getStatus,
    getAllData,
  };
};

function makeOneProject(name) {
  let projectName = name;
  let todoList = [];

  function getProjectName() {
    return projectName;
  }
  function addTodo(todo) {
    todoList.unshift(todo);
  }
  function deleteTodo() {}
  function getAllTodos() {
    return todoList;
  }

  function getTodo(index) {
    return todoList[index];
  }

  function updateTodo(index, newTodo) {
    todoList[index] = newTodo;
  }

  return {
    updateTodo,
    getTodo,
    addTodo,
    deleteTodo,
    getAllTodos,
    getProjectName,
  };
}

let allProjectsContainer = (function makeOneAllProjectsContainer() {
  let allProjects = [];

  function addProject(newProject) {
    allProjects.unshift(newProject);
  }

  function findProject(projectName) {
    return allProjects.filter((project) => {
      return project.getProjectName() === projectName;
    });
  }

  function getAllProjects() {
    return allProjects;
  }

  function deleteProject() {}

  function showAllProjects() {
    allProjects.map((elem) => console.log(elem.getProjectName()));
  }
  return {
    addProject,
    deleteProject,
    findProject,
    getAllProjects,
    showAllProjects,
  };
})();

let temporalStore = (function () {
  let tempToDo;
  let tempCard;
  let tempProject;
  let tempCount;

  let setTempToDo = (ti, desc, due, prio, sta) =>
    (tempToDo = newTodo(ti, desc, due, prio, sta));
  let getTempToDo = () => tempToDo;

  let setTempCard = (card) => {
    tempCard = card;
  };
  let getTempCard = () => {
    return tempCard;
  };

  let setTempProject = (project) => {
    tempProject = project;
  };

  let getTempProject = () => {
    return tempProject;
  };

  let setTempCount = (count) => {
    tempCount = count;
  };

  let getTempCount = () => {
    return tempCount;
  };

  let clearAll = () => {
    tempToDo = "";
    tempCard = "";
    tempProject = "";
    tempCount = 0;
  };

  return {
    clearAll,
    setTempCount,
    getTempCount,
    setTempToDo,
    getTempToDo,
    setTempCard,
    getTempCard,
    setTempProject,
    getTempProject,
  };
})();

export { newTodo, makeOneProject, allProjectsContainer, temporalStore };
