const createAssessmentModal = document.getElementById("submitModal");
const createAssessmentClose = document.getElementsByClassName(
  "create-assessment-close"
)[0];
const displayProgress = document.getElementById("ImgProgress");
const finalSubmitBtn = document.getElementById("finalSubmit");

const bulkVideoModalMsgBox = document.getElementById("getBulkVideoModal");
const bulkVideoMsgCloseBtn = document.getElementsByClassName(
  "bulk-video-modal-close"
)[0];

const loadBulkVideoModal = JSON.parse(window.localStorage.getItem("isTrue"));

const videoBulkMetadata = JSON.parse(
  window.localStorage.getItem("videoBulkMetaData")
);

const teacher_info = JSON.parse(window.localStorage.getItem("userInfo"));
const videoData = JSON.parse(window.localStorage.getItem("videoMetaData"));

const questions = document.getElementsByClassName("vid-ques-forms");

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
  if (loadBulkVideoModal.isTrue === null) {
    bulkVideoModalMsgBox.style.display = "block";

    bulkVideoMsgCloseBtn.addEventListener("click", () => {
      closeBulkVideoModalMsg();
    });

    function closeBulkVideoModalMsg() {
      bulkVideoModalMsgBox.style.display = "none";
    }

    window.localStorage.setItem("isTrue", false);
  }
};

let parentObj = {
  details: {
    qsn_Id: 0,
  },
};

let selectedFileVideo;

document.getElementById("videoEjs").style.display = "none";

document.getElementById("videoFileId").addEventListener("change", (e) => {
  selectedFileVideo = e.target.files[0];
  document.getElementById("videoBulkContent").style.display = "none";
  document.getElementById("videoEjs").style.display = "block";
});

document.getElementById("submit").style.display = "none";

function displayNextBtn() {
  document.getElementById("submit").style.display = "block";
}

window.displayNextBtn = displayNextBtn;

let videoWb = XLSX.utils.book_new();
videoWb.Props = {
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
  body: JSON.stringify(videoBulkMetadata),
};

const response = await fetch("/getTopics", option);
const data = await response.json();

Object.values(data).forEach((ele) => {
  videoWb.SheetNames.push(ele);
  let video_ws_header = [["name", "link"]];
  let video_ws = XLSX.utils.aoa_to_sheet(video_ws_header);
  videoWb.Sheets[ele] = video_ws;
});

let videoWbAbout = XLSX.write(videoWb, { bookType: "xlsx", type: "binary" });
function s2ab(s) {
  let buff = new ArrayBuffer(s.length);
  let view = new Uint8Array(buff);
  for (let i = 0; i < s.length; i++) {
    view[i] = s.charCodeAt(i) & 0xff;
  }
  return buff;
}
$("#dwnldTemplateModal").click(function () {
  saveAs(
    new Blob([s2ab(videoWbAbout)], { type: "application/octet-stream" }),
    "Video-Assessment.xlsx"
  );
  bulkVideoModalMsgBox.style.display = "none";
});

document.getElementById("dwnldTemplateMain").onclick = function () {
  saveAs(
    new Blob([s2ab(videoWbAbout)], { type: "application/octet-stream" }),
    "Video-Assessment.xlsx"
  );
};

function readData() {
  if (selectedFileVideo) {
    let fileReader = new FileReader();
    fileReader.onload = function (e) {
      let data = e.target.result;
      let workBook = XLSX.read(data, {
        type: "binary",
      });

      let sheet_name_list = workBook.SheetNames;

      setOptions(sheet_name_list, workBook);
    };
    fileReader.readAsBinaryString(selectedFileVideo);
  }
}

let optionValue;

const setOptions = async (sheet_name_list, workBook) => {
  const option = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(videoBulkMetadata),
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
        let html = `<div class="vid-ques-forms" id="question_form_${count}">
            <div class="vid-ques-area">
                <span class="vid-question-num">${count}.</span>
                <input type="text" name="videoName" class="video-name" placeholder="Video Name" value="${
                  element.name == undefined ? "" : element.name
                }">
                <input type="text" class="vid-link" name="videoLink" placeholder="Video Link" value="${
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

const sendVideoLinkData = (parentObj) => {
  createAssessmentModal.style.display = "none";

  return new Promise((resolve, reject) => {
    const videoInfo = {
      videoMetaData: videoData,
      videoData: parentObj,
      teacher_data: teacher_info,
    };
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(videoInfo),
    };
    try {
      fetch("/set-video-assessment", options);
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
    sendVideoLinkData(parentObj);
  });
}

document.getElementById("videoButtonId").addEventListener("click", openDialog);

function openDialog() {
  document.getElementById("videoFileId").click();
  document.getElementById("videoFileId").onchange = readData;
}

function checkAuth(Ques) {
  for (let j = 0; j < Ques.length; j++) {
    //console.log(Ques[j]);
  }
}

async function getCount() {
  const assessmentValue = {
    metadata: videoData,
    teacher_data: teacher_info,
  };

  const opt = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(assessmentValue),
  };

  const response = await fetch("/getVideoCount", opt);
  const countData = await response.json();

  return countData.qsn_Id;
}

function setVideoObj(lastVideoForm, qsnCounter) {
  let counterVal = qsnCounter;

  const videoObj = {
    name: "",
    onlineLink: "",
    subject: "",
    language: "",
    class: "",
    board: "",
    topic: "",
  };

  videoObj.name = lastVideoForm
    .getElementsByTagName("div")[0]
    .getElementsByTagName("input")[0].value;
  videoObj.onlineLink = lastVideoForm
    .getElementsByTagName("div")[0]
    .getElementsByTagName("input")[1].value;
  videoObj.subject = videoData.subject;
  videoObj.language = videoData.language;
  videoObj.class = videoData.classId;
  videoObj.board = videoData.board;
  videoObj.topic = videoData.topic;

  //const uniqueId = "id_" + new Date().getTime();

  let quesId;
  if (counterVal < 10) {
    quesId = videoData.topic + "_00" + counterVal;
  } else {
    quesId = videoData.topic + "_0" + counterVal;
  }

  parentObj[quesId] = videoObj;
  parentObj.details["qsn_Id"] = qsnCounter;
}

// let assessmentObj = XLSX.utils.sheet_to_json(
//   workBook.Sheets[sheet_name_list[0]]
// );
