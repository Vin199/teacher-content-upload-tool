import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-app.js";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  getMetadata,
} from "https://www.gstatic.com/firebasejs/9.8.1/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyC5UiikQU2_-_omC-qKYcXA0X4Ta8whfuI",
  authDomain: "iprep-7f10a.firebaseapp.com",
  databaseURL: "https://iprep-dev.firebaseio.com/",
  projectId: "iprep-7f10a",
  storageBucket: "iprep-7f10a.appspot.com",
  messagingSenderId: "165257927521",
  appId: "1:165257927521:web:3d145f0c2b04eafd",
  measurementId: "G-SXFQPY83P3"
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

//const success_msg = document.getElementById("successMsg");

const bulkModalMsgBox = document.getElementById("getExcelSheetModal");
const bulkMsgCloseBtn = document.getElementsByClassName("excel-modal-close")[0];

const loadModal = JSON.parse(window.localStorage.getItem("isTrue"));

const bulkMetadata = JSON.parse(window.localStorage.getItem("bulkMetaData"));
const teacher_info = JSON.parse(window.localStorage.getItem("userInfo"));

const assessmentData = JSON.parse(
  window.localStorage.getItem("assessmentMetaData")
);

let questions = document.getElementsByClassName("question_forms");

document.getElementById("submit").addEventListener("click", async () => {
  let qsnCounter = (await getCount()) + 1;
  let isErrorPresent = false;

  Array.from(questions).forEach((element) => {
    const assessmentOpt = element.getElementsByClassName("option");
    const assessmentOptImg = element.getElementsByClassName("optImage");
    Array.from(assessmentOpt).forEach((item, index) => {
      if (!(item.value || assessmentOptImg[index].files[0])) {
        item.style.border = "1.5px solid #ff0000";
        assessmentOptImg[index].style.border = "1.5px solid #ff0000";
        isErrorPresent = true;
      }
    });
    setObj(element, qsnCounter);
    qsnCounter++;
  });

  Array.from(questions).forEach((element) => {
    const assessmentQues = element.getElementsByClassName("question");
    const assessmentQuesImg = element.getElementsByClassName("quesImage");
    Array.from(assessmentQues).forEach((ele, index) => {
      if (!(ele.value || assessmentQuesImg[index].files[0])) {
        ele.style.border = "1.5px solid #ff0000";
        assessmentQuesImg[index].style.border = "1.5px solid #ff0000";
        isErrorPresent = true;
      }
    });
  });

  //console.log(parentObj);

  isErrorPresent
    ? (createAssessmentModal.style.display = "none")
    : (createAssessmentModal.style.display = "block");

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
    //const forText = document.getElementById("textSpan");
    finalSubmitBtn.style.display = "block";
    re_upload_btn.style.display = "none";
    updateDatabase();
    displayProgress.innerHTML = "Click Submit To Upload Assessment.";
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
      displayProgress.style.display = "none";

      const message =
        "There is an error therefore file has not been uploaded. If you want to re-upload the image then click the 'Re-Upload Button' or if you want to proceed ahead then click the 'Submit Button'.";

      //const showErr = document.getElementById("err");
      displayProgress.innerHTML = message;

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
              //displayProgress.style.display = "none";
              if (filesCount == 1) {
                displayProgress.innerHTML = "File uploaded successfully.";
                //success_msg.style.display = "block";
              } else {
                displayProgress.innerHTML = "All files uploaded successfully.";
                //success_msg.style.display = "block";
              }
              updateDatabase();
            }
            //success_msg.style.display = "none";
          });
        })
        .then(() => {
          console.log("File Uploaded Successfully!!");
          // DELETE METADATA HERE
        });
    }
  );
}

window.onload = function () {
  if (loadModal.isTrue === null) {
    bulkModalMsgBox.style.display = "block";

    bulkMsgCloseBtn.addEventListener("click", () => {
      closeBulkModalMsg();
    });

    function closeBulkModalMsg() {
      bulkModalMsgBox.style.display = "none";
    }

    window.localStorage.setItem("isTrue", false);
  }
};

let parentObj = {
  details: {
    qsn_Id: 0,
  },
};

