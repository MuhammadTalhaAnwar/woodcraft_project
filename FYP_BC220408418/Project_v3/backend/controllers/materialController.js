import Material from '../models/Material.js';

// fetch all inventory materials
const getMaterials = async (req, res) => {
  try {
    const materials = await Material.find({});
    res.json(materials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// add a new material to inventory
const createMaterial = async (req, res) => {
  const { name, category, quantity, unit, pricePerUnit, lowStockThreshold, supplierName, supplierContact } = req.body;

  try {
    const material = new Material({
      name,
      category,
      quantity,
      unit,
      pricePerUnit,
      lowStockThreshold,
      supplierName,
      supplierContact,
    });

    const createdMaterial = await material.save();
    res.status(201).json(createdMaterial);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// update details of an existing material (e.g. price or stock threshold)
const updateMaterial = async (req, res) => {
  const { name, category, quantity, unit, pricePerUnit, lowStockThreshold, supplierName, supplierContact } = req.body;

  try {
    const material = await Material.findById(req.params.id);

    if (material) {
      material.name = name || material.name;
      material.category = category || material.category;
      material.quantity = quantity !== undefined ? quantity : material.quantity;
      material.unit = unit || material.unit;
      material.pricePerUnit = pricePerUnit !== undefined ? pricePerUnit : material.pricePerUnit;
      material.lowStockThreshold = lowStockThreshold !== undefined ? lowStockThreshold : material.lowStockThreshold;
      material.supplierName = supplierName || material.supplierName;
      material.supplierContact = supplierContact || material.supplierContact;

      const updatedMaterial = await material.save();
      res.json(updatedMaterial);
    } else {
      res.status(404).json({ message: 'Material not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// remove a material from inventory
const deleteMaterial = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);

    if (material) {
      await material.deleteOne();
      res.json({ message: 'Material removed' });
    } else {
      res.status(404).json({ message: 'Material not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getMaterials, createMaterial, updateMaterial, deleteMaterial };
