const btn = document.getElementById("single__upload");

const modal = document.getElementById("myModal");

// Get the <span> element that closes the modal
const span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal
btn.onclick = function () {
  modal.style.display = "block";
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

const send = () => {
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
};

function getD(localData) {
  console.log(localData);
}

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

      for (let boards_ in boards) {
        board.options[board.options.length] = new Option(
          boards[boards_].name1,
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
            `<option value=${lang}>${languages[lang]["name"]}</option>`
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
            `<option value=${Class}>${classes[Class]["name"]}</option>`
          );
        }
      };

      class_.onchange = function () {
        $("#subject").html("<option>Select Subject</option>");
        $("#topic").html("<option>Select Topic</option>");

        const selectedBoard = $("#board").val();
        const selectedLanguage = $("#language").val();
        const selectedClass = $("#class").val();

        const subjects = boards[selectedBoard][selectedLanguage][selectedClass];

        for (const subject in subjects) {
          if (subject == "name") continue;

          $("#subject").append(
            `<option value=${subject}>${subjects[subject]["name"]}</option>`
          );
        }
      };

      subject.onchange = function () {
        $("#topic").html("<option>Select Topic</option>");

        const selectedBoard = $("#board").val();
        const selectedLanguage = $("#language").val();
        const selectedClass = $("#class").val();
        const selectedSubject = $("#subject").val();

        const topics =
          boards[selectedBoard][selectedLanguage][selectedClass][
            selectedSubject
          ]["topics"];

        for (const topic in topics) {
          $("#topic").append(
            `<option value=${topic}>${topics[topic]}</option>`
          );
        }
      };
    })
    .catch((e) => {
      console.log(e);
    });
}

const bulkBtn = document.getElementById("bulk__upload");
const bulkModal = document.getElementById("bulkModal");
const bulkClose = document.getElementsByClassName("bulk-modal-close")[0];

// When the user clicks the button, open the bulk upload modal
bulkBtn.onclick = function () {
  bulkModal.style.display = "block";
  getOptionsForBulkAssessment();
};

// When the user clicks the cross button, closes the bulk upload modal
bulkClose.addEventListener("click", () => {
  closeBulkModal();
});

function closeBulkModal() {
  bulkModal.style.display = "none";
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
  console.log("Hello");
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

      for (let boards_ in bulkBoards) {
        board.options[board.options.length] = new Option(
          bulkBoards[boards_].name1,
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
            `<option value=${lang}>${languages[lang]["name"]}</option>`
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
            `<option value=${Class}>${classes[Class]["name"]}</option>`
          );
        }
      };

      class_.onchange = function () {
        $("#bulkModalSubject").html("<option>Select Subject</option>");

        const selectedBoard = $("#bulkModalBoard").val();
        const selectedLanguage = $("#bulkModalLanguage").val();
        const selectedClass = $("#bulkModalClass").val();

        const subjects =
          bulkBoards[selectedBoard][selectedLanguage][selectedClass];

        for (const subject in subjects) {
          if (subject == "name") continue;

          $("#bulkModalSubject").append(
            `<option value=${subject}>${subjects[subject]["name"]}</option>`
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

const user = JSON.parse(window.localStorage.getItem("user"));
const uid = user.uid;

fetch("/getHistory", option)
  .then((res) => {
    return res.json();
  })
  .then((data) => {
    // let path = data;
    let len = Object.keys(data).length;
    let rowIdx = 0;
    for (let i = 0; i < len; i++) {
      let getDate = parseInt(Object.keys(data)[i]);
      let date = new Date(getDate);
      let actualDate = date.toString().slice(0, 21);
      rowIdx++;
      $("#tbody").append(`<tr class="tableRow" id="R${rowIdx}">
       <td id="${getDate}">${actualDate}
        </td>
        <td id="${Object.values(data)[i].board_id}">${
        Object.values(data)[i].board_id
      }
        </td>
        <td id="${Object.values(data)[i].class_id}">${
        Object.values(data)[i].class_name
      }
        </td>
        <td id="${Object.values(data)[i].language_id}">${
        Object.values(data)[i].language_name
      }
        </td>
        <td id="${Object.values(data)[i].subject_id}">${
        Object.values(data)[i].subject_name
      }
        </td>
        <td id="${Object.values(data)[i].topic_id}">${
        Object.values(data)[i].topic_name
      }
        </td>
        <td><button class="view" type="button"><a path="teacher_upload/upload/${uid}/${
        Object.values(data)[i].board_id
      }/${Object.values(data)[i].language_id}/${
        Object.values(data)[i].class_id
      }/${Object.values(data)[i].subject_id}/assessments/${
        Object.values(data)[i].topic_id
      }/questionId">View</a></button>
        </td>
       </tr>`);
    }

    $(".view").on("click", (e) => {
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

      fetch("/getQuestions", opt)
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          let count = 0;
          for (const key in data) {
            if (Object.hasOwnProperty.call(data, key)) {
              const element = data[key];
              count++;
              if (element != null) {
                let html = `<div class="question_forms" id="question_form_${count}">
                      <div class="question_area">
                        <span class="question_num">Q.${count}</span>
                        <input type="text" name="question" class="question" placeholder="Type Your Question Here" value="${
                          element.q
                        }" disabled>
                        <img src="${
                          element.questionImage
                        }" alt="img" width="50" height="50">
                      </div>
                      <div class="option_area">
                        <div class="opt_a">
                          <span class="question_num">A.</span>
                          <input type="text" name="opt_A" class="option" placeholder="Type Option A Here (Right Answer)" value="${
                            element.A.type == "image" ? "" : element.A.value
                          }" disabled>
                          <img src="${
                            element.A.type == "text" ? "" : element.A.value
                          }" width="50" height="50">
                        </div>
                        <div class=" opt_b">
                          <span class="question_num">B.</span>
                          <input type="text" name="opt_B" class="option" placeholder="Type Option B Here" value="${
                            element.B.type == "image" ? "" : element.B.value
                          }" disabled>
                          <img src="${
                            element.B.type == "text" ? "" : element.B.value
                          }" width="50" height="50">
                        </div>
                        <div class="opt_c">
                          <span class="question_num">C.</span>
                          <input type="text" name="opt_C" class="option" placeholder="Type Option C Here" value="${
                            element.C.type == "image" ? "" : element.C.value
                          }" disabled>
                          <img src="${
                            element.C.type == "text" ? "" : element.C.value
                          }" width="50" height="50">
                        </div>
                        <div class="opt_d">
                          <span class="question_num">D.</span>
                          <input type="text" name="opt_D" class="option" placeholder="Type Option D Here" value="${
                            element.D.type == "image" ? "" : element.D.value
                          }" disabled>
                          <img src="${
                            element.D.type == "text" ? "" : element.D.value
                          }" width="50" height="50">
                        </div>
                      </div>
                    </div> `;

                document.getElementById("set_questions").innerHTML += html;
              }
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    });
  })
  .catch((err) => {
    console.log(err);
  });
