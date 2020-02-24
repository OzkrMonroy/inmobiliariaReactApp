import React, { useState, useEffect } from "react";
import { Container, Avatar, Typography, Grid, TextField, Button } from "@material-ui/core";
// Global State
import { useSessionStateValue } from "../../../session/sessionStore";
import { consumerFirebase } from "../../../server";

import { styles } from "./userProfileStyles";
import userDefaultPhoto from "../../../logo.svg";
import { displaySnackBar } from "../../../session/actions/snackBarAction";

import ImageUploader from 'react-images-upload'
import uuid from 'uuid'

let initialState = {
  name: "",
  lastName: "",
  email: "",
  photo: "",
  id: "",
  phoneNumber: ""
};

const UserProfile = props => {
  const [{ session }, dispatch] = useSessionStateValue();
  let [userState, setUserState] = useState(initialState);

  const { firebase } = props;

  useEffect(() => {
    if (userState.id === "") {
      if (session) {
        setUserState(session.user);
      }
    }
  }, [session, userState.id]);

  const handleOnSubmit = e => {
    e.preventDefault();

    firebase.db
      .collection("Users")
      .doc(firebase.auth.currentUser.uid)
      .set(userState, { merge: true })
      .then(success => {
        dispatch({
          type: "CHANGE_SESSION",
          newUser: userState,
          isAuthenticated: true
        });
        displaySnackBar(dispatch, {
          isOpen: true,
          message: "Se guardaron los cambios correctamente"
        });
      })
      .catch(error => {
        displaySnackBar(dispatch, {
          isOpen: true,
          message: `Ha ocurrido un error: ${error}`
        });
      });
  };

  const handleOnChange = e => {
    const { name, value } = e.target;

    setUserState({
      ...userState,
      [name]: value
    });
  };

  const onChangeSelectProfileImage = photos => {
    const photo = photos[0]
    // const uniquePhotoCode = uuid.v4()
    const photoName = photo.name
    const photoExtension = photoName.split('.').pop()
    
    // const profilePhotoName = (photoName.split('')[0] + '_' + uniquePhotoCode + '.' + photoExtension).replace(/\s/g, '_').toLowerCase()
    const profilePhotoName = ('profilePhoto.' + photoExtension).replace(/\s/g, '_').toLowerCase()

    firebase.saveFileInStorage(profilePhotoName, photo, firebase.auth.currentUser.uid)
    .then(metaData => {
      firebase.getFileUrl(profilePhotoName, firebase.auth.currentUser.uid)
      .then(urlPhoto => {
        userState.photo = urlPhoto

        firebase.db
        .collection('Users')
        .doc(firebase.auth.currentUser.uid)
        .set({photo : urlPhoto}, {merge: true})
        .then(userDB => {
          dispatch({
            type: "CHANGE_SESSION",
            newUser: userState,
            isAuthenticated: true
          });
          displaySnackBar(dispatch, {
            isOpen: true,
            message: "Se guardaron los cambios correctamente"
          });
        })
      })
    })
  }

  let imageComponentKey = uuid.v4()

  return session ? (
    <Container component="main" maxWidth="md" justify="center">
      <div style={styles.paper}>
        <Avatar src={userState.photo || userDefaultPhoto} />
        <Typography component="h1" variant="h5">
          Mi cuenta
        </Typography>
      </div>
      <form style={styles.form} onSubmit={handleOnSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              name="name"
              variant="outlined"
              fullWidth
              label="Nombre"
              onChange={handleOnChange}
              value={userState.name}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              name="lastName"
              variant="outlined"
              fullWidth
              label="Apellido"
              onChange={handleOnChange}
              value={userState.lastName}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              name="email"
              variant="outlined"
              fullWidth
              label="Email"
              onChange={handleOnChange}
              value={userState.email}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              name="phoneNumber"
              variant="outlined"
              fullWidth
              label="Teléfono"
              onChange={handleOnChange}
              value={userState.phoneNumber}
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <ImageUploader
              withIcon={false}
              key={imageComponentKey}
              singleImage={true}
              buttonText="Selecciona una foto de perfil"
              onChange={onChangeSelectProfileImage}
              imgExtension={['.jpg', '.png', '.gif', '.jpeg']}
              maxFileSize={5242880}
            />
          </Grid>
        </Grid>
        <Grid container justify="center">
          <Grid item xs={12} md={6}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              style={styles.submit}
            >
              Guardar Cambios
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  ) : null;
};

export default consumerFirebase(UserProfile);
