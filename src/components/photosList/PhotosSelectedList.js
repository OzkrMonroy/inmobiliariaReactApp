import React from "react";
import { Button, Table, TableBody, TableRow, TableCell, Typography } from "@material-ui/core";
import { SecondarySpinner } from '../spinner'

const PhotosSelectedList = ({ photos, deletePhotoTemp, style, isLoading }) => {
  return (
    <Table>
      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell align="center">
              <SecondarySpinner
                color="primary"
                containerHeight={style.height}
                size={30}
              />
            </TableCell>
          </TableRow>
        ) : photos.length ? (
          photos.map((photo, i) => (
            <TableRow key={i}>
              <TableCell align="left">
                <img src={photo.url} style={style.photo} />
              </TableCell>
              <TableCell aling="left">
                <Button
                  variant="contained"
                  color="secondary"
                  size="small"
                  onClick={deletePhotoTemp(photo)}
                >
                  Eliminar
                </Button>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell align="center">
              <Typography variant="subtitle2">No hay fotos para mostrar</Typography>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default PhotosSelectedList;
