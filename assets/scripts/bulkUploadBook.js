const createAssessmentModal = document.getElementById("submitModal");
const createAssessmentClose = document.getElementsByClassName(
  "create-assessment-close"
)[0];
const displayProgress = document.getElementById("ImgProgress");
const finalSubmitBtn = document.getElementById("finalSubmit");

const bulkBookModalMsgBox = document.getElementById("getBulkBookModal");
const bulkBookMsgCloseBtn = document.getElementsByClassName(
  "bulk-book-modal-close"
)[0];

const loadBulkBookModal = JSON.parse(window.localStorage.getItem("isTrue"));

const notesBulkMetadata = JSON.parse(
  window.localStorage.getItem("booksBulkMetaData")
);

const teacher_info = JSON.parse(window.localStorage.getItem("userInfo"));
const notesData = JSON.parse(window.localStorage.getItem("notesMetaData"));

const questions = document.getElementsByClassName("notes-ques-forms");

document.getElementById("submit").addEventListener("click", async () => {
  let qsnCounter = (await getCount()) + 1;
  Array.from(questions).forEach((element) => {
    setVideoObj(element, qsnCounter);
    qsnCounter++;
  });

  // When the user clicks the submit button, open the modal
  createAssessmentModal.style.display = "block";

  updateDatabase();
});

window.onload = function () {
  if (loadBulkBookModal.isTrue === null) {
    bulkBookModalMsgBox.style.display = "block";

    bulkBookMsgCloseBtn.addEventListener("click", () => {
      closeBulkBookModalMsg();
    });

    function closeBulkBookModalMsg() {
      bulkBookModalMsgBox.style.display = "none";
    }

    window.localStorage.setItem("isTrue", false);
  }
};

let parentObj = {
  details: {
    qsn_Id: 0,
  },
};

let selectedFileBook;

document.getElementById("ejs").style.display = "none";

document.getElementById("fileId").addEventListener("change", (e) => {
  selectedFileBook = e.target.files[0];
  document.getElementById("bulkContent").style.display = "none";
  document.getElementById("ejs").style.display = "block";
});

document.getElementById("submit").style.display = "none";

function displayNextBtn() {
  document.getElementById("submit").style.display = "block";
}

window.displayNextBtn = displayNextBtn;

let bookWb = XLSX.utils.book_new();
bookWb.Props = {
  Title: "Assessment Sheet",
  Subject: "Test",
  Author: "Vinay Maurya",
  CreatedDate: new Date().getDate(),
};

const option = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(notesBulkMetadata),
};

const response = await fetch("/getTopics", option);
const data = await response.json();

Object.values(data).forEach((ele) => {
  bookWb.SheetNames.push(ele);
  let book_ws_header = [["name", "link"]];
  let video_ws = XLSX.utils.aoa_to_sheet(book_ws_header);
  bookWb.Sheets[ele] = video_ws;
});

let bookWbAbout = XLSX.write(bookWb, { bookType: "xlsx", type: "binary" });
function s2ab(s) {
  let buff = new ArrayBuffer(s.length);
  let view = new Uint8Array(buff);
  for (let i = 0; i < s.length; i++) {
    view[i] = s.charCodeAt(i) & 0xff;
  }
  return buff;
}
$("#dwnldBookTemplateModal").click(function () {
  saveAs(
    new Blob([s2ab(bookWbAbout)], { type: "application/octet-stream" }),
    "Books-Assessment.xlsx"
  );
  bulkBookModalMsgBox.style.display = "none";
});

document.getElementById("dwnldBookTemplateMain").onclick = function () {
  saveAs(
    new Blob([s2ab(bookWbAbout)], { type: "application/octet-stream" }),
    "Books-Assessment.xlsx"
  );
};

function readData() {
  if (selectedFileBook) {
    let fileReader = new FileReader();
    fileReader.onload = function (e) {
      let data = e.target.result;
      let workBook = XLSX.read(data, {
        type: "binary",
      });

      let sheet_name_list = workBook.SheetNames;

      setOptions(sheet_name_list, workBook);
    };
    fileReader.readAsBinaryString(selectedFileBook);
  }
}

let optionValue;

