const dummy = () => {};
var _$ = (function () {
  var Request = function () {};
  Request.prototype.myFetch = function (options) {
    let { url, type, data, headers } = options;
    type = (type || "GET").toUpperCase();
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();
      xhr.open(type, url);
      if (headers) {
        Object.entries(headers).forEach(([key, value]) => {
          xhr.setRequestHeader(key, value);
        });
      }
      // request state change event
      xhr.onreadystatechange = function () {
        // request completed?
        if (xhr.readyState !== 4) return;
        if (xhr.status === 200) {
          // request successful - show response
          resolve(xhr.responseText);
        } else {
          // request error
          reject(xhr.statusText);
        }
      };
      xhr.send(data);
    });
  };
  if (Request.flag) {
    return Request.flag;
  }
  Request.flag = new Request();
  return Request.flag;
})();

const APIs = (() => {
  const URL = "http://localhost:3000/todos";
  const RIGHT_URL = "http://localhost:3000/todosRight";

  const addTodo = (newTodo) => {
    return _$.myFetch({
      url: URL,
      type: "POST",
      data: JSON.stringify(newTodo),
      headers: {
        "Content-type": "application/json",
      },
    }).then((res) => JSON.parse(res));
  };

  const addTodoRight = (newTodo) => {
    return _$.myFetch({
      url: RIGHT_URL,
      type: "POST",
      data: JSON.stringify(newTodo),
      headers: {
        "Content-type": "application/json",
      },
    }).then((res) => JSON.parse(res));
  };

  const removeTodo = (id) => {
    return _$.myFetch({
      url: URL + `/${id}`,
      type: "delete",
    }).then((res) => JSON.parse(res));
  };

  const removeTodoRight = (id) => {
    return _$.myFetch({
      url: RIGHT_URL + `/${id}`,
      type: "delete",
    }).then((res) => JSON.parse(res));
  };

  const getTodos = () => {
    return _$.myFetch({
      url: URL,
      type: "GET",
    }).then((res) => JSON.parse(res));
  };

  const getTodosRight = () => {
    return _$.myFetch({
      url: RIGHT_URL,
      type: "GET",
    }).then((res) => JSON.parse(res));
  };

  return {
    addTodo,
    addTodoRight,
    removeTodo,
    removeTodoRight,
    getTodos,
    getTodosRight,
  };
})();

const Model = (() => {
  //todolist
  class State {
    #todos; //[{id: ,title: },{}]
    #todosRight; //[{id: ,title: },{}]
    #onChange;
    constructor() {
      this.#todos = [];
    }

    get todos() {
      return this.#todos;
    }

    set todos(newTodo) {
      console.log("setter");
      this.#todos = newTodo;
      this.#onChange?.();
    }

    get todosRight() {
      return this.#todosRight;
    }

    set todosRight(newTodo) {
      console.log("setter right");
      this.#todosRight = newTodo;
      this.#onChange?.();
    }

    subscribe(callback) {
      this.#onChange = callback;
    }
  }
  let {
    getTodos,
    getTodosRight,
    removeTodo,
    removeTodoRight,
    addTodo,
    addTodoRight,
  } = APIs;

  return {
    State,
    getTodos,
    getTodosRight,
    removeTodo,
    removeTodoRight,
    addTodo,
    addTodoRight,
  };
})();

