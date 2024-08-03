'use client'
import Image from "next/image";
import { useState, useEffect } from 'react';
import { firestore } from '@/firebase';
import { Box, Button, Modal, Stack, TextField, Typography } from "@mui/material";
import { collection, getDocs, query } from "firebase/firestore";

export default function Home() {
  const [pantry, setPantry] = useState([]) // Will store the inventory here
  const [open, setOpen] = useState(false) // Will use to add and remove items
  const [itemName, setItemName] = useState('') // Will use to store the name of the item

  const updatePantry = async () => { // Helper function 1 
    const snapshot = query(collection(firestore, 'pantry'))
    const docs = await getDocs(snapshot)
    const pantryList = []
    docs.forEach((doc) => {
      pantryList.push({
        name: doc.id,
        ...doc.data(),
      })
    })
    setPantry(pantryList)
    console.log(pantryList)
  }

  const addItem = async () => { // Helper function 2
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if(docSnap.exists()) {
      const {quantity} = docSnap.data()
      await setDoc(docRef, {quantity: quantity + 1})
    } else {
      await setDoc(docRef, {quantity: 1})
    }
    await updatePantry()
  }

  const removeItem = async () => { // Helper function 3
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if(docSnap.exists()) {
      const {quantity} = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, {quantity: quantity - 1})
      }
    }
    await updatePantry()
  }

  useEffect(() => {
    updatePantry()
  }, [])

  const handleOpen = () => setOpen(true) // Modal helper function
  const handleClose = () => setOpen(false) // Modal helper function

  return (
  // Box is the most basic Material UI Component
  <Box
    width="100vw"
    height="100vh"
    display="flex"
    justifyContent="center"
    alignItems="center"
    gap={2}
    >
    <Modal open={open} onClose={handleClose}>
      <Box
        position="absolute"
        top="50%"
        left="50%"
        width={400}
        bgcolor="white"
        border="2px solid #00000"
        boxShadow={24}
        p={4}
        display="flex"
        flexDirection="column"
        gap={3}
        sx={{
          transform: "translate(-50%, -50%)"
        }}
      >
        <Typography variant="h6">Add Item</Typography>
        <Stack width="100%" direction="row" spacing={2}>
          <TextField
            variant="outlined"
            fullWidth
            value={itemName}
            onChange={(e) => {
              setItemName(e.target.value)
            }}
          />
          <Button 
            variant="outlined"
            onClick={() => {
              addItem(itemName)
              setItemName('')
              handleClose()
            }}
          >
            Add
          </Button>
        </Stack>
      </Box>
    </Modal>
    <Typography variant="h1">Pantry Tracker</Typography>
  </Box>
  )
}
