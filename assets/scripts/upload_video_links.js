let i = 1;
function add_more_video_field() {
  i += 1;
  const generateDiv = document.getElementById("question_form_1");
  const clone = generateDiv.cloneNode(true);
  clone
    .getElementsByTagName("div")[0]
    .getElementsByTagName("span")[0].innerHTML = `${i}.`;
  clone.id = `question_form_${i}`;
  document.getElementById("video_form").appendChild(clone);

  const videoQuesForm = document.getElementsByClassName("vid-ques-forms");
  const videoCount = videoQuesForm.length;
  const lastVideoForm = videoQuesForm[videoCount - 2];

  const last_video_form = videoQuesForm[videoCount - 1];
  const lastVideoAssessment = last_video_form.getElementsByTagName("div");
  const video_name = lastVideoAssessment[0].getElementsByTagName("input")[0];
  const video_link = lastVideoAssessment[0].getElementsByTagName("input")[1];

  video_name.value = "";
  video_link.value = "";
  setVideoObj(lastVideoForm);
}

const parentVideoObj = {};

function setVideoObj(lastVideoForm) {
  const videoObj = {
    name: "",
    onlineLink: "",
    subject: "",
    language: "",
    class: "",
    board: "",
    topic: "",
  };

  const videoModalData = JSON.parse(
    window.localStorage.getItem("videoMetaData")
  );

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

  const uniqueId = "id_" + new Date().getTime();
  parentVideoObj[uniqueId] = videoObj;
  //console.log(parentVideoObj);
}

document.getElementById("videoSubmit").addEventListener("click", () => {
  const videoModalData = JSON.parse(
    window.localStorage.getItem("videoMetaData")
  );

  const teacher_info = JSON.parse(window.localStorage.getItem("teacher_info"));

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
  } catch (error) {
    alert(error.message);
  }
});
