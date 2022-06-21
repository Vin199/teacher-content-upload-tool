import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-app.js";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  getMetadata,
} from "https://www.gstatic.com/firebasejs/9.8.1/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyDNFbXQo3Fd7PYfWBwGJd6XdihZ3w-yEvk",
  authDomain: "node-project-c4942.firebaseapp.com",
  databaseURL: "https://node-project-c4942-default-rtdb.firebaseio.com",
  projectId: "node-project-c4942",
  storageBucket: "node-project-c4942.appspot.com", //"node-project-c4942.appspot.com"
  messagingSenderId: "581470710657",
  appId: "1:581470710657:web:a4792037ef1d415c375680",
  measurementId: "G-HQZDXNGMJ3",
};

const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);

const createAssessmentModal = document.getElementById("submitModal");
const createAssessmentClose = document.getElementsByClassName(
  "create-assessment-close"
)[0];
const displayProgress = document.getElementById("ImgProgress");
const finalSubmitBtn = document.getElementById("finalSubmit");
finalSubmitBtn.style.display = "none";

const re_upload_btn = document.getElementById("reUploadBtn");
re_upload_btn.style.display = "none";

const success_msg = document.getElementById("successMsg");

const bulkVideoModalMsgBox = document.getElementById("getBulkVideoModal");
const bulkVideoMsgCloseBtn = document.getElementsByClassName(
  "bulk-video-modal-close"
)[0];

const loadBulkVideoModal = JSON.parse(window.localStorage.getItem("isTrue"));

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

let videoWb = XLSX.utils.book_new();
videoWb.Props = {
  Title: "Assessment Sheet",
  Subject: "Test",
  Author: "Vinay Maurya",
  CreatedDate: new Date().getDate(),
};
videoWb.SheetNames.push("Relations and Functions");
videoWb.SheetNames.push("Algebra");
videoWb.SheetNames.push("Calculus");
videoWb.SheetNames.push("Probability");

let video_ws_header = [["name", "link"]];
let video_ws_1 = XLSX.utils.aoa_to_sheet(video_ws_header);

let video_ws_2 = XLSX.utils.aoa_to_sheet(video_ws_header);

let video_ws_3 = XLSX.utils.aoa_to_sheet(video_ws_header);

let video_ws_4 = XLSX.utils.aoa_to_sheet(video_ws_header);

videoWb.Sheets["Relations and Functions"] = video_ws_1;
videoWb.Sheets["Algebra"] = video_ws_2;
videoWb.Sheets["Calculus"] = video_ws_3;
videoWb.Sheets["Probability"] = video_ws_4;

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

let parentObj = {};

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

