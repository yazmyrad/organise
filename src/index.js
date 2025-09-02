import "./styles.css";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

import xmenu from '../imgs/xmenu.svg';

document.addEventListener("DOMContentLoaded", () => {
  flatpickr("#datepicker", {
    enableTime: true, // Enable time picker
    dateFormat: "Y-m-d H:i", // Format
  });
});

function showSidebar(){
    let menu = document.querySelector(".sidebar");
    menu.style.display = 'flex';
}
function hideSidebar(){
    let menu = document.querySelector(".sidebar");
    menu.style.display = 'none';
}
document.addEventListener('click', function(){
    document.querySelector(".gamburger").addEventListener('click', showSidebar);
    document.querySelector(".xmenu").addEventListener('click', hideSidebar);

});

const Dom = {
  create(tag, attributes = {}, children = []) {
    const el = document.createElement(tag);
    Object.entries(attributes).forEach(([key, value]) => {
      el.setAttribute(key, value);
    });
    children.forEach(child => el.appendChild(child));
    return el;
  },

  createSvg(pathData, viewBox = '0 -960 960 960') {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('height', '24px');
    svg.setAttribute('width', '24px');
    svg.setAttribute('viewBox', viewBox);
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', pathData);
    path.setAttribute('fill', '#000000');
    svg.appendChild(path);
    return svg;
  }
};

class ProjectComponent {
  constructor(container, project, ProjectManager) {
    this.container = container;
    this.projectManager = ProjectManager;
    this.state = {
      name: project.name, //'Default Project',
      description: project.description, //'Project description',
      tasks: project.tasks,
      expanded: false,
      showForm: false
    };
    this.priorityColors = {
      'high': 'red',
      'moderate': 'rgb(255, 187, 0)',
      'low': 'green',
      'negligible': 'grey',
    };
    this.init();
  }

  init() {
    this.renderProject();
    this.initEventListeners();
  }

  renderProject() {
    this.container.innerHTML = '';
    this.container.appendChild(this.createProjectHeader());
    this.container.appendChild(this.createTasksContainer());
    this.container.appendChild(this.createProjectControls());
  }

  createProjectHeader() {
    const header = Dom.create('div', { class: 'project-header' });
    const name = Dom.create('h2', { class: 'projectName' }, [document.createTextNode(this.state.name)]);
    const desc = Dom.create('h3', { class: 'projectDesc' }, [document.createTextNode(this.state.description)]);
    header.appendChild(name);
    header.appendChild(desc);
    return header;
  }

  createTasksContainer() {
    const tasksContainer = Dom.create('div', { class: 'tasks' });
    
    const tasksToShow = this.state.expanded 
      ? this.state.tasks 
      : this.state.tasks.slice(0, 3);
    
    tasksToShow.forEach((task, index) => {
      tasksContainer.appendChild(this.createTaskElement(task, index));
    });
    
    if (!this.state.expanded && this.state.tasks.length > 3) {
      tasksContainer.appendChild(this.createShowMoreButton());
    }
    
    return tasksContainer;
  }

  createTaskElement(task, index) {
    const taskEl = Dom.create('div', { class: 'task', 'data-index': index });
    taskEl.style.backgroundColor = this.priorityColors[task['priority']];
    
    const name = Dom.create('h4', { class: 'taskName' }, [document.createTextNode(task.name)]);
    
    const time = Dom.create('time', { class: 'taskTime', title: 'Due to' }, [
      document.createTextNode(task.dueDate),
      Dom.createSvg('M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Zm280 240q-17 0-28.5-11.5T440-440q0-17 11.5-28.5T480-480q17 0 28.5 11.5T520-440q0 17-11.5 28.5T480-400Zm-160 0q-17 0-28.5-11.5T280-440q0-17 11.5-28.5T320-480q17 0 28.5 11.5T360-440q0 17-11.5 28.5T320-400Zm320 0q-17 0-28.5-11.5T600-440q0-17 11.5-28.5T640-480q17 0 28.5 11.5T680-440q0 17-11.5 28.5T640-400ZM480-240q-17 0-28.5-11.5T440-280q0-17 11.5-28.5T480-320q17 0 28.5 11.5T520-280q0 17-11.5 28.5T480-240Zm-160 0q-17 0-28.5-11.5T280-280q0-17 11.5-28.5T320-320q17 0 28.5 11.5T360-280q0 17-11.5 28.5T320-240Zm320 0q-17 0-28.5-11.5T600-280q0-17 11.5-28.5T640-320q17 0 28.5 11.5T680-280q0 17-11.5 28.5T640-240Z')
    ]);
    time.style.color = 'white';
    
    const editBtn = Dom.create('button', { class: 'taskEdit', title: 'Edit task' }, [
      Dom.createSvg('M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z')
    ]);
    
    taskEl.append(name, time, editBtn);
    return taskEl;
  }

