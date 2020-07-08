const myList = document.querySelector('.my-list');
const myTask = document.querySelector('.list-tasks');
const newListInput = document.querySelector('.new-list-input');
const newListForm = document.querySelector('.new-list-form');
const deleteListButton = document.querySelector('.delete-list');
const deleteTaskButton = document.querySelector('.delete-task');
const taskContainer = document.querySelector('.task-container');
const taskTitle = taskContainer.querySelector('.top .left');
const taskCount = taskContainer.querySelector('.top .right');
const newTaskInput = document.querySelector('.new-task-input');
const newTaskForm = document.querySelector('.new-task-form');

const LIST_KEY = "task.lists";
const SELECTED_LIST_KEY = "task.selectedList";

let lists = JSON.parse(localStorage.getItem(LIST_KEY));
if(lists === null) lists = [];

let selectedListId = JSON.parse(localStorage.getItem(SELECTED_LIST_KEY));

newListForm.addEventListener('submit', e => {
    e.preventDefault();
    let listName = newListInput.value;
    if(listName === null || listName === '') return;
    let newList = createListElement(listName);
    newListInput.value = '';
    lists.push(newList);
    save();
    render();
});

newTaskForm.addEventListener('submit', e => {
    e.preventDefault();
    let taskName = newTaskInput.value;
    if(taskName === null || taskName === '') return;
    let newTask = createTaskElement(taskName);
    newTaskInput.value = '';
    const selectedList = lists.find(list => list.id == selectedListId);
    selectedList.tasks.push(newTask);
    save();
    render();
});

myList.addEventListener('click', e => {
    if(e.target.tagName.toLowerCase() === 'li'){
        selectedListId = e.target.dataset.listId;
    }
    save();
    render();
});

deleteListButton.onclick = function(){
    lists = lists.filter(list => list.id !== selectedListId);
    selectedListId = null;
    save();
    render();
}

myTask.addEventListener('click', e => {
    if(e.target.tagName.toLowerCase() === 'input'){
        const selectedList = lists.find(list => list.id == selectedListId);
        const selectedTaskId = e.target.id;
        const selectedTask = selectedList.tasks.find(task => task.id == selectedTaskId);
        selectedTask.isCompleted = e.target.checked;
        save();
        countTaskRemaining(selectedList);
    }
});

deleteTaskButton.onclick = function(){
    const selectedList = lists.find(list => list.id == selectedListId);
    selectedList.tasks = selectedList.tasks.filter(task => !task.isCompleted);
    save();
    render();
}

function render(){
    clearElements(myList);
    renderList();
    const selectedList = lists.find(list => list.id == selectedListId);
    if(selectedListId === null){
        taskContainer.style.display = 'none';
    }
    else{
        clearElements(myTask);
        taskContainer.style.display = '';
        taskTitle.innerHTML = selectedList.name;
        countTaskRemaining(selectedList);
        renderTask(selectedList);
    }
}

function renderList(){
    lists.forEach(list => {
        const listElement = document.createElement('li');
        listElement.dataset.listId = list.id;
        listElement.innerHTML = list.name;
        if(list.id == selectedListId){
            listElement.classList.add('active-list');
        }
        myList.appendChild(listElement);
    });
}

function createListElement(listName){
    return {id: Date.now().toString(), name: listName, tasks: []};
}

function createTaskElement(taskName){
    return {id: Date.now().toString(), name: taskName, isCompleted: false}
}


function save(){
    localStorage.setItem(LIST_KEY, JSON.stringify(lists));
    localStorage.setItem(SELECTED_LIST_KEY, selectedListId);
}

function clearElements(element){
    while(element.firstChild){
        element.removeChild(element.firstChild);
    }
}

function renderTask(selectedList){
    selectedList.tasks.forEach(task => {
        appendNewTask(task);
    })
}

function appendNewTask(task){
    const taskElement = document.createElement('div');
    const taskCheckbox = document.createElement('input');
    const taskLabel = document.createElement('label');
    taskElement.classList.add('task');
    taskCheckbox.type = 'checkbox';
    taskCheckbox.id = task.id;
    taskCheckbox.classList.add('check-button');
    taskCheckbox.checked = task.isCompleted ? true : false;
    taskLabel.htmlFor = task.id;
    taskElement.appendChild(taskCheckbox);
    taskElement.appendChild(taskLabel);
    taskLabel.innerHTML = task.name;
    myTask.appendChild(taskElement); 
}

function countTaskRemaining(selectedList){
    let remainingTasks = selectedList.tasks.filter(task => task.isCompleted === false);
    let taskString = remainingTasks.length === 1 ? "task" : "tasks";
    taskCount.innerHTML = `${remainingTasks.length} ${taskString} remaining`;
}

render();