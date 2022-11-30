const btn = document.getElementById("single__upload");

const modal = document.getElementById("myModal");

// Get the <span> element that closes the modal
const span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal
btn.onclick = function () {
  modal.style.display = "block";
  btn.style.border = "1px solid #0077FF";
  getOptionsForSingleAssessment();
};

// When the user clicks on <span> (x), close the modal
/* span.onclick = function () {
    modal.style.display = "none";
} */
span.addEventListener("click", () => {
  closeModal();
});

function closeModal() {
  modal.style.display = "none";
  btn.style.border = "1px solid #64748B";
}

// When the user clicks anywhere outside of the modal, close it
window.addEventListener("click", (event) => {
  if (event.target == modal) {
    modal.style.display = "none";
  }
});

let assessmentForm = document.getElementById("initData");
assessmentForm.onsubmit = storeFormData;

function storeFormData(e) {
  let data = {};
  e.preventDefault();
  const formData = new FormData(assessmentForm);
  for (let key of formData.keys()) {
    data[key] = formData.get(key);
  }

  window.localStorage.setItem("assessmentMetaData", JSON.stringify(data));
  send();
}

const send = async () => {
  let localData = JSON.parse(window.localStorage.getItem("assessmentMetaData"));
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(localData),
  };

  fetch("/create-assessment", options)
    .then((res) => {
      window.location.href = "/createAssessment";
      return res.json();
    })
    .then((res) => {
      console.log(res);
    })
    .catch((e) => {
      console.log(e);
    });

  const historyOpt = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(historyObj),
  };

  fetch("/setHistory", historyOpt)
    .then((res) => {
      return res.json();
    })
    .then((result) => {
      console.log(result);
    })
    .catch((error) => {
      console.log(error);
    });
};

let historyObj = {
  board_id: "",
  board_name: "",
  class_id: "",
  class_name: "",
  language_id: "",
  language_name: "",
  subject_id: "",
  subject_name: "",
  topic_id: "",
  topic_name: "",
};

function getOptionsForSingleAssessment() {
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

        historyObj.board_id = selectedBoard;
        historyObj.board_name = selectedBoard;

        const languages = boards[selectedBoard];

        for (const lang in languages) {
          if (lang == "name1") continue;

          historyObj.language_id = lang;
          historyObj.language_name = languages[lang]["name"];

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

          historyObj.class_id = Class;
          historyObj.class_name = Class;

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

          historyObj.subject_id = subject;
          historyObj.subject_name = subjects[subject]["name"];

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

const topicValue = document.getElementById("topic");
topicValue.addEventListener("change", () => {
  historyObj.topic_id = topicValue.value;
  historyObj.topic_name = topicValue.options[topicValue.selectedIndex].text;
});

const bulkBtn = document.getElementById("bulk__upload");
const bulkModal = document.getElementById("bulkModal");
const bulkClose = document.getElementsByClassName("bulk-modal-close")[0];

// When the user clicks the button, open the bulk upload modal
bulkBtn.onclick = function () {
  bulkModal.style.display = "block";
  bulkBtn.style.border = "1px solid #0077FF";
  getOptionsForBulkAssessment();
};

// When the user clicks the cross button, closes the bulk upload modal
bulkClose.addEventListener("click", () => {
  closeBulkModal();
});

function closeBulkModal() {
  bulkModal.style.display = "none";
  bulkBtn.style.border = "1px solid #64748B";
}

// When the user clicks anywhere outside of the modal, close it
window.addEventListener("click", (event) => {
  if (event.target == bulkModal) {
    bulkModal.style.display = "none";
  }
});

let bulkForm = document.getElementById("initDataBulk");
bulkForm.onsubmit = storeBulkFormData;

function storeBulkFormData(e) {
  e.preventDefault();
  let bulkData = {};
  const bulkFormData = new FormData(bulkForm);
  for (let key of bulkFormData.keys()) {
    bulkData[key] = bulkFormData.get(key);
  }

  const isModalTrue = {
    isTrue: null,
  };

  window.localStorage.setItem("isTrue", JSON.stringify(isModalTrue));
  window.localStorage.setItem("bulkMetaData", JSON.stringify(bulkData));
  sendBulkData();
}

const sendBulkData = () => {
  const localBulkData = JSON.parse(window.localStorage.getItem("bulkMetaData"));
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(localBulkData),
  };

  fetch("/create-bulk-assessment", options)
    .then((res) => {
      window.location.href = "/bulk-upload-assessment";
      return res.json();
    })
    .then((res) => {
      console.log(res);
    })
    .catch((e) => {
      console.log(e);
    });
};

function getOptionsForBulkAssessment() {
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
      let board = document.getElementById("bulkModalBoard");
      let language = document.getElementById("bulkModalLanguage");
      let class_ = document.getElementById("bulkModalClass");
      let bulkBoards = data;

      console.log(data);

      for (let boards_ in bulkBoards) {
        board.options[board.options.length] = new Option(
          boards_,
          boards_
        );
      }

      board.onchange = function () {
        $("#bulkModalLanguage").html("<option>Select Language</option>");
        $("#bulkModalSubject").html("<option>Select Subject</option>");
        $("#bulkModalClass").html("<option>Select Class</option>");

        const selectedBoard = $("#bulkModalBoard").val();

        const languages = bulkBoards[selectedBoard];

        for (const lang in languages) {
          if (lang == "name1") continue;

          $("#bulkModalLanguage").append(
            `<option value=${lang}>${lang}</option>`
          );
        }
      };

      language.onchange = function () {
        $("#bulkModalClass").html("<option>Select Class</option>");
        $("#bulkModalSubject").html("<option>Select Subject</option>");

        const selectedBoard = $("#bulkModalBoard").val();
        const selectedLanguage = $("#bulkModalLanguage").val();

        const classes = bulkBoards[selectedBoard][selectedLanguage];

        for (const Class in classes) {
          if (Class == "name") continue;

          $("#bulkModalClass").append(
            `<option value=${Class}>${Class}</option>`
          );
        }
      };

      class_.onchange = function () {
        $("#bulkModalSubject").html("<option>Select Subject</option>");

        const selectedBoard = $("#bulkModalBoard").val();
        const selectedLanguage = $("#bulkModalLanguage").val();
        const selectedClass = $("#bulkModalClass").val();

        const subjects = bulkBoards[selectedBoard][selectedLanguage][selectedClass]["subjects"];

        for (const subject in subjects) {
          if (subject == "name") continue;

          $("#bulkModalSubject").append(
            `<option value=${subject}>${subject}</option>`
          );
        }
      };
    })
    .catch((e) => {
      console.log(e);
    });
}

