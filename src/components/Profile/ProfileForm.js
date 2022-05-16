import classes from "./ProfileForm.module.css";
import { useRef, useContext } from "react";
import AuthContext from "../../store/auth-context";

const ProfileForm = () => {
  const newPasswordInputRef = new useRef();
  const authCtx = useContext(AuthContext);

  const submitHandler = (e) => {
    e.preventDefault();
    const enteredNewPassword = newPasswordInputRef.current.value;

    // https://firebase.google.com/docs/reference/rest/auth?hl=en&authuser=0#section-change-password
    fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyBdlJf2kiVgHIgsNWBWa4j3p-MtIzzEQM4",
      {
        method: "POST",
        body: JSON.stringify({
          idToken: authCtx.token,
          password: enteredNewPassword,
          returnSecureToken: false, // we do not need a new token here
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((res) => {
      if (res.ok) {
        return res.json()
      } else {
        return res.json().then((data) => {
          let errorMessage = "Changing Password Failed";
          throw new Error(errorMessage);
        });
      }
    })
    // .then((data) => {
    //   // authCtx.login(data.idToken);
    //   console.log(data);
    // })
    .catch((err) => {
      alert(err.message);
    });
  };

  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <div className={classes.control}>
        <label htmlFor="new-password">New Password</label>
        <input type="password" id="new-password" ref={newPasswordInputRef} />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
};

export default ProfileForm;
