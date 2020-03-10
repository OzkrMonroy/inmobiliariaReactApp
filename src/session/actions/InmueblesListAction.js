export const getData = (firebase, pageSize, initialHouse, searchText) => {
  return new Promise(async (resolve, reject) => {
    let houses = firebase.db
                 .collection("Homes")
                 .orderBy("address")
                 .limit(pageSize)

    if(initialHouse !== null) {
      houses = firebase.db
               .collection("Homes")
               .orderBy("address")
               .startAfter(initialHouse)
               .limit(pageSize)

      if(searchText.trim() !== "") {
        houses = firebase.db
                 .collection("Homes")
                 .orderBy("address")
                 .where("keywords", "array-contains", searchText.toLowerCase())
                 .startAfter(initialHouse)
                 .limit(pageSize)
      }
    }

    const snapshot = await houses.get()

    const housesArray = snapshot.docs.map(doc => {
      let data = doc.data()
      let id = doc.id

      return {id, ...data}
    })

    const firstHouse = snapshot.docs[0]
    const lastHouse = snapshot.docs[snapshot.docs.length -1]

    const returnValue = {
      housesArray,
      firstHouse,
      lastHouse
    }

    resolve(returnValue)
  })

}