import { Router } from "express";
import controller from "../controllers/controller.js";
import auth from "../middleware/auth.js";
import redirectAuth from "../middleware/redirectAuthenticated.js";

const router = Router();

// router.post('/api', controller.loginData);
router.get("/", redirectAuth, controller.login);
router.get("/logout", controller.logout);

router.get("/emailLogin", redirectAuth, controller.emailLogin);
router.get("/setPassword", redirectAuth, controller.setPassword);
router.get("/loginWithPhone", redirectAuth, controller.loginWithPhone);
router.get("/setSession", redirectAuth, controller.setSession);
router.get(
  "/authentication-failed",
  redirectAuth,
  controller.authenticationFailed
);

router.get("/dashboard", auth, controller.dashboard);
router.get("/users", auth, controller.getUsers); // , auth
router.get("/getHistory", auth, controller.getHistory);
router.get("/assessment", auth, controller.assessment);
router.get("/showHistory", auth, controller.showHistory);
router.get("/videos", auth, controller.videos);
router.get("/books", auth, controller.books);
router.get("/createAssessment", auth, controller.getAssessment);
router.get("/uploadVideoLinks", auth, controller.uploadVideos);
router.get("/uploadNotesLinks", auth, controller.uploadNotes);
router.get("/bulk-upload-assessment", auth, controller.bulkUploadAssessment);
router.get("/bulk-upload-videos", auth, controller.bulkUploadVideos);
router.get("/bulk-upload-books", auth, controller.bulkUploadBooks);
router.get("/preview-bulk-upload", auth, controller.previewBulkUpload);

router.post("/set-assessment", auth, controller.setAssessment);
router.post("/create-bulk-assessment", auth, controller.postBulkAssessment);
router.post(
  "/send-assessment-preview-bulk-data",
  auth,
  controller.postAssessmentBulkDataPreview
);
router.post("/videoLinks", auth, controller.videoLinkAssessment);
router.post("/create-bulk-video", auth, controller.postBulkVideos);
router.post("/notesLinks", auth, controller.notesLinkAssessment);
router.post("/create-bulk-books", auth, controller.postBulkBooks);
router.post("/set-video-assessment", auth, controller.setVideosAssessment);
router.post("/set-notes-assessment", auth, controller.setNotesAssessment);
router.post("/teachers", auth, controller.updateUser);
router.post("/getCount", auth, controller.getCount);
router.post("/getVideoCount", auth, controller.getVideoCount);
router.post("/getBookCount", auth, controller.getBookCount);
router.post("/getQuestions", auth, controller.getAssessments);
router.post("/getTopics", auth, controller.getTopics);

router.post("/checkUserStatus", controller.checkUserStatus);

router.patch("/updatePassword", controller.updatePassword);

router.post("/resetPassword", controller.resetPassword);

router.post("/setHistory", controller.setHistory);

export default router;
