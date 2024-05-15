// Этап 1. В HTML файле создайте верстку элементов, которые будут статичны(неизменны).
const tableHeader = [
  "ФИО",
  "Факультет",
  "Дата рождения (возраст)",
  "Годы обучения (курс)",
  "Удаление",
];

const tableClass = ["table", "caption-top", "table-striped", "table-hover"],
  tableBtnClass = ["btn", "btn-outline-primary", "btn-th"],
  errorMsg = document.querySelector(".validation-error"),
  filterCancelBtn = document.querySelector(".btn-cancel");

// очищаем поля фильтра
filterCancelBtn.addEventListener("click", function () {
  $fio.value = "";
  $faculty.value = "";
  $birthDateAge.value = "";
  $studyStart.value = "";
  renderStudentsTable(StudentsListForRender);
});

const $tableWrapper = document.getElementById("table"),
  $table = document.createElement("table"),
  $tableCaption = document.createElement("caption"),
  $tableHead = document.createElement("thead"),
  $tableHeadRow = document.createElement("tr"),
  $tableHeaderCol1 = document.createElement("th"),
  $tableHeaderCol2 = document.createElement("th"),
  $tableHeaderCol3 = document.createElement("th"),
  $tableHeaderCol4 = document.createElement("th"),
  $tableHeaderCol5 = document.createElement("th"),
  $tableHeaderFio = document.createElement("button"),
  $tableHeaderFaculty = document.createElement("button"),
  $tableHeaderBirthDateAge = document.createElement("button"),
  $tableHeaderstudyStart = document.createElement("button"),
  $tableFilterBody = document.createElement("tbody"),
  $tableBody = document.createElement("tbody");

for (let i = 0; i < tableClass.length; i++) {
  $table.classList.add(tableClass[i]); // добавляем классы таблице
}

$tableHeaderFio.textContent = tableHeader[0];
$tableHeaderFaculty.textContent = tableHeader[1];
$tableHeaderBirthDateAge.textContent = tableHeader[2];
$tableHeaderstudyStart.textContent = tableHeader[3];
$tableHeaderCol5.textContent = tableHeader[4];

$tableHeaderCol5.classList.add("delete-btn-header");

$tableCaption.textContent = "Список студентов:";

for (let i = 0; i < tableBtnClass.length; i++) {
  $tableHeaderFio.classList.add(tableBtnClass[i]);
  $tableHeaderFaculty.classList.add(tableBtnClass[i]);
  $tableHeaderBirthDateAge.classList.add(tableBtnClass[i]);
  $tableHeaderstudyStart.classList.add(tableBtnClass[i]);
}

$tableHeaderCol1.append($tableHeaderFio);
$tableHeaderCol2.append($tableHeaderFaculty);
$tableHeaderCol3.append($tableHeaderBirthDateAge);
$tableHeaderCol4.append($tableHeaderstudyStart);
$tableHeadRow.append(
  $tableHeaderCol1,
  $tableHeaderCol2,
  $tableHeaderCol3,
  $tableHeaderCol4,
  $tableHeaderCol5
);
$tableHead.append($tableHeadRow);
$table.append($tableHead, $tableCaption);
$tableWrapper.append($table);

// добавляем строку для фильтрации:
const $filterHeadRow = document.createElement("tr"),
  $filterCol1 = document.createElement("td"),
  $filterCol2 = document.createElement("td"),
  $filterCol3 = document.createElement("td"),
  $filterCol4 = document.createElement("td"),
  $filterCol5 = document.createElement("td"),
  $filterBody = document.createElement("tbody");

$filterCol1.innerHTML =
  '<input type="text" id="fio" class="form-control" placeholder="Фильтр по ФИО" required id="inputName">';
$filterCol2.innerHTML =
  '<input type="text" id="faculty" class="form-control" placeholder="Фильтр по факультету" required id="inputName">';
$filterCol3.innerHTML =
  '<input type="text" id="birthDateAge" class="form-control" placeholder="Фильтр по возрасту" required id="inputName">';
$filterCol4.innerHTML =
  '<input type="text" id="studyStart" class="form-control" placeholder="Фильтр по годам обучения" required id="inputName">';
