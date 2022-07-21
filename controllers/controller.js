import request from "request";
import model from "../Model/user.js";

export default {
  login: async (req, res) => {
    res.render("login");
  },

  logout: (req, res) => {
    //logout by resetting user session or other means
    req.session.destroy();
    res.redirect("/");
  },

  setSession: async (req, res) => {
    req.session.user = await model.getUserWithUid(req.query.uid);
    req.session.home = "/dashboard";
    res.send({});
  },

  authenticationFailed: (req, res) => {
    res.render("authentication-failed");
  },

  dashboard: (req, res) => {
    res.render("dashboard");
  },

  emailLogin: (req, res) => {
    res.render("emailLogin");
  },

  loginWithPhone: (req, res) => {
    res.render("loginWithPhone");
  },

  setPassword: (req, res) => {
    res.render("setPassword");
  },

  assessment: (req, res) => {
    res.render("assessment");
  },

  showHistory: (req, res) => {
    res.render("showHistory");
  },

  videos: (req, res) => {
    res.render("videos");
  },

  uploadVideos: (req, res) => {
    res.render("upload_video_links");
  },

  uploadNotes: (req, res) => {
    res.render("upload_note_links");
  },

  postBulkAssessment: (req, res) => {
    res.send({ msg: "Api Done" });
  },

  previewBulkUpload: (req, res) => {
    res.render("preview_assessment_bulk_upload");
  },

  postAssessmentBulkDataPreview: (req, res) => {
    res.send({ msg: "Api Done" });
  },

  videoLinkAssessment: (req, res) => {
    res.send({ msg: "Api Done" });
  },

  postBulkVideos: (req, res) => {
    res.send({ msg: "Api Done" });
  },

  notesLinkAssessment: (req, res) => {
    res.send({ msg: "Api Done" });
  },

  postBulkBooks: (req, res) => {
    res.send({ msg: "Api Done" });
  },

  books: (req, res) => {
    res.render("books");
  },

  getAssessment: (req, res) => {
    res.render("create-assessment");
  },

  bulkUploadAssessment: (req, res) => {
    res.render("assessment-bulk-upload");
  },

  bulkUploadVideos: (req, res) => {
    res.render("videos-bulk-upload");
  },

  bulkUploadBooks: (req, res) => {
    res.render("books-bulk-upload");
  },

  getUsers: async (req, res) => {
    const path = "topics";
    const data = await model.getter(path);
    res.send(data);
  },

  getHistory: async (req, res) => {
    const path = "teacher_upload/history/teacher_uid1/assessments";
    const data = await model.getter(path);
    res.send(data);
  },

  getAssessments: async (req, res) => {
    const { path } = req.body;
    const data = await model.getter(path);
    res.send(data);
  },

  setUsers: async (req, res) => {
    const { board, ClassID, subject } = req.body;
    await model.setter(path, req.body);
    res.send();
  },

  updateUser: async (req, res) => {
    const path = req.body.uid;
    await model.update(path, req.body);
    res.send();
  },

  setAssessment: async (req, res) => {
    const { board, classId, language, subject, topic } = req.body.metadata;
    const teacher_uid = req.body.teacher_data.uid;
    const upload_path = `teacher_upload/upload/${teacher_uid}/${board}/${language}/${classId}/${subject}/assessments/${topic}/questions`;

    try {
      await model.update(upload_path, req.body.questionData);
      res.send();
    } catch (error) {
      res.status(500).send({ error });
    }
  },

  setVideosAssessment: async (req, res) => {
    const teacher_uid = req.body.teacher_data.uid;
    const upload_path = `teacher_upload/upload/${teacher_uid}/${req.body.videoMetaData.board}/${req.body.videoMetaData.language}/${req.body.videoMetaData.classId}/${req.body.videoMetaData.subject}/videos/${req.body.videoMetaData.topic}/questions`;

    //const history_path = `teacher_upload/history/${teacher_uid}/videos/${req.body.videoMetaData.board}/${req.body.videoMetaData.classId}/${req.body.videoMetaData.language}/${req.body.videoMetaData.subject}/videos/${req.body.videoMetaData.topic}`;
    await model.update(upload_path, req.body.videoData);

    //await model.update(history_path, req.body.videoData);
    res.send();
  },

  setNotesAssessment: async (req, res) => {
    //console.log(req.body);
    const teacher_uid = req.body.teacher_data.uid;
    const upload_path = `teacher_upload/upload/${teacher_uid}/${req.body.notesMetaDataInfo.board}/${req.body.notesMetaDataInfo.language}/${req.body.notesMetaDataInfo.classId}/${req.body.notesMetaDataInfo.subject}/books/${req.body.notesMetaDataInfo.topic}/questions`;
    //const history_path = `teacher_upload/history/${teacher_uid}/books/${req.body.notesMetaDataInfo.board}/${req.body.notesMetaDataInfo.classId}/${req.body.notesMetaDataInfo.language}/${req.body.notesMetaDataInfo.subject}/books/${req.body.notesMetaDataInfo.topic}`;

    await model.update(upload_path, req.body.notesData);
    //await model.update(history_path, req.body.notesData);
    res.send();
  },

  getCount: async (req, res) => {
    const { board, classId, language, subject, topic } = req.body.metadata;
    const teacher_uid = req.body.teacher_data.uid;
    const upload_path = `teacher_upload/upload/${teacher_uid}/${board}/${language}/${classId}/${subject}/assessments/${topic}/questions/details`;
    const counterValue = await model.getter(upload_path);
    if (counterValue == null) {
      res.send({ qsn_Id: 0 });
    } else {
      res.send(counterValue);
    }
  },

  getVideoCount: async (req, res) => {
    const { board, classId, language, subject, topic } = req.body.metadata;
    const teacher_uid = req.body.teacher_data.uid;
    const upload_path = `teacher_upload/upload/${teacher_uid}/${board}/${language}/${classId}/${subject}/videos/${topic}/questions/details`;
    const counterValue = await model.getter(upload_path);
    if (counterValue == null) {
      res.send({ qsn_Id: 0 });
    } else {
      res.send(counterValue);
    }
  },

  getBookCount: async (req, res) => {
    const { board, classId, language, subject, topic } = req.body.metadata;
    const teacher_uid = req.body.teacher_data.uid;
    const upload_path = `teacher_upload/upload/${teacher_uid}/${board}/${language}/${classId}/${subject}/books/${topic}/questions/details`;
    const counterValue = await model.getter(upload_path);
    if (counterValue == null) {
      res.send({ qsn_Id: 0 });
    } else {
      res.send(counterValue);
    }
  },

  getTopics: async (req, res) => {
    //console.log(req.body);
    const { board, classId, language, subject } = req.body;
    const path = `topics/${board}/${language}/${classId}/${subject}/topics`;
    const topicsObj = await model.getter(path);
    res.send(topicsObj);
  },

  checkUserStatus: async (req, res) => {
    let status = 0;
    const provider = req.body.providerVal;
    const value = req.body.inputVal;

    try {
      let userRecord;
      if (provider === "email") {
        userRecord = await model.getUserWithEmail(value);
      } else if (provider === "phone") {
        userRecord = await model.getUserWithPhoneNumber(value);
      } else {
        throw new Error({ error: "Wrong provider!" });
        return;
      }

      // check if the user is a teacher
      const path = "teachers/" + userRecord.uid;
      const user = await model.getter(path);
      user.uid = userRecord.uid;

      // check if user with email has a password
      if (provider === "email") {
        if (user.isPasswordSet) {
          status = 1; // user has already set up a password
        } else {
          status = 2; // user hasn't set up a password yet

          // todo: add code to send an email with create new password link
        }
      }

      res.send(JSON.stringify({ status, provider, user }));
    } catch (error) {
      console.log(error);
      res.status(404).send(JSON.stringify({ status, provider, error })); // user doesn't exist
    }
  },

  updatePassword: async (req, res) => {
    try {
      const user = await model.updatePassword(
        req.body.uid,
        req.body.passwordVal
      );
      await model.update(`teachers/${req.body.uid}`, { isPasswordSet: true });
      res.send({});
    } catch (error) {
      res.status(400).send({ error });
    }
  },

  resetPassword: async (req, res) => {
    const { linkUrl, platformTitle, customerContactEmail, userEmail } =
      req.body;

    try {
      // getUserByEmail --> updated
      const userDetails = await model.getter(`teachers/${req.body.uid}`);

      const actionCodeSettings = {
        // URL you want to redirect back to. The domain (www.example.com) for
        // this URL must be whitelisted in the Firebase Console.
        url: "http://localhost:3000/emailLogin",
        // This must be true for email link sign-in.
        handleCodeInApp: false,
      };

      const link = await model.getResetPasswordLink(
        userEmail,
        actionCodeSettings
      );

      if (link) {
        const mailOptions = {
          to: [{ email: userEmail, name: userDetails.name }],
          subject: "Change Password | iPrep Backend",
          text: "Hello  " + userDetails.name,
        };

        mailOptions.html = `Hi,</ > ${userDetails.name}
        <br> <br>
            Hope you're doing great ;)\n
            Looks like you have requested to change your password, here is the link to <a href="${link}">change password</a> of <a href="${linkUrl}">${platformTitle}</a>.
            <br><br>
                <br><br>
                    <div style="display">
                    </strong>Your username is</strong>
                    <br>
                        <label>Email: ${userEmail}</label>
                    </div>
                    <br>
                        In case of any issue, please write to us at <a href="mailto:${customerContactEmail}">${customerContactEmail}</a> or get in the touch with an iDream representative connected with you.
                        <br>`;

        // send email to the newly created user for accoutn activation
        const { error, info } = await sendMail(mailOptions);

        let status = 200;
        let resObj = undefined;

        if (error) {
          status = 500;
        } else {
          resObj = JSON.stringify({
            message:
              "Successfully created new user.\nAn email has been sent to the user.",
          });
        }
        res.status(status).send(resObj);
      }
    } catch (e) {
      res.status(404).send({ error: e });
    }
  },

  setHistory: async (req, res) => {
    const upload_path = `teacher_upload/history/teacher_uid1/assessments/${+new Date()}/`;
    const data = await model.update(upload_path, req.body);
    if (data) {
      res.status(200).send();
    } else {
      res.status(500).send();
    }
  },
};

const sendMail = (mailOptions) => {
  const options = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "api-key": process.env.SEND_IN_BLUE_API_KEY,
    },
    method: "POST",
    url: "https://api.sendinblue.com/v3/smtp/email",
    body: {
      tags: ["1"],
      sender: {
        name: "iPrep",
        email: "p@idreameducation.org",
      },
      to: mailOptions.to,
      htmlContent: mailOptions.html,
      subject: mailOptions.subject,
      replyTo: {
        email: "p@idreameducation.org",
        name: "Puneet",
      },
    },
    json: true,
  };

  return new Promise((resolve, reject) => {
    request(options, function (error, response, body) {
      if (error) reject({ error, info: body });
      resolve({ error, info: body });
    });
  });
};