  createShowMoreButton() {
    const btn = Dom.create('button', { 
      class: 'showMore',
      textContent: `Show all tasks (${this.state.tasks.length - 3} more)`
    });
    btn.addEventListener('click', () => {
      this.state.expanded = true;
      this.renderProject();
    });
    return btn;
  }

  createProjectControls() {
    const controls = Dom.create('div', { class: 'settingProject' });
    
    this.createTaskForm(this.state.showForm);
    
    const addTaskBtn = Dom.create('button', { 
      class: 'addTask', 
      title: 'Add Task' 
    }, [
      Dom.createSvg('M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z')
    ]);
    
    const editProjectBtn = Dom.create('button', { 
      class: 'editProject', 
      title: 'Edit Project' 
    }, [
      Dom.createSvg('M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h357l-80 80H200v560h560v-278l80-80v358q0 33-23.5 56.5T760-120H200Zm280-360ZM360-360v-170l367-367q12-12 27-18t30-6q16 0 30.5 6t26.5 18l56 57q11 12 17 26.5t6 29.5q0 15-5.5 29.5T897-728L530-360H360Zm481-424-56-56 56 56ZM440-440h56l232-232-28-28-29-28-231 231v57Zm260-260-29-28 29 28 28 28-28-28Z')
    ]);
    
    const expandBtn = Dom.create('button', { 
      class: 'expandProject', 
      title: this.state.expanded ? 'Collapse tasks' : 'See all tasks'
    }, [
      Dom.createSvg('M480-80 240-320l57-57 183 183 183-183 57 57L480-80ZM298-584l-58-56 240-240 240 240-58 56-182-182-182 182Z')
    ]);
    
    addTaskBtn.addEventListener('click', () => {
      this.state.showForm = !this.state.showForm;
      this.renderProject();
    });
    
    editProjectBtn.addEventListener('click', () => this.handleEditProject());
    expandBtn.addEventListener('click', () => {
      this.state.expanded = !this.state.expanded;
      this.renderProject();
    });
    
    controls.append(this.createTaskForm(this.state.showForm), addTaskBtn, editProjectBtn, expandBtn);
    return controls;
  }

  createTaskForm(show = false) {
    const addTaskForm = Dom.create('div', { class: 'addTaskForm' }, []);
    const taskForm = Dom.create('div', { class: 'taskForm' }, []);
    addTaskForm.addEventListener('click', ()=>{
      this.state.showForm = !this.state.showForm; 
    });

    if(show){
      taskForm.style.display = 'flex';
      addTaskForm.style.display = 'flex';
      taskForm.style.opacity = 1;
    }else{
      taskForm.style.display = 'none';
      addTaskForm.style.display = 'none';
      taskForm.style.opacity = 0;
    }

    const form = Dom.create('form', { action: '#projects', method: 'post' });
    
    const nameLabel = Dom.create('label', { for: 'name' }, [
      document.createTextNode('Task '),
      Dom.create('input', {
        type: 'text',
        id: 'name',
        name: 'name',
        placeholder: 'Enter the task',
        required: '',
        minlength: '4',
        maxlength: '40',
        size: '40'
      })
    ]);
    
    const dateLabel = Dom.create('label', { for: 'datepicker' }, [
      document.createTextNode('Due to '),
      Dom.create('input', {
        type: 'text',
        id: 'datepicker',
        placeholder: 'Select date/time',
        required: ''
      })
    ]);

    const priorityLabel = Dom.create('label', { for: 'priority'}, [
      document.createTextNode('Priority '),
      Dom.create('select', { name: 'priority' , id: 'priority'}, 
      [
        Dom.create('option', { value: 'high'}, [
          document.createTextNode('High'),
        ]),
        Dom.create('option', { value: 'moderate'}, [
          document.createTextNode('Moderate'),
        ]),
        Dom.create('option', { value: 'low'}, [
          document.createTextNode('Low'),
        ]),
        Dom.create('option', { value: 'negligible', selected: true}, [
          document.createTextNode('Negligible'),
        ]),
      ])
    ]);
    
    const submitBtn = Dom.create('button', { type: 'submit' }, [
      document.createTextNode('Add')
    ]);
    
    form.append(nameLabel, dateLabel, priorityLabel, submitBtn);
    
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.querySelector('#name').value;
      const dueDate = form.querySelector('#datepicker').value;
      const priority = form.querySelector('#priority').value;
      if (name && dueDate && priority) {
        this.addTask(name, dueDate, priority);
        this.state.showForm = false;
        this.renderProject();
        this.projectManager.saveToLocal();
      }
    });

    const closeForm = Dom.create('div', { class: 'closeForm' }, [
      document.createTextNode('Create your task'),
    ]);
    const closeFormImg = Dom.create('img', { src: xmenu, alt: 'Close form'}, []);
    closeFormImg.addEventListener('click', ()=>{
      this.state.showForm = !this.state.showForm;
      this.renderProject();
    });
    closeForm.appendChild(closeFormImg);
    taskForm.appendChild(closeForm);
    taskForm.appendChild(form);
    addTaskForm.appendChild(taskForm);

    // Initialize Flatpickr
    flatpickr(form.querySelector('#datepicker'), {
      enableTime: true,
      dateFormat: "Y-m-d H:i",
    });
    
    return addTaskForm;
  }

  // State Management Methods
  addTask(name, dueDate, priority) {
    this.state.tasks.push({
      name,
      dueDate,
      completed: false,
      priority,
    });
  }

  editTask(index, newName, newDueDate) {
    if (index >= 0 && index < this.state.tasks.length) {
      this.state.tasks[index] = {
        ...this.state.tasks[index],
        name: newName,
        dueDate: newDueDate
      };
      this.projectManager.saveToLocal();
    }
  }

  handleEditProject() {
    const newName = prompt('Enter new project name:', this.state.name);
    const newDesc = prompt('Enter new project description:', this.state.description);
    
    if (newName !== null && newDesc !== null) {
      this.state.name = newName;
      this.state.description = newDesc;
      this.renderProject();
      this.projectManager.saveToLocal();
    }
  }

  initEventListeners() {
    this.container.addEventListener('click', (e) => {
      const taskElement = e.target.closest('.task');
      if (!taskElement) return;
      
      const index = parseInt(taskElement.dataset.index);
      
      if (e.target.closest('.taskEdit')) {
        const task = this.state.tasks[index];
        const newName = prompt('Edit task name:', task.name);
        const newDate = prompt('Edit due date:', task.dueDate);
        
        if (newName !== null && newDate !== null) {
          this.editTask(index, newName, newDate);
          this.renderProject();
        }
      }
    });
  };
}

