import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@material-ui/core'

const AlertDialog = ({ house, isOpen, deleteHouseFromFirestore, setDataForDelete }) => {

  const [open, setOpen] = useState(true);

  useEffect(() => {
    setOpen(isOpen)
  }, [isOpen])

  const handleClose = () => {
    setOpen(false);
    setDataForDelete({}, false)
  };

  const handleCloseAndDelete = () => {
    setOpen(false);
    deleteHouseFromFirestore(house)
    setDataForDelete({}, false)
  };

  return (
    <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth={true}
        maxWidth="sm"
      >
        <DialogTitle id="alert-dialog-title"> {`Eliminar Inmueble`} </DialogTitle>
        <DialogContent>
          <Typography variant="subtitle2" gutterBottom>
            Dirección: <Typography variant="body2" gutterBottom>{house.address}</Typography>
          </Typography>
          <Typography variant="subtitle2" gutterBottom>
            Ciudad: <Typography variant="body2" gutterBottom>{house.city}</Typography>
          </Typography>
          <Typography variant="subtitle2" gutterBottom>
            País: <Typography variant="body2" gutterBottom>{house.country}</Typography>
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleCloseAndDelete} color="secondary">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
  );
}
 
export default AlertDialog;