function readData() {
  if (selectedFileVideo) {
    let fileReader = new FileReader();
    fileReader.onload = function (e) {
      let data = e.target.result;
      let workBook = XLSX.read(data, {
        type: "binary",
      });

      let sheet_name_list = workBook.SheetNames;

      // let assessmentObj = XLSX.utils.sheet_to_json(
      //   workBook.Sheets[sheet_name_list[0]]
      // );

      let allQuestions = [];
      workBook.SheetNames.forEach((sheet) => {
        let rowObject = XLSX.utils.sheet_to_row_object_array(
          workBook.Sheets[sheet]
        );
        allQuestions.push(rowObject);
      });

      document.getElementById("topics").addEventListener("change", (e) => {
        const topicIndex = sheet_name_list.indexOf(e.target.value);
        const questionObj = allQuestions[topicIndex];
        let count = 0;
        document.getElementById("set_questions").innerHTML = "";
        for (const key in questionObj) {
          if (Object.hasOwnProperty.call(questionObj, key)) {
            const element = questionObj[key];
            count++;
            let html = `<div class="question_forms" id="question_form_"${count}>
                <div class="question_area">
                  <span class="question_num">Q.${count}</span>
                  <input type="text" name="question" class="question" placeholder="Type Your Question Here" value="${element.question}">
                  <input id="quesImgFile_${count}" type="file" class="quesImage" name="questionImage">
                </div>
                <div class="option_area">
                  <div class="opt_a">
                    <span class="question_num">A.</span>
                    <input type="text" name="opt_A" class="option" placeholder="Type Option A Here (Right Answer)" value="${element.option_a}">
                    <input id="optAFile_${count}" type="file" class="optImage" name="option_A_Image">
                  </div>
                  <div class=" opt_b">
                    <span class="question_num">B.</span>
                    <input type="text" name="opt_B" class="option" placeholder="Type Option B Here" value="${element.option_b}">
                    <input id="optBFile_${count}" type="file" class="optImage" name="option_B_Image">
                  </div>
                  <div class="opt_c">
                    <span class="question_num">C.</span>
                    <input type="text" name="opt_C" class="option" placeholder="Type Option C Here" value="${element.option_c}">
                    <input id="optCFile_${count}" type="file" class="optImage" name="option_C_Image">
                  </div>
                  <div class="opt_d">
                    <span class="question_num">D.</span>
                    <input type="text" name="opt_D" class="option" placeholder="Type Option D Here" value="${element.option_d}">
                    <input id="optDFile_${count}" type="file" class="optImage" name="option_D_Image">
                  </div>
                </div>
              </div> `;

            document.getElementById("set_questions").innerHTML += html;
          }
        }
        const Ques = document.getElementsByClassName("question_forms");
        checkAuth(Ques);
      });
    };
    fileReader.readAsBinaryString(selectedFileVideo);
  }
}

let counter = 0;
let filesCount = 0;
let isError = false;

const sendQuestionData = (parentObj) => {
  createAssessmentModal.style.display = "none";

  return new Promise((resolve, reject) => {
    const assessmentData = JSON.parse(
      window.localStorage.getItem("assessmentMetaData")
    );
    const assessmentValue = {
      metadata: assessmentData,
      questionData: parentObj,
    };
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(assessmentValue),
    };
    try {
      fetch("/set-assessment", options);
      resolve();
    } catch (error) {
      alert(error.message);
      reject();
    }
  });
};

document.getElementById("submit").addEventListener("click", () => {
  // When the user clicks the submit button, open the modal
  createAssessmentModal.style.display = "block";
  let imageObj = {};
  Object.keys(parentObj).forEach((uid) => {
    let childObject = parentObj[uid];
    let reducedChildObject = Object.values(childObject);
    for (let i = 0; i < reducedChildObject.length; i++) {
      if (
        reducedChildObject[i] &&
        (reducedChildObject[i].size || reducedChildObject[i].type == "image")
      ) {
        counter++;
        filesCount++;
        const file = reducedChildObject[i].value
          ? reducedChildObject[i].value
          : reducedChildObject[i];
        if (!imageObj.hasOwnProperty(uid)) {
          imageObj[uid] = {};
        }
        imageObj[uid][Object.keys(childObject)[i]] = file;
      }
    }
  });
  if (counter > 0) {
    for (const uid in imageObj) {
      for (const imageKey in imageObj[uid]) {
        uploadImage(imageObj[uid][imageKey], uid, imageKey);
      }
    }
  } else {
    const forText = document.getElementById("textSpan");
    finalSubmitBtn.style.display = "block";
    re_upload_btn.style.display = "none";
    updateDatabase();
    forText.innerHTML = "Click Submit To Upload Assessments.";
  }
});

