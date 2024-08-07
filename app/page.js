'use client'
import Image from "next/image";
import { useState, useEffect } from 'react';
import { firestore } from '@/firebase';
import { Box, Button, Modal, Stack, TextField, Typography, MenuItem, Select, FormControl, InputLabel, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { collection, getDocs, query, doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";

export default function Home() {
  const [pantry, setPantry] = useState([]) // Will store the inventory here
  const [open, setOpen] = useState(false) // Will use to add and remove items
  const [itemName, setItemName] = useState('') // Will use to store the name of the item
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('');

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

  const addItem = async (item) => { // Helper function 2
    const docRef = doc(collection(firestore, 'pantry'), item)
    const docSnap = await getDoc(docRef)

    if(docSnap.exists()) {
      const {quantity} = docSnap.data()
      await setDoc(docRef, {quantity: quantity + 1})
    } else {
      await setDoc(docRef, {quantity: 1})
    }
    await updatePantry()
  }

  const removeItem = async (item) => { // Helper function 3
    const docRef = doc(collection(firestore, 'pantry'), item)
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

  const deleteItem = async (item) => { // Function to delete the entire item
    const docRef = doc(collection(firestore, 'pantry'), item)
    await deleteDoc(docRef)
    await updatePantry()
  }

  useEffect(() => {
    updatePantry()
  }, [])

  const highlightText = (text, query) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={index} style={{ backgroundColor: 'yellow' }}>
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const filteredPantry = pantry.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedPantry = filteredPantry.sort((a, b) => {
    if (sortOrder === 'name') {
      return a.name.localeCompare(b.name);
    } else if (sortOrder === 'quantity') {
      return b.quantity - a.quantity;
    }
    return 0;
  });

  const handleOpen = () => setOpen(true) // Modal helper function
  const handleClose = () => setOpen(false) // Modal helper function

  return (
  // Box is the most basic Material UI Component
  <Box
    width="100vw"
    height="100vh"
    display="flex"
    flexDirection="column"
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
        <Typography
          variant="h6"
        >
          Add Item
        </Typography>
        <Stack
          width="100%"
          direction="row"
          spacing={2}
        >
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
    {/* <Typography variant="h1">Pantry Tracker</Typography> */}
    <Button
      variant="contained"
      onClick={() => {
        handleOpen()
      }}
    >
      Add New Item
    </Button>
    <Box border="1px solid #333">
      <Box
        width="800px"
        height="200px"
        bgcolor="#ADD8E6"
        display="flex"
        alignItems="center"
        justifyContent="space-around"
        flexDirection="column"
      >
        <Typography
          variant="h2"
          color="#333"
        >
          Pantry Items
        </Typography>
        <Box display="flex" width="100%" justifyContent="space-between" paddingX={2} gap={2}>
          <TextField
            label="Search"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ flex: 2 }}
          />
          <FormControl variant="outlined" style={{ flex: 1 }}>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              label="Sort By"
            >
              <MenuItem value="name">Name</MenuItem>
              <MenuItem value="quantity">Quantity</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>
      <Stack width="800px" height="300px" overflow="auto">
          {sortedPantry.map(({ name, quantity }) => (
            <Box
              key={name}
              width="100%"
              minHeight="150px"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              bgcolor="#f0f0f0"
              padding={5}
            >
              <Box flex={1} display="flex">
                <Typography variant="h4" color="#333">
                  {highlightText(name.charAt(0).toUpperCase() + name.slice(1), searchQuery)}
                </Typography>
              </Box>
              <Box flex={1} display="flex" justifyContent="center">
                <Typography variant="h4" color="#333">
                  {quantity}
                </Typography>
              </Box>
              <Box flex={1} display="flex" justifyContent="center">
                <Stack direction="row" spacing={2}>
                  <Button variant="contained" onClick={() => addItem(name)}>
                    Add
                  </Button>
                  <Button variant="contained" onClick={() => removeItem(name)}>
                    Remove
                  </Button>
                  <IconButton aria-label="delete" onClick={() => deleteItem(name)}>
                    <DeleteIcon />
                  </IconButton>
                </Stack>
              </Box>
            </Box>
          ))}
        </Stack>
    </Box>
  </Box>
  )
}
