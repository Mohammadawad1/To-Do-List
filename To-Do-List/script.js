
const priorities = ["Low", "Medium", "High"];


const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const priorityFilter = document.getElementById("priorityFilter");
const statusFilter = document.getElementById("statusFilter");
const addButton = document.getElementById("addButton");
const searchInput = document.getElementById("searchInput");
const dateTimeDisplay = document.getElementById("dateTimeDisplay"); 
const inputField= document.createElement("input");
function getCurrentDateTime() {
    const now = new Date();
    const date = now.toLocaleDateString();
    const time = now.toLocaleTimeString();
    return `${date} ${time}`;
}
function completeTask(button) {
    const task = button.parentElement.parentElement;
    const statusElement = task.querySelector(".status");
    const datetime = task.querySelector(".date-time");
    const dateTime = getCurrentDateTime(); 
    datetime.textContent = dateTime;

    if (statusElement.textContent === "Completed") {
        statusElement.textContent = "Pending";
        task.classList.remove("completed"); 
        button.textContent = "Complete";
    } else {
        statusElement.textContent = "Completed";
        task.classList.add("completed"); 
        button.textContent = "Pending";
    }
}

function lodpage() {
    taskInput.focus();
}
window.onload = lodpage();
function addOrUpdateTask() {
    const taskText = taskInput.value.trim();
    const selectedPriority = prioritySelect.value; 
    const selectedStatus = statusFilter.value;
    if (taskText === "") {
        alert("Please enter a task.");
        return; 
    }
    if (selectedPriority === "All") { 
        alert("Please select a priority.");
        prioritySelect.style='border:3px solid red';
        return; 
    }
    const dateTime = getCurrentDateTime(); 
    if (editMode && editedTask) {
        editedTask.querySelector("span").textContent = taskText;
        editedTask.querySelector(".priority").textContent = selectedPriority;
        editedTask.querySelector(".status").textContent = selectedStatus;
        editedTask.querySelector(".date-time").textContent = dateTime; // Update date and time
        editedTask.setAttribute("data-priority", selectedPriority);
        editedTask.setAttribute("data-status", selectedStatus);
        editedTask.querySelector(".edit-actions").style.display = "none";
        editMode = false;
        editedTask = null;
    } else {
        prioritySelect.style='border:1px solid black';
        const taskElement = document.createElement("div");
        taskElement.classList.add("task");
        taskElement.setAttribute("data-priority", selectedPriority);
        taskElement.innerHTML = `
            <span class="text">${taskText}</span>
            <span class="priority">${selectedPriority}</span>
            <span class="status">Pending</span>
            <span class="date-time">${dateTime}</span>
            <div class="task-actions">
                <button onclick="completeTask(this)">Complete</button>
                <button onclick="editTask(this)">Edit</button>
                <button onclick="deleteTask(this)">Delete</button>
            </div>
            <div class="edit-actions" style="display: none;">
                <button onclick="updateTask(this)">Update</button>
                <button onclick="cancelEdit(this)">Cancel</button>
            </div>
        `;
        taskList.appendChild(taskElement);
        taskInput.value = "";
    }
    prioritySelect.value = "All";
    statusFilter.value = "All";
    addButton.disabled = true; 
    filterTasks(); 
}

priorityFilter.addEventListener("change", filterTasks);
statusFilter.addEventListener("change", filterTasks);


searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.toLowerCase().trim();

    priorityFilter.querySelector('option[value="All"]').disabled = false;
statusFilter.querySelector('option[value="All"]').disabled = false;
    const tasks = Array.from(taskList.getElementsByClassName("task"));

    tasks.forEach((task) => {
        const taskText = task.querySelector("span").textContent.toLowerCase();

        if (taskText.includes(searchTerm)) {
            task.style.display = "block";
        } else {
            task.style.display = "none";
        }
    });
});

let editMode = false;
let editedTask = null;

function deleteTask(button) {
    const task = button.parentElement.parentElement;
    task.remove();
}

function filterTasks() {
    const selectedPriority = priorityFilter.value;
    const selectedStatus = statusFilter.value;
    const tasks = Array.from(taskList.getElementsByClassName("task"));
    tasks.forEach((task) => {
        const priority = task.getAttribute("data-priority");
        const isCompleted = task.classList.contains("completed");
        const priorityMatch = selectedPriority === "All" || priority === selectedPriority;
        const statusMatch = selectedStatus === "All" || (selectedStatus === "Completed" && isCompleted) || (selectedStatus === "Pending" && !isCompleted);
        if (priorityMatch && statusMatch) {
            task.style.display = "block";
        } else {
            task.style.display = "none";
        }
    });
}

function editTask(button) {
    const task = button.parentElement.parentElement;
    const editActions = task.querySelector(".edit-actions");
    if (editActions) {
        const taskTextElement = task.querySelector("span");
        const originalText = taskTextElement.textContent;
        taskTextElement.style.display = "none";
        
        inputField.type = "text";
        inputField.value = originalText;
        inputField.setAttribute("data-original-text", originalText);
        task.insertBefore(inputField, taskTextElement);
        inputField.focus();
        inputField.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                updateTask(button);
            }
        });

        editMode = true;
        editedTask = task;
        editActions.style.display = "block";
    }
}

function cancelEdit(button) {
    const task = button.parentElement.parentElement;
    const inputField = task.querySelector("input[type='text']");
    const originalText = inputField.getAttribute("data-original-text");
    task.querySelector(".edit-actions").style.display = "none";
    task.querySelector("span").style.display = "inline";
    task.querySelector("span").textContent = originalText;
    inputField.value = originalText;
    editMode = false;
    editedTask = null;
    inputField.remove();
}

function updateTask(button) {
const task = button.parentElement.parentElement;
    const updatedText = inputField.value.trim();
    if (updatedText !== "") {
        const dateTime = getCurrentDateTime();
        task.querySelector(".edit-actions").style.display = "none";
        task.querySelector("span").style.display = "inline";
        task.querySelector("span").textContent = updatedText;
        task.querySelector(".date-time").textContent = dateTime;
        inputField.value = inputField.getAttribute("data-original-text");
        editMode = false;
    editedTask = null;
    inputField.remove();
    }
}