const express = require('express');
const router = express.Router();
const firestoreService = require('../services/firestoreService');

// Get all users
router.get('/', async (req, res) => {
  try {
    const { limit, orderBy = 'createdAt', role } = req.query;
    let filters = {};
    
    if (role) {
      filters.where = { field: 'role', operator: '==', value: role };
    }
    
    if (limit) {
      filters.limit = parseInt(limit);
    }
    
    filters.orderBy = { field: orderBy, direction: 'desc' };
    
    const users = await firestoreService.getAll('users', filters);
    
    res.status(200).json({
      users,
      count: users.length
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

// Get doctors - this needs to come before the /:id route
router.get('/doctors/all', async (req, res) => {
  try {
    const { specialty, available, limit } = req.query;
    let filters = {
      where: { field: 'role', operator: '==', value: 'doctor' }
    };
    
    if (specialty) {
      filters.where = [
        { field: 'role', operator: '==', value: 'doctor' },
        { field: 'specialty', operator: '==', value: specialty }
      ];
    }
    
    if (available) {
      filters.where = [
        { field: 'role', operator: '==', value: 'doctor' },
        { field: 'available', operator: '==', value: available === 'true' }
      ];
    }
    
    if (limit) {
      filters.limit = parseInt(limit);
    }
    
    filters.orderBy = { field: 'rating', direction: 'desc' };
    
    const doctors = await firestoreService.getAll('users', filters);
    
    // Remove sensitive data
    const doctorsData = doctors.map(doctor => {
      delete doctor.password;
      return doctor;
    });
    
    res.status(200).json({
      doctors: doctorsData,
      count: doctorsData.length
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

// Get user profile (current user)
router.get('/profile/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    const filters = {
      where: { field: 'uid', operator: '==', value: uid }
    };
    
    const users = await firestoreService.getAll('users', filters);
    const user = users.length > 0 ? users[0] : null;
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }
    
    // Remove sensitive data
    delete user.password;
    
    res.status(200).json({
      user
    });
  } catch (error) {
    res.status(404).json({
      error: error.message
    });
  }
});

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await firestoreService.getById('users', id);
    
    // Remove sensitive data
    if (user) {
      delete user.password;
    }
    
    res.status(200).json({
      user
    });
  } catch (error) {
    res.status(404).json({
      error: error.message
    });
  }
});

// Update user profile
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Remove sensitive fields that shouldn't be updated via this endpoint
    delete updates.password;
    delete updates.uid;
    delete updates.email;
    
    const user = await firestoreService.update('users', id, updates);
    
    res.status(200).json({
      message: 'User profile updated successfully',
      user
    });
  } catch (error) {
    res.status(400).json({
      error: error.message
    });
  }
});

// Create user (admin only)
router.post('/', async (req, res) => {
  try {
    const userData = req.body;
    
    // Validate required fields
    const requiredFields = ['email', 'firstName', 'lastName', 'role'];
    for (const field of requiredFields) {
      if (!userData[field]) {
        return res.status(400).json({
          error: `${field} is required`
        });
      }
    }
    
    const user = await firestoreService.create('users', userData);
    
    // Remove password from response
    delete user.password;
    
    res.status(201).json({
      message: 'User created successfully',
      user
    });
  } catch (error) {
    res.status(400).json({
      error: error.message
    });
  }
});

// Delete user (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await firestoreService.delete('users', id);
    
    res.status(200).json({
      message: 'User deleted successfully',
      result
    });
  } catch (error) {
    res.status(400).json({
      error: error.message
    });
  }
});

module.exports = router;
