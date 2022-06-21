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
let counter = 0;
let filesCount = 0;
let isError = false;

let historyParentObj = {};

const assessmentData = JSON.parse(
  window.localStorage.getItem("assessmentMetaData")
);

const teacher_info = JSON.parse(window.localStorage.getItem("teacher_info"));

const sendQuestionData = async (parentObj) => {
  createAssessmentModal.style.display = "none";

  return new Promise((resolve, reject) => {
    const assessmentValue = {
      metadata: assessmentData,
      questionData: parentObj,
      teacher_data: teacher_info,
    };

    const qsnOption = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(assessmentValue),
    };

    try {
      fetch("/set-assessment", qsnOption);
      resolve();
    } catch (error) {
      alert(error.message);
      reject();
    }
  });
};

const sendHistoryData = async (historyParentObj) => {
  const history_value = {
    metadata: assessmentData,
    historyData: historyParentObj,
    teacher_data: teacher_info,
  };

  const historyOption = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(history_value),
  };

  try {
    fetch("/set-history", historyOption);
  } catch (error) {
    alert(error.message);
    reject();
  }
};

const createAssessmentModal = document.getElementById("submitModal");
const createAssessmentClose = document.getElementsByClassName(
  "create-assessment-close"
)[0];
const displayProgress = document.getElementById("ImgProgress");
const finalSubmitBtn = document.getElementById("finalSubmit");
finalSubmitBtn.style.display = "none";

const re_upload_btn = document.getElementById("reUploadBtn");
re_upload_btn.style.display = "none";

// const displayProgress = document.getElementById("successMsg");
let last_ques_form = "";

document
  .getElementById("uploadAssessment")
  .addEventListener("click", async () => {
    const questions = document.getElementsByClassName("question_forms");
    let qsnCounter = (await getCount()) + 1;
    Array.from(questions).forEach((element) => {
      setObj(element, questions.length, qsnCounter);
      qsnCounter++;
    });

    //console.log(parentObj);
    // setLastAssessment();

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
      // const forText = document.getElementById("textSpan");
      finalSubmitBtn.style.display = "block";
      re_upload_btn.style.display = "none";
      updateDatabase();
      displayProgress.innerHTML = "Click Submit To Upload Assessments.";
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
        fileName + " - Upload is " + parseInt(progress) + "% done";
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

      // const showErr = document.getElementById("err");
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
              // displayProgress.style.display = "none";
              if (filesCount == 1) {
                displayProgress.innerHTML = "File uploaded successfully.";
                // displayProgress.style.display = "block";
              } else {
                displayProgress.innerHTML = "All files uploaded successfully.";
                // success_msg.style.display = "block";
                // $(displayProgress).css('display', 'block');
              }
              updateDatabase();
            }
            // displayProgress.style.display = "none";
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
    sendHistoryData(historyObj);
  });
}

const typeArr = ["image/png", "image/jpeg"];

const quesFile = document.getElementById("quesImgFile");
quesFile.onchange = function () {
  const qFile = this.files[0];
  if (qFile.size > 1048576) {
    alert("File is too big, Please select an image of smaller size!");
    this.value = "";
  } else {
    const includes_ques = typeArr.includes(qFile.type);
    if (qFile.type == "" || !includes_ques) {
      alert(
        "Not a valid file format, please select an image of type jpeg or png."
      );
      this.value = "";
    }
  }
};