$filterCol5.innerHTML =
  '<button id="delete-all" class="btn btn-outline-primary col-md-3 col-sm-6 btn-th">Удалить всех</button>';

$filterHeadRow.append(
  $filterCol1,
  $filterCol2,
  $filterCol3,
  $filterCol4,
  $filterCol5
);
$tableFilterBody.append($filterHeadRow);
$table.append($tableFilterBody);

let $fio = document.getElementById("fio");
let $faculty = document.getElementById("faculty");
let $birthDateAge = document.getElementById("birthDateAge");
let $studyStart = document.getElementById("studyStart");

// Загружаем список студентов с сервера
let responce;
let studentsList;
async function getStudentsFromDB() {
  responce = await fetch("http://localhost:3000/api/students");
  studentsList = await responce.json();
  if (!studentsList.length) {
    alert("Данные на сервере отсутсуют");
    studentsList = [];
  }
}

await getStudentsFromDB();

let copyStudentsList = [...studentsList];
let StudentsListForRender = [];

// Этап 3. Создайте функцию вывода одного студента в таблицу, по аналогии с тем, как вы делали вывод одного дела в модуле 8. Функция должна вернуть html элемент с информацией и пользователе.У функции должен быть один аргумент - объект студента.

function getStudentItem(studentObj) {
  const $item = document.createElement("tr"),
    $tableDataFio = document.createElement("td"),
    $tableDataBirthDateAge = document.createElement("td"),
    $tableDataStudyStart = document.createElement("td"),
    $tableDataFaculty = document.createElement("td"),
    $tableDataDeleteBtn = document.createElement("td");

  let $deleteButton = document.createElement("button");
  $tableDataFio.textContent = studentObj.fio;
  $tableDataFaculty.textContent = studentObj.faculty;
  $tableDataBirthDateAge.textContent = studentObj.birthDateAge;
  $tableDataStudyStart.textContent = studentObj.studyStart;

  //создаем кнопку удаления студента:
  $deleteButton.classList.add(
    "btn",
    "btn-outline-primary",
    "col-md-3",
    "col-sm-6",
    "btn-th",
    "btn-delete"
  );
  $deleteButton.textContent = "Удалить студента";

  // присваеваем id студента кнопке:
  $deleteButton.setAttribute("id", studentObj.id);

  // добавляем обработчик на кнопку - удаление задачи
  $deleteButton.addEventListener("click", function () {
    onDelete({ studentObj, element: $item });
  });

  // присваеваем id студента элементу':
  $item.setAttribute("id", studentObj.id);
  $item.append($tableDataFio);
  $item.append($tableDataFaculty);
  $item.append($tableDataBirthDateAge);
  $item.append($tableDataStudyStart);
  $tableDataDeleteBtn.append($deleteButton);
  $item.append($tableDataDeleteBtn);
  $tableBody.append($item);
  $table.append($tableBody);
  return $item;
}

// Этап 4. Создайте функцию отрисовки всех студентов. Аргументом функции будет массив студентов.Функция должна использовать ранее созданную функцию создания одной записи для студента.Цикл поможет вам создать список студентов.Каждый раз при изменении списка студента вы будете вызывать эту функцию для отрисовки таблицы.

//подготовка массива для рендера, с объектами из 4-х элеменов.
function preRender(copyStudentsList) {
  for (const studentObj of copyStudentsList) {
    let birthday = new Date(studentObj.birthday)
      .toJSON()
      .split("T")[0]
      .split("-")
      .reverse()
      .join(".");

    let StudentsObjForRender = {
      fio:
        studentObj.surname + " " + studentObj.name + " " + studentObj.lastname,
      faculty: studentObj.faculty,
      birthDateAge: `${birthday} (${getAge(studentObj.birthday)})`,
      studyStart: `${studentObj.studyStart} - ${
        parseInt(studentObj.studyStart) + 4
      } (${getCource(studentObj.studyStart)})`,
      id: studentObj.id,
    };
    StudentsListForRender.push(StudentsObjForRender);
  }
}

preRender(copyStudentsList);

// функция фильтрации массива:
function filterTable(col, param, arr) {
  return arr.filter((oneUser) =>
    oneUser[param].toLowerCase().includes(col.value.trim().toLowerCase())
  );
}

