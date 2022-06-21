import { Router } from "express";
import Controller from "../controllers/controller.js";
import Middleware from "../middleware/middleware.js";
const controller = new Controller();

const router = Router();

// router.post('/api', controller.loginData);
router.get("/", Middleware, controller.login);
router.get("/dashboard", controller.dashboard);
router.get("/users", controller.getUsers);
router.get("/getHistory", controller.getHistory);
router.post("/getQuestions", controller.getAssessments);
router.get("/assessment", controller.assessment);
router.get("/videos", controller.videos);
router.get("/books", controller.books);
router.get("/createAssessment", controller.getAssessment);
router.get("/uploadVideoLinks", controller.uploadVideos);
router.get("/uploadNotesLinks", controller.uploadNotes);
router.get("/bulk-upload-assessment", controller.bulkUploadAssessment);
router.get("/bulk-upload-videos", controller.bulkUploadVideos);
router.get("/bulk-upload-books", controller.bulkUploadBooks);
router.get("/preview-bulk-upload", controller.previewBulkUpload);

router.post("/set-assessment", controller.setAssessment);
router.post("/create-bulk-assessment", controller.postBulkAssessment);
router.post(
  "/send-assessment-preview-bulk-data",
  controller.postAssessmentBulkDataPreview
);
router.post("/videoLinks", controller.videoLinkAssessment);
router.post("/create-bulk-video", controller.postBulkVideos);
router.post("/notesLinks", controller.notesLinkAssessment);
router.post("/create-bulk-books", controller.postBulkBooks);
router.post("/set-video-assessment", controller.setVideosAssessment);
router.post("/set-notes-assessment", controller.setNotesAssessment);
router.post("/teachers", controller.updateUser);
router.post("/getCount", controller.getCount);
router.post("/set-history", controller.setHistory);

export default router;
