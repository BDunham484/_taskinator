//create task id variable
var taskIdCounter = 0;

var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var pageContentEl = document.querySelector("#page-content");
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");

var tasks = [];




var taskFormHandler = function(event) {
    event.preventDefault();
    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskTypeInput = document.querySelector("select[name='task-type']").value; 
    //check if input values are empty strings
    if (!taskNameInput || !taskTypeInput) {
        alert("You need to fill out the task form.");
        return false;
    }
    //reset form
    formEl.reset();
    //look to see if form already has a data task id attribute
    var isEdit = formEl.hasAttribute("data-task-id");
    //has data attribute, so get task id and call function to complete edit process
    if (isEdit) {
        var taskId = formEl.getAttribute("data-task-id");
        completedEditTask(taskNameInput, taskTypeInput, taskId);
    }
    //no data attribute, so create object as normal and pass to createTaskEl function
    else {
        var taskDataObj = {
            name: taskNameInput,
            type: taskTypeInput,
            status: "to do"
        };
        createTaskEl(taskDataObj);
    }
};





var completedEditTask = function(taskName, taskType, taskId) {
    //find the matching task list item
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    //set new values
    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;
    //loop through tasks array and task object with new content
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].name = taskName;
            tasks[i].type = taskType;
        }
    };
    //save to localStorage
    saveTasks();
    alert('Task Upadated!');
    formEl.removeAttribute("data-task-id");
    document.querySelector("#save-task").textContent = "Add Task";
}





var createTaskEl = function(taskDataObj) {
    //create list item
    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";
    //add task id as a custom attribute
    listItemEl.setAttribute("data-task-id", taskIdCounter);
    //create div to hold task info and add to list item
    var taskInfoEl = document.createElement("div");
    taskInfoEl.className = "task-info";
    //add html content to div
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
    
    listItemEl.appendChild(taskInfoEl);
    
    // assign createTaskActions function to a variable and call it/append it to li element with matching task id
    var taskActionsEl = createTaskActions(taskIdCounter);
    listItemEl.appendChild(taskActionsEl);

    switch (taskDataObj.status) {
        case "to do":
          taskActionsEl.querySelector("select[name='status-change']").selectedIndex = 0;
          tasksToDoEl.append(listItemEl);
          break;
        case "in progress":
          taskActionsEl.querySelector("select[name='status-change']").selectedIndex = 1;
          tasksInProgressEl.append(listItemEl);
          break;
        case "completed":
          taskActionsEl.querySelector("select[name='status-change']").selectedIndex = 2;
          tasksCompletedEl.append(listItemEl);
          break;
        default:
          console.log("Something went wrong!");
      }
    
    //add the task id to the taskDataOjb
    taskDataObj.id = taskIdCounter;
    //add the updated taskDataObj to the tasks array
    tasks.push(taskDataObj);
    //save to localStorage
    saveTasks();
    //increase task counter for next unique id
    taskIdCounter++;
};





var createTaskActions = function(taskId) {
    //dynamically create a div
    var actionContainerEl = document.createElement("div");
    //assign a class name
    actionContainerEl.className = "task-actions";
    //create edit button
    var editButtonEl = document.createElement("button");
    editButtonEl.textContent = "Edit";
    editButtonEl.className = "btn edit-btn";
    editButtonEl.setAttribute("data-task-id", taskId);

    //append button to container div
    actionContainerEl.appendChild(editButtonEl);

    //create delete button
    var deleteButtonEl = document.createElement("button");
    deleteButtonEl.textContent = "Delete";
    deleteButtonEl.className = "btn delete-btn";
    deleteButtonEl.setAttribute("data-task-id", taskId);

    //append button to container div
    actionContainerEl.appendChild(deleteButtonEl);

    //create drop down menu
    var statusSelectEl = document.createElement("select");
    statusSelectEl.className = "select-status";
    statusSelectEl.setAttribute("name", "status-change");
    statusSelectEl.setAttribute("data-task-id", taskId);

    //append drop down to container div
    actionContainerEl.appendChild(statusSelectEl);

    //create array for drop down menu options
    var statusChoices = ["To Do", "In Progress", "Completed"];

    //create for loop to iterate through statusChoices array
    for (var i = 0; i < statusChoices.length; i++) {
        //create option element
        var statusOptionEl = document.createElement("option");
        statusOptionEl.textContent = statusChoices[i];
        statusOptionEl.setAttribute = ("value", statusChoices[i]);

        //append to select
        statusSelectEl.appendChild(statusOptionEl);
    }

    return actionContainerEl;
};





var taskButtonHandler = function(event) {
    //get target element from event
    var targetEl = event.target;
    //edit button was clicked
    if (targetEl.matches(".edit-btn")) {
        var taskId = targetEl.getAttribute("data-task-id");
        editTask(taskId);
    }
    //check to see if delete button was clicked
    if (targetEl.matches(".delete-btn")) {
        //get elements task id
        var taskId = targetEl.getAttribute("data-task-id");
        deleteTask(taskId);
    }
};





var editTask = function(taskId) {
    //get task list item element
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    //get content from the task name and  type
    var taskName = taskSelected.querySelector("h3.task-name").textContent;
    var taskType = taskSelected.querySelector("span.task-type").textContent;
    //assign task namd and  type to inputs
    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;
    //update add task button to save task
    document.querySelector("#save-task").textContent = "Save Task";
    //add task id to edit task
    formEl.setAttribute("data-task-id", taskId);

}




var deleteTask = function(taskId) {
    //get task list item element
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']")
    taskSelected.remove();
    //create new array to hold updated list of tasks
    var updatedTaskArr = [];
    //loop through current tasks
    for (var i = 0; i < tasks.length; i++) {
        //if tasks[i].id dowsn't match the value of taskId, let's keep that task and push it into the new array
        if (tasks[i].id !== parseInt(taskId)) {
            updatedTaskArr.push(tasks[i]);
        }
    }

    tasks = updatedTaskArr;
    //save to localStorage
    saveTasks();
}





var taskStatusChangeHandler = function(event) {
    //get the task item's id
    var taskId = event.target.getAttribute("data-task-id");
    //get the currently selected option's value and convert to lowercase
    var statusValue = event.target.value.toLowerCase();
    //find the parent task item element based on the id
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    if (statusValue === "to do") {
        tasksToDoEl.appendChild(taskSelected);
    } else if (statusValue === "in progress") {
            tasksInProgressEl.appendChild(taskSelected);
    } else if (statusValue === "completed") {
                tasksCompletedEl.appendChild(taskSelected);
    }
    //update task's in tasks array
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].status = statusValue;
        }
    }
    //save to localStorage
    saveTasks();
};





var saveTasks = function() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}




// 1.gets task items from localStorage
// 2. converts tasks from the string format back into an array of objects
// 3. iterates through a tasks array and creeates task elements on the page from it
var loadTasks = function() {
    //get task items from localStorage
    var savedTasks = localStorage.getItem("tasks");
    //check to see if tasks is null
    if (!savedTasks) {
        return false
    }
    //remove string format
    savedTasks = JSON.parse(savedTasks); 
    //loop through SavedTasks array
    for (var i = 0; i < savedTasks.length; i++) {
        //pass each task object inot the createTaskEl() function
        createTaskEl(savedTasks[i]);
    }
};




//create a new task
formEl.addEventListener("submit", taskFormHandler);
//for edit and delete buttons
pageContentEl.addEventListener("click", taskButtonHandler);
//for changing the status
pageContentEl.addEventListener("change", taskStatusChangeHandler);

loadTasks();