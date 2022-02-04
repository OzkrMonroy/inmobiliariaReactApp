import React, { useState, useEffect } from 'react'
import { Container, Paper, Grid, Table, TableBody, TableRow, TableCell, Button, Typography, Dialog, DialogTitle, DialogContent, Select, MenuItem, DialogActions } from "@material-ui/core";
import { style } from './userLIstStyle'
import { useDispatch, useSelector } from 'react-redux';
import { getUsersList, updateUserRoles } from '../../../redux/actions/userAction'
import { sendEmailAction } from '../../../redux/actions/emailAction'
import { useSessionStateValue } from '../../../session/sessionStore';
import { displaySnackBar } from '../../../session/actions/snackBarAction';
import { consumerFirebase } from '../../../server'
import { refreshSession } from '../../../session/actions/sessionAction';
import { sendNotification } from '../../../session/actions/notificationAction';

const initialUserSelected = {
  email: '',
  phoneNumber: '',
  roles: []
}

const UsersList = (props) => {
  const [{session}, dispatch] = useSessionStateValue()

  const [isLoaded, setIsLoaded] = useState(false)
  const [dialogIsOpen, setDialogIsOpen] = useState(false)
  const [userSelected, setUserSelected] = useState(initialUserSelected)
  const [selectedRole, setSelectedRole] = useState('0')

  const usersArray = useSelector(state => state.usersList.users)
  const dispatchRedux = useDispatch()

  useEffect(() => {
    if(!isLoaded) {
      getUsersList(dispatchRedux).then(success => {
        setIsLoaded(true)
      })
    }
  }, [isLoaded, dispatchRedux])

  const sendEmail = email => {
    const obj = {
      email: email,
      title: 'Correo desde Curso React Extremo',
      message: 'Gracias por participar en el curso'
    }
    sendEmailAction(obj).then(result => {
      console.log(result)
      displaySnackBar(dispatch, {
        isOpen: true,
        message: `Se envió el mensaje al destinatario: ${email} `
      })
    })
  }

  const onHandleChange = e => {
    setSelectedRole(e.target.value)
  }

  const openAlertDialog = user => {
    setUserSelected(user)
    setDialogIsOpen(true)
  }

  const addRole = async() => {
    if(selectedRole === '0'){
      displaySnackBar(dispatch, {
        isOpen: true,
        message: "Seleccione un Rol Válido."
      })
      return
    }
    if(!userSelected.roles) {
      userSelected.roles = []
    }

    const existRole = userSelected.roles.filter(rol => rol.name === selectedRole)

    if(existRole.length === 0) {
      // Init create custom user claim
      const customClaims = {}

      userSelected.roles.map(_role => {
        Object.defineProperty(customClaims, _role.name, {
          value: _role.state,
          writable: true,
          enumerable: true,
          configurable: true
        })
      })

      Object.defineProperty(customClaims, selectedRole, {
        value: true,
        writable: true,
        enumerable: true,
        configurable: true
      })
      // End create custom user claim

      userSelected.roles.push({name: selectedRole, value: true})

      updateUserRoles(dispatchRedux, userSelected, customClaims, props.firebase).then(res => {
        if(res.data.status !== 'error') {
          refreshSession(props.firebase)
    
          displaySnackBar(dispatch, {
            isOpen: true,
            message: 'Se eliminó el rol de usuario.'
          })
        }else {
          const originalRoles = userSelected.roles.filter(role => role.name !== selectedRole.name)
          setUserSelected({
            ...userSelected,
            roles: originalRoles
          })
          displaySnackBar(dispatch, {
            isOpen: true,
            message: res.data.message
          })
        }
        getUsersList(dispatchRedux)
      })
    }
  }

  const removeRole = async roleS => {
    const originalUserRoles = userSelected.roles
    const newRolesArray = userSelected.roles.filter(role => role.name !== roleS)
    userSelected.roles = newRolesArray

    const customClaims = {}

    newRolesArray.map(_rol => {
      Object.defineProperty(customClaims, _rol.name, {
        value: _rol.state,
        writable: true,
        enumerable: true,
        configurable: true
      })
    })

    Object.defineProperty(customClaims, roleS, {
      value: false,
      writable: true,
      enumerable: true,
      configurable: true
    })

    // const response = await updateUserRoles(dispatchRedux, userSelected, customClaims)
    updateUserRoles(dispatchRedux, userSelected, customClaims, props.firebase).then(res => {
      if(res.data.status !== 'error') {
        refreshSession(props.firebase)
  
        displaySnackBar(dispatch, {
          isOpen: true,
          message: 'Se eliminó el rol de usuario.'
        })
      }else {
        setUserSelected({
          ...userSelected,
          roles: originalUserRoles
        })
        displaySnackBar(dispatch, {
          isOpen: true,
          message: res.data.message
        })
      }
      getUsersList(dispatchRedux)
    })
  }

  const sendPushNotification = user => {
    if(props.firebase.messaginValidation.isSupported()){
      const listToken = user.tokenArray
      const obj = {
        token: listToken || []
      }

      sendNotification(obj).then(resp => {
        displaySnackBar(dispatch, {
          isOpen: true,
          message: resp.data.message
        })
      })
    }else {
      displaySnackBar(dispatch, {
        isOpen: true,
        message: 'Tu navegador no soporta Push Notifications.'
      })
    }
  }

  //TODO: Crear un componente para el dialog
  return (
    <Container style={style.container}>
      <Dialog open={dialogIsOpen} onClose={() => {setDialogIsOpen(false)}}>
        <DialogTitle>
          Roles del usuario: {userSelected.email || userSelected.phoneNumber}
        </DialogTitle>
        <DialogContent>
          <Grid container justify="center">
            <Grid item xs={6} sm={6}>
              <Select value={selectedRole} onChange={onHandleChange} >
                <MenuItem value={"0"}>Seleccione Rol</MenuItem>
                <MenuItem value={"ADMIN"}>Administrador</MenuItem>
                <MenuItem value={"OPERADOR"}>Operador</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={6} sm={6}>
              <Button variant="contained" color="primary" onClick={() => addRole()}>Agregar</Button>
            </Grid>
            <Grid item xs={12} sm={12}>
              <Table>
                <TableBody>
                  {userSelected.roles ?
                    userSelected.roles.map((role, i) => (
                      <TableRow key={i}>
                        <TableCell align="left">{role.name}</TableCell>
                        <TableCell align="left">
                          <Button variant="contained" color="secondary" size="small" onClick={() => removeRole(role.name)}>
                            Eliminar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  : 
                    <TableRow>
                      <TableCell align="center">Este usurio aún no tiene roles</TableCell>
                    </TableRow>
                  }
                </TableBody>
              </Table>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
        <Button color="secondary" onClick={() => {setDialogIsOpen(false)}}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      <Paper style={style.paper}>
        <Grid container justify="center">
          <Grid item xs={12} sm={12}>
            <Table>
              <TableBody>
                {usersArray.length ? 
                  usersArray.map((user, id) => (
                    <TableRow key={id}>
                      <TableCell align="left">{user.email || user.phoneNumber}</TableCell>
                      <TableCell align="left">{user.name ? (`${user.name} ${user.lastName}`) : "No posee nombre"}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={() => openAlertDialog(user)}
                        >
                          Roles
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={() => sendPushNotification(user)}>
                          Notification
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={() => sendEmail(user.email)}>
                          Enviar mensaje
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                : <TableRow>
                    <TableCell align="center">
                      <Typography component="h3" variant="h5">No hay usuarios para mostrar</Typography>
                    </TableCell>
                  </TableRow>
                }
              </TableBody>
            </Table>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}
 
export default consumerFirebase(UsersList);