//рендер подготовленного массива + фильтрация по всем колонкам.
function renderStudentsTable(arr) {
  $tableBody.innerHTML = ""; // очищаем тело таблицы
  let copyList = [...arr]; // создаем копию массива

  // Фильтрация таблицы по всем столбцам:
  if ($fio.value.trim() !== "") {
    copyList = filterTable($fio, "fio", copyList);
  }
  if ($faculty.value.trim() !== "") {
    copyList = filterTable($faculty, "faculty", copyList);
  }
  if ($birthDateAge.value.trim() !== "") {
    copyList = filterTable($birthDateAge, "birthDateAge", copyList);
  }
  if ($studyStart.value.trim() !== "") {
    copyList = filterTable($studyStart, "studyStart", copyList);
  }

  // показываем или скрываем кнопку сброса фильтра:
  if (
    $fio.value.trim() !== "" ||
    $faculty.value.trim() !== "" ||
    $birthDateAge.value.trim() !== "" ||
    $studyStart.value.trim() !== ""
  ) {
    filterCancelBtn.classList.remove("d-none");
  } else {
    filterCancelBtn.classList.add("d-none");
  }

  // рендерим всю таблицу
  for (const studentObj of copyList) {
    getStudentItem(studentObj);
  }
}

renderStudentsTable(StudentsListForRender);

// Этап 5. К форме добавления студента добавьте слушатель события отправки формы, в котором будет проверка введенных данных.Если проверка пройдет успешно, добавляйте объект с данными студентов в массив студентов и запустите функцию отрисовки таблицы студентов, созданную на этапе 4.

const $studentForm = document.getElementById("studentForm");

$studentForm.addEventListener("submit", async function (event) {
  event.preventDefault(); // отменяем перезагрузку страницы

  const inputName = document.getElementById("inputName"),
    inputLastname = document.getElementById("inputLastname"),
    inputSurname = document.getElementById("inputSurname"),
    inputBirthDate = document.getElementById("inputBirthDate"),
    inputStudyStart = document.getElementById("inputStudyStart"),
    inputFaculty = document.getElementById("inputFaculty");

  // Валидация
  if (inputName.value.trim() == "") {
    errorMsg.textContent = "Имя не введено!";
    return;
  }

  if (inputLastname.value.trim() == "") {
    errorMsg.textContent = "Отчество не введено!";
    return;
  }

  if (inputSurname.value.trim() == "") {
    errorMsg.textContent = "Фамилия не введена!";
    return;
  }

  if (inputBirthDate.value == "") {
    errorMsg.textContent = "Дата рождения не введена!";
    return;
  }

  if (inputBirthDate.valueAsDate > new Date()) {
    errorMsg.textContent = "Дата рождения не корректна!";
    return;
  }

  if (inputBirthDate.valueAsDate < new Date(1900, 0, 1)) {
    errorMsg.textContent = "Дата рождения не корректна!";
    return;
  }

  if (inputStudyStart.value.trim() == "") {
    errorMsg.textContent = "Год начала обучения не введен!";
    return;
  }

  if (inputStudyStart.value > new Date().getFullYear()) {
    errorMsg.textContent = "Год начала обучения не корректен!";
    return;
  }

  if (inputStudyStart.value < new Date(2000, 0, 1).getFullYear()) {
    errorMsg.textContent = "Год начала обучения не корректен!";
    return;
  }

  if (inputFaculty.value.trim() == "") {
    errorMsg.textContent = "Факультет не введен!";
    return;
  }

  const responce = await fetch("http://localhost:3000/api/students", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: inputName.value,
      surname: inputSurname.value,
      lastname: inputLastname.value,
      birthday: inputBirthDate.valueAsDate,
      studyStart: inputStudyStart.value,
      faculty: inputFaculty.value,
    }),
  });

  let newStudent = await responce.json();

  preRender(copyStudentsList); //пререндер - в массив объектов по 4 элемента
  renderStudentsTable(StudentsListForRender); //отрисовываем таблицу

  // отчистка формы, после добавления студента в массив
  inputName.value = "";
  inputSurname.value = "";
  inputLastname.value = "";
  inputBirthDate.value = "";
  inputStudyStart.value = "";
  inputFaculty.value = "";
  errorMsg.textContent = "";
});