function uploadImage(file, uid, imageKey) {
  const fileName = file.name;
  // select unique name for everytime when image uploaded
  // Date.now() is function that give current timestamp
  const name = new Date().getTime() + "-" + fileName;

  // make ref to your firebase storage and select images folder
  var storageRef = ref(storage, `Images/${name}`);

  const metadata = {
    contentType: file.type,
    customMetadata: {
      uid: uid,
      imageKey: imageKey,
      uniqueId: uid + "-" + imageKey,
    },
  };

  // put file to firebase
  const uploadTask = uploadBytesResumable(storageRef, file, metadata);

  //all working for progress bar that in html
  //to indicate image uploading... report
  uploadTask.on(
    "state_changed",
    (snapshot) => {
      //Observe state change events such as progress, pause, and resume
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      displayProgress.innerHTML =
        fileName + " - Upload is " + progress + "% done";
      //console.log(fileName + " - Upload is " + progress + "% done");
      switch (snapshot.state) {
        case "paused":
          console.log("Upload is paused");
          break;
        case "running":
          console.log("Upload is running");
          break;
      }
    },
    function (error) {
      // 1) Retry limit exceeded Error
      // 2) Cancelled Error
      // let uid = "id1";
      // let imageKey = "ik1";
      isError = true;
      getMetadata(uploadTask.snapshot.ref).then((metadata) => {
        uid = metadata.customMetadata.uid;
        imageKey = metadata.customMetadata.imageKey;
      });

      displayProgress.style.display = "none";

      const element = document.querySelector(
        `[unique_id='${uid}-${imageKey}']`
      );

      element.style.backgroundColor = "red";
      success_msg.style.display = "none";

      const message =
        "There is an error therefore file has not been uploaded. If you want to re-upload the image then click the 'Re-Upload Button' or if you want to proceed ahead then click the 'Submit Button'.";

      const showErr = document.getElementById("err");
      showErr.innerHTML = message;

      re_upload_btn.style.display = "block";
      finalSubmitBtn.style.display = "block";

      re_upload_btn.addEventListener("click", () => {
        createAssessmentModal.style.display = "none";
      });

      counter--;
      if (!counter) {
        //re_upload_btn.style.display = "block";
        finalSubmitBtn.addEventListener("click", () => {
          updateDatabase();
        });
      }

      console.log(">>> ", error);
      // DELETE METADATA HERE
    },
    () => {
      // Handle successful uploads on complete
      // For instance, get the download URL: https://firebasestorage.googleapis.com/...
      getDownloadURL(uploadTask.snapshot.ref)
        .then((downloadURL) => {
          console.log("File available at", downloadURL);
          getMetadata(uploadTask.snapshot.ref).then((metadata) => {
            const downloadObj = {
              type: "image",
              value: downloadURL,
            };
            if (metadata.customMetadata.imageKey == "questionImage") {
              parentObj[metadata.customMetadata.uid][
                metadata.customMetadata.imageKey
              ] = downloadURL;
            } else {
              parentObj[metadata.customMetadata.uid][
                metadata.customMetadata.imageKey
              ] = downloadObj;
            }

            counter--;

            if (!counter) {
              finalSubmitBtn.style.display = "block";
              if (isError) {
                re_upload_btn.style.display = "block";
              } else {
                re_upload_btn.style.display = "none";
              }
              //re_upload_btn.style.display = "none";
              displayProgress.style.display = "none";
              if (filesCount == 1) {
                success_msg.innerHTML = "File uploaded successfully.";
                success_msg.style.display = "block";
              } else {
                success_msg.innerHTML = "All files uploaded successfully.";
                success_msg.style.display = "block";
              }
              updateDatabase();
            }
            success_msg.style.display = "none";
          });
        })
        .then(() => {
          console.log("File Uploaded Successfully!!");
          // DELETE METADATA HERE
        });
    }
  );
}

createAssessmentClose.addEventListener("click", () => {
  createAssessmentModal.style.display = "none";
});

function updateDatabase() {
  finalSubmitBtn.addEventListener("click", () => {
    sendQuestionData(parentObj);
  });
}

document.getElementById("videoButtonId").addEventListener("click", openDialog);

function openDialog() {
  document.getElementById("videoFileId").click();
  document.getElementById("videoFileId").onchange = readData;
}

