var btn = document.getElementById("video__single__upload");

var modal = document.getElementById("video_modal");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("video_close")[0];

// When the user clicks the button, open the modal
btn.onclick = function () {
  modal.style.display = "block";
  getData();
};

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

let videoForm = document.querySelector("form");
videoForm.onsubmit = storeVideoFormData;

function storeVideoFormData(e) {
  let videoData = {};
  e.preventDefault();
  const videoFormData = new FormData(videoForm);
  for (let key of videoFormData.keys()) {
    videoData[key] = videoFormData.get(key);
  }

  window.localStorage.setItem("videoMetaData", JSON.stringify(videoData));
  sendVideoData();
}

const sendVideoData = () => {
  const data1 = JSON.parse(window.localStorage.getItem("videoMetaData"));
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data1),
  };

  fetch("/videoLinks", options)
    .then((res) => {
      window.location.href = "/uploadVideoLinks";
      return res.json();
    })
    .then((res) => {
      console.log(res);
    })
    .catch((e) => {
      console.log(e);
    });
};

function getData() {
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

      console.log(data);

      for (let boards_ in boards) {
        board.options[board.options.length] = new Option(
          boards_,
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
            `<option value=${lang}>${lang}</option>`
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

        console.log(classes, "classes");

        for (const Class in classes) {
          if (Class == "name") continue;

          $("#class").append(
            `<option value=${Class}>${Class}</option>`
          );
        }
      };

      class_.onchange = function () {
        $("#subject").html("<option>Select Subject</option>");
        $("#topic").html("<option>Select Topic</option>");

        const selectedBoard = $("#board").val();
        const selectedLanguage = $("#language").val();
        const selectedClass = $("#class").val();

        const subjects = boards[selectedBoard][selectedLanguage][selectedClass]["subjects"];

        for (const subject in subjects) {
          if (subject == "name") continue;

          $("#subject").append(
            `<option value=${subject}>${subject}</option>`
          );
        }
      };

      subject.onchange = function () {
        $("#topic").html("<option>Select Topic</option>");

        const selectedBoard = $("#board").val();
        const selectedLanguage = $("#language").val();
        const selectedClass = $("#class").val();
        const selectedSubject = $("#subject").val();

        const topics = boards[selectedBoard][selectedLanguage][selectedClass]["subjects"][selectedSubject];

        for (const topic in topics) {
          $("#topic").append(
            `<option value=${topic}>${topic}</option>`
          );
        }
      };
    })
    .catch((e) => {
      console.log(e);
    });
}

const videoBulkBtn = document.getElementById("video_bulk_upload");
const videoBulkModal = document.getElementById("videoBulkModal");
const videoBulkClose = document.getElementsByClassName(
  "video-bulk-modal-close"
)[0];

// When the user clicks the button, open the bulk upload modal
videoBulkBtn.onclick = function () {
  videoBulkModal.style.display = "block";
  getOptionsForBulkVideos();
};

// When the user clicks the cross button, closes the bulk upload modal
videoBulkClose.addEventListener("click", () => {
  closeVideoBulkModal();
});

function closeVideoBulkModal() {
  videoBulkModal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.addEventListener("click", (event) => {
  if (event.target == videoBulkModal) {
    videoBulkModal.style.display = "none";
  }
});

let videoBulkForm = document.getElementById("videoBulkData");
videoBulkForm.onsubmit = storeVideoBulkFormData;

function storeVideoBulkFormData(e) {
  let videoBulkData = {};
  e.preventDefault();
  const videoBulkFormData = new FormData(videoBulkForm);
  for (let key of videoBulkFormData.keys()) {
    videoBulkData[key] = videoBulkFormData.get(key);
  }

  const isVideoModalTrue = {
    isTrue: null,
  };

  window.localStorage.setItem("isTrue", JSON.stringify(isVideoModalTrue));
  window.localStorage.setItem(
    "videoBulkMetaData",
    JSON.stringify(videoBulkData)
  );
  sendVideoBulkData();
}

const sendVideoBulkData = () => {
  const localVideoBulkData = JSON.parse(
    window.localStorage.getItem("videoBulkMetaData")
  );
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(localVideoBulkData),
  };

  fetch("/create-bulk-video", options)
    .then((res) => {
      window.location.href = "/bulk-upload-videos";
      return res.json();
    })
    .then((res) => {
      console.log(res);
    })
    .catch((e) => {
      console.log(e);
    });
};

function getOptionsForBulkVideos() {
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
      let board = document.getElementById("videoBulkModalBoard");
      let language = document.getElementById("videoBulkModalLanguage");
      let class_ = document.getElementById("videoBulkModalClass");
      let bulkBoards = data;

      for (let boards_ in bulkBoards) {
        board.options[board.options.length] = new Option(
          boards_,
          boards_
        );
      }

      board.onchange = function () {
        $("#videoBulkModalLanguage").html("<option>Select Language</option>");
        $("#videoBulkModalClass").html("<option>Select Class</option>");
        $("#videoBulkModalSubject").html("<option>Select Subject</option>");

        const selectedBoard = $("#videoBulkModalBoard").val();

        const languages = bulkBoards[selectedBoard];

        for (const lang in languages) {
          if (lang == "name1") continue;

          $("#videoBulkModalLanguage").append(
            `<option value=${lang}>${lang}</option>`
          );
        }
      };

      language.onchange = function () {
        $("#videoBulkModalClass").html("<option>Select Class</option>");
        $("#videoBulkModalSubject").html("<option>Select Subject</option>");

        const selectedBoard = $("#videoBulkModalBoard").val();
        const selectedLanguage = $("#videoBulkModalLanguage").val();

        const classes = bulkBoards[selectedBoard][selectedLanguage];

        for (const Class in classes) {
          if (Class == "name") continue;

          $("#videoBulkModalClass").append(
            `<option value=${Class}>${Class}</option>`
          );
        }
      };

      class_.onchange = function () {
        $("#videoBulkModalSubject").html("<option>Select Subject</option>");

        const selectedBoard = $("#videoBulkModalBoard").val();
        const selectedLanguage = $("#videoBulkModalLanguage").val();
        const selectedClass = $("#videoBulkModalClass").val();

        const subjects = bulkBoards[selectedBoard][selectedLanguage][selectedClass]["subjects"];

        for (const subject in subjects) {
          if (subject == "name") continue;

          $("#videoBulkModalSubject").append(
            `<option value=${subject}>${subject}</option>`
          );
        }
      };
    })
    .catch((e) => {
      console.log(e);
    });
}
