'use client'
import Image from "next/image";
import { useState, useEffect } from 'react';
import { firestore } from '@/firebase';
import { Box, Typography } from "@mui/material";
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

  const handleOpen = () => setOpen(true) // Model helper function
  const handleClose = () => setOpen(false) // Model helper function

  return (
  // Box is the most basic Material UI Component
  <Box>
    <Typography variant="h1">Pantry Tracker</Typography>
    {
      pantry.forEach((item) => {
        console.log(item)
        return (
        <>
        {item.name}
        {item.count}
        </>
        )
      })
    }
  </Box>
  )
}
