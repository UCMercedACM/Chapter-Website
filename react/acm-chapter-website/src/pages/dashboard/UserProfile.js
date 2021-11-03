import React from "react";
import userData from "./testUserData";

const UserProfile = () => {
  return (
    <div className="user-profile dashboard-component">
      <section>
        <div className="user-profile__profile-pic"></div>
        <p className="user-profile__join-date">
          Joined {userData.profile.joinDate}
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
  );
};

export default UserProfile;