function checkAuth(Ques) {
  for (let j = 0; j < Ques.length; j++) {
    const typeArr = ["image/png", "image/jpeg"];
    const obj1 = {
      q: "",
      questionImage: "",
      A: {
        type: "",
        value: "",
      },
      B: {
        type: "",
        value: "",
      },
      C: {
        type: "",
        value: "",
      },
      D: {
        type: "",
        value: "",
      },
    };
    obj1.q = Ques[j]
      .getElementsByTagName("div")[0]
      .getElementsByTagName("input")[0].value;

    const qImage = Ques[j]
      .getElementsByTagName("div")[0]
      .getElementsByTagName("input")[1].files[0];
    if (qImage) {
      obj1.questionImage = qImage;
    }

    let qFile = Ques[j]
      .getElementsByTagName("div")[0]
      .getElementsByTagName("input")[1];
    qFile.onchange = function (e) {
      if (e.target.files[0].size) {
        Ques[j]
          .getElementsByTagName("div")[0]
          .getElementsByTagName("input")[0]
          .setAttribute("disabled", true);
      }
      const q_file = qFile.files[0];
      if (q_file.size > 1048576) {
        alert("File is too big, Please select an image of smaller size!");
        this.value = "";
      } else {
        const includes_q = typeArr.includes(q_file.type);
        if (q_file.type == "" || !includes_q) {
          alert(
            "Not a valid file format, please select an image of type jpeg or png."
          );
          this.value = "";
        }
      }
    };

    const type1 = Ques[j]
      .getElementsByTagName("div")[1]
      .getElementsByTagName("div")[0]
      .getElementsByTagName("input")[1].value;
    const text1 = Ques[j]
      .getElementsByTagName("div")[2]
      .getElementsByTagName("input")[0].value;
    if (type1) {
      obj1.A.type = "image";
      obj1.A.value = Ques[j]
        .getElementsByTagName("div")[2]
        .getElementsByTagName("input")[1].files[0];
    } else if (text1) {
      obj1.A.type = "text";
      obj1.A.value = text1;
    }

    const aFile = Ques[j]
      .getElementsByTagName("div")[2]
      .getElementsByTagName("input")[1];

    aFile.onchange = function (e) {
      if (e.target.files[0].size) {
        document.getElementsByName("opt_A")[0].setAttribute("disabled", true);
      }
      const A_File = this.files[0];
      if (A_File.size > 1048576) {
        alert("File is too big, Please select an image of smaller size!");
        this.value = "";
      } else {
        const includes_A = typeArr.includes(A_File.type);
        if (A_File.type == "" || !includes_A) {
          alert(
            "Not a valid file format, please select an image of type jpeg or png."
          );
          this.value = "";
        }
      }
    };

    const type2 = Ques[j]
      .getElementsByTagName("div")[1]
      .getElementsByTagName("div")[1]
      .getElementsByTagName("input")[1].value;
    const text2 = Ques[j]
      .getElementsByTagName("div")[3]
      .getElementsByTagName("input")[0].value;
    if (type2) {
      obj1.B.type = "image";
      obj1.B.value = Ques[j]
        .getElementsByTagName("div")[3]
        .getElementsByTagName("input")[1].files[0];
    } else if (text2) {
      obj1.B.type = "text";
      obj1.B.value = text2;
    }

    const bFile = Ques[j]
      .getElementsByTagName("div")[3]
      .getElementsByTagName("input")[1];

    bFile.onchange = function (e) {
      if (e.target.files[0].size) {
        document.getElementsByName("opt_B")[0].setAttribute("disabled", true);
      }
      const B_File = this.files[0];
      if (B_File.size > 1048576) {
        alert("File is too big, Please select an image of smaller size!");
        this.value = "";
      } else {
        const includes_B = typeArr.includes(B_File.type);
        if (B_File.type == "" || !includes_B) {
          alert(
            "Not a valid file format, please select an image of type jpeg or png."
          );
          this.value = "";
        }
      }
    };

    const type3 = Ques[j]
      .getElementsByTagName("div")[1]
      .getElementsByTagName("div")[2]
      .getElementsByTagName("input")[1].value;
    const text3 = Ques[j]
      .getElementsByTagName("div")[4]
      .getElementsByTagName("input")[0].value;
    if (type3) {
      obj1.C.type = "image";
      obj1.C.value = Ques[j]
        .getElementsByTagName("div")[4]
        .getElementsByTagName("input")[1].files[0];
    } else if (text3) {
      obj1.C.type = "text";
      obj1.C.value = text3;
    }

    const cFile = Ques[j]
      .getElementsByTagName("div")[4]
      .getElementsByTagName("input")[1];

    cFile.onchange = function (e) {
      if (e.target.files[0].size) {
        document.getElementsByName("opt_C")[0].setAttribute("disabled", true);
      }
      const C_File = this.files[0];
      if (C_File.size > 1048576) {
        alert("File is too big, Please select an image of smaller size!");
        this.value = "";
      } else {
        const includes_C = typeArr.includes(C_File.type);
        if (C_File.type == "" || !includes_C) {
          alert(
            "Not a valid file format, please select an image of type jpeg or png."
          );
          this.value = "";
        }
      }
    };

    const type4 = Ques[j]
      .getElementsByTagName("div")[1]
      .getElementsByTagName("div")[3]
      .getElementsByTagName("input")[1].value;
    const text4 = Ques[j]
      .getElementsByTagName("div")[5]
      .getElementsByTagName("input")[0].value;
    if (type4) {
      obj1.D.type = "image";
      obj1.D.value = Ques[j]
        .getElementsByTagName("div")[5]
        .getElementsByTagName("input")[1].files[0];
    } else if (text4) {
      obj1.D.type = "text";
      obj1.D.value = text4;
    }

    const dFile = Ques[j]
      .getElementsByTagName("div")[5]
      .getElementsByTagName("input")[1];

    dFile.onchange = function (e) {
      if (e.target.files[0].size) {
        document.getElementsByName("opt_D")[0].setAttribute("disabled", true);
      }
      const D_File = this.files[0];
      if (D_File.size > 1048576) {
        alert("File is too big, Please select an image of smaller size!");
        this.value = "";
      } else {
        const includes_D = typeArr.includes(D_File.type);
        if (D_File.type == "" || !includes_D) {
          alert(
            "Not a valid file format, please select an image of type jpeg or png."
          );
          this.value = "";
        }
      }
    };

    parentObj[Math.floor(Math.random() * 1000 + 1)] = obj1;
  }

  for (let i = 0; i < Ques.length; i++) {
    const opt = Ques[i].getElementsByTagName("input");
    opt[2].addEventListener("keyup", (e) => {
      if (e.target.value == "") {
        opt[3].removeAttribute("disabled");
      } else {
        opt[3].setAttribute("disabled", false);
      }
    });

    if (opt[2].value.length == 0) {
      opt[3].removeAttribute("disabled");
    } else {
      opt[3].setAttribute("disabled", false);
    }

    opt[4].addEventListener("keyup", (e) => {
      if (e.target.value == "") {
        opt[5].removeAttribute("disabled");
      } else {
        opt[5].setAttribute("disabled", false);
      }
    });

    if (opt[4].value.length == 0) {
      opt[5].removeAttribute("disabled");
    } else {
      opt[5].setAttribute("disabled", false);
    }

    opt[6].addEventListener("keyup", (e) => {
      if (e.target.value == "") {
        opt[7].removeAttribute("disabled");
      } else {
        opt[7].setAttribute("disabled", false);
      }
    });

    if (opt[6].value.length == 0) {
      opt[7].removeAttribute("disabled");
    } else {
      opt[7].setAttribute("disabled", false);
    }

    opt[8].addEventListener("keyup", (e) => {
      if (e.target.value == "") {
        opt[9].removeAttribute("disabled");
      } else {
        opt[9].setAttribute("disabled", false);
      }
    });

    if (opt[8].value.length == 0) {
      opt[9].removeAttribute("disabled");
    } else {
      opt[9].setAttribute("disabled", false);
    }
  }
}
