let i = 1;
function add_more_notes_field() {
  i += 1;
  const generateDiv = document.getElementById("question_form_1");
  const clone = generateDiv.cloneNode(true);
  clone
    .getElementsByTagName("div")[0]
    .getElementsByTagName("span")[0].innerHTML = `${i}.`;
  clone.id = `question_form_${i}`;
  document.getElementById("notes_form").appendChild(clone);

  const notesForm = document.getElementsByClassName("notes-ques-forms");
  const notesCount = notesForm.length;
  const lastNoteForm = notesForm[notesCount - 2];

  const last_note_form = notesForm[notesCount - 1];
  const lastNoteAssessment = last_note_form.getElementsByTagName("div");
  const note_name = lastNoteAssessment[0].getElementsByTagName("input")[0];
  const note_link = lastNoteAssessment[0].getElementsByTagName("input")[1];

  note_name.value = "";
  note_link.value = "";

  setNoteObj(lastNoteForm);
}

const parentNoteObj = {};

function setNoteObj(lastNoteForm) {
  const noteObj = {
    name: "",
    onlineLink: "",
    subject: "",
    language: "",
    class: "",
    board: "",
    topic: "",
  };

  const notesModalData = JSON.parse(
    window.localStorage.getItem("notesMetaData")
  );

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

  const uniqueId = "id_" + new Date().getTime();
  parentNoteObj[uniqueId] = noteObj;
  //console.log(parentNoteObj);
}

document.getElementById("noteSubmit").addEventListener("click", () => {
  const notesModalData = JSON.parse(
    window.localStorage.getItem("notesMetaData")
  );

  const teacher_info = JSON.parse(window.localStorage.getItem("teacher_info"));

  const notesInfo = {
    notesMetaDataInfo: notesModalData,
    notesData: parentNoteObj,
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
  } catch (error) {
    alert(error.message);
  }
});