const View = (() => {
  const formEl = document.querySelector(".form");
  const todoListEl = document.querySelector(".todo-list");
  const todoListRightEl = document.querySelector(".todo-list-right");
  const updateTodoList = (todos = [], todosRight = []) => {
    let template = "<div class='ul-title'>Pending Tasks</div>";
    let templateRight = "<div class='ul-title'>Completed Tasks</div>";
    todos.forEach((todo) => {
      const editSvg = `<div style="cursor:pointer;display:inline;background:#008cba;padding:4px 3px;border-radius:2px;" class="btn--edit--left" id="${todo.id}"><svg style="width:24px;transform:translateY(6px);pointer-events:none;" focusable="false" aria-hidden="true" viewBox="0 0 24 24" aria-label="fontSize small"><path fill="#f0f0f0" d="M3 17.25V21h3.75L17.81 9.94l-3.75 -3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path></svg></div>`;
      const deleteSvg = `<div style="cursor:pointer;display:inline;background:#c94c4c;padding:4px 3px;border-radius:2px;" class="btn--delete" id="${todo.id}"><svg style="width:24px;transform:translateY(6px);pointer-events:none;" focusable="false" aria-hidden="true" viewBox="0 0 24 24" aria-label="fontSize small"><path fill="#f0f0f0" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg></div>`;
      const rightSvg = `<div style="cursor:pointer;display:inline;background:#4caf50;padding:4px 3px;border-radius:2px;" class="btn--move--right" id="${todo.id}"><svg style="width:24px;transform:rotate(180deg) translateY(-6px);pointer-events:none;" focusable="false" aria-hidden="true" viewBox="0 0 24 24" aria-label="fontSize small"><path fill="#f0f0f0" d="M20 11H7.83l5.59-5.59L12 4l -8 8 8 8 1.41-1.41L7.83 13H20v-2z"></path></svg></div>`;
      const todoTemplate = `<li style="background: #e6e2d3;border-color: #e6e2d3;">
        <div></div>
        <span style="word-break: break-all;max-width: 200px;line-height: 28px;" class="left-container-${todo.id}" data-edit="false">${todo.title}</span>
        <div style="transform: translateY(-3px);">
          ${editSvg}
          ${deleteSvg}
          ${rightSvg}
        </div>
      </li>`;
      template += todoTemplate;
    });
    todosRight.forEach((todo) => {
      const editSvg = `<div style="cursor:pointer;display:inline;background:#008cba;padding:4px 3px;border-radius:2px;" class="btn--edit--right" id="${todo.id}"><svg style="width:24px;transform:translateY(6px);pointer-events:none;" focusable="false" aria-hidden="true" viewBox="0 0 24 24" aria-label="fontSize small"><path fill="#f0f0f0" d="M3 17.25V21h3.75L17.81 9.94l-3.75 -3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path></svg></div>`;
      const deleteSvg = `<div style="cursor:pointer;display:inline;background:#c94c4c;padding:4px 3px;border-radius:2px;" class="btn--delete--right" id="${todo.id}"><svg style="width:24px;transform:translateY(6px);pointer-events:none;" focusable="false" aria-hidden="true" viewBox="0 0 24 24" aria-label="fontSize small"><path fill="#f0f0f0" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg></div>`;
      const leftSvg = `<div style="cursor:pointer;display:inline;background:#4caf50;padding:4px 3px;border-radius:2px;" class="btn--move--left" id="${todo.id}"><svg style="width:24px;transform:translateY(6px);pointer-events:none;" focusable="false" aria-hidden="true" viewBox="0 0 24 24" aria-label="fontSize small"><path fill="#f0f0f0" d="M20 11H7.83l5.59-5.59L12 4l -8 8 8 8 1.41-1.41L7.83 13H20v-2z"></path></svg></div>`;
      const todoTemplate = `<li style="background: #e6e2d3;border-color: #e6e2d3;">
        <div style="transform: translateY(-3px);">
          ${leftSvg}
        </div>
        <span style="word-break: break-all;max-width: 200px;line-height: 28px;" class="right-container-${todo.id}" data-edit="false">${todo.title}</span>
        <div style="transform: translateY(-3px);">
          ${editSvg}
          ${deleteSvg}
        </div>
      </li>`;
      templateRight += todoTemplate;
    });
    if (todos.length === 0) {
      template = "<div class='ul-title'>Pending Tasks</div>no task to display";
    }
    if (todosRight.length === 0) {
      templateRight =
        "<div class='ul-title'>Completed Tasks</div>no task to display";
    }
    todoListEl.innerHTML = template;
    todoListRightEl.innerHTML = templateRight;
  };

  return {
    formEl,
    todoListEl,
    todoListRightEl,
    updateTodoList,
  };
})();

