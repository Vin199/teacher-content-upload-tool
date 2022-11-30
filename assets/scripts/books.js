let notes_btn = document.getElementById("notes_single_upload");

let notes_modal = document.getElementById("notes_modal");

// Get the <span> element that closes the modal
let notes_span = document.getElementsByClassName("notes_close")[0];

// When the user clicks the button, open the modal
notes_btn.onclick = function () {
  notes_modal.style.display = "block";
  getData();
};

notes_span.addEventListener("click", () => {
  closeNotesModal();
});

function closeNotesModal() {
  notes_modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.addEventListener("click", (event) => {
  if (event.target == notes_modal) {
    notes_modal.style.display = "none";
  }
});

let notesForm = document.querySelector("form");
notesForm.onsubmit = storeNotesFormData;

function storeNotesFormData(e) {
  let notesData = {};
  e.preventDefault();
  const notesFormData = new FormData(notesForm);
  for (let key of notesFormData.keys()) {
    notesData[key] = notesFormData.get(key);
  }

  window.localStorage.setItem("notesMetaData", JSON.stringify(notesData));
  sendNotesData();
}

const sendNotesData = () => {
  const notesStorageData = JSON.parse(
    window.localStorage.getItem("notesMetaData")
  );
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(notesStorageData),
  };

  fetch("/notesLinks", options)
    .then((res) => {
      window.location.href = "/uploadNotesLinks";
      return res.json();
    })
    .then((res) => {
      console.log(res);
    })
    .catch((e) => {
      console.log(e);
    });
};

function getData() {
  const option = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  fetch("/users", option)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      let board = document.getElementById("board");
      let language = document.getElementById("language");
      let class_ = document.getElementById("class");
      let subject = document.getElementById("subject");
      let boards = data;

      console.log(data);

      for (let boards_ in boards) {
        board.options[board.options.length] = new Option(
          boards_,
          boards_
        );
      }

      board.onchange = function () {
        $("#language").html("<option>Select Language</option>");
        $("#subject").html("<option>Select Subject</option>");
        $("#topic").html("<option>Select Topic</option>");
        $("#class").html("<option>Select Class</option>");

        const selectedBoard = $("#board").val();

        const languages = boards[selectedBoard];

        for (const lang in languages) {
          if (lang == "name1") continue;

          $("#language").append(
            `<option value=${lang}>${lang}</option>`
          );
        }
      };

      language.onchange = function () {
        $("#class").html("<option>Select Class</option>");
        $("#subject").html("<option>Select Subject</option>");
        $("#topic").html("<option>Select Topic</option>");

        const selectedBoard = $("#board").val();
        const selectedLanguage = $("#language").val();

        const classes = boards[selectedBoard][selectedLanguage];

        for (const Class in classes) {
          if (Class == "name") continue;

          $("#class").append(
            `<option value=${Class}>${Class}</option>`
          );
        }
      };

      class_.onchange = function () {
        $("#subject").html("<option>Select Subject</option>");
        $("#topic").html("<option>Select Topic</option>");

        const selectedBoard = $("#board").val();
        const selectedLanguage = $("#language").val();
        const selectedClass = $("#class").val();

        const subjects = boards[selectedBoard][selectedLanguage][selectedClass]["subjects"];

        for (const subject in subjects) {
          if (subject == "name") continue;

          $("#subject").append(
            `<option value=${subject}>${subject}</option>`
          );
        }
      };

      subject.onchange = function () {
        $("#topic").html("<option>Select Topic</option>");

        const selectedBoard = $("#board").val();
        const selectedLanguage = $("#language").val();
        const selectedClass = $("#class").val();
        const selectedSubject = $("#subject").val();

        const topics = boards[selectedBoard][selectedLanguage][selectedClass]["subjects"][selectedSubject];

        for (const topic in topics) {
          $("#topic").append(
            `<option value=${topic}>${topic}</option>`
          );
        }
      };
    })
    .catch((e) => {
      console.log(e);
    });
}

