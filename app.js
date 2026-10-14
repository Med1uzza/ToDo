let todos = [];
let userLists = [];
let activeList = "all";
let selectedDate = null;
let currentDate = new Date();
let sortBy = "none";

const monthNames = [
  "Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень",
  "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень"
];

const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const dateInput = document.getElementById("todo-date");
const tagInput = document.getElementById("todo-tag");
const list = document.getElementById("todo-list");
const mainTitle = document.getElementById("current-list-title");
const tasksCount = document.getElementById("tasks-count");
const sortSelect = document.getElementById("sort-select");
const listsContainer = document.getElementById("lists-container");
const newListInput = document.getElementById("new-list-input");
const monthTitle = document.getElementById("month-title");
const calendarDays = document.getElementById("calendar-days");
const prevBtn = document.getElementById("prev-month");
const nextBtn = document.getElementById("next-month");

sortSelect.addEventListener("change", () => {
  sortBy = sortSelect.value;
  renderTodos();
});

const renderLists = () => {
  listsContainer.innerHTML = "";

  const allItem = document.createElement("li");
  allItem.className = "list-item";
  if (activeList === "all" && selectedDate === null) {
    allItem.classList.add("active");
  }
  allItem.innerHTML = `
    <div class="list-item-left">
      <i class="fa-solid fa-list-check"></i>
      <span>Всі завдання</span>
    </div>
  `;
  allItem.addEventListener("click", () => {
    activeList = "all";
    selectedDate = null;
    renderLists();
    renderCalendar();
    renderTodos();
  });
  listsContainer.appendChild(allItem);

  for (let i = 0; i < userLists.length; i++) {
    const listName = userLists[i];
    const li = document.createElement("li");
    li.className = "list-item";
    if (activeList === listName && selectedDate === null) {
      li.classList.add("active");
    }

    li.innerHTML = `
      <div class="list-item-left">
        <i class="fa-solid fa-folder"></i>
        <span>${listName}</span>
      </div>
      <button class="delete-list-btn" title="Видалити список">✕</button>
    `;

    li.addEventListener("click", () => {
      activeList = listName;
      selectedDate = null;
      renderLists();
      renderCalendar();
      renderTodos();
    });

    const deleteListBtn = li.querySelector(".delete-list-btn");
    deleteListBtn.addEventListener("click", (event) => {
      event.stopPropagation();

      userLists.splice(i, 1);

      let remainingTodos = [];
      for (let k = 0; k < todos.length; k++) {
        if (todos[k].listName !== listName) {
          remainingTodos.push(todos[k]);
        }
      }
      todos = remainingTodos;

      if (activeList === listName) {
        activeList = "all";
      }

      renderLists();
      renderCalendar();
      renderTodos();
    });

    listsContainer.appendChild(li);
  }
};

newListInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    const name = newListInput.value.trim();

    if (name !== "") {
      let exists = false;
      for (let i = 0; i < userLists.length; i++) {
        if (userLists[i].toLowerCase() === name.toLowerCase()) {
          exists = true;
          break;
        }
      }

      if (exists === false) {
        userLists.push(name);
        activeList = name;
        selectedDate = null;
        newListInput.value = "";
        newListInput.blur();
        renderLists();
        renderCalendar();
        renderTodos();
      } else {
        alert("Такий список уже існує!");
      }
    }
  }
});

