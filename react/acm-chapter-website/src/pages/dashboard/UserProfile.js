import React, { useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import userData from "./testUserData";
// import { fireStorage } from "../../firebase/config";
import { useAuth } from "../../contexts/AuthContext";
import { auth } from "../../firebase/config";
// import { createAvatar } from "@dicebear/avatars";
// import * as style from "@dicebear/miniavs";

const UserProfile = ({ attendedEvents }) => {
  const [file, setFile] = useState(null);
  const [url, setURL] = useState("");

  function handleChange(e) {
    setFile(e.target.files[0]);
  }

  // function handleUpload(e) {
  //   e.preventDefault();
  //   const ref = fireStorage.ref(currentUser + "/profilePicture/" + file.name);
  //   const uploadTask = ref.put(file);
  //   uploadTask.on("state_changed", console.log, console.error, () => {
  //     ref.getDownloadURL().then((url) => {
  //       setFile(null);
  //       setURL(url);
  //     });
  //   });
  // }

  // let generatedProfilePhoto = createAvatar(style, {
  //   seed: currentUser.name,
  //   // ... and other options
  // });
  // console.log(generatedProfilePhoto);

  // const svgString = encodeURIComponent(
  //   renderToStaticMarkup(generatedProfilePhoto)
  // );
  // const dataUri = `url("data:image/svg+xml,${svgString}")`;
  return (
    <div className="user-profile dashboard-component">
      <div>
        <section>
          <p className="user-profile__join-date">
            Joined {auth.currentUser.metadata.creationTime}
          </p>
        </section>
        <section>
          <div className="user-profile__about-top">
            <h3 className="user-profile__about-top__heading">About me</h3>
            <button className="user-profile__about-top__edit-btn">Edit</button>
          </div>
          <div className="user-profile__about-bottom">
            <p className="user-profile__about-bottom__bio">
              {userData.profile.bio}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default UserProfile;
