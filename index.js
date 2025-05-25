require('dotenv').config();
const express = require("express")
const mongoose = require('mongoose')

const app = express()
const PORT = process.env.PORT || 5000

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

mongoose.connect(process.env.mongoDB_URI)
.then(() => {
  console.log("MongoDB connected...")
  app.listen(console.log(` "Server is running on ${PORT}" `))
})
.catch((err) => {
  console.error("MongoDB connection error...:", err);
});


const itemSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  description: [string],
  locationFound: [string],
  dateFound: { type: Date},
  claimed: { type: Boolean, default: false },
});

const Item = mongoose.model("'Item", itemSchema);
// 1. Add a found item
app.post("/items", async (req, res) => {
  try {
    const foundItem = new Item({
      itemName: req.body.itemName,
      description: req.body.description,
      locationFound: req.body.locationFound,
      dateFound: req.body.dateFound,
      claimed: req.body.claimed
    });

    await foundItem.save();
    res.status(201).json(foundItem);
  } catch (error) {
    res.status(500).json({ message: "Error creating item", error });
  }

})
// 2. view all unclaimed items
app.get("items/unclaimed", async (req, res) => {
  await Item.find({ claimed: false }, (err, items) =>{
    if (err){
      res.status(500).json({message: "Error fetching unclaimed items", err});
    }
    else{
      res.status(200).json(items);
    }
  }
    
  );

})
app.get("/items/unclaimed", async (req, res) => {
  try {
    const items = await Item.find({ claimed: false });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: "Error fetching unclaimed items", error });
  }
});

// 3. view one item by ID
app.get('/itme/:id', async (req, res) => {
  try{
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.status(200).json(item);
  }catch(error) {
    res.status(500).json({ message: "Error fetching item", error });
  }
});
// 4. Update an item by ID
app.put('/items/:id', async (req, res) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(req.params.id)
    if (!updatedItem) {
      return res.status(404).json({ message: "Item not found" });
    }else{
      return res.status(200).json(updatedItem)
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating item", error });
  }
})
// 5. Delete an item by ID
app.delete("/items/:id", async(req, res) =>{
  try{
    const deletedItem = await Item.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.status(200).json({ message: "Item deleted successfully" });
  }catch(err){
    res.status(500).json({ message: "Error deleting item", error: err });
  }
})