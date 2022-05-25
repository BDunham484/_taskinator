//create task id variable
var taskIdCounter = 0;

var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var pageContentEl = document.querySelector("#page-content");




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
    //package up data as an object
    var taskDataObj = {
        name: taskNameInput,
        type: taskTypeInput
    };
    //send it as an argumnet to createTaskEl
    createTaskEl(taskDataObj);
};





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
    
    //add entire list item to list
    tasksToDoEl.appendChild(listItemEl);
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
    statusSelectEl.setAttribute("date-task-id", taskId);

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
    console.log(event.target);

    //check to see if click event matches the delete button class
    if (event.target.matches(".delete-btn")) {
        //get elements task id
        var taskId = event.target.getAttribute("data-task-id");
        deleteTask(taskId);
    }
}





var deleteTask = function(taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']")
    console.log(taskSelected);
    taskSelected.remove();
}





formEl.addEventListener("submit", taskFormHandler);
pageContentEl.addEventListener("click", taskButtonHandler);