const opt_A_File = document.getElementById("optAFile");
opt_A_File.onchange = function (e) {
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

const opt_B_File = document.getElementById("optBFile");
opt_B_File.onchange = function (e) {
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

const opt_C_File = document.getElementById("optCFile");
opt_C_File.onchange = function (e) {
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

const opt_D_File = document.getElementById("optDFile");
opt_D_File.onchange = function (e) {
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

let i = 1;
document.getElementById("nextQues").onclick = function () {
  debugger;
  const x = parentObj;

  i += 1;
  const generatedDiv = document.getElementById("question_form_1");
  const clone = generatedDiv.cloneNode(true);
  clone
    .getElementsByTagName("div")[0]
    .getElementsByTagName("span")[0].innerHTML = `Q.${i}`;
  clone.id = `question_form_${i}`;
  document.getElementById("assessment_form").appendChild(clone);

  const question_form = document.getElementsByClassName("question_forms");
  const count = question_form.length;
  const last_assessment_div = question_form[count - 2];

  last_ques_form = question_form[count - 1];

  const lastAssessment = last_ques_form.getElementsByTagName("div");

  Array.from(lastAssessment[0].getElementsByTagName("input")).forEach(
    (element) => {
      element.value = "";
      element.value = "";
    }
  );

  Array.from(lastAssessment[1].getElementsByTagName("input")).forEach(
    (element) => {
      element.value = "";
      element.value = "";
      if (element.hasAttribute("disabled")) {
        element.removeAttribute("disabled");
      }
    }
  );

  /* validation code for question image of dynamically created assessment */
  const qFile = last_ques_form
    .getElementsByTagName("div")[0]
    .getElementsByTagName("input")[1];

  qFile.onchange = function (e) {
    if (e.target.files[0].size) {
      last_ques_form
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

  /* validation code for option A of dynamically created assessment */
  const aFile = last_ques_form
    .getElementsByTagName("div")[2]
    .getElementsByTagName("input")[1];

  aFile.onchange = function (e) {
    if (e.target.files[0].size) {
      last_ques_form
        .getElementsByTagName("div")[2]
        .getElementsByTagName("input")[0]
        .setAttribute("disabled", true);
    }
    const a_file = aFile.files[0];
    if (a_file.size > 1048576) {
      alert("File is too big, Please select an image of smaller size!");
      this.value = "";
    } else {
      const includes_a = typeArr.includes(a_file.type);
      if (a_file.type == "" || !includes_a) {
        alert(
          "Not a valid file format, please select an image of type jpeg or png."
        );
        this.value = "";
      }
    }
  };

  last_ques_form
    .getElementsByTagName("div")[2]
    .getElementsByTagName("input")[0].onkeyup = function (e) {
    if (e.target.value == "") {
      aFile.removeAttribute("disabled");
    } else {
      aFile.setAttribute("disabled", false);
    }
  };

  /* validation code for option B of dynamically created assessment */
  const bFile = last_ques_form
    .getElementsByTagName("div")[3]
    .getElementsByTagName("input")[1];
  bFile.onchange = function (e) {
    if (e.target.files[0].size) {
      last_ques_form
        .getElementsByTagName("div")[3]
        .getElementsByTagName("input")[0]
        .setAttribute("disabled", true);
    }
    const b_file = bFile.files[0];
    if (b_file.size > 1048576) {
      alert("File is too big, Please select an image of smaller size!");
      this.value = "";
    } else {
      const includes_b = typeArr.includes(b_file.type);
      if (b_file.type == "" || !includes_b) {
        alert(
          "Not a valid file format, please select an image of type jpeg or png."
        );
        this.value = "";
      }
    }
  };

  last_ques_form
    .getElementsByTagName("div")[3]
    .getElementsByTagName("input")[0].onkeyup = function (e) {
    if (e.target.value == "") {
      bFile.removeAttribute("disabled");
    } else {
      bFile.setAttribute("disabled", false);
    }
  };

  /* validation code for option C of dynamically created assessment */
  const cFile = last_ques_form
    .getElementsByTagName("div")[4]
    .getElementsByTagName("input")[1];

  cFile.onchange = function (e) {
    if (e.target.files[0].size) {
      last_ques_form
        .getElementsByTagName("div")[4]
        .getElementsByTagName("input")[0]
        .setAttribute("disabled", true);
    }
    const c_file = cFile.files[0];
    if (c_file.size > 1048576) {
      alert("File is too big, Please select an image of smaller size!");
      this.value = "";
    } else {
      const includes_c = typeArr.includes(c_file.type);
      if (c_file.type == "" || !includes_c) {
        alert(
          "Not a valid file format, please select an image of type jpeg or png."
        );
        this.value = "";
      }
    }
  };

  last_ques_form
    .getElementsByTagName("div")[4]
    .getElementsByTagName("input")[0].onkeyup = function (e) {
    if (e.target.value == "") {
      cFile.removeAttribute("disabled");
    } else {
      cFile.setAttribute("disabled", false);
    }
  };

  /* validation code for option D of dynamically created assessment */
  const dFile = last_ques_form
    .getElementsByTagName("div")[5]
    .getElementsByTagName("input")[1];

  dFile.onchange = function (e) {
    if (e.target.files[0].size) {
      last_ques_form
        .getElementsByTagName("div")[5]
        .getElementsByTagName("input")[0]
        .setAttribute("disabled", true);
    }
    const d_file = dFile.files[0];
    if (d_file.size > 1048576) {
      alert("File is too big, Please select an image of smaller size!");
      this.value = "";
    } else {
      const includes_d = typeArr.includes(d_file.type);
      if (d_file.type == "" || !includes_d) {
        alert(
          "Not a valid file format, please select an image of type jpeg or png."
        );
        this.value = "";
      }
    }
  };

  last_ques_form
    .getElementsByTagName("div")[5]
    .getElementsByTagName("input")[0].onkeyup = function (e) {
    if (e.target.value == "") {
      dFile.removeAttribute("disabled");
    } else {
      dFile.setAttribute("disabled", false);
    }
  };
  //setObj(last_assessment_div);
};

const parentObj = {
  details: {
    qsn_Id: 0,
  },
};

let historyObj = {};

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
  const user = await response.json();

  return user.qsn_Id;

  // fetch("/getCount", opt)
  //   .then((res) => {
  //     return res.json();
  //   })
  //   .then((data) => {
  //     //console.log(data);
  //     let counter = data.counter;
  //     if (data.count == "1") {
  //       counterCopy = data.count;
  //       parentObj.details.counter = length;
  //     } else {
  //       counter++;
  //       parentObj[counter] = obj1;
  //       parentObj.details.counter = counter;
  //     }
  //     //console.log(parentObj);
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
}

const setObj = async (last_assessment_div, qsnCounter) => {
  let counterVal = qsnCounter;

  historyParentObj = {
    board_id: assessmentData.board,
    class_id: assessmentData.classId,
    class_name: assessmentData.classId,
    language_id: assessmentData.language,
    subject_id: assessmentData.subject,
    subject_name: assessmentData.subject,
    topic_id: assessmentData.topic,
    board_name: "Central Board of Secondary Education",
    language_name: "English",
    topic_name: "Integration",
  };

  //console.log(last_assessment_div);
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

  // async () => {
  //   let count;
  //   try {
  //     count = await getCount();
  //   } catch (error) {
  //     console.log(error);
  //   }
  //   console.log(count);
  // };

  //console.log(counterCopy++);
  //parentObj[counterCopy++] = obj1;

  const uniqueId = "id_" + new Date().getTime();
  // let questionId = 0;
  // const counter = await getCount()

  parentObj[counterVal] = obj1;
  parentObj.details["qsn_Id"] = qsnCounter;
  // parentObj.details.counter = questionId;
  console.log(parentObj);

  const ques_image = document.getElementsByClassName("question_forms");
  const form_count = ques_image.length;
  const last_form = ques_image[form_count - 1]; // [check for multiple questions]
  const last_ques_img = last_form
    .getElementsByTagName("div")[0]
    .getElementsByTagName("input")[1];
  const last_opt_a = last_form
    .getElementsByTagName("div")[1]
    .getElementsByTagName("div")[0]
    .getElementsByTagName("input")[1];
  const last_opt_b = last_form
    .getElementsByTagName("div")[1]
    .getElementsByTagName("div")[1]
    .getElementsByTagName("input")[1];
  const last_opt_c = last_form
    .getElementsByTagName("div")[1]
    .getElementsByTagName("div")[2]
    .getElementsByTagName("input")[1];
  const last_opt_d = last_form
    .getElementsByTagName("div")[1]
    .getElementsByTagName("div")[3]
    .getElementsByTagName("input")[1];

  last_ques_img.setAttribute("unique_id", uniqueId + "-" + "questionImage");
  last_opt_a.setAttribute("unique_id", uniqueId + "-" + "A");
  last_opt_b.setAttribute("unique_id", uniqueId + "-" + "B");
  last_opt_c.setAttribute("unique_id", uniqueId + "-" + "C");
  last_opt_d.setAttribute("unique_id", uniqueId + "-" + "D");
};

/* code to disable either of the input in option A of 1st question */
document.getElementsByName("opt_A")[0].addEventListener("keyup", (e) => {
  if (e.target.value == "") {
    document.getElementsByName("option_A_Image")[0].removeAttribute("disabled");
  } else {
    document
      .getElementsByName("option_A_Image")[0]
      .setAttribute("disabled", false);
  }
});

/* code to disable either of the input in option B of 1st question */
document.getElementsByName("opt_B")[0].addEventListener("keyup", (e) => {
  if (e.target.value == "") {
    document.getElementsByName("option_B_Image")[0].removeAttribute("disabled");
  } else {
    document
      .getElementsByName("option_B_Image")[0]
      .setAttribute("disabled", false);
  }
});

/* code to disable either of the input in option C of 1st question */
document.getElementsByName("opt_C")[0].addEventListener("keyup", (e) => {
  if (e.target.value == "") {
    document.getElementsByName("option_C_Image")[0].removeAttribute("disabled");
  } else {
    document
      .getElementsByName("option_C_Image")[0]
      .setAttribute("disabled", false);
  }
});

/* code to disable either of the input in option D of 1st question */
document.getElementsByName("opt_D")[0].addEventListener("keyup", (e) => {
  if (e.target.value == "") {
    document.getElementsByName("option_D_Image")[0].removeAttribute("disabled");
  } else {
    document
      .getElementsByName("option_D_Image")[0]
      .setAttribute("disabled", false);
  }
});