const renderTodos = () => {
  list.innerHTML = "";

  if (selectedDate !== null) {
    mainTitle.textContent = "Завдання на " + selectedDate;
  } else if (activeList === "all") {
    mainTitle.textContent = "Всі завдання";
  } else {
    mainTitle.textContent = activeList;
  }

  let tasksToShow = [];

  for (let i = 0; i < todos.length; i++) {
    const todo = todos[i];

    if (selectedDate !== null) {
      if (todo.date === selectedDate) {
        tasksToShow.push(todo);
      }
    } else {
      if (activeList === "all" || todo.listName === activeList) {
        tasksToShow.push(todo);
      }
    }
  }

  if (sortBy === "title") {
    tasksToShow.sort((a, b) => {
      return a.title.localeCompare(b.title);
    });
  } else if (sortBy === "date") {
    tasksToShow.sort((a, b) => {
      if (a.date === "") return 1;
      if (b.date === "") return -1;
      return a.date.localeCompare(b.date);
    });
  } else if (sortBy === "tag") {
    tasksToShow.sort((a, b) => {
      if (a.tag === "") return 1;
      if (b.tag === "") return -1;
      return a.tag.localeCompare(b.tag);
    });
  }

  let completedCount = 0;
  for (let c = 0; c < tasksToShow.length; c++) {
    if (tasksToShow[c].completed === true) {
      completedCount = completedCount + 1;
    }
  }
  tasksCount.textContent = `Виконано: ${completedCount} з ${tasksToShow.length}`;

  if (tasksToShow.length === 0) {
    const emptyLi = document.createElement("li");
    emptyLi.style.color = "#777";
    if (selectedDate !== null) {
      emptyLi.textContent = "Немає завдань на цей день.";
    } else {
      emptyLi.textContent = "Список порожній. Додайте перше завдання!";
    }
    list.appendChild(emptyLi);
    return;
  }

  for (let j = 0; j < tasksToShow.length; j++) {
    const todo = tasksToShow[j];
    const item = document.createElement("li");

    if (todo.completed === true) {
      item.classList.add("completed");
    }

    let checkIcon = "";
    if (todo.completed === true) {
      checkIcon = '<i class="fa-solid fa-check"></i>';
    }

    let listBadgeHtml = "";
    if ((activeList === "all" || selectedDate !== null) && todo.listName !== "all") {
      listBadgeHtml = `<span class="task-list-badge"><i class="fa-solid fa-folder"></i> ${todo.listName}</span>`;
    }

    let tagHtml = "";
    if (todo.tag !== "") {
      tagHtml = `<span class="task-tag">#${todo.tag}</span>`;
    }

    let dateHtml = "";
    if (todo.date !== "") {
      dateHtml = `<span class="task-date">${todo.date}</span>`;
    }

    item.innerHTML = `
      <div class="task-left">
        <button class="check-btn" title="Виконати">${checkIcon}</button>
        <span class="task-title">${todo.title}</span>
      </div>
      <div class="task-meta">
        ${listBadgeHtml}
        ${tagHtml}
        ${dateHtml}
        <button class="delete-btn" title="Видалити">✕</button>
      </div>
    `;

    const checkBtn = item.querySelector(".check-btn");
    checkBtn.addEventListener("click", () => {
      if (todo.completed === true) {
        todo.completed = false;
      } else {
        todo.completed = true;
      }
      renderTodos();
    });

    const deleteBtn = item.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", () => {
      const index = todos.indexOf(todo);
      if (index !== -1) {
        todos.splice(index, 1);
      }
      renderTodos();
      renderCalendar();
    });

    list.appendChild(item);
  }
};

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = input.value.trim();
  const date = dateInput.value;
  const tag = tagInput.value.trim();

  if (title !== "") {
    const newTodo = {
      id: Date.now(),
      title: title,
      date: date,
      tag: tag,
      listName: activeList,
      completed: false
    };

    todos.push(newTodo);

    form.reset();
    renderTodos();
    renderCalendar();
  }
});

const renderCalendar = () => {
  calendarDays.innerHTML = "";

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  monthTitle.innerHTML = monthNames[month] + " <span>" + year + "</span>";

  const nextMonthDate = new Date(year, month + 1, 0);
  const totalDays = nextMonthDate.getDate();

  const firstDayDate = new Date(year, month, 1);
  let firstDayIndex = firstDayDate.getDay();

  if (firstDayIndex === 0) {
    firstDayIndex = 6;
  } else {
    firstDayIndex = firstDayIndex - 1;
  }

  for (let i = 0; i < firstDayIndex; i++) {
    const emptyDiv = document.createElement("div");
    emptyDiv.className = "day empty";
    calendarDays.appendChild(emptyDiv);
  }

  for (let day = 1; day <= totalDays; day++) {
    const dayBtn = document.createElement("div");
    dayBtn.className = "day";
    dayBtn.textContent = day;

    const monthNumber = month + 1;
    let monthString = "" + monthNumber;
    if (monthNumber < 10) {
      monthString = "0" + monthNumber;
    }

    let dayString = "" + day;
    if (day < 10) {
      dayString = "0" + day;
    }

    const fullDateString = year + "-" + monthString + "-" + dayString;

    let hasTasks = false;
    for (let k = 0; k < todos.length; k++) {
      if (todos[k].date === fullDateString) {
        hasTasks = true;
        break;
      }
    }

    if (hasTasks === true) {
      dayBtn.classList.add("has-tasks");
    }

    if (selectedDate === fullDateString) {
      dayBtn.classList.add("selected");
    }

    dayBtn.addEventListener("click", () => {
      if (selectedDate === fullDateString) {
        selectedDate = null;
      } else {
        selectedDate = fullDateString;
      }
      renderLists();
      renderCalendar();
      renderTodos();
    });

    calendarDays.appendChild(dayBtn);
  }
};

prevBtn.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
});

nextBtn.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
});

renderLists();
renderCalendar();
renderTodos();