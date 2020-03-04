import React from "react";
import { Grid, Typography, Card, CardContent, CardActions, Button, CardMedia } from "@material-ui/core";

const CardListHomes = ({ item, style, redirectToEditHouse, deleteHouseFromFirestore, logo}) => {
  //TODO: Agregar un alertDialog de confirmación de Eliminación
  return (
    <Grid item xs={12} ms={6} md={4}>
      <Card style={style.card}>
        <CardMedia
          style={style.cardMedia}
          image={item.photos ? item.photos[0].url : logo}
          title="My House"
        />
        <CardContent style={style.cardContet}>
          <Typography gutterBottom variant="h5" component="h2">
            {`${item.city}, ${item.country}`}
          </Typography>
        </CardContent>
        <CardActions>
          <Button
            size="small"
            color="primary"
            onClick={() => redirectToEditHouse(item.id)}
          >
            Editar
          </Button>
          <Button
            size="small"
            color="secondary"
            onClick={() => deleteHouseFromFirestore(item)}
          >
            Eliminar
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
};

export default CardListHomes;
