# Configurando el proyecto para trabajar con Firebase

* Instalar firebase-tools mediante el siguiente comando (lo instalamos de forma global):
  ```
  npm i -g firebase-tools
  ```

Instalada la herramienta procedemos a iniciar sesión, esto lo hacemos mediante el comando:
```
firebase login
```

Al hacerlo nos abrirá una ventana del navegador en la cual vamos a tener que iniciar sesión. Cuando lo hagamos nos mostrará en consola que el proceso se realizó con éxito.

Ya que nos hemos loggeado vamos a inicializar Firebase en nuestro proyecto, para ello (dentro de la carpeta de nuestro proyecto) vamos a ejecutar el siguiente comando:

```
firebase init
```

Para finalizar la configuración debemos instalar lo siguiente:

```
npm install --save firebase
```

<!-- Revisar la configuración dentro de la carpeta server. -->