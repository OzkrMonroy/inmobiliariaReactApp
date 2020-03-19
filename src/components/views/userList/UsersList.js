import React, { useState, useEffect } from 'react'
import { Container, Paper, Grid, Table, TableBody, TableRow, TableCell, Button, Typography } from "@material-ui/core";
import { style } from './userLIstStyle'
import { useDispatch, useSelector } from 'react-redux';
import { getUsersList } from '../../../redux/actions/userAction'

const UsersList = (props) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const usersArray = useSelector(state => state.usersList.users)
  const dispatch = useDispatch()

  useEffect(() => {
    if(!isLoaded) {
      getUsersList(dispatch).then(success => {
        setIsLoaded(true)
      })
    }
  }, [isLoaded])

  return (
    <Container style={style.container}>
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
                        <Button variant="contained" color="primary" size="small">Roles</Button>
                      </TableCell>
                      <TableCell>
                        <Button variant="contained" color="primary" size="small">Enviar mensaje</Button>
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
 
export default UsersList;