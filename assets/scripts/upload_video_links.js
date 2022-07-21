const videoModalData = JSON.parse(window.localStorage.getItem("videoMetaData"));

const teacher_info = JSON.parse(window.localStorage.getItem("userInfo"));

const createAssessmentModal = document.getElementById("submitModal");
const createAssessmentClose = document.getElementsByClassName(
  "create-assessment-close"
)[0];
const displayProgress = document.getElementById("ImgProgress");
const finalSubmitBtn = document.getElementById("finalSubmit");

const sendVideoLinkData = (parentVideoObj) => {
  createAssessmentModal.style.display = "none";

  return new Promise((resolve, reject) => {
    const videoInfo = {
      videoMetaData: videoModalData,
      videoData: parentVideoObj,
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

let i = 1;
function add_more_video_field() {
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
  document.getElementById("video_form").appendChild(clone);

  $(document).on("click", ".deleteBtn", function () {
    $(this).parent().remove();
  });

  document.getElementById("video_form").appendChild(clone);

  const videoQuesForm = document.getElementsByClassName("vid-ques-forms");
  const videoCount = videoQuesForm.length;
  // const lastVideoForm = videoQuesForm[videoCount - 2];

  const last_video_form = videoQuesForm[videoCount - 1];
  const lastVideoAssessment = last_video_form.getElementsByTagName("div");
  const video_name = lastVideoAssessment[0].getElementsByTagName("input")[0];
  const video_link = lastVideoAssessment[0].getElementsByTagName("input")[1];

  video_name.value = "";
  video_link.value = "";
}

const parentVideoObj = {
  details: {
    qsn_Id: 0,
  },
};

async function getCount() {
  const assessmentValue = {
    metadata: videoModalData,
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

const setVideoObj = async (lastVideoForm, qsnCounter) => {
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
  videoObj.subject = videoModalData.subject;
  videoObj.language = videoModalData.language;
  videoObj.class = videoModalData.classId;
  videoObj.board = videoModalData.board;
  videoObj.topic = videoModalData.topic;

  //const uniqueId = "id_" + new Date().getTime();

  let quesId;
  if (counterVal < 10) {
    quesId = videoModalData.topic + "_00" + counterVal;
  } else {
    quesId = videoModalData.topic + "_0" + counterVal;
  }

  parentVideoObj[quesId] = videoObj;
  parentVideoObj.details["qsn_Id"] = qsnCounter;

  // console.log(parentVideoObj);
};

document.getElementById("videoSubmit").addEventListener("click", async () => {
  const videoLinkForm = document.getElementsByClassName("vid-ques-forms");
  let qsnCounter = (await getCount()) + 1;
  Array.from(videoLinkForm).forEach((element) => {
    setVideoObj(element, qsnCounter);
    qsnCounter++;
  });

  createAssessmentModal.style.display = "block";

  updateDatabase();
});

createAssessmentClose.addEventListener("click", () => {
  createAssessmentModal.style.display = "none";
});

function updateDatabase() {
  finalSubmitBtn.addEventListener("click", () => {
    sendVideoLinkData(parentVideoObj);
    //sendHistoryData(historyObj);
  });
}
