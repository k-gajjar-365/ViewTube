import { Router } from "express";
import {
   createPlaylist,
   getPlaylistById,
   getUserPlaylists,
   addVideoToPlaylist,
   updatePlaylist,
   deletePlaylist,
   removeVideoFromPlaylist,
} from "../controllers/playlist.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// all routes below require user to be logged in
router.use(verifyJWT);

router.route("/").post(createPlaylist);
router.route("/user/:userId").get(getUserPlaylists);
router.route("/:playlistId")
                            .get(getPlaylistById)
                            .patch(updatePlaylist)
                            .delete(deletePlaylist);

router.route("/:playlistId/add/:videoId").patch(addVideoToPlaylist);
router.route("/:playlistId/remove/:videoId").patch(removeVideoFromPlaylist);


export default router;