let selectedFile;

document.getElementById("ejs").style.display = "none";

document.getElementById("fileId").addEventListener("change", (e) => {
  selectedFile = e.target.files[0];
  document.getElementById("bulkContent").style.display = "none";
  document.getElementById("ejs").style.display = "block";
});

document.getElementById("submit").style.display = "none";

function displayNextBtn() {
  document.getElementById("submit").style.display = "block";
}

window.displayNextBtn = displayNextBtn;

let wb = XLSX.utils.book_new();
wb.Props = {
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
  body: JSON.stringify(bulkMetadata),
};

const response = await fetch("/getTopics", option);
const data = await response.json();

Object.values(data).forEach((ele) => {
  wb.SheetNames.push(ele);
  let ws_heading = [
    ["question", "option_a", "option_b", "option_c", "option_d"],
  ];
  let ws = XLSX.utils.aoa_to_sheet(ws_heading);
  wb.Sheets[ele] = ws;
});

let wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });
function s2ab(s) {
  let buff = new ArrayBuffer(s.length);
  let view = new Uint8Array(buff);
  for (let i = 0; i < s.length; i++) {
    view[i] = s.charCodeAt(i) & 0xff;
  }
  return buff;
}
$("#btn").click(function () {
  saveAs(
    new Blob([s2ab(wbout)], { type: "application/octet-stream" }),
    "Assessment.xlsx"
  );
  bulkModalMsgBox.style.display = "none";
});

document.getElementById("btn_2").onclick = function () {
  saveAs(
    new Blob([s2ab(wbout)], { type: "application/octet-stream" }),
    "Assessment.xlsx"
  );
};

function readData() {
  if (selectedFile) {
    let fileReader = new FileReader();
    fileReader.onload = function (e) {
      let data = e.target.result;
      let workBook = XLSX.read(data, {
        type: "binary",
      });

      let sheet_name_list = workBook.SheetNames;

      setOptions(sheet_name_list, workBook);
    };
    fileReader.readAsBinaryString(selectedFile);
  }
}

let optionsObj = {};
let optionValue;

const setOptions = async (sheet_name_list, workBook) => {
  const option = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bulkMetadata),
  };

  const response = await fetch("/getTopics", option);
  const result = await response.json();

  // let qsnCounter = await getCount();

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
        let html = `<div class="question_forms" id="question_form_${count}">
                <div class="question_area">
                  <span class="question_num">Q.${count}</span>
                  <input type="text" name="question" class="question" placeholder="Type Your Question Here" value="${
                    element.question == undefined ? "" : element.question
                  }">
                  <input id="quesImgFile_${count}" type="file" class="quesImage" name="questionImage"> 
                </div>
                <div class="option_area">
                  <div class="opt_a">
                    <span class="question_num">A.</span>
                    <input type="text" name="opt_A" class="option" placeholder="Type Option A Here (Right Answer)" value="${
                      element.option_a == undefined ? "" : element.option_a
                    }">
                    <input id="optAFile_${count}" type="file" class="optImage" name="option_A_Image">
                  </div>
                  <div class=" opt_b">
                    <span class="question_num">B.</span>
                    <input type="text" name="opt_B" class="option" placeholder="Type Option B Here" value="${
                      element.option_b == undefined ? "" : element.option_b
                    }">
                    <input id="optBFile_${count}" type="file" class="optImage" name="option_B_Image">
                  </div>
                  <div class="opt_c">
                    <span class="question_num">C.</span>
                    <input type="text" name="opt_C" class="option" placeholder="Type Option C Here" value="${
                      element.option_c == undefined ? "" : element.option_c
                    }">
                    <input id="optCFile_${count}" type="file" class="optImage" name="option_C_Image">
                  </div>
                  <div class="opt_d">
                    <span class="question_num">D.</span>
                    <input type="text" name="opt_D" class="option" placeholder="Type Option D Here" value="${
                      element.option_d == undefined ? "" : element.option_d
                    }">
                    <input id="optDFile_${count}" type="file" class="optImage" name="option_D_Image">
                  </div>
                </div>
              </div> `;

        document.getElementById("set_questions").innerHTML += html;
      }
    }
    optionValue = e.target.value;
    checkAuth(questions);
  });
};