const setOptions = async (sheet_name_list, workBook) => {
  const option = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(notesBulkMetadata),
  };

  const response = await fetch("/getTopics", option);
  const result = await response.json();

  Object.keys(result).forEach((elem) => {
    $("#topics").append(`<option value="${elem}">${result[elem]}</option>`);
  });

  let allQuestions = [];
  workBook.SheetNames.forEach((sheet) => {
    let rowObject = XLSX.utils.sheet_to_row_object_array(
      workBook.Sheets[sheet]
    );
    allQuestions.push(rowObject);
  });

  document.getElementById("topics").addEventListener("change", (e) => {
    const options = e.target.querySelectorAll("option");
    let selectedoption = null;
    options.forEach((element) => {
      if (element.value == e.target.value) {
        selectedoption = element.innerHTML;
      }
    });
    const topicIndex = sheet_name_list.indexOf(selectedoption);
    if (topicIndex == -1) return alert("sheet name not found");
    const questionObj = allQuestions[topicIndex];
    let count = 0;
    document.getElementById("set_questions").innerHTML = "";
    for (const key in questionObj) {
      if (Object.hasOwnProperty.call(questionObj, key)) {
        const element = questionObj[key];
        count++;
        let html = `<div class="notes-ques-forms" id="question_form_${count}">
            <div class="notes-ques-area">
                <span class="notes-question-num">${count}.</span>
                <input type="text" name="notesName" class="notes-name" placeholder="Notes/Books Name" value="${
                  element.name == undefined ? "" : element.name
                }">
                <input type="text" class="notes-link" name="notesLink" placeholder="Notes/Books Name" value="${
                  element.link == undefined ? "" : element.link
                }">
            </div>
        </div>`;

        document.getElementById("set_questions").innerHTML += html;
      }
    }
    optionValue = e.target.value;
    checkAuth(questions);
  });
};

const sendBookLinkData = (parentObj) => {
  createAssessmentModal.style.display = "none";

  return new Promise((resolve, reject) => {
    const notesInfo = {
      notesMetaDataInfo: notesData,
      notesData: parentObj,
      teacher_data: teacher_info,
    };
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(notesInfo),
    };
    try {
      fetch("/set-notes-assessment", options);
      resolve();
    } catch (error) {
      alert(error.message);
      reject();
    }
  });
};

createAssessmentClose.addEventListener("click", () => {
  createAssessmentModal.style.display = "none";
});

function updateDatabase() {
  finalSubmitBtn.addEventListener("click", () => {
    sendBookLinkData(parentObj);
  });
}

document.getElementById("buttonId").addEventListener("click", openDialog);

function openDialog() {
  document.getElementById("fileId").click();
  document.getElementById("fileId").onchange = readData;
}

function checkAuth(Ques) {
  for (let j = 0; j < Ques.length; j++) {
    //console.log(Ques[j]);
  }
}

async function getCount() {
  const assessmentValue = {
    metadata: notesData,
    teacher_data: teacher_info,
  };

  const opt = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(assessmentValue),
  };

  const response = await fetch("/getBookCount", opt);
  const countData = await response.json();

  return countData.qsn_Id;
}

function setVideoObj(lastVideoForm, qsnCounter) {
  let counterVal = qsnCounter;

  const noteObj = {
    name: "",
    onlineLink: "",
    subject: "",
    language: "",
    class: "",
    board: "",
    topic: "",
  };

  noteObj.name = lastVideoForm
    .getElementsByTagName("div")[0]
    .getElementsByTagName("input")[0].value;
  noteObj.onlineLink = lastVideoForm
    .getElementsByTagName("div")[0]
    .getElementsByTagName("input")[1].value;
  noteObj.subject = notesData.subject;
  noteObj.language = notesData.language;
  noteObj.class = notesData.classId;
  noteObj.board = notesData.board;
  noteObj.topic = notesData.topic;

  //const uniqueId = "id_" + new Date().getTime();

  let quesId;
  if (counterVal < 10) {
    quesId = notesData.topic + "_00" + counterVal;
  } else {
    quesId = notesData.topic + "_0" + counterVal;
  }

  parentObj[quesId] = noteObj;
  parentObj.details["qsn_Id"] = qsnCounter;
}

// let assessmentObj = XLSX.utils.sheet_to_json(
//   workBook.Sheets[sheet_name_list[0]]
// );