const option = {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
};

const user = JSON.parse(window.localStorage.getItem("userInfo"));
const uid = user.uid;

fetch("/getHistory", option)
  .then((res) => {
    return res.json();
  })
  .then((data) => {
    // let path = data;
    console.log(data);
    let len = Object.keys(data).length;
    let rowIdx = 0;
    for (let i = 0; i < len; i++) {
      let getDate = parseInt(Object.keys(data)[i]);
      let date = new Date(getDate);
      let actualDate = date.toString().slice(0, 21);
      rowIdx++;
      const tableBody = document.querySelector(".tableBody");
      const {
        board_id,
        class_name,
        language_name,
        subject_name,
        topic_name,
        language_id,
        class_id,
        subject_id,
        topic_id,
      } = Object.values(data)[i];
      const dataHtml = `<div class="tableRow" id="R${rowIdx}">\
        <div class="tableData">${board_id}</div>\
        <div class="tableData">${language_id}</div>\
        <div class="tableData">${class_name}</div>\
        <div class="tableData">${subject_id}</div>\
        <div class="tableData">${topic_name}</div>\
        <div class="tableData" id="${getDate}">${Intl.DateTimeFormat(
        ["ban", "id"], //bangladesh & Indonesia
        {
          month: "2-digit",
          year: "2-digit",
          day: "2-digit",
          minute: "2-digit",
          hour: "2-digit",
          hourCycle: "h12",
        }
      ).format(new Date(actualDate))}</div>\
        <div class="tableData">\
          <button class="view" type="button" path="teacher_upload/upload/${uid}/${board_id}/${language_id}/${class_name}/${subject_id}/assessments/${topic_name}/questions">\
          View\
          </button>\
        </div>\
      </div>`;

      tableBody.innerHTML += dataHtml;
    }

    $(".view").on("click", async (e) => {
      const pathObj = {
        path: $(e.target).attr("path"),
      };

      const opt = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pathObj),
      };

      const response = await fetch("/getQuestions", opt);
      const quesData = await response.json();
      window.localStorage.setItem("historyData", JSON.stringify(quesData));
      location.href = "/showHistory";
    });
  })
  .catch((err) => {
    console.log(err);
  });
