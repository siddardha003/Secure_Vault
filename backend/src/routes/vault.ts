import express, { Response } from 'express';
import VaultItem from '../models/VaultItem';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Get all vault items for the authenticated user
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const { search } = req.query;
    let query: any = { userId: req.userId };

    // Add search functionality
    if (search && typeof search === 'string') {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { username: { $regex: search, $options: 'i' } },
        { url: { $regex: search, $options: 'i' } }
      ];
    }

    const vaultItems = await VaultItem.find(query).sort({ updatedAt: -1 });
    res.json(vaultItems);
  } catch (error) {
    console.error('Get vault items error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a specific vault item
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const vaultItem = await VaultItem.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!vaultItem) {
      return res.status(404).json({ error: 'Vault item not found' });
    }

    res.json(vaultItem);
  } catch (error) {
    console.error('Get vault item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new vault item
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const { title, username, encryptedPassword, url, notes } = req.body;

    // Validation
    if (!title || !username || !encryptedPassword) {
      return res.status(400).json({ 
        error: 'Title, username, and encrypted password are required' 
      });
    }

    const vaultItem = new VaultItem({
      userId: req.userId,
      title: title.trim(),
      username: username.trim(),
      encryptedPassword,
      url: url?.trim(),
      notes: notes?.trim()
    });

    await vaultItem.save();
    res.status(201).json(vaultItem);
  } catch (error) {
    console.error('Create vault item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a vault item
router.put('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { title, username, encryptedPassword, url, notes } = req.body;

    // Validation
    if (!title || !username || !encryptedPassword) {
      return res.status(400).json({ 
        error: 'Title, username, and encrypted password are required' 
      });
    }

    const vaultItem = await VaultItem.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      {
        title: title.trim(),
        username: username.trim(),
        encryptedPassword,
        url: url?.trim(),
        notes: notes?.trim()
      },
      { new: true, runValidators: true }
    );

    if (!vaultItem) {
      return res.status(404).json({ error: 'Vault item not found' });
    }

    res.json(vaultItem);
  } catch (error) {
    console.error('Update vault item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a vault item
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const vaultItem = await VaultItem.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });

    if (!vaultItem) {
      return res.status(404).json({ error: 'Vault item not found' });
    }

    res.json({ message: 'Vault item deleted successfully' });
  } catch (error) {
    console.error('Delete vault item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;