const ViewModel = ((View, Model) => {
  console.log("model", Model);
  const state = new Model.State();

  const getTodos = () => {
    Model.getTodos().then((res) => {
      state.todos = res;
    });
  };

  const getTodosRight = () => {
    Model.getTodosRight().then((res) => {
      state.todosRight = res;
    });
  };

  const addTodo = () => {
    View.formEl.addEventListener("submit", (event) => {
      event.preventDefault();
      const title = event.target[0].value;
      if (title.trim() === "") {
        alert("please input title!");
        return;
      }
      const newTodo = { title };
      Model.addTodo(newTodo)
        .then((res) => {
          state.todos = [res, ...state.todos];
          event.target[0].value = "";
        })
        .catch(dummy);
    });
  };

  const removeTodo = () => {
    View.todoListEl.addEventListener("click", (event) => {
      const id = event.target.id;
      if (event.target.className === "btn--delete") {
        Model.removeTodo(id)
          .then((res) => {
            // state.todos = state.todos.filter((todo) => +todo.id !== +id);
          })
          .catch(dummy);
      }
      if (event.target.className === "btn--move--right") {
        Model.removeTodo(id)
          .then((res) => {
            // state.todos = state.todos.filter((todo) => +todo.id !== +id);
          })
          .catch(dummy);
        const target = state.todos.find((item) => item.id == id);
        Model.addTodoRight({ title: target.title })
          .then((res) => {
            // state.todosRight = state.todosRight.filter((todo) => +todo.id !== +id);
          })
          .catch(dummy);
      }
      if (event.target.className === "btn--edit--left") {
        const leftContainer = document.querySelector(`.left-container-${id}`);
        const toEdit = leftContainer.getAttribute("data-edit") === "false";
        if (toEdit) {
          leftContainer.innerHTML = `
            <input style="height:24px" type="text" class="edit-input" value="${leftContainer.innerText}" />
          `;
          leftContainer.setAttribute("data-edit", "true");
        } else {
          const title = leftContainer.children[0].value;
          leftContainer.innerHTML = title;
          leftContainer.setAttribute("data-edit", "false");
          Model.removeTodo(id)
            .then((res) => {
              // state.todos = state.todos.filter((todo) => +todo.id !== +id);
            })
            .catch(dummy);
          Model.addTodo({ title })
            .then((res) => {
              // state.todos = state.todos.filter((todo) => +todo.id !== +id);
            })
            .catch(dummy);
        }
      }
    });
    View.todoListRightEl.addEventListener("click", (event) => {
      const id = event.target.id;
      if (event.target.className === "btn--delete--right") {
        Model.removeTodoRight(id)
          .then((res) => {
            // state.todos = state.todos.filter((todo) => +todo.id !== +id);
          })
          .catch(dummy);
      }
      if (event.target.className === "btn--move--left") {
        Model.removeTodoRight(id)
          .then((res) => {
            // state.todosRight = state.todosRight.filter((todo) => +todo.id !== +id);
          })
          .catch(dummy);
        const target = state.todosRight.find((item) => item.id == id);
        Model.addTodo({ title: target.title })
          .then((res) => {
            // state.todos = state.todos.filter((todo) => +todo.id !== +id);
          })
          .catch(dummy);
      }
      if (event.target.className === "btn--edit--right") {
        const rightContainer = document.querySelector(`.right-container-${id}`);
        const toEdit = rightContainer.getAttribute("data-edit") === "false";
        if (toEdit) {
          rightContainer.innerHTML = `
            <input style="height:24px" type="text" class="edit-input" value="${rightContainer.innerText}" />
          `;
          rightContainer.setAttribute("data-edit", "true");
        } else {
          const title = rightContainer.children[0].value;
          rightContainer.innerHTML = title;
          rightContainer.setAttribute("data-edit", "false");
          Model.removeTodoRight(id)
            .then((res) => {
              // state.todosRight = state.todosRight.filter((todo) => +todo.id !== +id);
            })
            .catch(dummy);
          Model.addTodoRight({ title })
            .then((res) => {
              // state.todosRight = state.todosRight.filter((todo) => +todo.id !== +id);
            })
            .catch(dummy);
        }
      }
    });
  };

  const bootstrap = () => {
    addTodo();
    getTodos();
    getTodosRight();
    removeTodo();
    state.subscribe(() => {
      console.log(state.todos, state.todosRight);
      View.updateTodoList(state.todos, state.todosRight);
    });
  };

  return {
    bootstrap,
  };
})(View, Model);

ViewModel.bootstrap();
