import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { put, del } from '@vercel/blob'; // Added 'del' for deleting blobs
import multer from 'multer';
import Property from './models/Property.js';
import authRouter from './routes/auth.js';
import heroSlideRouter from './routes/heroSlides.js';
import { authenticate, authorizeAdmin } from './middleware/auth.js';
const app = express();
const PORT = process.env.PORT || 4000;
// Use Memory Storage for Vercel compatibility
const upload = multer({ storage: multer.memoryStorage() });
// Middleware
app.use(cors({
    origin: (origin, callback) => {
        const allowed = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];
        if (!origin || allowed.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.use(express.json());
// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('→ MongoDB connected'))
    .catch(err => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
});
app.use('/api/auth', authRouter);
app.use('/api/hero-slides', heroSlideRouter);
// --- HELPER FUNCTION FOR VERCEL BLOB UPLOAD ---
const uploadToBlob = async (files) => {
    const uploadPromises = files.map(file => put(`properties/${Date.now()}-${file.originalname}`, file.buffer, {
        access: 'public',
    }));
    const results = await Promise.all(uploadPromises);
    return results.map(result => result.url); // Returns array of permanent URLs
};
// GET all properties (public)
app.get('/api/properties', async (req, res) => {
    try {
        const properties = await Property.find().sort({ createdAt: -1 }).lean();
        res.json(properties);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// GET single property by ID (public)
app.get('/api/properties/:id', async (req, res) => {
    try {
        const property = await Property.findById(req.params.id).lean();
        if (!property)
            return res.status(404).json({ error: 'Property not found' });
        res.json(property);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// POST new property (protected)
app.post('/api/properties', authenticate, authorizeAdmin, upload.array('images', 10), async (req, res) => {
    try {
        const { title, description, price, type, featured, location, province, address, lat, lng, bedrooms, bathrooms, landArea, buildingArea, status, yearBuilt, features, videoUrl, agentName, agentPhone, agentEmail } = req.body;
        const propertyData = {
            title: title?.trim(),
            description: description?.trim(),
            price: Number(price),
            type: type?.toLowerCase().trim(),
            featured: featured === 'true' || featured === true,
            location: location?.trim() || 'Honiara',
            images: []
        };
        // Handle Vercel Blob Uploads
        const files = req.files;
        if (files && files.length > 0) {
            propertyData.images = await uploadToBlob(files);
        }
        // Additional fields mapping...
        if (province)
            propertyData.province = province.trim();
        if (address)
            propertyData.address = address.trim();
        if (lat && lng)
            propertyData.coordinates = { lat: Number(lat), lng: Number(lng) };
        if (bedrooms)
            propertyData.bedrooms = Number(bedrooms);
        if (bathrooms)
            propertyData.bathrooms = Number(bathrooms);
        if (landArea)
            propertyData.landArea = Number(landArea);
        if (buildingArea)
            propertyData.buildingArea = Number(buildingArea);
        if (status)
            propertyData.status = status.toLowerCase().trim();
        if (yearBuilt)
            propertyData.yearBuilt = Number(yearBuilt);
        if (features) {
            propertyData.features = typeof features === 'string' ? features.split(',').map((f) => f.trim()).filter(Boolean) : features;
        }
        if (videoUrl)
            propertyData.videoUrl = videoUrl.trim();
        propertyData.agent = {
            name: agentName?.trim() || '',
            phone: agentPhone?.trim() || '',
            email: agentEmail?.trim() || '',
        };
        const newProperty = new Property(propertyData);
        await newProperty.save();
        res.status(201).json(newProperty);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// PUT update property (protected)
app.put('/api/properties/:id', authenticate, authorizeAdmin, upload.array('images', 10), async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        if (!property)
            return res.status(404).json({ error: 'Property not found' });
        const { deletedImages, ...updates } = req.body;
        // 1. Handle image deletions from Vercel Blob
        if (deletedImages) {
            const urlsToDelete = deletedImages.split(',').map((url) => url.trim());
            for (const url of urlsToDelete) {
                await del(url).catch(err => console.warn('Failed to delete blob:', err));
                property.images = property.images?.filter(img => img !== url) || [];
            }
        }
        // 2. Handle new uploads to Vercel Blob
        const files = req.files;
        if (files && files.length > 0) {
            const newImageUrls = await uploadToBlob(files);
            property.images = [...(property.images || []), ...newImageUrls];
        }
        // 3. Update other fields
        Object.assign(property, updates);
        // Note: ensure price/lat/lng/rooms are cast to Numbers if provided in updates
        const updatedProperty = await property.save();
        res.status(200).json(updatedProperty);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// DELETE property (protected)
app.delete('/api/properties/:id', authenticate, authorizeAdmin, async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        if (!property)
            return res.status(404).json({ error: 'Property not found' });
        // Delete all associated images from Vercel Blob
        if (property.images && property.images.length > 0) {
            for (const url of property.images) {
                await del(url).catch(err => console.warn('Blob delete failed:', err));
            }
        }
        await Property.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Property and images deleted successfully' });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
export default app;
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Ground Link API running on port ${PORT}`);
    });
}
//# sourceMappingURL=index.js.map