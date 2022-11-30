const notesModalData = JSON.parse(window.localStorage.getItem("notesMetaData"));

const teacher_info = JSON.parse(window.localStorage.getItem("userInfo"));

const createAssessmentModal = document.getElementById("submitModal");
const createAssessmentClose = document.getElementsByClassName(
  "create-assessment-close"
)[0];
const displayProgress = document.getElementById("ImgProgress");
const finalSubmitBtn = document.getElementById("finalSubmit");

const sendBookLinkData = (parentBookObj) => {
  return new Promise((resolve, reject) => {
    const notesInfo = {
      notesMetaDataInfo: notesModalData,
      notesData: parentBookObj,
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
      displayProgress.innerHTML = "Successfully Uploaded Book Links";
      finalSubmitBtn.style.display = "none";
    } catch (error) {
      alert(error.message);
      reject();
    }
  });
};

let i = 1;
function add_more_notes_field() {
  i += 1;
  const generateDiv = document.getElementById("question_form_1");
  const clone = generateDiv.cloneNode(true);
  clone
    .getElementsByTagName("div")[0]
    .getElementsByTagName("span")[0].innerHTML = `${i}.`;
  clone.id = `question_form_${i}`;

  const deleteBtn = document.createElement("button");
  deleteBtn.innerHTML = "<span>Delete</span>";
  deleteBtn.setAttribute("class", "deleteBtn");
  const deleteSign = document.createElement("img");
  deleteSign.setAttribute("class", "deleteSign");
  deleteSign.setAttribute("src", "/assets/images/Group.svg");
  deleteBtn.appendChild(deleteSign);
  clone.appendChild(deleteBtn);
  document.getElementById("notes_form").appendChild(clone);

  $(document).on("click", ".deleteBtn", function () {
    $(this).parent().remove();
  });

  document.getElementById("notes_form").appendChild(clone);

  const notesForm = document.getElementsByClassName("notes-ques-forms");
  const notesCount = notesForm.length;
  //const lastNoteForm = notesForm[notesCount - 2];

  const last_note_form = notesForm[notesCount - 1];
  const lastNoteAssessment = last_note_form.getElementsByTagName("div");
  const note_name = lastNoteAssessment[0].getElementsByTagName("input")[0];
  const note_link = lastNoteAssessment[0].getElementsByTagName("input")[1];

  note_name.value = "";
  note_link.value = "";
}

const parentBookObj = {
  details: {
    qsn_Id: 0,
  },
};

async function getCount() {
  const assessmentValue = {
    metadata: notesModalData,
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

const setNoteObj = async (lastNoteForm, qsnCounter) => {
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

  noteObj.name = lastNoteForm
    .getElementsByTagName("div")[0]
    .getElementsByTagName("input")[0].value;
  noteObj.onlineLink = lastNoteForm
    .getElementsByTagName("div")[0]
    .getElementsByTagName("input")[1].value;
  noteObj.subject = notesModalData.subject;
  noteObj.language = notesModalData.language;
  noteObj.class = notesModalData.classId;
  noteObj.board = notesModalData.board;
  noteObj.topic = notesModalData.topic;

  //const uniqueId = "id_" + new Date().getTime();

  let quesId;
  if (counterVal < 10) {
    quesId = notesModalData.topic + "_00" + counterVal;
  } else {
    quesId = notesModalData.topic + "_0" + counterVal;
  }

  parentBookObj[quesId] = noteObj;
  parentBookObj.details["qsn_Id"] = qsnCounter;
  //console.log(parentNoteObj);
};

document.getElementById("noteSubmit").addEventListener("click", async () => {
  const notesLinkForm = document.getElementsByClassName("notes-ques-forms");
  let qsnCounter = (await getCount()) + 1;
  Array.from(notesLinkForm).forEach((element) => {
    setNoteObj(element, qsnCounter);
    qsnCounter++;
  });

  createAssessmentModal.style.display = "block";

  updateDatabase();
});

createAssessmentClose.addEventListener("click", () => {
  createAssessmentModal.style.display = "none";
  location.reload();
});

function updateDatabase() {
  finalSubmitBtn.addEventListener("click", () => {
    sendBookLinkData(parentBookObj);
    //sendHistoryData(historyObj);
  });
}