class ProjectManager {
  constructor() {
    this.projects = [];
    this.nextProjectId = 1;
    this.initElements();
    this.initEventListeners();
    this.saveToLocal();
    this.loadFromLocalStorage();
  }

  initElements() {
    this.addProjectButton = document.querySelector('.addProjectButton');
    this.addProjectForm = document.querySelector('.addProject');
    this.contentContainer = document.querySelector('.contentContainer');
    this.form = document.querySelector('.projectForm form');
    this.projectForm = document.querySelector('.projectForm');
    this.closeForm = document.querySelector('.closeProjectForm');
  }

  initEventListeners() {
    this.addProjectButton.addEventListener('click', () => {
      this.toggleFormVisibility();
    });

    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleFormSubmit();
    });

    this.closeForm.addEventListener('click', ()=>{
      this.toggleFormVisibility();
      
    });
  }

  toggleFormVisibility() {
    this.addProjectForm.style.display = 
      this.addProjectForm.style.display === 'flex' ? 'none' : 'flex';
    this.projectForm.classList.toggle('visible');
  }

  handleFormSubmit() {
    const name = this.form.querySelector('#name').value;
    const description = this.form.querySelector('#desc').value;

    if (name && description) {
      this.addProject(name, description);
      this.form.reset();
      this.toggleFormVisibility();
    }

  }

  addProject(name, description) {
    const projectId = `project_${this.nextProjectId++}`;
    const projectData = {
      id: projectId,
      name,
      description,
      tasks: []
    };

    this.projects.push(projectData);
    this.renderProject(projectData);
    this.saveToLocal();

  }

  renderProject(project) {
    const projectElement = Dom.create('div', {
      class: 'content',
      id: project.id
    });

    this.contentContainer.appendChild(projectElement);

    // Initialize project functionality
    new ProjectComponent(projectElement, project, this);
  };

  saveToLocal() {
    localStorage.setItem('todoProjects', JSON.stringify({
      projects: this.projects,
      nextProjectId: this.nextProjectId
    }));
  }

  loadFromLocalStorage() {
    const savedData = localStorage.getItem('todoProjects');
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        this.projects = data.projects || [];
        this.nextProjectId = data.nextProjectId || 1;
        
        // Render all saved projects
        this.projects.forEach(project => {
          this.renderProject(project);
        });
      } catch (error) {
        console.error('Error loading from localStorage:', error);
        this.projects = [];
        this.nextProjectId = 1;
      }
    }
  }

}

// Initialize the project
document.addEventListener('DOMContentLoaded', () => {
  const project = new ProjectManager();
  
});