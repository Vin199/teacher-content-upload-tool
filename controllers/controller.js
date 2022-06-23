import AppSectionModel from "../model/user.js";
const model = new AppSectionModel();

class Controller {
  constructor() {}

  login = (req, res) => {
    res.render("login");
  };

  dashboard = (req, res) => {
    res.render("dashboard");
  };

  assessment = (req, res) => {
    res.render("assessment");
  };

  videos = (req, res) => {
    res.render("videos");
  };

  uploadVideos = (req, res) => {
    res.render("upload_video_links");
  };

  uploadNotes = (req, res) => {
    res.render("upload_note_links");
  };

  postBulkAssessment = (req, res) => {
    res.send({ msg: "Api Done" });
  };

  previewBulkUpload = (req, res) => {
    res.render("preview_assessment_bulk_upload");
  };

  postAssessmentBulkDataPreview = (req, res) => {
    res.send({ msg: "Api Done" });
  };

  videoLinkAssessment = (req, res) => {
    res.send({ msg: "Api Done" });
  };

  postBulkVideos = (req, res) => {
    res.send({ msg: "Api Done" });
  };

  notesLinkAssessment = (req, res) => {
    res.send({ msg: "Api Done" });
  };

  postBulkBooks = (req, res) => {
    res.send({ msg: "Api Done" });
  };

  books = (req, res) => {
    res.render("books");
  };

  getAssessment = (req, res) => {
    res.render("create-assessment");
  };

  bulkUploadAssessment = (req, res) => {
    res.render("assessment-bulk-upload");
  };

  bulkUploadVideos = (req, res) => {
    res.render("videos-bulk-upload");
  };

  bulkUploadBooks = (req, res) => {
    res.render("books-bulk-upload");
  };

  getUsers = async (req, res) => {
    const path = "topics";
    const data = await model.getter(path);
    res.send(data);
  };

  getHistory = async (req, res) => {
    const path = "teacher_upload/history/teacher_uid1/assessments";
    const data = await model.getter(path);
    res.send(data);
  };

  getAssessments = async (req, res) => {
    const { path } = req.body;
    const data = await model.getter(path);
    res.send(data);
  };

  setUsers = async (req, res) => {
    const { board, ClassID, subject } = req.body;
    await model.setter(path, req.body);
    res.send();
  };

  updateUser = async (req, res) => {
    const path = req.body.uid;
    await model.update(path, req.body);
    res.send();
  };

  setAssessment = async (req, res) => {
    const { board, classId, language, subject, topic } = req.body.metadata;
    const teacher_uid = req.body.teacher_data.uid;
    const upload_path = `teacher_upload/upload/${teacher_uid}/${board}/${language}/${classId}/${subject}/assessments/${topic}/questions`;
    //const history_path = `teacher_upload/history/${teacher_uid}/assessment/${board}/${classId}/${language}/${subject}/assessments/${topic}/"questionId"`;

    try {
      await model.update(upload_path, req.body.questionData);
      //await model.update(history_path, req.body.questionData);
      res.send();
    } catch (error) {
      res.status(500).send({ error });
    }
  };

  setVideosAssessment = async (req, res) => {
    //console.log(req.body);
    const teacher_uid = req.body.teacher_data.uid;
    const upload_path = `teacher_upload/upload/${teacher_uid}/${req.body.videoMetaData.board}/${req.body.videoMetaData.language}/${req.body.videoMetaData.classId}/${req.body.videoMetaData.subject}/videos/${req.body.videoMetaData.topic}`;

    //const history_path = `teacher_upload/history/${teacher_uid}/videos/${req.body.videoMetaData.board}/${req.body.videoMetaData.classId}/${req.body.videoMetaData.language}/${req.body.videoMetaData.subject}/videos/${req.body.videoMetaData.topic}`;

    await model.update(upload_path, req.body.videoData);
    //await model.update(history_path, req.body.videoData);

    res.send();
  };

  setNotesAssessment = async (req, res) => {
    //console.log(req.body);
    const teacher_uid = req.body.teacher_data.uid;
    const upload_path = `teacher_upload/upload/${teacher_uid}/${req.body.notesMetaDataInfo.board}/${req.body.notesMetaDataInfo.language}/${req.body.notesMetaDataInfo.classId}/${req.body.notesMetaDataInfo.subject}/books/${req.body.notesMetaDataInfo.topic}`;
    //const history_path = `teacher_upload/history/${teacher_uid}/books/${req.body.notesMetaDataInfo.board}/${req.body.notesMetaDataInfo.classId}/${req.body.notesMetaDataInfo.language}/${req.body.notesMetaDataInfo.subject}/books/${req.body.notesMetaDataInfo.topic}`;

    await model.update(upload_path, req.body.notesData);
    //await model.update(history_path, req.body.notesData);
    res.send();
  };

  getCount = async (req, res) => {
    const { board, classId, language, subject, topic } = req.body.metadata;
    const teacher_uid = req.body.teacher_data.uid;
    const upload_path = `teacher_upload/upload/${teacher_uid}/${board}/${language}/${classId}/${subject}/assessments/${topic}/questions/details`;
    const counterValue = await model.getter(upload_path);
    if (counterValue == null) {
      res.send({ qsn_Id: 0 });
    } else {
      res.send(counterValue);
    }
  };

  getTopics = async (req, res) => {
    //console.log(req.body);
    const { board, classId, language, subject } = req.body;
    const path = `topics/${board}/${language}/${classId}/${subject}/topics`;
    const topicsObj = await model.getter(path);
    res.send(topicsObj);
  };

  // setHistory = async (req, res) => {
  //   const { board, classId, language, subject, topic } = req.body.metadata;
  //   const teacher_uid = req.body.teacher_data.uid;
  //   const upload_path = `teacher_upload/history/${teacher_uid}/assessments/${+new Date()}/`;
  //   await model.update(upload_path, { kjb: "sdf" });
  //   res.send();
  //   // if (history_value) res.status(200).send(history_value);
  //   // else res.status(404).send(null);
  // };
}

export default Controller;