let counter = 0;
let filesCount = 0;
let isError = false;

const sendQuestionData = (parentObj) => {
  return new Promise((resolve, reject) => {
    const assessmentValue = {
      metadata: assessmentData,
      questionData: parentObj,
      teacher_data: teacher_info,
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
      displayProgress.innerHTML = "Assessment Uploaded Successfully.";
      finalSubmitBtn.style.display = "none";
      setTimeout(()=>{
        location.reload();
      }, 3000);
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
    sendQuestionData(parentObj);
  });
}

document.getElementById("buttonId").addEventListener("click", openDialog);

function openDialog() {
  document.getElementById("fileId").click();
  document.getElementById("fileId").onchange = readData;
}

function checkAuth(Ques) {
  for (let j = 0; j < Ques.length; j++) {
    const typeArr = ["image/png", "image/jpeg"];

    let qFile = Ques[j]
      .getElementsByTagName("div")[0]
      .getElementsByTagName("input")[1];

    let qText = Ques[j]
      .getElementsByTagName("div")[0]
      .getElementsByTagName("input")[0];

    qFile.onchange = function (e) {
      if (e.target.files[0].size) {
        qText.setAttribute("disabled", true);
        qFile.style.border = "none";
        qText.style.border = "none";
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

    const aFile = Ques[j]
      .getElementsByTagName("div")[2]
      .getElementsByTagName("input")[1];

    const aText = Ques[j]
      .getElementsByTagName("div")[2]
      .getElementsByTagName("input")[0];

    aFile.onchange = function (e) {
      try {
        if (e.target.files[0].size) {
          document.getElementsByName("opt_A")[0].setAttribute("disabled", true);
          aFile.style.border = "none";
          aText.style.border = "none";
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
      } catch (error) {
        console.log(error);
        aText.removeAttribute("disabled");
      }
    };

    const bFile = Ques[j]
      .getElementsByTagName("div")[3]
      .getElementsByTagName("input")[1];

    const bText = Ques[j]
      .getElementsByTagName("div")[3]
      .getElementsByTagName("input")[0];

    bFile.onchange = function (e) {
      try {
        if (e.target.files[0].size) {
          document.getElementsByName("opt_B")[0].setAttribute("disabled", true);
          bFile.style.border = "none";
          bText.style.border = "none";
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
      } catch (error) {
        console.log(error);
        bText.removeAttribute("disabled");
      }
    };

    const cFile = Ques[j]
      .getElementsByTagName("div")[4]
      .getElementsByTagName("input")[1];

    const cText = Ques[j]
      .getElementsByTagName("div")[4]
      .getElementsByTagName("input")[0];

    cFile.onchange = function (e) {
      try {
        if (e.target.files[0].size) {
          document.getElementsByName("opt_C")[0].setAttribute("disabled", true);
          cFile.style.border = "none";
          cText.style.border = "none";
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
      } catch (error) {
        console.log(error);
        cText.removeAttribute("disabled");
      }
    };

    const dFile = Ques[j]
      .getElementsByTagName("div")[5]
      .getElementsByTagName("input")[1];

    const dText = Ques[j]
      .getElementsByTagName("div")[5]
      .getElementsByTagName("input")[0];

    dFile.onchange = function (e) {
      try {
        if (e.target.files[0].size) {
          document.getElementsByName("opt_D")[0].setAttribute("disabled", true);
          dFile.style.border = "none";
          dText.style.border = "none";
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
      } catch (error) {
        console.log(error);
        dText.removeAttribute("disabled");
      }
    };

    qText.addEventListener("keyup", (e) => {
      if (e.target.value != "") {
        qFile.style.border = "none";
        qText.style.border = "none";
      }
    });

    aText.addEventListener("keyup", (e) => {
      if (e.target.value == "") {
        aFile.removeAttribute("disabled");
      } else {
        aFile.setAttribute("disabled", false);
        aFile.style.border = "none";
        aText.style.border = "none";
      }
    });

    bText.addEventListener("keyup", (e) => {
      if (e.target.value == "") {
        bFile.removeAttribute("disabled");
      } else {
        bFile.setAttribute("disabled", false);
        bFile.style.border = "none";
        bText.style.border = "none";
      }
    });

    cText.addEventListener("keyup", (e) => {
      if (e.target.value == "") {
        cFile.removeAttribute("disabled");
      } else {
        cFile.setAttribute("disabled", false);
        cFile.style.border = "none";
        cText.style.border = "none";
      }
    });

    dText.addEventListener("keyup", (e) => {
      if (e.target.value == "") {
        dFile.removeAttribute("disabled");
      } else {
        dFile.setAttribute("disabled", false);
        dFile.style.border = "none";
        dText.style.border = "none";
      }
    });
  }
}

async function getCount() {
  const assessmentValue = {
    metadata: assessmentData,
    teacher_data: teacher_info,
  };

  const opt = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(assessmentValue),
  };

  const response = await fetch("/getCount", opt);
  const countData = await response.json();

  return countData.qsn_Id;
}

function setObj(last_assessment_div, qsnCounter) {
  let counterVal = qsnCounter;

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

  obj1.q = last_assessment_div
    .getElementsByTagName("div")[0]
    .getElementsByTagName("input")[0].value;

  const qImage = last_assessment_div
    .getElementsByTagName("div")[0]
    .getElementsByTagName("input")[1].files[0];
  if (qImage) {
    obj1.questionImage = qImage;
  }

  const type1 = last_assessment_div
    .getElementsByTagName("div")[1]
    .getElementsByTagName("div")[0]
    .getElementsByTagName("input")[1].value;
  const text1 = last_assessment_div
    .getElementsByTagName("div")[2]
    .getElementsByTagName("input")[0].value;
  if (type1) {
    obj1.A.type = "image";
    obj1.A.value = last_assessment_div
      .getElementsByTagName("div")[2]
      .getElementsByTagName("input")[1].files[0];
  } else if (text1) {
    obj1.A.type = "text";
    obj1.A.value = text1;
  }

  const type2 = last_assessment_div
    .getElementsByTagName("div")[1]
    .getElementsByTagName("div")[1]
    .getElementsByTagName("input")[1].value;
  const text2 = last_assessment_div
    .getElementsByTagName("div")[3]
    .getElementsByTagName("input")[0].value;
  if (type2) {
    obj1.B.type = "image";
    obj1.B.value = last_assessment_div
      .getElementsByTagName("div")[3]
      .getElementsByTagName("input")[1].files[0];
  } else if (text2) {
    obj1.B.type = "text";
    obj1.B.value = text2;
  }

  const type3 = last_assessment_div
    .getElementsByTagName("div")[1]
    .getElementsByTagName("div")[2]
    .getElementsByTagName("input")[1].value;
  const text3 = last_assessment_div
    .getElementsByTagName("div")[4]
    .getElementsByTagName("input")[0].value;
  if (type3) {
    obj1.C.type = "image";
    obj1.C.value = last_assessment_div
      .getElementsByTagName("div")[4]
      .getElementsByTagName("input")[1].files[0];
  } else if (text3) {
    obj1.C.type = "text";
    obj1.C.value = text3;
  }

  const type4 = last_assessment_div
    .getElementsByTagName("div")[1]
    .getElementsByTagName("div")[3]
    .getElementsByTagName("input")[1].value;
  const text4 = last_assessment_div
    .getElementsByTagName("div")[5]
    .getElementsByTagName("input")[0].value;
  if (type4) {
    obj1.D.type = "image";
    obj1.D.value = last_assessment_div
      .getElementsByTagName("div")[5]
      .getElementsByTagName("input")[1].files[0];
  } else if (text4) {
    obj1.D.type = "text";
    obj1.D.value = text4;
  }

  let quesId;
  if (counterVal < 10) {
    quesId = optionValue + "_00" + counterVal;
  } else {
    quesId = optionValue + "_0" + counterVal;
  }

  parentObj[quesId] = obj1;
  parentObj.details["qsn_Id"] = counterVal;
}