const booksBulkBtn = document.getElementById("notes_bulk_upload");
const booksBulkModal = document.getElementById("notesBulkModal");
const booksBulkClose = document.getElementsByClassName(
  "notes-bulk-modal-close"
)[0];

// When the user clicks the button, open the bulk upload modal
booksBulkBtn.onclick = function () {
  booksBulkModal.style.display = "block";
  getOptionsForBulkBooks();
};

// When the user clicks the cross button, closes the bulk upload modal
booksBulkClose.addEventListener("click", () => {
  closeBooksBulkModal();
});

function closeBooksBulkModal() {
  booksBulkModal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.addEventListener("click", (event) => {
  if (event.target == booksBulkModal) {
    booksBulkModal.style.display = "none";
  }
});

let booksBulkForm = document.getElementById("notesBulkData");
booksBulkForm.onsubmit = storeBooksBulkFormData;

function storeBooksBulkFormData(e) {
  let booksBulkData = {};
  e.preventDefault();
  const booksBulkFormData = new FormData(booksBulkForm);
  for (let key of booksBulkFormData.keys()) {
    booksBulkData[key] = booksBulkFormData.get(key);
  }

  const isBooksModalTrue = {
    isTrue: null,
  };

  window.localStorage.setItem("isTrue", JSON.stringify(isBooksModalTrue));
  window.localStorage.setItem(
    "booksBulkMetaData",
    JSON.stringify(booksBulkData)
  );
  sendBooksBulkData();
}

const sendBooksBulkData = () => {
  const localBooksBulkData = JSON.parse(
    window.localStorage.getItem("booksBulkMetaData")
  );
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(localBooksBulkData),
  };

  fetch("/create-bulk-books", options)
    .then((res) => {
      window.location.href = "/bulk-upload-books";
      return res.json();
    })
    .then((res) => {
      console.log(res);
    })
    .catch((e) => {
      console.log(e);
    });
};

function getOptionsForBulkBooks() {
  const option = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  fetch("/users", option)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      let board = document.getElementById("notesBulkModalBoard");
      let language = document.getElementById("notesBulkModalLanguage");
      let class_ = document.getElementById("notesBulkModalClass");
      let bulkBoards = data;

      console.log(data);

      for (let boards_ in bulkBoards) {
        board.options[board.options.length] = new Option(
          boards_,
          boards_
        );
      }

      board.onchange = function () {
        $("#notesBulkModalLanguage").html("<option>Select Language</option>");
        $("#notesBulkModalClass").html("<option>Select Class</option>");
        $("#notesBulkModalSubject").html("<option>Select Subject</option>");

        const selectedBoard = $("#notesBulkModalBoard").val();

        const languages = bulkBoards[selectedBoard];

        for (const lang in languages) {
          if (lang == "name1") continue;

          $("#notesBulkModalLanguage").append(
            `<option value=${lang}>${lang}</option>`
          );
        }
      };

      language.onchange = function () {
        $("#notesBulkModalClass").html("<option>Select Class</option>");
        $("#notesBulkModalSubject").html("<option>Select Subject</option>");

        const selectedBoard = $("#notesBulkModalBoard").val();
        const selectedLanguage = $("#notesBulkModalLanguage").val();

        const classes = bulkBoards[selectedBoard][selectedLanguage];

        for (const Class in classes) {
          if (Class == "name") continue;

          $("#notesBulkModalClass").append(
            `<option value=${Class}>${Class}</option>`
          );
        }
      };

      class_.onchange = function () {
        $("#notesBulkModalSubject").html("<option>Select Subject</option>");

        const selectedBoard = $("#notesBulkModalBoard").val();
        const selectedLanguage = $("#notesBulkModalLanguage").val();
        const selectedClass = $("#notesBulkModalClass").val();

        const subjects = bulkBoards[selectedBoard][selectedLanguage][selectedClass]["subjects"];

        for (const subject in subjects) {
          if (subject == "name") continue;

          $("#notesBulkModalSubject").append(
            `<option value=${subject}>${subject}</option>`
          );
        }
      };
    })
    .catch((e) => {
      console.log(e);
    });
}