// Этап 5. Создайте функцию сортировки массива студентов и добавьте события кликов на соответствующие колонки.
let sortDirection = true;

const sortArr = (arr, property, sortDirection) => {
  arr.sort((a, b) =>
    (sortDirection ? a[property] < b[property] : a[property] > b[property])
      ? -1
      : 1
  );
  renderStudentsTable(arr);
};

$tableHeaderFio.addEventListener("click", () => {
  sortDirection = !sortDirection;
  sortArr(StudentsListForRender, "fio", sortDirection);
});

$tableHeaderFaculty.addEventListener("click", () => {
  sortDirection = !sortDirection;
  sortArr(StudentsListForRender, "faculty", sortDirection);
});

$tableHeaderstudyStart.addEventListener("click", () => {
  sortDirection = !sortDirection;
  let property = "studyStart";
  sortArr(StudentsListForRender, "studyStart", sortDirection);
});

//сортировка по дате рождения (перевод даты формата дд.мм.гггг в обьект new Date)
const sortArrAge = (arr, sortDirection) => {
  arr.sort((a, b) =>
    (
      sortDirection
        ? new Date(
            a.birthDateAge.slice(0, 10).split(".")[2],
            a.birthDateAge.slice(0, 10).split(".")[1] - 1,
            a.birthDateAge.slice(0, 10).split(".")[0]
          ) <
          new Date(
            b.birthDateAge.slice(0, 10).split(".")[2],
            b.birthDateAge.slice(0, 10).split(".")[1] - 1,
            b.birthDateAge.slice(0, 10).split(".")[0]
          )
        : new Date(
            a.birthDateAge.slice(0, 10).split(".")[2],
            a.birthDateAge.slice(0, 10).split(".")[1] - 1,
            a.birthDateAge.slice(0, 10).split(".")[0]
          ) >
          new Date(
            b.birthDateAge.slice(0, 10).split(".")[2],
            b.birthDateAge.slice(0, 10).split(".")[1] - 1,
            b.birthDateAge.slice(0, 10).split(".")[0]
          )
    )
      ? -1
      : 1
  );
  renderStudentsTable(arr);
};

$tableHeaderBirthDateAge.addEventListener("click", () => {
  sortDirection = !sortDirection;
  sortArrAge(StudentsListForRender, sortDirection);
});

// Этап 6. Создайте функцию фильтрации массива студентов и добавьте события для элементов формы.

$fio.addEventListener("input", () => {
  renderStudentsTable(StudentsListForRender);
});

$faculty.addEventListener("input", () => {
  renderStudentsTable(StudentsListForRender);
});

$birthDateAge.addEventListener("input", () => {
  renderStudentsTable(StudentsListForRender);
});

$studyStart.addEventListener("input", () => {
  renderStudentsTable(StudentsListForRender);
});

// вспомогательные функции >>>>-------------->

// рассчитываем возраст студента
function getAge(date) {
  return (
    ((new Date().getTime() - new Date(date)) / (24 * 3600 * 365.25 * 1000)) | 0
  );
}

// рассчитываем курс студента
function getCource(date) {
  let cource = new Date().getFullYear() - date;
  return cource > 4 ? "закончил" : cource;
}

// функция удлаения одного студента с сервера и с сайта:
function onDelete({ studentObj, element }) {
  if (!confirm("Вы уверены?")) {
    return;
  }
  element.remove();
  fetch(`http://localhost:3000/api/students/${studentObj.id}`, {
    method: "DELETE",
  });
}

// очиска списка студентов на сервере:
// задаем кнопку
const $deleteAll = document.getElementById("delete-all");
// вешаем событие клик - удаление на сервере
$deleteAll.addEventListener("click", function () {
  if (!confirm("Удалить всех студентов?")) {
    return;
  }
  deleteAll();
});

// функция удаления всех студентов на сервере:
function deleteAll() {
  for (const student of studentsList) {
    fetch(`http://localhost:3000/api/students/${student.id}`, {
      method: "DELETE",
    });
  }
}
